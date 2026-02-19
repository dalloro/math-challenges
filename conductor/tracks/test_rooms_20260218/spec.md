# Specification - Test Rooms and Session Persistence

## Goal
Implement a "Test Room" system that allows students to persist their progress across refreshes and resume their testing sessions on different devices using a unique 6-character room code.

## Functional Requirements
1.  **Room Code Generation:**
    - When a student starts a new challenge, generate a random 6-character alphanumeric code (e.g., `AB12XY`).
    - The code must be displayed prominently during the test.
2.  **State Persistence (Hybrid):**
    - **localStorage:** Store the current room code and session state locally for instant "one-click" resumption.
    - **Cloud Firestore:** Store the full session state (current level, accuracy, answers, remaining time) in a `rooms` collection.
3.  **Smart Timer Recovery:**
    - Record the `lastInteractionAt` timestamp in Firestore every time the user clicks "Confirm Selection".
    - When resuming a session, calculate the remaining time by subtracting the elapsed time between `lastInteractionAt` and the current time from the stored `remainingSeconds`.
4.  **Resumption Logic:**
    - **Landing Page:** 
        - Add a "Join Room" input field.
        - Add a "Resume Active Session" button that appears if a room code is found in `localStorage`.
    - **URL Access:** Support deep linking via `/test?room=[CODE]`.
5.  **Lifecycle & Data Purging:**
    - **Database Purge:** Firestore rooms that have not been interacted with for more than 7 days must be purged.
    - **Local Cleanup:** If a student attempts to resume a room (via localStorage or manual entry) that no longer exists in Firestore, the application must:
        - Inform the user that the session has expired.
        - Completely wipe the invalid session data from `localStorage`.
        - Redirect the user back to the grade selection screen.

## Technical Details
- **Collection:** `rooms`
- **Schema:** `{ roomCode, grade, currentLevel, score, answers: [], remainingSeconds, lastInteractionAt, createdAt }`

## Acceptance Criteria
- [ ] Refreshing the `TestPage` maintains the current question and remaining timer.
- [ ] Entering a room code from another device loads the same state and an approximated timer.
- [ ] The room code is generated only once per session.
- [ ] If a room is missing from Firestore, the `localStorage` entry is wiped and the user is notified.

## Out of Scope
- Multi-user collaboration within the same room.
- Server-side scheduled cron for purging (will be handled by client-side detection or manual admin scripts for now).
