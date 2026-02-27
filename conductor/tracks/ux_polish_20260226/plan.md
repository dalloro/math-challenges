# Implementation Plan - Enhanced Feedback & UX Polish

## Phase 1: Setup & State Management [checkpoint: c4fa138]
- [x] Task: Update Storage for Gemini Toggle [36cd27b]
- [x] Task: Install Math Dependencies [b0e8e63]
- [x] Task: Conductor - User Manual Verification 'Phase 1: Setup & State Management' (Protocol in workflow.md) [c4fa138]

## Phase 2: Settings UI Enhancements [checkpoint: fced7cf]
- [x] Task: Implement AI Toggle Switch [fced7cf]
- [x] Task: Conductor - User Manual Verification 'Phase 2: Settings UI Enhancements' (Protocol in workflow.md) [fced7cf]

## Phase 3: LaTeX Math Rendering [checkpoint: 9eccaf4]
- [x] Task: Integrate KaTeX with Markdown [9eccaf4]
- [x] Task: Conductor - User Manual Verification 'Phase 3: LaTeX Math Rendering' (Protocol in workflow.md) [9eccaf4]

## Phase 4: Delayed Review Flow [checkpoint: fba0fb1]
- [x] Task: Implement "Next" Button Delay [fba0fb1]
- [x] Task: Add Delay Tooltip [fba0fb1]
- [x] Task: Conductor - User Manual Verification 'Phase 4: Delayed Review Flow' (Protocol in workflow.md) [fba0fb1]

## Phase 5: Heart-Beat Animations [checkpoint: 0651694]
- [x] Task: Create Heart-Beat Component [0651694]
- [x] Task: Trigger Animations in Test Engine [0651694]
- [x] Task: Conductor - User Manual Verification 'Phase 5: Heart-Beat Animations' (Protocol in workflow.md) [0651694]

## Phase 6: Animation Fixes (Mobile & Loop) [checkpoint: e1501bf]
- [x] Task: Fix Animation Looping [e1501bf]
    - [x] Update `src/index.css` to limit `heart-beat` to 2 iterations instead of `infinite`. [e1501bf]
    - [x] Ensure `OutcomeOverlay` timing matches the CSS duration. [e1501bf]
- [x] Task: Fix Mobile Visibility [e1501bf]
    - [x] Refactor `OutcomeOverlay` styling to ensure it is visible on mobile viewports. [e1501bf]
    - [x] Remove conflicting `pointer-events` classes. [e1501bf]
- [x] Task: Conductor - User Manual Verification 'Phase 6: Animation Fixes' (Protocol in workflow.md) [e1501bf]
