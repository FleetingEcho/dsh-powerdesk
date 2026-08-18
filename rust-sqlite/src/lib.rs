//! dsh-powerdesk-sqlite: a Node native addon (napi-rs) backed by rusqlite
//! (bundled SQLite amalgamation — no system libsqlite3 dependency), exposing
//! a thin driver surface the dsh-powerdesk host half loads for calendar
//! persistence:
//!
//!   open(path) -> Database
//!   Database.exec(sql)                       // DDL / migrations / no params
//!   Database.run(sql, params?) -> changes     // INSERT / UPDATE / DELETE
//!   Database.query(sql, params?) -> rows[]    // SELECT
//!   Database.close()
//!
//! JS owns the schema and migrations (exec runs arbitrary SQL); Rust just
//! drives SQLite and marshals rows to/from JSON. Params are passed as JS
//! values (null/bool/number/string/array/object); arrays and objects are
//! stored as JSON text. Results are JSON objects keyed by column name.
//!
//! Lifecycle: one long-lived Database handle per host process (the host half
//! opens it for the calendar DB on first use and reuses it). The connection
//! closes when the JS handle is GC'd or `close()` is called.
//!
//! Build: `cargo build --release` produces a cdylib; scripts/build-rust-sqlite.sh
//! copies it to ../prebuilt/<triple>/dsh_powerdesk_sqlite.node.

use std::sync::Mutex;
use std::time::Duration;

use napi::bindgen_prelude::Error as NapiError;
use napi::Result as NapiResult;
use napi_derive::napi;
use rusqlite::types::{ToSqlOutput, Value as SqlValue};
use rusqlite::{params_from_iter, Connection, ToSql};
use serde_json::Value as JsonValue;

/// A local wrapper around `serde_json::Value` so we can implement rusqlite's
/// `ToSql` for it. The orphan rule forbids a foreign trait (`ToSql`) on a
/// foreign type (`serde_json::Value`); wrapping in a local newtype makes the
/// impl legal while keeping the ergonomic JS→JSON param path.
struct JsonParam(JsonValue);

impl ToSql for JsonParam {
    fn to_sql(&self) -> rusqlite::Result<ToSqlOutput<'_>> {
        Ok(ToSqlOutput::Owned(match &self.0 {
            JsonValue::Null => SqlValue::Null,
            JsonValue::Bool(b) => SqlValue::Integer(*b as i64),
            JsonValue::Number(n) => {
                if let Some(i) = n.as_i64() {
                    SqlValue::Integer(i)
                } else if let Some(f) = n.as_f64() {
                    SqlValue::Real(f)
                } else {
                    // NaN / Infinity are not representable in SQLite; store NULL.
                    SqlValue::Null
                }
            }
            JsonValue::String(s) => SqlValue::Text(s.clone()),
            // arrays / objects: serialize to JSON text so structured params
            // round-trip without a separate blob encoding.
            other => SqlValue::Text(other.to_string()),
        }))
    }
}

/// Convert a SQLite stored value into a JSON value for the JS return path.
fn sql_to_json(v: SqlValue) -> JsonValue {
    match v {
        SqlValue::Null => JsonValue::Null,
        SqlValue::Integer(i) => JsonValue::Number(i.into()),
        SqlValue::Real(f) => serde_json::Number::from_f64(f)
            .map(JsonValue::Number)
            .unwrap_or(JsonValue::Null),
        SqlValue::Text(s) => JsonValue::String(s),
        // Blob → array of byte numbers (JSON-safe; no base64 dependency).
        SqlValue::Blob(b) => JsonValue::Array(
            b.into_iter()
                .map(|byte| JsonValue::Number((byte as i64).into()))
                .collect(),
        ),
    }
}

/// A handle to an open SQLite database file. One connection per handle; the
/// host half opens one `Database` for the calendar DB and reuses it for the
/// process lifetime. `Option<Connection>` lets `close()` actually release the
/// file (the inner connection drops when replaced with `None`).
#[napi]
pub struct Database {
    conn: Mutex<Option<Connection>>,
}

#[napi]
impl Database {
    /// Open (creating if needed) the SQLite file at `path`. The parent
    /// directory is created when missing. Sensible pragmas (WAL, foreign
    /// keys, a 5s busy timeout) are applied so the host half doesn't have to.
    #[napi]
    pub fn open(path: String) -> NapiResult<Database> {
        if let Some(parent) = std::path::Path::new(&path).parent() {
            if !parent.as_os_str().is_empty() {
                std::fs::create_dir_all(parent)
                    .map_err(|e| NapiError::from_reason(format!("create db dir failed: {e}")))?;
            }
        }
        let conn = Connection::open(&path)
            .map_err(|e| NapiError::from_reason(format!("open sqlite failed: {e}")))?;
        // WAL: readers don't block the writer; FK enforcement on; a busy
        // timeout so a transient lock doesn't surface as an immediate error.
        conn.pragma_update(None, "journal_mode", "WAL")
            .map_err(|e| NapiError::from_reason(format!("pragma journal_mode failed: {e}")))?;
        conn.pragma_update(None, "foreign_keys", "ON")
            .map_err(|e| NapiError::from_reason(format!("pragma foreign_keys failed: {e}")))?;
        conn.busy_timeout(Duration::from_secs(5))
            .map_err(|e| NapiError::from_reason(format!("pragma busy_timeout failed: {e}")))?;
        Ok(Database {
            conn: Mutex::new(Some(conn)),
        })
    }

    /// Execute one or more semicolon-separated SQL statements with no bound
    /// parameters (DDL, migrations, pragmas). Returns nothing.
    #[napi]
    pub fn exec(&self, sql: String) -> NapiResult<()> {
        let mut guard = self
            .conn
            .lock()
            .map_err(|e| NapiError::from_reason(format!("db lock poisoned: {e}")))?;
        let conn = guard
            .as_mut()
            .ok_or_else(|| NapiError::from_reason("database is closed"))?;
        conn.execute_batch(&sql)
            .map_err(|e| NapiError::from_reason(format!("exec failed: {e}")))?;
        Ok(())
    }

    /// Run a parameterised statement (INSERT/UPDATE/DELETE) and return the
    /// number of rows changed. `params` is a JS array of values; null/omitted
    /// when the statement takes none.
    #[napi]
    pub fn run(&self, sql: String, params: Option<Vec<JsonValue>>) -> NapiResult<i64> {
        let mut guard = self
            .conn
            .lock()
            .map_err(|e| NapiError::from_reason(format!("db lock poisoned: {e}")))?;
        let conn = guard
            .as_mut()
            .ok_or_else(|| NapiError::from_reason("database is closed"))?;
        let params = params.unwrap_or_default();
        let changes = conn
            .execute(&sql, params_from_iter(params.into_iter().map(JsonParam)))
            .map_err(|e| NapiError::from_reason(format!("run failed: {e}")))?;
        Ok(changes as i64)
    }

    /// Run a parameterised SELECT and return rows as JSON objects keyed by
    /// column name. `params` is a JS array of values; null/omitted when none.
    #[napi]
    pub fn query(&self, sql: String, params: Option<Vec<JsonValue>>) -> NapiResult<Vec<JsonValue>> {
        let mut guard = self
            .conn
            .lock()
            .map_err(|e| NapiError::from_reason(format!("db lock poisoned: {e}")))?;
        let conn = guard
            .as_mut()
            .ok_or_else(|| NapiError::from_reason("database is closed"))?;
        let params = params.unwrap_or_default();
        let mut stmt = conn
            .prepare(&sql)
            .map_err(|e| NapiError::from_reason(format!("prepare failed: {e}")))?;
        let column_count = stmt.column_count();
        // Snapshot column names up front: rusqlite borrows the statement for
        // the query lifetime, and name lookup per row is wasteful.
        let column_names: Vec<String> = (0..column_count)
            .map(|i| {
                stmt.column_name(i)
                    .map(|s| s.to_string())
                    .unwrap_or_default()
            })
            .collect();
        let rows = stmt
            .query_map(params_from_iter(params.into_iter().map(JsonParam)), |row| {
                let mut map = serde_json::Map::new();
                for (i, name) in column_names.iter().enumerate() {
                    let val: SqlValue = row.get(i).unwrap_or(SqlValue::Null);
                    map.insert(name.clone(), sql_to_json(val));
                }
                Ok(JsonValue::Object(map))
            })
            .map_err(|e| NapiError::from_reason(format!("query failed: {e}")))?;
        let mut out = Vec::new();
        for row in rows {
            let row = row.map_err(|e| NapiError::from_reason(format!("row read failed: {e}")))?;
            out.push(row);
        }
        Ok(out)
    }

    /// Close the connection (releases the file handle; SQLite flushes WAL).
    /// Further calls on this handle error with "database is closed".
    #[napi]
    pub fn close(&self) -> NapiResult<()> {
        let mut guard = self
            .conn
            .lock()
            .map_err(|e| NapiError::from_reason(format!("db lock poisoned: {e}")))?;
        *guard = None;
        Ok(())
    }
}
