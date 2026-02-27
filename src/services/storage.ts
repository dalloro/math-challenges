const API_KEY_STORAGE_NAME = 'gemini_api_key';
const TEST_MODALITY_STORAGE_NAME = 'test_modality';

export type TestModality = 'combined' | 'blind';

/**
 * Retrieves the Gemini API key from localStorage.
 * @returns The API key or null if not found.
 */
export function getApiKey(): string | null {
  return localStorage.getItem(API_KEY_STORAGE_NAME);
}

/**
 * Saves the Gemini API key to localStorage.
 * @param key The API key to save.
 */
export function saveApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE_NAME, key);
}

/**
 * Removes the Gemini API key from localStorage.
 */
export function deleteApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_NAME);
}

/**
 * Retrieves the test modality from localStorage.
 * @returns The test modality ('combined' or 'blind'). Defaults to 'combined'.
 */
export function getTestModality(): TestModality {
  const modality = localStorage.getItem(TEST_MODALITY_STORAGE_NAME);
  return (modality === 'blind') ? 'blind' : 'combined';
}

/**
 * Saves the test modality to localStorage.
 * @param modality The modality to save ('combined' or 'blind').
 */
export function saveTestModality(modality: TestModality): void {
  localStorage.setItem(TEST_MODALITY_STORAGE_NAME, modality);
}
