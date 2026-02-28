# Implementation Plan - Robust Question Randomization & Selection

## Phase 1: Audit & Recently Seen Infrastructure [checkpoint: d0b16d8]
- [x] Task: Locate and Audit Current Selection Logic [9352738]
    - [x] Inspect `src/pages/TestPage.tsx` and `src/hooks/useQuestions.ts` to identify the exact random picking mechanism. [9352738]
- [x] Task: Implement 'Seen Questions' Persistence [9352738]
    - [x] Update `src/services/storage.ts` to support tracking `seenQuestionIds` per room/grade. [9352738]
    - [x] **Write failing tests** for Seen Questions tracking. [9352738]
    - [x] **Implement** Seen Questions tracking. [9352738]
- [x] Task: Conductor - User Manual Verification 'Phase 1: Audit & Recently Seen Infrastructure' (Protocol in workflow.md) [d0b16d8]

## Phase 2: Multi-Tier Selection Logic [checkpoint: a7ab93f]
- [x] Task: Create Randomization Utility [3b342ad]
    - [x] **Write failing tests** for a utility that shuffles a pool using a stable seeded random algorithm. [3b342ad]
    - [x] **Implement** the utility in `src/utils/randomization.ts`. [3b342ad]
- [x] Task: Refactor Question Selection Engine [a7ab93f]
    - [x] **Write failing tests** for the new selection flow: [a7ab93f]
        1. Filter by `grade` + `level` + `type`.
        2. Exclude `seenQuestionIds`.
        3. If empty, filter by `grade` + `level` (fallback).
        4. Exclude `seenQuestionIds`.
        5. If still empty, reset `seenQuestionIds` for that tier and pick.
    - [x] **Implement** the logic in `src/pages/TestPage.tsx` or a new hook `useQuestionSelection`. [a7ab93f]
- [x] Task: Conductor - User Manual Verification 'Phase 2: Multi-Tier Selection Logic' (Protocol in workflow.md) [a7ab93f]

## Phase 3: Integration & Final Polish
- [~] Task: Verify End-to-End Flow
    - [ ] Run automated integration tests covering the selection logic.
    - [ ] Ensure that selection is fast and doesn't cause UI jitters.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Integration & Final Polish' (Protocol in workflow.md)
