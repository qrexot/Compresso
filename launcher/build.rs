use std::{env, fs, path::PathBuf, process::Command};
fn main() {
    println!("cargo:rerun-if-changed=icon.ico");
    if env::var("CARGO_CFG_TARGET_OS").as_deref() != Ok("windows") || env::var("CARGO_CFG_TARGET_ENV").as_deref() != Ok("gnu") { return; }
    let dir = PathBuf::from(env::var_os("OUT_DIR").unwrap());
    let rc = dir.join("app-icon.rc");
    let obj = dir.join("app-icon.o");
    let icon = PathBuf::from(env::var_os("CARGO_MANIFEST_DIR").unwrap()).join("icon.ico");
    fs::write(&rc, format!("1 ICON \"{}\"\n", icon.display().to_string().replace('\\', "/"))).unwrap();
    if Command::new("x86_64-w64-mingw32-windres").args([rc.as_os_str(), obj.as_os_str()]).status().map(|s| s.success()).unwrap_or(false) {
        println!("cargo:rustc-link-arg={}", obj.display());
    }
}
