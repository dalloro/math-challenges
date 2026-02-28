/**
 * A robust randomization utility for shuffling pools of items.
 */

/**
 * Shuffles an array using a stable seeded random algorithm (Fisher-Yates + Mulberry32).
 * @param array The array to shuffle.
 * @param seed A string seed to ensure consistent results for the same input.
 * @returns A new shuffled array.
 */
export function seededShuffle<T>(array: T[], seed: string): T[] {
  const result = [...array];
  
  // 1. Generate a numeric seed from the string
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }

  // 2. Mulberry32 generator
  const rand = () => {
    h |= 0; h = h + 0x6D2B79F5 | 0;
    let t = Math.imul(h ^ h >>> 15, 1 | h);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };

  // 3. Fisher-Yates shuffle
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
