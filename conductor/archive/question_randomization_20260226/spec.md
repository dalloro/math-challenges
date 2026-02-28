# Specification - Robust Question Randomization & Selection

## Overview
This track addresses reports of non-uniform question distribution and frequent repetitions in the current question selection engine. It aims to implement a more robust randomization strategy that incorporates frequency weighting and intelligent fallback logic.

## Functional Requirements

### 1. Investigative Audit
- Verify the current implementation of question selection logic (likely in `src/pages/TestPage.tsx` or `src/hooks/useQuestions.ts`).
- Confirm if the current logic is strictly `grade+level` or already includes `type`.

### 2. Multi-Tier Selection & Fallback Logic
- **Primary Tier:** Filter the pool by `grade`, `level`, AND `type`.
- **Secondary Tier (Fallback):** If no un-seen questions are available in the Primary Tier, fall back to the broader pool of `grade` and `level` only, regardless of `type`.
- **Goal:** Ensure the user always gets a fresh challenge if one exists, even if it requires switching topic types.

### 3. Frequency Weighting (Recently Seen Tracking)
- Implement a mechanism to track questions previously presented to the user.
- **Persistence:** Tracking should persist across page reloads (e.g., via `localStorage` tied to the room or user).
- **Selection Weighting:** Prioritize questions that have *never* been seen or have not been seen in the current "cycle" of the available pool.

### 4. Robust Randomization
- Replace simple `Math.random()` index picking with a more uniform distribution strategy.
- Combine **Frequency Weighting** with a **Seeded Random** approach to ensure a high degree of variety for every session.

## Non-Functional Requirements
- **Efficiency:** The selection logic must run in O(N) or better relative to the filtered pool size to avoid UI hangs.
- **Maintainability:** Randomization logic should be encapsulated in a pure utility function or a dedicated hook.

## Acceptance Criteria
- [ ] Users do not see the same question twice until the available pool for that `grade+level` is exhausted.
- [ ] Selection logic successfully falls back from `type`-specific to `type`-agnostic pools.
- [ ] Randomization distribution is visibly more uniform across multiple test starts.

## Out of Scope
- Modifying the adaptive engine's difficulty progression rules.
- Adding new questions to the database.
- Modifying the Admin dashboard.
