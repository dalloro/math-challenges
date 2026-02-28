# Implementation Plan - Robust Question Randomization & Selection

## Phase 1: Audit & Recently Seen Infrastructure
- [x] Task: Locate and Audit Current Selection Logic [9352738]
    - [x] Inspect `src/pages/TestPage.tsx` and `src/hooks/useQuestions.ts` to identify the exact random picking mechanism. [9352738]
- [x] Task: Implement 'Seen Questions' Persistence [9352738]
    - [x] Update `src/services/storage.ts` to support tracking `seenQuestionIds` per room/grade. [9352738]
    - [x] **Write failing tests** for Seen Questions tracking. [9352738]
    - [x] **Implement** Seen Questions tracking. [9352738]
- [~] Task: Conductor - User Manual Verification 'Phase 1: Audit & Recently Seen Infrastructure' (Protocol in workflow.md)

## Phase 2: Multi-Tier Selection Logic
- [ ] Task: Create Randomization Utility
    - [ ] **Write failing tests** for a utility that shuffles a pool using a stable seeded random algorithm.
    - [ ] **Implement** the utility in `src/utils/randomization.ts`.
- [ ] Task: Refactor Question Selection Engine
    - [ ] **Write failing tests** for the new selection flow:
        1. Filter by `grade` + `level` + `type`.
        2. Exclude `seenQuestionIds`.
        3. If empty, filter by `grade` + `level` (fallback).
        4. Exclude `seenQuestionIds`.
        5. If still empty, reset `seenQuestionIds` for that tier and pick.
    - [ ] **Implement** the logic in `src/pages/TestPage.tsx` or a new hook `useQuestionSelection`.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Multi-Tier Selection Logic' (Protocol in workflow.md)

## Phase 3: Integration & Final Polish
- [ ] Task: Verify End-to-End Flow
    - [ ] Run automated integration tests covering the selection logic.
    - [ ] Ensure that selection is fast and doesn't cause UI jitters.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Integration & Final Polish' (Protocol in workflow.md)
