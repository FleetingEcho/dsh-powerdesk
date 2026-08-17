/**
 * Deferred one-shot open for hosts that may not have a real size yet.
 *
 * restty's canvas/renderer setup must not run in a zero-size container (the
 * WebGPU/WebGL2 surface creation can fail or produce a 0×0 context). The
 * caller's `open` callback is invoked exactly once, on the first frame where
 * the host reports a real size. While the host stays zero-sized the polling
 * continues every frame; it stops when the host leaves the document
 * (`isConnected`), so a pending open never fires after unmount. The returned
 * cancel function drops a pending frame immediately (idempotent).
 *
 * `raf`/`caf` are injectable so tests can drive the polling deterministically.
 */
export declare function openWhenSized(host: HTMLElement, open: () => void, raf?: (cb: FrameRequestCallback) => number, caf?: (id: number) => void): () => void;
