# Specification - Unified Reasoning Modality & Enhanced Feedback

## Overview
This track aims to unify the application's testing experience by making "Reasoning Mode" the exclusive modality. It introduces a mandatory reasoning input step, a new "Blind Mode" setting, and dynamic feedback logic that adapts based on the presence of a Gemini API key.

## Functional Requirements

### 1. Mandatory Reasoning
- **Scope:** Applied to all questions in the assessment.
- **Enforcement:** Clicking "Submit" without reasoning text triggers a validation message.
- **Input:** A text area for step-by-step process documentation.

### 2. Modality Settings
- **Location:** `SettingsPage.tsx`.
- **Options:**
    - **Combined Mode (Default):** Multiple-choice options are visible alongside the reasoning input.
    - **Blind Mode:** Multiple-choice options are hidden. Users must provide their reasoning and a separate "Final Answer" input.

### 3. Feedback Logic (Post-Submission)
- **Case A: No Gemini API Key (Static Feedback)**
    - Display "Great job!" (Correct) or "Not exactly!" (Incorrect).
    - Display pre-generated Socratic hints/questions.
    - Provide a collapsible "View Correct Answer" section.
- **Case B: Gemini API Key Present (AI Feedback)**
    - Inline display of an in-depth AI review of the user's reasoning.
    - Review includes validation of logic, strengths/flaws, and tips for similar problems.

### 4. Prompt Engineering
- **Asset:** Save the user-provided system prompt in `TEST-REASONING.md`.
- **Usage:** This prompt will be the primary instruction set for Gemini-based reasoning reviews.

## Non-Functional Requirements
- **UX:** Transitions between question, submission, and feedback must be smooth and inline.
- **Persistence:** Selected modality must persist in `localStorage`.

## Acceptance Criteria
- [ ] Users cannot skip reasoning input.
- [ ] Settings successfully toggle between Multiple-Choice and Blind inputs.
- [ ] AI feedback is displayed inline when an API key is available.
- [ ] `TEST-REASONING.md` contains the specified prompt.

## Out of Scope
- Modifying the core adaptive engine logic.
- Adding new content to the question bank.
