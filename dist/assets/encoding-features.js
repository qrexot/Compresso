/** Shared encoder arguments for both actual compression and the size estimate. */
export function usesNvenc(config) {
  return config.encoder === 'nvenc' && config.formats?.[0] === 'mp4';
}
export function encoderArguments(config) {
  const fraction = Math.max(0, Math.min(1, Number(config.crfFraction ?? .5)));
  if (config.formats?.[0] === 'mp4') {
    const quality = String(Math.round((1 - fraction) * 51));
    return usesNvenc(config)
      ? ['-c:v','h264_nvenc','-tag:v','avc1','-rc','vbr','-cq',quality,'-b:v','0','-preset','p4']
      : ['-c:v','libx264','-tag:v','avc1','-crf',quality,'-b:v','0','-preset',config.speed ?? 'veryfast'];
  }
  if (config.formats?.[0] === 'webm') {
    const quality = String(Math.round((1 - fraction) * 63));
    const speed = {ultrafast:8,superfast:7,veryfast:6,fast:5,medium:3,slow:2,slower:1,veryslow:0}[config.speed] ?? 5;
    return ['-c:v','libvpx-vp9','-crf',quality,'-b:v','0','-deadline','good','-cpu-used',String(speed)];
  }
  throw new Error('Unsupported video format');
}
/** Three short clips spread over the trimmed region; no clip exceeds three seconds. */
export function planSamples(duration, trimStart, trimEnd) {
  if (!Number.isFinite(duration) || duration <= 0) throw new Error('Invalid video duration');
  const start = Number.isFinite(trimStart) ? Math.max(0, trimStart) : 0;
  const end = Number.isFinite(trimEnd) ? Math.min(duration, trimEnd) : duration;
  const length = end - start;
  if (!(length > 0)) throw new Error('Invalid trim range');
  if (length <= 3) return {length,samples:[{start,duration:length}]};
  const clip=Math.min(3,length/3);
  return {length,samples:[.12,.5,.88].map(position=>({start:start+(length-clip)*position,duration:clip}))};
}
/** Remove input, progress reporting, and output path from the actual FFmpeg command. */
export function sampleOptions(args) {
  if (args[0] !== '-i' || args.length < 4) throw new Error('Unexpected FFmpeg arguments');
  const result=[];
  for(let i=2;i<args.length-1;i++) {
    if(args[i]==='-progress') {i++;continue;}
    if(args[i]==='-y' || args[i]==='-n') continue;
    result.push(String(args[i]));
  }
  return result;
}
export function estimateFromSamples(results, totalDuration) {
  const seconds=results.reduce((sum,sample)=>sum+sample.duration,0);
  const bytes=results.reduce((sum,sample)=>sum+sample.bytes,0);
  if (!(seconds>0) || !(bytes>0) || !(totalDuration>0)) throw new Error('Empty estimate');
  return Math.round(bytes / seconds * totalDuration);
}
