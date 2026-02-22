# Implementation Plan - UX & UI Enhancements (Track: ux_improvements_20260221)

## Phase 1: Landing Page & Admin UI Adjustments
- [ ] **Task: Improve Landing Page Grade Selection**
    - [ ] Write tests to verify the "Select Your Grade" header visibility.
    - [ ] Implement the "Select Your Grade" header above the grade selection grid on the landing page.
- [ ] **Task: Fix Admin Refresh Mode Tooltip Positioning**
    - [ ] Write tests to check the tooltip's positioning logic/styles.
    - [ ] Adjust the tooltip styles in the Admin Page to prevent overlap with the top toolbar.
- [ ] **Task: Conductor - User Manual Verification 'Phase 1: Landing Page & Admin UI Adjustments' (Protocol in workflow.md)**

## Phase 2: Timer Low-Pressure Mode
- [ ] **Task: Implement Timer Toggle Component/State**
    - [ ] Write tests for the timer's visibility toggle (hidden/shown states).
    - [ ] Implement the toggle functionality in the timer component (clicking/touching numbers hides/shows them).
    - [ ] Add the "Show Timer" icon/placeholder for the hidden state.
- [ ] **Task: Conductor - User Manual Verification 'Phase 2: Timer Low-Pressure Mode' (Protocol in workflow.md)**

## Phase 3: Socratic Hint Parsing & Display
- [ ] **Task: Implement `ideal_solution` Parser Utility**
    - [ ] Write unit tests for the Socratic hint parser (case-insensitive "Socratic Hint:" delimiter, no hint scenarios).
    - [ ] Implement the `parseIdealSolution` utility function to separate the hint from the solution.
- [ ] **Task: Implement Collapsible Solution Display Component**
    - [ ] Write tests for the `SolutionDisplay` component (initial collapsed state, toggle expansion).
    - [ ] Implement the `SolutionDisplay` component to render the Socratic hint box and the collapsible ideal solution box.
- [ ] **Task: Update Test Session Page for Displaying Parsed Solutions**
    - [ ] Write integration tests for the new solution display flow in the test session.
    - [ ] Integrate the `SolutionDisplay` component into the test session UI.
- [ ] **Task: Conductor - User Manual Verification 'Phase 3: Socratic Hint Parsing & Display' (Protocol in workflow.md)**
