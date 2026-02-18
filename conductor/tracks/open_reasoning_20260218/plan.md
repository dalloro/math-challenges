# Implementation Plan - Open Reasoning Interface and Adaptive Engine Refinement

## Phase 1: Stability & Regression Testing
- [x] Task: Create Unit Tests for Adaptive Logic
    - [x] Set up Vitest mocks for Firestore and Router
    - [x] Write test case: "Stay at current level if next level is empty"
    - [x] Write test case: "Correctly display question level from metadata"
- [x] Task: Refactor Adaptive Logic into a custom hook `useAdaptiveEngine` for better testability [a6ec060]

## Phase 2: Open Reasoning UI
- [ ] Task: Build Open Reasoning Component
    - [ ] Add "Switch to Reasoning" toggle in `TestPage`
    - [ ] Implement multi-line text input for student process
    - [ ] Create "Submit for Review" button
- [ ] Task: Build Feedback Display
    - [ ] Create UI for displaying AI feedback / Ideal Solution
    - [ ] Implement thematic shift integration for reasoning mode

## Phase 3: AI Integration & Fallback
- [ ] Task: Implement AI Feedback Client
    - [ ] Create service to call Gemini API with student input
    - [ ] Write Socratic prompt for reasoning evaluation
- [ ] Task: Implement Static Fallback logic
    - [ ] Logic to show `ideal_solution` from Firestore if API key is missing or call fails

## Phase 4: Verification & Polish
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Stability & Regression Testing'
- [ ] Task: Conductor - User Manual Verification 'Phase 2 & 3: AI Reasoning'
