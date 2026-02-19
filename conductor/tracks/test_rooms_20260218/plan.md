# Implementation Plan - Test Rooms and Session Persistence

## Phase 1: Room Data Layer
- [ ] Task: Create `useRoom` Hook
    - [ ] Write unit tests for room code generation logic (6-char alphanumeric)
    - [ ] Implement logic to save/load room state from Cloud Firestore
    - [ ] Implement logic to save/load room code from `localStorage`
- [ ] Task: Implement Smart Timer Recovery
    - [ ] Logic to calculate remaining time based on `lastInteractionAt` and `remainingSeconds`
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Room Data Layer' (Protocol in workflow.md)

## Phase 2: Integration into Test Engine
- [ ] Task: Update `TestPage` to use `useRoom`
    - [ ] Logic to initialize a room if none exists (new test)
    - [ ] Logic to load existing room from URL param `?room=CODE`
    - [ ] Update "Confirm Selection" to sync state to Firestore and update `lastInteractionAt`
- [ ] Task: Implement Expiration and Cleanup logic
    - [ ] Logic to check if a room exists in Firestore before loading
    - [ ] If room is missing, clear `localStorage` and notify user
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Integration into Test Engine' (Protocol in workflow.md)

## Phase 3: Landing Page Enhancements
- [ ] Task: Build Room Access UI
    - [ ] Add "Join Room" input field with validation
    - [ ] Add "Resume Challenge" button (conditional on `localStorage`)
- [ ] Task: Final Polish & UI for Room Code
    - [ ] Display the room code prominently in the `TestPage` header
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Landing Page Enhancements' (Protocol in workflow.md)
