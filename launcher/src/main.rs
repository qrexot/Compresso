#![windows_subsystem = "windows"]

use std::{fs, io::{Cursor, copy}, path::{Path, PathBuf}, process::{Command, ExitCode}, time::{SystemTime, UNIX_EPOCH}};

const PACKAGE: &[u8] = include_bytes!("../../payload.zip");
const FILES: &[&str] = &["compresso.exe", "ffmpeg.exe", "ffprobe.exe", "WebView2Loader.dll", "FFmpeg-LICENSE.txt", "FFmpeg-README.txt"];

#[link(name = "user32")]
extern "system" { fn MessageBoxW(hwnd: isize, text: *const u16, caption: *const u16, flags: u32) -> i32; }

fn show_error(error: &str) {
    let body: Vec<u16> = format!("Не удалось запустить Compresso.\n\n{error}").encode_utf16().chain(Some(0)).collect();
    let title: Vec<u16> = "Compresso".encode_utf16().chain(Some(0)).collect();
    unsafe { MessageBoxW(0, body.as_ptr(), title.as_ptr(), 0x10); }
}

struct TemporaryDirectory(PathBuf);
impl Drop for TemporaryDirectory {
    fn drop(&mut self) { let _ = fs::remove_dir_all(&self.0); }
}

fn create_temp_dir() -> Result<TemporaryDirectory, String> {
    let timestamp = SystemTime::now().duration_since(UNIX_EPOCH).map_err(|e| e.to_string())?.as_nanos();
    for index in 0..100 {
        let dir = std::env::temp_dir().join(format!("Compresso-{}-{timestamp}-{index}", std::process::id()));
        match fs::create_dir(&dir) {
            Ok(()) => return Ok(TemporaryDirectory(dir)),
            Err(e) if e.kind() == std::io::ErrorKind::AlreadyExists => continue,
            Err(e) => return Err(format!("Не удалось создать временную папку: {e}")),
        }
    }
    Err("Не удалось создать временную папку".into())
}

fn unpack(directory: &Path) -> Result<(), String> {
    let mut archive = zip::ZipArchive::new(Cursor::new(PACKAGE)).map_err(|e| e.to_string())?;
    for name in FILES {
        let mut item = archive.by_name(name).map_err(|e| format!("Отсутствует {name}: {e}"))?;
        let mut destination = fs::File::create(directory.join(name)).map_err(|e| e.to_string())?;
        copy(&mut item, &mut destination).map_err(|e| format!("Ошибка распаковки {name}: {e}"))?;
    }
    Ok(())
}

fn run() -> Result<ExitCode, String> {
    let directory = create_temp_dir()?;
    unpack(&directory.0)?;
    let status = Command::new(directory.0.join("compresso.exe"))
        .args(std::env::args_os().skip(1))
        .current_dir(&directory.0)
        .status().map_err(|e| format!("Ошибка запуска: {e}"))?;
    Ok(ExitCode::from(if status.success() { 0 } else { 1 }))
}
fn main() -> ExitCode {
    match run() { Ok(status) => status, Err(error) => { show_error(&error); ExitCode::FAILURE } }
}
