import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getApiKey, saveApiKey, deleteApiKey } from '../storage';

describe('Storage Service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should return null if no API key is stored', () => {
    expect(getApiKey()).toBeNull();
  });

  it('should save and retrieve the API key', () => {
    const testKey = 'test-api-key';
    saveApiKey(testKey);
    expect(getApiKey()).toBe(testKey);
  });

  it('should delete the API key', () => {
    const testKey = 'test-api-key';
    saveApiKey(testKey);
    deleteApiKey();
    expect(getApiKey()).toBeNull();
  });
});
