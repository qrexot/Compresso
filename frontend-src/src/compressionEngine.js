/**
 * Compresso - Video Compression Engine
 * Developer: @seltux (Telegram: @seltux)
 * License: Full Unlocked Lifetime License
 * 
 * Handles FFmpeg argument generation, ffprobe metadata extraction,
 * real-time stdout progress tracking, and optional watermark generation.
 */

import { Command } from '@tauri-apps/plugin-shell';

/**
 * Default compression parameters
 */
export const DEFAULT_CONFIG = {
  formats: ["mp4"],
  crfFraction: 0.42,
  speed: "veryfast",
  overwrite: false,
  overwrite_postfix: "_smaller",
  downscaleFraction: undefined,
  downscaleType: "relative", // "relative" | "width" | "height"
  downscaleWidth: 800,
  downscaleHeight: 600,
  webStreamable: true,
  maxFramerate: undefined,
  removeAudio: false,
  speedFraction: undefined,
  threadCount: undefined,
  preserveMetadata: undefined,
  targetSizeBytes: undefined,
  useTargetSize: false
};

/**
 * Builds video filter chain (scaling, speed change, watermark overlay)
 */
export function buildFilterComplex({ config, needsWatermark }) {
  const filters = [];

  if (needsWatermark) {
    filters.push("overlay=x=(main_w-overlay_w-10):y=(main_h-overlay_h-10)");
  }

  if (config.speedFraction && config.speedFraction !== 1) {
    filters.push(`setpts=${1 / config.speedFraction}*PTS`);
  }

  switch (config.downscaleType) {
    case "relative":
      if (config.downscaleFraction) {
        filters.push(`scale=ceil(iw*${config.downscaleFraction}/2)*2:ceil(ih*${config.downscaleFraction}/2)*2`);
      }
      break;
    case "width":
      if (config.downscaleWidth) {
        filters.push(`scale=${config.downscaleWidth}:-2`);
      }
      break;
    case "height":
      if (config.downscaleHeight) {
        filters.push(`scale=-2:${config.downscaleHeight}`);
      }
      break;
  }

  return filters.length > 0 ? ["-filter_complex", filters.join(",")] : [];
}

/**
 * Constructs complete FFmpeg CLI argument list
 */
export function buildFfmpegArgs({ inputFilePath, outputPath, config, watermarkPath = null }) {
  let videoCodec;
  let videoTag;
  let crfValue;
  let movFlags = null;

  const format = config.formats?.[0] || "mp4";
  const maxCrfH264 = 51;
  const maxCrfVp9 = 63;
  const crfFraction = config.crfFraction ?? 0.5;
  const hasWatermark = watermarkPath !== null;

  switch (format) {
    case "mp4":
      videoCodec = "libx264";
      videoTag = "avc1";
      crfValue = Math.round((1 - crfFraction) * maxCrfH264);
      movFlags = config.webStreamable ? ["-movflags", "+faststart"] : null;
      break;
    case "webm":
      videoCodec = "libvpx";
      videoTag = "vp9";
      crfValue = Math.round((1 - crfFraction) * maxCrfVp9);
      movFlags = null;
      break;
    default:
      throw new Error(`Unsupported output format: ${format}`);
  }

  const args = [
    "-i", inputFilePath,
    ...(hasWatermark ? ["-i", watermarkPath] : []),
    "-c:v", videoCodec,
    "-tag:v", videoTag,
    ...(config.removeAudio || (config.speedFraction && config.speedFraction !== 1) ? ["-an"] : []),
    ...(movFlags || []),
    "-crf", `${crfValue}`,
    "-b:v", "0",
    "-preset", config.speed ?? "veryfast",
    ...(config.trimStart ? ["-ss", `${config.trimStart}`] : []),
    ...(config.trimEnd ? ["-to", `${config.trimEnd}`] : []),
    ...buildFilterComplex({ config, needsWatermark: hasWatermark }),
    ...(config.maxFramerate ? ["-fpsmax", `${config.maxFramerate}`] : []),
    ...(config.preserveMetadata ? ["-map_metadata", "0"] : []),
    "-progress", "-",
    "-y",
    ...(config.threadCount ? ["-threads", `${config.threadCount}`] : []),
    outputPath
  ];

  return args;
}

/**
 * Parses real-time FFmpeg stdout progress
 */
export function parseFfmpegProgress(chunk, currentProgress, totalDuration) {
  const timeMatch = chunk.match(/time=(\d{2}):(\d{2}):(\d{2}\.\d{2})/);
  const dupMatch = chunk.match(/dup_frames=(\d+)/);
  const speedMatch = chunk.match(/speed=(\d+(?:\.\d+)?)x/);
  const fpsMatch = chunk.match(/fps=(\d+\.\d+)/);
  const sizeMatch = chunk.match(/total_size=(\d+)/);

  if (chunk.match(/progress=end/)) {
    return { ...currentProgress, progress: 1 };
  }

  if (dupMatch) currentProgress.dupFrames = parseInt(dupMatch[1]);
  if (speedMatch) currentProgress.speed = parseFloat(speedMatch[1]);
  if (fpsMatch) currentProgress.fps = parseFloat(fpsMatch[1]);
  if (sizeMatch) currentProgress.totalSize = parseInt(sizeMatch[1]);

  if (timeMatch && totalDuration) {
    const [, h, m, s] = timeMatch;
    const currentSeconds = parseInt(h) * 3600 + parseInt(m) * 60 + parseFloat(s);
    currentProgress.progress = Math.min(1, currentSeconds / totalDuration);
  }

  return currentProgress;
}

/**
 * Queries media metadata using ffprobe sidecar
 */
export async function extractVideoMetadata(filePath) {
  const result = await Command.sidecar("binaries/ffprobe", [
    "-v", "quiet",
    "-print_format", "json",
    "-show_format",
    "-show_streams",
    filePath
  ]).execute();

  if (result.code !== 0) {
    throw new Error(`ffprobe failed with code ${result.code}: ${result.stderr}`);
  }

  const data = JSON.parse(result.stdout);
  const videoStream = data.streams?.find(s => s.codec_type === "video");
  const audioStream = data.streams?.find(s => s.codec_type === "audio");

  const [num, den] = videoStream?.r_frame_rate?.split("/") ?? [];
  const fps = num && den ? Number(num) / Number(den) : null;

  const summary = {
    duration: data.format?.duration ? parseFloat(data.format.duration) : null,
    fileExtension: filePath.split(".").pop(),
    videoCodec: videoStream?.codec_name,
    size: data.format?.size ? parseInt(data.format.size) : null,
    videoFps: fps,
    hasAudio: !!audioStream,
    hasVideo: !!videoStream,
    audioCodec: audioStream?.codec_name,
    audioSampleRate: audioStream?.sample_rate,
    videoWidth: videoStream?.width,
    videoHeight: videoStream?.height
  };

  return { ...data, summary };
}

/**
 * Obtains exact duration in seconds using ffmpeg stderr output
 */
export async function getMediaDuration(filePath) {
  const cmd = Command.sidecar("binaries/ffmpeg", ["-i", filePath]);
  const child = await cmd.spawn();

  return new Promise((resolve, reject) => {
    cmd.on("error", err => reject(err));
    cmd.on("close", status => {
      if (status.code !== 0 && status.code !== 1) {
        reject(new Error(`Failed to read duration, exit code: ${status.code}`));
      }
    });

    cmd.stderr.on("data", line => {
      const match = line.match(/Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})/);
      if (match) {
        const [, h, m, s] = match;
        const total = parseInt(h) * 3600 + parseInt(m) * 60 + parseFloat(s);
        resolve(total);
      }
    });
  });
}
