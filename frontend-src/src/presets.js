import { DEFAULT_CONFIG } from './compressionEngine.js';

export const SPEED_PRESETS = [
  "ultrafast",
  "superfast",
  "veryfast",
  "faster",
  "fast",
  "medium",
  "slow",
  "slower",
  "veryslow"
];

export const PRESETS = [
  {
    name: "Standard",
    description: "Balanced compression with optimal quality and speed",
    config: { ...DEFAULT_CONFIG }
  },
  {
    name: "High Quality",
    description: "Best visual fidelity with higher bitrate",
    config: {
      ...DEFAULT_CONFIG,
      crfFraction: 0.9,
      speed: "medium"
    }
  },
  {
    name: "Small file",
    description: "Maximum reduction for email, Discord, or sharing limits",
    config: {
      ...DEFAULT_CONFIG,
      crfFraction: 0.2,
      speed: "medium"
    }
  },
  {
    name: "Compress + resize to half size",
    description: "Compresses and scales video dimensions to 50%",
    config: {
      ...DEFAULT_CONFIG,
      downscaleFraction: 0.5
    }
  },
  {
    name: "Fast Compression",
    description: "Fastest encoding speed using ultrafast preset",
    config: {
      ...DEFAULT_CONFIG,
      crfFraction: 0.5,
      speed: "ultrafast"
    }
  }
];
