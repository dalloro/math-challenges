# Implementation Plan - Admin Content Management Dashboard

## Phase 1: Security & Auth Foundation [checkpoint: 2ee4be6]
- [x] Task: Implement Admin Custom Claim Script [2ee4be6]
    - [x] Create `scripts/set-admin.ts` using `firebase-admin` to set custom user claims
- [x] Task: Update Firestore Security Rules [2ee4be6]
    - [x] Add `allow write: if request.auth.token.admin == true;` to the `questions` collection
- [x] Task: Create Admin Route Guard [2ee4be6]
    - [x] Implement a higher-order component or hook to check for the `admin` claim before rendering the `/admin` route
- [x] Task: Conductor - User Manual Verification 'Phase 1: Security & Auth Foundation' (Protocol in workflow.md) [2ee4be6]

## Phase 2: Admin Dashboard Skeleton [checkpoint: 2ee4be6]
- [x] Task: Build Admin Page Layout [2ee4be6]
    - [x] Create `/src/pages/AdminPage.tsx` with a split view (Bulk vs. Wizard)
    - [x] Add the JSON Schema documentation section
- [x] Task: Implement Single Question Wizard [2ee4be6]
    - [x] Build the form with live validation logic
    - [x] Implement "Add Question" button with duplicate checking
- [x] Task: Conductor - User Manual Verification 'Phase 2: Admin Dashboard Skeleton' (Protocol in workflow.md) [2ee4be6]

## Phase 3: Bulk Management & Data Sync [checkpoint: 2ee4be6]
- [x] Task: Implement Bulk JSON Editor [2ee4be6]
    - [x] Create text area with JSON syntax validation
    - [x] Add Grade/Level scope filters and the "Refresh/Append" toggle
- [x] Task: Implement Batch Writing Logic [2ee4be6]
    - [x] Implement logic to purge targeted Grade/Level if "Refresh" is selected
    - [x] Use Firestore batches to commit multiple questions efficiently
- [x] Task: Implement Duplicate Prevention [2ee4be6]
    - [x] Logic to cross-reference incoming question text with existing records in the selected Grade
- [x] Task: Conductor - User Manual Verification 'Phase 3: Bulk Management & Data Sync' (Protocol in workflow.md) [2ee4be6]
