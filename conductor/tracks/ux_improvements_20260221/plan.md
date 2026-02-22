# Implementation Plan - UX & UI Enhancements (Track: ux_improvements_20260221)

## Phase 1: Landing Page & Admin UI Adjustments [checkpoint: a2058df]
- [x] **Task: Improve Landing Page Grade Selection** [a28becf]
    - [x] Write tests to verify the "Select Your Grade" header visibility.
    - [x] Implement the "Select Your Grade" header above the grade selection grid on the landing page.
- [x] **Task: Fix Admin Refresh Mode Tooltip Positioning** [c82e716]
    - [x] Write tests to check the tooltip's positioning logic/styles.
    - [x] Adjust the tooltip styles in the Admin Page to prevent overlap with the top toolbar.
- [x] **Task: Conductor - User Manual Verification 'Phase 1: Landing Page & Admin UI Adjustments' (Protocol in workflow.md)** [a2058df]

## Phase 2: Timer Low-Pressure Mode [checkpoint: fe2c0df]
- [x] **Task: Implement Timer Toggle Component/State** [3bea563]
    - [x] Write tests for the timer's visibility toggle (hidden/shown states).
    - [x] Implement the toggle functionality in the timer component (clicking/touching numbers hides/shows them).
    - [x] Add the "Show Timer" icon/placeholder for the hidden state.
- [x] **Task: Conductor - User Manual Verification 'Phase 2: Timer Low-Pressure Mode' (Protocol in workflow.md)** [fe2c0df]

## Phase 3: Socratic Hint Parsing & Display [checkpoint: 083bc27]
- [x] **Task: Implement `ideal_solution` Parser Utility** [61a297c]
    - [x] Write unit tests for the Socratic hint parser (case-insensitive "Socratic Hint:" delimiter, no hint scenarios).
    - [x] Implement the `parseIdealSolution` utility function to separate the hint from the solution.
- [x] **Task: Implement Collapsible Solution Display Component** [020d695]
    - [x] Write tests for the `SolutionDisplay` component (initial collapsed state, toggle expansion).
    - [x] Implement the `SolutionDisplay` component to render the Socratic hint box and the collapsible ideal solution box.
- [x] **Task: Update Test Session Page for Displaying Parsed Solutions** [3c1d291]
    - [x] Write integration tests for the new solution display flow in the test session.
    - [x] Integrate the `SolutionDisplay` component into the test session UI.
- [x] **Task: Conductor - User Manual Verification 'Phase 3: Socratic Hint Parsing & Display' (Protocol in workflow.md)** [083bc27]

## Phase: Review Fixes
- [x] Task: Apply review suggestions [120ee9e]
