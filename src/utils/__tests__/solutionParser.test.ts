import { describe, it, expect } from 'vitest';
import { parseIdealSolution } from '../solutionParser';

describe('parseIdealSolution', () => {
  it('splits solution with "Socratic Hint:" delimiter (hint at end)', () => {
    const input = 'The answer is 7. Socratic Hint: Think about prime numbers.';
    const result = parseIdealSolution(input);
    expect(result.socraticHint).toBe('Think about prime numbers.');
    expect(result.finalIdealSolution).toBe('The answer is 7.');
  });

  it('is case-insensitive for the delimiter', () => {
    const input = 'Then generalize. SOCRATIC HINT: Start with small cases.';
    const result = parseIdealSolution(input);
    expect(result.socraticHint).toBe('Start with small cases.');
    expect(result.finalIdealSolution).toBe('Then generalize.');
  });

  it('handles delimiter in the middle of complex text', () => {
    const input = 'Initial context. Final solution steps. Socratic Hint: Look for symmetry.';
    const result = parseIdealSolution(input);
    expect(result.socraticHint).toBe('Look for symmetry.');
    expect(result.finalIdealSolution).toBe('Initial context. Final solution steps.');
  });

  it('returns null hint if delimiter is missing', () => {
    const input = 'Just the steps and the answer.';
    const result = parseIdealSolution(input);
    expect(result.socraticHint).toBeNull();
    expect(result.finalIdealSolution).toBe(input);
  });

  it('trims whitespace from result components', () => {
    const input = '  The solution text   Socratic Hint:   Hint text    ';
    const result = parseIdealSolution(input);
    expect(result.socraticHint).toBe('Hint text');
    expect(result.finalIdealSolution).toBe('The solution text');
  });

  it('handles empty input', () => {
    const result = parseIdealSolution('');
    expect(result.socraticHint).toBeNull();
    expect(result.finalIdealSolution).toBe('');
  });
});
