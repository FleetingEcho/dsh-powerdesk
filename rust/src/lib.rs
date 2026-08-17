//! dsh-powerdesk-pty: a Node native addon (napi-rs) that spawns a local PTY
//! backed by wezterm's `portable-pty` (pure Rust, cross-platform), exposing
//! the small surface the dsh-powerdesk host half loads:
//!
//!   spawn(shell, args, options) -> Pty
//!   Pty.on_data(callback)            // callback: (data: string) => void
//!   Pty.on_exit(callback)            // callback: (event: ExitEvent) => void
//!   Pty.write(data)
//!   Pty.resize(cols, rows, pixelW?, pixelH?)
//!   Pty.kill()
//!   Pty.pid
//!
//! `on_data` / `on_exit` each register ONE callback (the JS wrapper in
//! src/rust-pty.ts installs a single dispatcher at construction and fans out
//! to multiple subscribers itself).
//!
//! Lifecycle: a background reader thread (started by `on_data`) decodes pty
//! output as UTF-8 and fires the data callback; a background wait thread
//! (started by `spawn`) polls `try_wait` every 50 ms so `kill()` stays
//! reachable, records the exit event, and fires the exit callback once the
//! JS side has registered it (or immediately if it registered late).
//!
//! Build: `cargo build --release` produces a cdylib; scripts/build-rust.sh
//! copies it to ../prebuilt/<triple>/dsh_powerdesk_pty.node. The napi-rs CLI
//! (`napi build`) also works against rust/package.json.

#![deny(clippy::all)]

use std::collections::HashMap;
use std::io::{Read, Write};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;

use napi::bindgen_prelude::Error as NapiError;
use napi::threadsafe_function::{
    ErrorStrategy, ThreadsafeFunction, ThreadsafeFunctionCallMode,
};
use napi::Result as NapiResult;
use napi_derive::napi;

use portable_pty::{native_pty_system, CommandBuilder, MasterPty, PtySize, PtySystem};

/// Exit event delivered to the JS `on_exit` callback.
#[napi(object)]
#[derive(Clone)]
pub struct ExitEvent {
    /// The process exit code (0 on success; best-effort 1 on signal/abnormal).
    pub exit_code: i32,
    /// POSIX signal number when the process was killed by a signal (None on
    /// Windows; best-effort None on POSIX — portable-pty does not always
    /// report the signal reliably across platforms).
    pub signal: Option<i32>,
}

/// Spawn options (mirrors the JS-side `RustPtySpawnOptions`).
#[napi(object)]
pub struct SpawnOptions {
    pub cols: u32,
    pub rows: u32,
    pub cwd: String,
    /// Environment for the spawned shell. `Some(v)` sets the var; `None`
    /// removes it (so `{ ...process.env }` with undefined values clears).
    pub env: HashMap<String, Option<String>>,
}

type ExitTsfn = ThreadsafeFunction<ExitEvent, ErrorStrategy::CalleeHandled>;
type DataTsfn = ThreadsafeFunction<String, ErrorStrategy::CalleeHandled>;

/// A live PTY. Held by the JS wrapper (`RustPty`) for the process's life.
#[napi]
pub struct Pty {
    master: Box<dyn MasterPty + Send>,
    writer: Mutex<Option<Box<dyn Write + Send>>>,
    child: Arc<Mutex<Option<Box<dyn portable_pty::Child + Send + Sync>>>>,
    pid: i32,
    exit_tsfn: Arc<Mutex<Option<ExitTsfn>>>,
    exit_event: Arc<Mutex<Option<ExitEvent>>>,
}

#[napi]
impl Pty {
    /// Register the single data callback and start the reader thread. Called
    /// exactly once by the JS wrapper at construction.
    #[napi]
    pub fn on_data(&self, callback: DataTsfn) -> NapiResult<()> {
        let reader = self
            .master
            .try_clone_reader()
            .map_err(|e| NapiError::from_reason(format!("clone reader: {e}")))?;
        thread::spawn(move || {
            let mut reader = reader;
            let mut buf = [0u8; 8192];
            loop {
                match reader.read(&mut buf) {
                    Ok(0) => break,
                    Ok(n) => {
                        // String::from_utf8_lossy replaces invalid byte
                        // sequences with U+FFFD — a terminal can produce
                        // partial multibyte sequences split across reads; the
                        // JS side's streaming TextDecoder would handle those
                        // better, but lossy conversion is safe (never panics)
                        // and the common case (valid UTF-8 chunks) is exact.
                        let s = String::from_utf8_lossy(&buf[..n]).into_owned();
                        let _ = callback.call(Ok(s), ThreadsafeFunctionCallMode::NonBlocking);
                    }
                    Err(_) => break,
                }
            }
        });
        Ok(())
    }

    /// Register the exit callback. If the process already exited (the wait
    /// thread recorded it before the JS side registered), deliver it now.
    #[napi]
    pub fn on_exit(&self, callback: ExitTsfn) -> NapiResult<()> {
        {
            let mut slot = self.exit_tsfn.lock().expect("exit_tsfn lock");
            *slot = Some(callback.clone());
        }
        let evt = self.exit_event.lock().expect("exit_event lock").clone();
        if let Some(e) = evt {
            let _ = callback.call(Ok(e), ThreadsafeFunctionCallMode::NonBlocking);
        }
        Ok(())
    }

    /// Write text to the pty's stdin.
    #[napi]
    pub fn write(&self, data: String) -> NapiResult<()> {
        let mut guard = self.writer.lock().expect("writer lock");
        if let Some(w) = guard.as_mut() {
            w.write_all(data.as_bytes())
                .map_err(|e| NapiError::from_reason(format!("write: {e}")))?;
            let _ = w.flush();
        }
        Ok(())
    }

    /// Resize the pty. Pixel dimensions are best-effort TIOCSWINSZ hints.
    #[napi]
    pub fn resize(
        &self,
        cols: u32,
        rows: u32,
        pixel_w: Option<u32>,
        pixel_h: Option<u32>,
    ) -> NapiResult<()> {
        let size = PtySize {
            rows: rows.max(2) as u16,
            cols: cols.max(2) as u16,
            pixel_width: pixel_w.unwrap_or(0) as u16,
            pixel_height: pixel_h.unwrap_or(0) as u16,
        };
        self.master
            .resize(size)
            .map_err(|e| NapiError::from_reason(format!("resize: {e}")))?;
        Ok(())
    }

    /// Kill the underlying process (platform termination path).
    #[napi]
    pub fn kill(&self) -> NapiResult<()> {
        let mut guard = self.child.lock().expect("child lock");
        if let Some(child) = guard.as_mut() {
            let _ = child.kill();
        }
        Ok(())
    }

    /// The spawned process id.
    #[napi]
    pub fn pid(&self) -> NapiResult<i32> {
        Ok(self.pid)
    }
}

/// Spawn a PTY running `shell` with `args` under `options`.
#[napi]
pub fn spawn(shell: String, args: Vec<String>, options: SpawnOptions) -> NapiResult<Pty> {
    let system: Box<dyn PtySystem> = native_pty_system();
    let size = PtySize {
        rows: options.rows.max(2) as u16,
        cols: options.cols.max(2) as u16,
        pixel_width: 0,
        pixel_height: 0,
    };
    let pair = system
        .openpty(size)
        .map_err(|e| NapiError::from_reason(format!("openpty: {e}")))?;
    let master = pair.master;
    let slave = pair.slave;

    let mut cmd = CommandBuilder::new(&shell);
    for a in args {
        cmd.arg(a);
    }
    cmd.cwd(&options.cwd);
    for (k, v) in options.env {
        match v {
            Some(val) => cmd.env(k, val),
            None => cmd.env_remove(k),
        }
    }

    let child = slave
        .spawn_command(cmd)
        .map_err(|e| NapiError::from_reason(format!("spawn: {e}")))?;
    // The slave fd MUST be closed in the parent after spawn, otherwise the
    // reader never sees EOF when the child exits.
    drop(slave);

    let pid = child
        .process_id()
        .ok_or_else(|| NapiError::from_reason("spawn: process has no pid"))?
        as i32;
    let writer = master
        .take_writer()
        .map_err(|e| NapiError::from_reason(format!("take_writer: {e}")))?;

    // spawn_command returns Box<dyn Child + Send + Sync>; use it directly.
    let child: Arc<Mutex<Option<Box<dyn portable_pty::Child + Send + Sync>>>> =
        Arc::new(Mutex::new(Some(child)));
    let exit_tsfn: Arc<Mutex<Option<ExitTsfn>>> = Arc::new(Mutex::new(None));
    let exit_event: Arc<Mutex<Option<ExitEvent>>> = Arc::new(Mutex::new(None));

    // Wait thread: poll try_wait every 50 ms (non-blocking) so kill() stays
    // reachable; on exit record the event and fire the exit callback if the
    // JS side has already registered it (or the next on_exit delivers it).
    {
        let child = Arc::clone(&child);
        let exit_tsfn = Arc::clone(&exit_tsfn);
        let exit_event = Arc::clone(&exit_event);
        thread::spawn(move || loop {
            thread::sleep(Duration::from_millis(50));
            let status = {
                let mut guard = match child.lock() {
                    Ok(g) => g,
                    Err(_) => return,
                };
                match guard.as_mut() {
                    Some(c) => match c.try_wait() {
                        Ok(Some(s)) => Some(s),
                        Ok(None) => None,
                        Err(_) => None,
                    },
                    None => {
                        // Child already taken (waited/cleared); nothing to do.
                        return;
                    }
                }
            };
            if let Some(status) = status {
                // portable-pty's ExitStatus::success() is the version-tolerant
                // way to read the outcome; the exact code/signal shape varies
                // across versions, so map to a best-effort 0/1.
                let exit_code = if status.success() { 0 } else { 1 };
                {
                    let mut g = child.lock().expect("child lock");
                    *g = None;
                }
                let evt = ExitEvent {
                    exit_code,
                    signal: None,
                };
                {
                    let mut g = exit_event.lock().expect("exit_event lock");
                    *g = Some(evt.clone());
                }
                let tsfn = exit_tsfn.lock().expect("exit_tsfn lock").clone();
                if let Some(t) = tsfn {
                    let _ = t.call(Ok(evt), ThreadsafeFunctionCallMode::NonBlocking);
                }
                return;
            }
        });
    }

    Ok(Pty {
        master,
        writer: Mutex::new(Some(writer)),
        child,
        pid,
        exit_tsfn,
        exit_event,
    })
}
