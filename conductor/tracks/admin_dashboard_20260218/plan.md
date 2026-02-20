# Implementation Plan - Admin Content Management Dashboard

## Phase 1: Security & Auth Foundation [checkpoint: e05cc9a]
- [x] Task: Implement Admin Custom Claim Script [664e690]
    - [x] Create `scripts/set-admin.ts` using `firebase-admin` to set custom user claims
- [x] Task: Update Firestore Security Rules [95b7f75]
    - [x] Add `allow write: if request.auth.token.admin == true;` to the `questions` collection
- [x] Task: Create Admin Route Guard [3c70116]
    - [x] Implement a higher-order component or hook to check for the `admin` claim before rendering the `/admin` route
- [x] Task: Conductor - User Manual Verification 'Phase 1: Security & Auth Foundation' (Protocol in workflow.md)

## Phase 2: Admin Dashboard Skeleton
- [x] Task: Build Admin Page Layout [10fb546]
    - [x] Create `/src/pages/AdminPage.tsx` with a split view (Bulk vs. Wizard)
    - [x] Add the JSON Schema documentation section
- [x] Task: Implement Single Question Wizard [a09139a]
    - [x] Build the form with live validation logic
    - [x] Implement "Add Question" button with duplicate checking
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Admin Dashboard Skeleton' (Protocol in workflow.md)

## Phase 3: Bulk Management & Data Sync
- [ ] Task: Implement Bulk JSON Editor
    - [ ] Create text area with JSON syntax validation
    - [ ] Add Grade/Level scope filters and the "Refresh/Append" toggle
- [ ] Task: Implement Batch Writing Logic
    - [ ] Implement logic to purge targeted Grade/Level if "Refresh" is selected
    - [ ] Use Firestore batches to commit multiple questions efficiently
- [ ] Task: Implement Duplicate Prevention
    - [ ] Logic to cross-reference incoming question text with existing records in the selected Grade
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Bulk Management & Data Sync' (Protocol in workflow.md)
