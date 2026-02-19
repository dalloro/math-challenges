# Implementation Plan - Open Reasoning Interface and Adaptive Engine Refinement

## Phase 1: Stability & Regression Testing
- [x] Task: Create Unit Tests for Adaptive Logic
    - [x] Set up Vitest mocks for Firestore and Router
    - [x] Write test case: "Stay at current level if next level is empty"
    - [x] Write test case: "Correctly display question level from metadata"
- [x] Task: Refactor Adaptive Logic into a custom hook `useAdaptiveEngine` for better testability [a6ec060]

## Phase 2: Open Reasoning UI
- [x] Task: Build Open Reasoning Component [8cc5e11]
    - [x] Add "Switch to Reasoning" toggle in `TestPage`
    - [x] Implement multi-line text input for student process
    - [x] Create "Submit for Review" button
- [x] Task: Build Feedback Display [8cc5e11]
    - [x] Create UI for displaying AI feedback / Ideal Solution
    - [x] Implement thematic shift integration for reasoning mode

## Phase 3: AI Integration & Fallback
- [x] Task: Implement AI Feedback Client [8cc5e11]
    - [x] Create service to call Gemini API with student input
    - [x] Write Socratic prompt for reasoning evaluation
- [x] Task: Implement Static Fallback logic [8cc5e11]
    - [x] Logic to show `ideal_solution` from Firestore if API key is missing or call fails

## Phase 4: Verification & Polish
- [x] Task: Conductor - User Manual Verification 'Phase 1: Stability & Regression Testing' [8cc5e11]
- [x] Task: Conductor - User Manual Verification 'Phase 2 & 3: AI Reasoning' [8cc5e11]
