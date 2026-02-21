# Specification - Content Generator Prompt

## Goal
Develop a high-rigor, parametric markdown prompt (`CONTENT-GENERATOR-PROMPT.md`) designed to generate gifted-level math questions that comply with the application's JSON schema and educational philosophy.

## Functional Requirements
1.  **Parametric Configuration:**
    - The file starts with a clear `## CONFIGURATION` section for `GRADE`, `LEVEL`, and `COUNT`.
2.  **Schema Compliance:**
    - The generated output must be a valid JSON array matching the schema:
      - `grade`: number
      - `level`: number
      - `difficulty`: "gifted"
      - `type`: one of the 5 defined categories.
      - `question`: string
      - `options`: array of 5 strings.
      - `correct_answer`: string (exact match to an option).
      - `ideal_solution`: string (Hybrid: direct derivation + Socratic hint).
      - `failure_modes`: object mapping keys to specific error logic.
3.  **High-Rigor Pedagogy:**
    - Sourced from Beast Academy, AMC, MATHCOUNTS, and AIME standards.
    - Explicit calibration for difficulty levels 1-10.
4.  **Mathematical Quality Gates (Prompt Instructions):**
    - **Plausible Distractors:** All wrong options must be derived from the specified failure modes.
    - **Standard Notation:** Use readable text-based math (e.g., `x^2`, `sqrt(y)`) instead of raw LaTeX.
    - **Exact Matching:** Strict instructions to ensure the `correct_answer` exists in `options`.

## Technical Details
- **File Name:** `CONTENT-GENERATOR-PROMPT.md`
- **Output Format:** JSON Array only (no markdown code blocks in the LLM response).

## Acceptance Criteria
- [ ] The prompt includes a clear section at the top for variables.
- [ ] The prompt explicitly defines the 5 allowed `type` values.
- [ ] The prompt lists and explains the specific `failure_modes` keys.
- [ ] The prompt forces the LLM to output ONLY the JSON array.
- [ ] The `ideal_solution` instruction requires both a derivation and a Socratic hint.

## Out of Scope
- Building a UI for this prompt (manual copy-paste for now).
- Automating the LLM call via API (this is for manual content seeding).
