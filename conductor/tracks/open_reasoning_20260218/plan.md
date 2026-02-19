# Implementation Plan - Open Reasoning Interface and Adaptive Engine Refinement

## Phase 1: Stability & Regression Testing
- [x] Task: Create Unit Tests for Adaptive Logic
    - [x] Set up Vitest mocks for Firestore and Router
    - [x] Write test case: "Stay at current level if next level is empty"
    - [x] Write test case: "Correctly display question level from metadata"
- [x] Task: Refactor Adaptive Logic into a custom hook `useAdaptiveEngine` for better testability [a6ec060]

## Phase 2: Open Reasoning UI
- [x] Task: Build Open Reasoning Component [a6ec060]
    - [x] Add "Switch to Reasoning" toggle in `TestPage`
    - [x] Implement multi-line text input for student process
    - [x] Create "Submit for Review" button
- [x] Task: Build Feedback Display [a6ec060]
    - [x] Create UI for displaying AI feedback / Ideal Solution
    - [x] Implement thematic shift integration for reasoning mode

## Phase 3: AI Integration & Fallback
- [x] Task: Implement AI Feedback Client [a6ec060]
    - [x] Create service to call Gemini API with student input
    - [x] Write Socratic prompt for reasoning evaluation
- [~] Task: Implement Static Fallback logic
    - [ ] Logic to show `ideal_solution` from Firestore if API key is missing or call fails

## Phase 4: Verification & Polish
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Stability & Regression Testing'
- [ ] Task: Conductor - User Manual Verification 'Phase 2 & 3: AI Reasoning'
