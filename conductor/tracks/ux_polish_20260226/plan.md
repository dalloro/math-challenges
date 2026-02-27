# Implementation Plan - Enhanced Feedback & UX Polish

## Phase 1: Setup & State Management
- [x] Task: Update Storage for Gemini Toggle [36cd27b]
    - [x] Update `src/services/storage.ts` to include `isAiEnabled` functions. [36cd27b]
    - [x] Write unit tests for the new storage keys. [36cd27b]
- [x] Task: Install Math Dependencies [b0e8e63]
    - [x] Install `remark-math` and `rehype-katex`. [b0e8e63]
    - [x] Install `katex` and its CSS. [b0e8e63]
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Setup & State Management' (Protocol in workflow.md)

## Phase 2: Settings UI Enhancements
- [ ] Task: Implement AI Toggle Switch
    - [ ] Add a "Enable Gemini AI" toggle switch in `SettingsPage.tsx`.
    - [ ] Ensure it persists state without affecting the stored API key.
    - [ ] Update tests for `SettingsPage`.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Settings UI Enhancements' (Protocol in workflow.md)

## Phase 3: LaTeX Math Rendering
- [ ] Task: Integrate KaTeX with Markdown
    - [ ] Update `TestPage.tsx` (and any other Markdown consumers) to use `remark-math` and `rehype-katex`.
    - [ ] Import KaTeX CSS globally in `main.tsx` or `index.css`.
    - [ ] Write integration tests to verify LaTeX rendering (e.g., checking for specific KaTeX classes).
- [ ] Task: Conductor - User Manual Verification 'Phase 3: LaTeX Math Rendering' (Protocol in workflow.md)

## Phase 4: Delayed Review Flow
- [ ] Task: Implement "Next" Button Delay
    - [ ] Add logic in `TestPage.tsx` to disable the "Next" button for 5s in Static Mode.
    - [ ] Implement the countdown timer for the delay.
- [ ] Task: Add Delay Tooltip
    - [ ] Integrate a tooltip component (or custom logic) to show the "Take a moment..." message.
    - [ ] Write unit tests for the button state and tooltip visibility.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Delayed Review Flow' (Protocol in workflow.md)

## Phase 5: Heart-Beat Animations
- [ ] Task: Create Heart-Beat Component
    - [ ] Implement a reusable `OutcomeOverlay` component.
    - [ ] Define the heart-beat CSS keyframes.
- [ ] Task: Trigger Animations in Test Engine
    - [ ] Update `TestPage.tsx` to show the overlay on correct/incorrect answers and test completion.
    - [ ] Ensure assets `happy.png`, `sad.png`, and `completed.png` are correctly referenced.
    - [ ] Verify timing (2 beats, 2 seconds total).
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Heart-Beat Animations' (Protocol in workflow.md)
