import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isAiEnabled, saveAiEnabled } from '../storage';

describe('AI Toggle Storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should return true as default if no AI toggle state is stored', () => {
    expect(isAiEnabled()).toBe(true);
  });

  it('should save and retrieve the AI toggle state (false)', () => {
    saveAiEnabled(false);
    expect(isAiEnabled()).toBe(false);
  });

  it('should save and retrieve the AI toggle state (true)', () => {
    saveAiEnabled(false);
    saveAiEnabled(true);
    expect(isAiEnabled()).toBe(true);
  });
});
