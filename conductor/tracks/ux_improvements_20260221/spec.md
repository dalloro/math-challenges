# Specification - Application Improvements (Track: ux_improvements_20260221)

## Overview
This track focuses on a series of UX and functional improvements to the Math Challenges application: enhancing the landing page clarity, providing a "low-pressure" timer mode, fixing admin UI overlapping, and implementing a more educational Socratic hint display.

## Functional Requirements

### 1. Landing Page: Grade Selection Clarity
- Add a prominent "Select Your Grade" header above the grid of numbers on the landing page.
- Ensure the header clearly communicates that the numbers represent school grades.
- (Implicit) Maintain the existing grid functionality but improve its context.

### 2. Timer: Low-Pressure Mode
- Implement a toggle feature for the test session timer.
- When the timer is clicked or touched, replace the numeric countdown with a "Show Timer" placeholder or icon.
- When the placeholder/icon is clicked, restore the numeric countdown.
- The timer state (hidden/visible) should be persistent within the session if possible.

### 3. Admin UI: Tooltip Positioning
- Reposition the "refresh mode" tooltip in the admin page.
- Ensure it no longer overlaps with the top toolbar; it should be positioned clearly below or adjacent to its trigger without occlusion.

### 4. Socratic Hint & Ideal Solution Rendering
- **Parsing:**
    - Implement a case-insensitive parser for the `ideal_solution` field in the question JSON.
    - Look for the delimiter "Socratic Hint:" (and variations like "SOCRATIC HINT:").
    - Separate the text into two components: `socraticHint` and `finalIdealSolution`.
- **UI Rendering:**
    - If a Socratic hint is found:
        - Render it first in a dedicated "Socratic Hint" box.
        - Render the `finalIdealSolution` below it in a separate box.
    - The "Ideal Solution" box MUST be collapsible and rendered **collapsed by default**.
    - The student must explicitly click/touch to expand the ideal solution.
    - If no Socratic hint is found, render only the "Ideal Solution" (also collapsible and initially collapsed).

## Non-Functional Requirements
- **Graceful Degradation:** If parsing fails or the delimiter is missing, the entire `ideal_solution` should be treated as the final solution and rendered in the collapsible box.
- **Responsiveness:** All new UI elements must be touch-friendly for mobile devices.

## Acceptance Criteria
- [ ] Landing page has a "Select Your Grade" header.
- [ ] Timer can be hidden and shown via click/touch.
- [ ] Admin refresh mode tooltip does not overlap the toolbar.
- [ ] Questions with "Socratic Hint:" in their `ideal_solution` field display the hint separately.
- [ ] Ideal solutions are always collapsed by default and require interaction to view.

## Out of Scope
- Modifying the underlying data in Firestore (this is a UI/parsing-only change for now).
- Adding new questions or changing question content.
