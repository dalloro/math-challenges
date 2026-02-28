const API_KEY_STORAGE_NAME = 'gemini_api_key';
const TEST_MODALITY_STORAGE_NAME = 'test_modality';
const AI_ENABLED_STORAGE_NAME = 'ai_enabled';
const SEEN_QUESTIONS_PREFIX = 'seen_questions_';
const GLOBAL_SEEN_PREFIX = 'global_seen_questions_';

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

/**
 * Checks if Gemini AI features are enabled in localStorage.
 * @returns true if enabled or not set, false otherwise.
 */
export function isAiEnabled(): boolean {
  const enabled = localStorage.getItem(AI_ENABLED_STORAGE_NAME);
  return enabled === null ? true : enabled === 'true';
}

/**
 * Saves the Gemini AI enabled state to localStorage.
 * @param enabled The enabled state to save.
 */
export function saveAiEnabled(enabled: boolean): void {
  localStorage.setItem(AI_ENABLED_STORAGE_NAME, String(enabled));
}

/**
 * Retrieves the list of seen question IDs for a specific room.
 * @param roomCode The room code to look up.
 * @returns An array of question IDs.
 */
export function getSeenQuestions(roomCode: string): string[] {
  const seen = localStorage.getItem(`${SEEN_QUESTIONS_PREFIX}${roomCode}`);
  try {
    return seen ? JSON.parse(seen) : [];
  } catch (e) {
    console.error('Failed to parse seen questions', e);
    return [];
  }
}

/**
 * Retrieves the global list of seen question IDs for a specific grade on this device.
 * @param grade The grade level.
 * @returns An array of question IDs.
 */
export function getGlobalSeenQuestions(grade: number): string[] {
  const seen = localStorage.getItem(`${GLOBAL_SEEN_PREFIX}${grade}`);
  try {
    return seen ? JSON.parse(seen) : [];
  } catch (e) {
    console.error('Failed to parse global seen questions', e);
    return [];
  }
}

/**
 * Adds a question ID to the seen list for a specific room AND the global device list.
 * @param roomCode The room code.
 * @param questionId The ID of the question.
 * @param grade The grade level of the question.
 */
export function addSeenQuestion(roomCode: string, questionId: string, grade: number): void {
  // 1. Room-specific tracking (used for resetting within a long session)
  const seen = getSeenQuestions(roomCode);
  if (!seen.includes(questionId)) {
    seen.push(questionId);
    localStorage.setItem(`${SEEN_QUESTIONS_PREFIX}${roomCode}`, JSON.stringify(seen));
  }

  // 2. Device-wide global tracking (used to prevent repeats across new tests)
  const globalSeen = getGlobalSeenQuestions(grade);
  if (!globalSeen.includes(questionId)) {
    globalSeen.push(questionId);
    localStorage.setItem(`${GLOBAL_SEEN_PREFIX}${grade}`, JSON.stringify(globalSeen));
  }
}

/**
 * Clears the global seen questions for a grade (resetting the device history).
 * @param grade The grade level.
 */
export function clearGlobalSeenQuestions(grade: number): void {
  localStorage.removeItem(`${GLOBAL_SEEN_PREFIX}${grade}`);
}

/**
 * Clears the seen questions list for a specific room.
 * @param roomCode The room code.
 */
export function clearSeenQuestions(roomCode: string): void {
  localStorage.removeItem(`${SEEN_QUESTIONS_PREFIX}${roomCode}`);
}
