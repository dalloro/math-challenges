import { describe, it, expect } from 'vitest';
import { seededShuffle } from '../randomization';

describe('Randomization Utility', () => {
  const pool = ['a', 'b', 'c', 'd', 'e'];
  const seed = 'test-seed';

  it('should return a shuffled array of the same length', () => {
    const result = seededShuffle(pool, seed);
    expect(result).toHaveLength(pool.length);
    expect(result.sort()).toEqual(pool.sort());
  });

  it('should produce the same result for the same seed', () => {
    const result1 = seededShuffle(pool, seed);
    const result2 = seededShuffle(pool, seed);
    expect(result1).toEqual(result2);
  });

  it('should produce different results for different seeds', () => {
    const result1 = seededShuffle(pool, 'seed-1');
    const result2 = seededShuffle(pool, 'seed-2');
    expect(result1).not.toEqual(result2);
  });

  it('should not mutate the original array', () => {
    const original = [...pool];
    seededShuffle(original, seed);
    expect(original).toEqual(pool);
  });
});
