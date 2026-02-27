# Implementation Plan - Unified Reasoning Modality

## Phase 1: Configuration & State Management [checkpoint: 5c9e485]
- [x] Task: Create Prompt Asset [cb719e4]
    - [x] Create `TEST-REASONING.md` in the project root with the provided prompt
- [x] Task: Update State Management for New Modality [0c4563b]
    - [x] Update `src/services/storage.ts` to support saving/loading `testModality` (combined vs blind) [0c4563b]
    - [x] Write unit tests for the updated storage utility [0c4563b]
- [x] Task: Conductor - User Manual Verification 'Phase 1: Configuration & State Management' (Protocol in workflow.md) [5c9e485]

## Phase 2: UI & Settings Implementation [checkpoint: fe6ff7d]
- [x] Task: Implement New Settings UI [a7b0f8e]
    - [x] Update `src/pages/SettingsPage.tsx` to include the Modality toggle [a7b0f8e]
    - [x] Write tests to verify setting persistence [a7b0f8e]
- [x] Task: Refactor Question Wizard for Mandatory Reasoning [e8f3ba4]
    - [x] Update `src/pages/TestPage.tsx` to require reasoning text [e8f3ba4]
    - [x] Add "Blind Mode" conditional rendering (hiding choices, adding final answer field) [e8f3ba4]
    - [x] Implement validation message when "Submit" is clicked without reasoning [e8f3ba4]
    - [x] Write unit tests for the new validation logic and mode-specific rendering [e8f3ba4]
- [x] Task: Conductor - User Manual Verification 'Phase 2: UI & Settings Implementation' (Protocol in workflow.md) [fe6ff7d]

## Phase 3: Enhanced Feedback Logic
- [ ] Task: Refactor Feedback Service
    - [ ] Update `src/services/ai.ts` (or relevant service) to use the prompt from `TEST-REASONING.md`
    - [ ] Implement conditional feedback logic:
        - [ ] IF No API Key -> Show static "Great job!"/ "Not exactly!" + Socratic hints + Collapsible answer
        - [ ] IF API Key -> Call Gemini for reasoning review and tips
    - [ ] Write unit tests for the feedback routing and prompt construction
- [ ] Task: Update Solution Display Component
    - [ ] Refactor `src/components/SolutionDisplay.tsx` to support inline AI reviews and collapsible static answers
    - [ ] Write tests for the updated solution presentation
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Enhanced Feedback Logic' (Protocol in workflow.md)

## Phase 4: Final Polish & Verification
- [ ] Task: UX Refinement
    - [ ] Ensure smooth transitions between input and feedback states
    - [ ] Final styling pass for the "Blind Mode" UI
- [ ] Task: Full Integration Testing
    - [ ] Verify the end-to-end flow in both "Combined" and "Blind" modes
    - [ ] Verify behavior with and without API keys
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Polish & Verification' (Protocol in workflow.md)
