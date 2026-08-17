fn main() {
    // napi_build emits the linker flags and version metadata the napi-rs
    // runtime checks at load time. Required for the produced cdylib to be a
    // valid Node addon (process.dlopen target).
    napi_build::setup();
}
