# Specification - Open Reasoning Interface and Adaptive Engine Refinement

## Goal
Implement the "Open Reasoning" modality where students type their logic, add regression tests for the adaptive engine, and integrate Gemini for live feedback.

## Core Requirements
- **Regression Testing:**
  - Implement unit tests for the `TestPage` logic or a specialized hook to ensure levels are not incremented if no content exists for the next level.
- **Open Reasoning Interface:**
  - Toggle between MC5 and Open modality.
  - Text area for "Process/Reasoning" input.
  - UI for displaying the "Ideal Solution" side-by-side or as a toggle.
- **AI Integration (BYOK):**
  - Use the Gemini API key from local storage.
  - Call `gemini-1.5-flash` to evaluate the student's typed reasoning.
  - Socratic feedback: provide hints without giving the final answer.
- **Graceful Degradation:**
  - If no API key is present, show the static "Ideal Solution" instead of live feedback.

## Success Criteria
- [ ] Adaptive engine correctly handles empty level pools (Regression Test passes).
- [ ] Students can submit text-based solutions.
- [ ] Live AI feedback works when a key is provided.
- [ ] App falls back to static content without a key.
