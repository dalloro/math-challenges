const API_KEY_STORAGE_NAME = 'gemini_api_key';

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
