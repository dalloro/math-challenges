# Implementation Plan - Unified Reasoning Modality

## Phase 1: Configuration & State Management
- [x] Task: Create Prompt Asset [cb719e4]
    - [x] Create `TEST-REASONING.md` in the project root with the provided prompt
- [ ] Task: Update State Management for New Modality
    - [ ] Update `src/services/storage.ts` to support saving/loading `testModality` (combined vs blind)
    - [ ] Write unit tests for the updated storage utility
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Configuration & State Management' (Protocol in workflow.md)

## Phase 2: UI & Settings Implementation
- [ ] Task: Implement New Settings UI
    - [ ] Update `src/pages/SettingsPage.tsx` to include the Modality toggle
    - [ ] Write tests to verify setting persistence
- [ ] Task: Refactor Question Wizard for Mandatory Reasoning
    - [ ] Update `src/components/QuestionWizard.tsx` to require reasoning text
    - [ ] Add "Blind Mode" conditional rendering (hiding choices, adding final answer field)
    - [ ] Implement validation message when "Submit" is clicked without reasoning
    - [ ] Write unit tests for the new validation logic and mode-specific rendering
- [ ] Task: Conductor - User Manual Verification 'Phase 2: UI & Settings Implementation' (Protocol in workflow.md)

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
