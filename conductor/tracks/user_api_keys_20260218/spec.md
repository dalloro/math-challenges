# Specification - User-Specific API Keys and Enhanced Static Fallback

## Goal
Implement a robust "Bring Your Own Key" (BYOK) architecture that separates Gemini API key usage between individual users via client-side storage, while providing a fully featured static learning experience for users who opt out of providing a key.

## Functional Requirements
1.  **User-Specific Key Separation:**
    - Use `localStorage` to store the Gemini API key. 
    - Ensure all AI service calls pull the key directly from the current user's browser context.
    - Result: User A's usage is completely independent of User B's usage.
2.  **API Key Management UI:**
    - Refine the **Settings Page** to allow users to input, update, or delete their Gemini API key.
    - Provide a "Connection Test" button to verify if the entered key is valid before saving.
3.  **First-Class Static Fallback:**
    - When no API key is detected in `localStorage`:
        - The "Open Reasoning" modality remains fully available.
        - Instead of calling the AI, the app displays the **Ideal Solution** walkthrough immediately upon student submission.
        - Ensure the UI clearly signals that the user is in "Static Mode" (e.g., a "Learning from Ideal Solution" banner).
4.  **Privacy & Security:**
    - Add a clear disclaimer that API keys are stored only in the user's browser and are never sent to the application's backend or Firestore.

## Technical Details
- **Persistence:** `localStorage.setItem('gemini_api_key', '...')`
- **Logic:** Conditional logic in the `useAIReasoning` hook or similar service to switch between `live` and `static` modalities based on key presence.

## Acceptance Criteria
- [ ] User A enters a key; User B (different browser) does not see or use that key.
- [ ] A user without a key can still complete a full reasoning challenge and see the ideal solution.
- [ ] Deleting the key in Settings successfully triggers the fallback behavior.
- [ ] Invalid keys show an immediate error message during the "Connection Test."

## Out of Scope
- Server-side storage of API keys (to maintain maximum privacy and zero-cost).
- Multi-device sync for anonymous users.
