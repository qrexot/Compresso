// Compresso Desktop Application
// Developer: @seltux (Telegram: @seltux)
// License: Full Lifetime License to @seltux
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod estimate;

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use tauri::{AppHandle, Manager, State};
use tauri_plugin_fs::FsExt;

#[derive(Default)]
pub struct UpdateState {
    pub wants_update: Arc<AtomicBool>,
}

#[tauri::command]
fn expand_scope(app_handle: AppHandle, folder_path: String) -> Result<(), String> {
    let path = std::path::Path::new(&folder_path);
    // Expand scopes so the webview can read files from selected folders
    if let Some(parent) = path.parent() {
        let _ = app_handle.asset_protocol_scope().allow_directory(parent, true);
        let _ = app_handle.fs_scope().allow_directory(parent, true);
    }
    let _ = app_handle.asset_protocol_scope().allow_directory(path, true);
    let _ = app_handle.fs_scope().allow_directory(path, true);
    let _ = app_handle.asset_protocol_scope().allow_file(path);
    let _ = app_handle.fs_scope().allow_file(path);
    Ok(())
}

#[tauri::command]
fn show_in_folder(path: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        use std::process::Command;
        // On Windows, explorer /select,path highlights the file in File Explorer
        Command::new("explorer")
            .args(["/select,", &path])
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    #[cfg(not(target_os = "windows"))]
    {
        showfile::show_path_in_file_manager(&path);
    }
    Ok(())
}

#[tauri::command]
fn open_file(path: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        use std::process::Command;
        Command::new("cmd")
            .args(["/C", "start", "", &path])
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    #[cfg(not(target_os = "windows"))]
    {
        showfile::show_path_in_file_manager(&path);
    }
    Ok(())
}

#[tauri::command]
fn open_developer() -> Result<(), String> {
    #[cfg(target_os = "windows")]
    std::process::Command::new("rundll32.exe")
        .args(["url.dll,FileProtocolHandler", "https://t.me/seltux"])
        .spawn().map_err(|e| e.to_string())?;
    #[cfg(not(target_os = "windows"))]
    std::process::Command::new("xdg-open").arg("https://t.me/seltux")
        .spawn().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn estimate_sample(input_path: String, output_options: Vec<String>, start: f64, duration: f64, format: String) -> Result<u64, String> {
    tauri::async_runtime::spawn_blocking(move || {
        let exe = std::env::current_exe().map_err(|e| e.to_string())?;
        let parent = exe.parent().ok_or("Cannot locate the application directory")?;
        let name = if cfg!(windows) { "ffmpeg.exe" } else { "ffmpeg" };
        estimate::sample(&parent.join(name), std::path::Path::new(&input_path), start, duration, &format, &output_options)
    }).await.map_err(|e| e.to_string())?
}

#[tauri::command]
fn restart_app(app_handle: AppHandle) {
    println!("restarting");
    app_handle.restart();
}

#[tauri::command]
fn wants_update_on_exit(state: State<'_, UpdateState>) {
    state.wants_update.store(true, Ordering::SeqCst);
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .manage(UpdateState::default())
        .invoke_handler(tauri::generate_handler![
            expand_scope,
            show_in_folder,
            open_file,
            open_developer,
            estimate_sample,
            restart_app,
            wants_update_on_exit
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|app_handle, event| {
            if let tauri::RunEvent::ExitRequested { .. } = event {
                let state = app_handle.state::<UpdateState>();
                if state.wants_update.load(Ordering::SeqCst) {
                    println!("app is about to exit! checking if we should install an update");
                }
            }
        });
}
