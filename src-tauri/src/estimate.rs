//! Sampling for size estimation. Output is confined to a newly-created temp directory.
use std::{path::{Path, PathBuf}, process::{Command, Stdio}, sync::atomic::{AtomicU64, Ordering}, time::{Duration, Instant, SystemTime, UNIX_EPOCH}};
static COUNTER: AtomicU64 = AtomicU64::new(0);
struct TemporaryDirectory(PathBuf);
impl Drop for TemporaryDirectory { fn drop(&mut self) { let _ = std::fs::remove_dir_all(&self.0); } }

fn make_temp() -> Result<TemporaryDirectory, String> {
    let now = SystemTime::now().duration_since(UNIX_EPOCH).map_err(|e| e.to_string())?.as_nanos();
    let root = std::env::temp_dir();
    for _ in 0..20 {
        let id = COUNTER.fetch_add(1, Ordering::Relaxed);
        let path = root.join(format!("compresso-estimate-{}-{now}-{id}", std::process::id()));
        match std::fs::create_dir(&path) {
            Ok(()) => return Ok(TemporaryDirectory(path)),
            Err(e) if e.kind() == std::io::ErrorKind::AlreadyExists => continue,
            Err(e) => return Err(format!("Cannot create temporary directory: {e}")),
        }
    }
    Err("Cannot create temporary directory".into())
}

fn valid_options(options: &[String]) -> bool {
    let mut i=0;
    while i < options.len() {
        match options[i].as_str() {
            "-an" => i+=1,
            "-c:v" | "-tag:v" | "-rc" | "-cq" | "-b:v" | "-crf" | "-preset" | "-deadline" | "-cpu-used" | "-movflags" | "-fpsmax" | "-map_metadata" | "-threads" | "-filter_complex" => {
                if i+1 >= options.len() || options[i+1].is_empty() || options[i+1].len()>512 || options[i+1].starts_with('-') { return false; }
                if !options[i+1].chars().all(|c| c.is_ascii_alphanumeric() || ".,:=*/+_()".contains(c) || c=='-') { return false; }
                if options[i] == "-filter_complex" && !options[i+1].split(',').all(|filter| filter.starts_with("scale=") || filter.starts_with("setpts=")) { return false; }
                i+=2;
            }
            _ => return false,
        }
    }
    true
}

pub fn sample(ffmpeg: &Path, input: &Path, start:f64, duration:f64, format:&str, options:&[String]) -> Result<u64,String> {
    if !input.is_file() { return Err("Input file is unavailable".into()); }
    if !start.is_finite() || start<0.0 || !duration.is_finite() || !(0.0..=3.05).contains(&duration) || duration==0.0 { return Err("Invalid sample range".into()); }
    if !matches!(format,"mp4"|"webm") || !valid_options(options) { return Err("Unsupported encoding options".into()); }
    let dir=make_temp()?;
    let output=dir.0.join(format!("sample.{format}"));
    let mut command=Command::new(ffmpeg);
    command.args(["-hide_banner","-loglevel","error","-nostdin","-n","-ss",&start.to_string(),"-t",&duration.to_string(),"-i"]).arg(input).args(options).arg(&output).stdin(Stdio::null()).stdout(Stdio::null()).stderr(Stdio::null());
    #[cfg(target_os="windows")]
    { use std::os::windows::process::CommandExt; command.creation_flags(0x08000000); }
    let mut child=command.spawn().map_err(|e| format!("Could not run FFmpeg: {e}"))?;
    let deadline=Instant::now()+Duration::from_secs(90);
    let status=loop {
        match child.try_wait() {
            Ok(Some(status)) => break status,
            Ok(None) if Instant::now()<deadline => std::thread::sleep(Duration::from_millis(100)),
            Ok(None) => { let _=child.kill(); let _=child.wait(); return Err("Sample timed out".into()); },
            Err(error) => { let _=child.kill(); let _=child.wait(); return Err(error.to_string()); },
        }
    };
    if !status.success() { return Err(format!("FFmpeg sample failed: {status}")); }
    let bytes=output.metadata().map_err(|e| e.to_string())?.len();
    if bytes==0 { return Err("Empty sample".into()); }
    Ok(bytes)
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn sample_encodes_real_video_without_modifying_input() {
        let root = make_temp().expect("test directory");
        let input = root.0.join("input.mp4");
        let generated = Command::new("ffmpeg").args(["-hide_banner", "-loglevel", "error", "-f", "lavfi", "-i", "testsrc2=size=160x90:rate=20:duration=4", "-c:v", "libx264", "-y"]).arg(&input).status().expect("FFmpeg installed for integration test");
        assert!(generated.success());
        let before=std::fs::read(&input).unwrap();
        let opts = ["-c:v","libx264","-tag:v","avc1","-crf","30","-b:v","0","-preset","veryfast","-movflags","+faststart"].iter().map(|s| s.to_string()).collect::<Vec<_>>();
        let bytes = sample(Path::new("ffmpeg"),&input,1.0,2.0,"mp4",&opts).expect("sample encoded");
        assert!(bytes>1000);
        assert_eq!(std::fs::read(&input).unwrap(),before);
        let webm = ["-c:v","libvpx-vp9","-crf","36","-b:v","0","-deadline","good","-cpu-used","6"].iter().map(|s| s.to_string()).collect::<Vec<_>>();
        assert!(sample(Path::new("ffmpeg"),&input,1.0,1.0,"webm",&webm).unwrap()>1000);
    }

    #[test] fn option_validation_blocks_extra_inputs_and_outputs() {
        assert!(valid_options(&["-c:v".into(),"libx264".into(),"-crf".into(),"30".into(),"-filter_complex".into(),"scale=ceil(iw*0.5/2)*2:ceil(ih*0.5/2)*2".into()]));
        assert!(!valid_options(&["-i".into(),"other.mp4".into()]));
        assert!(!valid_options(&["-c:v".into(),"libx264".into(),"-y".into()]));
        assert!(!valid_options(&["-filter_complex".into(),"movie=/tmp/x".into()]));
    }
}
