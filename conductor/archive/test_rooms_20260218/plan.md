# Implementation Plan - Test Rooms and Session Persistence

## Phase 1: Room Data Layer
- [x] Task: Create `useRoom` Hook [611f315]
    - [x] Write unit tests for room code generation logic (6-char alphanumeric)
    - [x] Implement logic to save/load room state from Cloud Firestore
    - [x] Implement logic to save/load room code from `localStorage`
- [x] Task: Implement Smart Timer Recovery [611f315]
    - [x] Logic to calculate remaining time based on `lastInteractionAt` and `remainingSeconds`
- [x] Task: Conductor - User Manual Verification 'Phase 1: Room Data Layer' (Protocol in workflow.md) [611f315]

## Phase 2: Integration into Test Engine
- [x] Task: Update `TestPage` to use `useRoom` [611f315]
    - [x] Logic to initialize a room if none exists (new test)
    - [x] Logic to load existing room from URL param `?room=CODE`
    - [x] Update "Confirm Selection" to sync state to Firestore and update `lastInteractionAt`
- [x] Task: Implement Expiration and Cleanup logic [611f315]
    - [x] Logic to check if a room exists in Firestore before loading
    - [x] If room is missing, clear `localStorage` and notify user
- [x] Task: Conductor - User Manual Verification 'Phase 2: Integration into Test Engine' (Protocol in workflow.md) [611f315]

## Phase 3: Landing Page Enhancements
- [x] Task: Build Room Access UI [611f315]
    - [x] Add "Join Room" input field with validation
    - [x] Add "Resume Challenge" button (conditional on `localStorage`)
- [x] Task: Final Polish & UI for Room Code [611f315]
    - [x] Display the room code prominently in the `TestPage` header
- [x] Task: Conductor - User Manual Verification 'Phase 3: Landing Page Enhancements' (Protocol in workflow.md) [611f315]
