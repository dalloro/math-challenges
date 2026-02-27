import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getTestModality, saveTestModality } from '../storage';

describe('Modality Storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should return "combined" as default if no modality is stored', () => {
    expect(getTestModality()).toBe('combined');
  });

  it('should save and retrieve the test modality', () => {
    saveTestModality('blind');
    expect(getTestModality()).toBe('blind');
  });

  it('should allow switching back to combined', () => {
    saveTestModality('blind');
    saveTestModality('combined');
    expect(getTestModality()).toBe('combined');
  });
});
