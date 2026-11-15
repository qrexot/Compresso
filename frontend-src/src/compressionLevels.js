/** Compression levels use the existing encoder's quality scale.
 * Larger values retain more detail; 0.42 is the original default. */
export const COMPRESSION_LEVELS = Object.freeze([
  { value: 0.60, title: 'Слабое', description: 'Лучше качество · файл больше' },
  { value: 0.50, title: 'Среднее', description: 'Баланс качества и размера' },
  { value: 0.42, title: 'Сильное', description: 'Меньше размер · прежний режим' }
]);

export function applyCompressionLevel(config, value) {
  if (!COMPRESSION_LEVELS.some(level => level.value === value)) {
    throw new RangeError('Неизвестный уровень сжатия');
  }
  return { ...config, crfFraction: value };
}

/** Keep the first occurrence and skip files already present or being added. */
export function uniqueNewPaths(paths, existing, pending = new Set()) {
  const key = path => path.replaceAll('/', '\\').toLowerCase();
  const known = new Set(existing.map(key));
  for (const item of pending) known.add(key(item));
  return paths.filter(path => {
    if (typeof path !== 'string' || !path) return false;
    const normalized = key(path);
    if (known.has(normalized)) return false;
    known.add(normalized);
    return true;
  });
}
