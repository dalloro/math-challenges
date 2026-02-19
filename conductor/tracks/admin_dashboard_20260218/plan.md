# Implementation Plan - Admin Content Management Dashboard

## Phase 1: Security & Auth Foundation
- [ ] Task: Implement Admin Custom Claim Script
    - [ ] Create `scripts/set-admin.ts` using `firebase-admin` to set custom user claims
- [ ] Task: Update Firestore Security Rules
    - [ ] Add `allow write: if request.auth.token.admin == true;` to the `questions` collection
- [ ] Task: Create Admin Route Guard
    - [ ] Implement a higher-order component or hook to check for the `admin` claim before rendering the `/admin` route
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Security & Auth Foundation' (Protocol in workflow.md)

## Phase 2: Admin Dashboard Skeleton
- [ ] Task: Build Admin Page Layout
    - [ ] Create `/src/pages/AdminPage.tsx` with a split view (Bulk vs. Wizard)
    - [ ] Add the JSON Schema documentation section
- [ ] Task: Implement Single Question Wizard
    - [ ] Build the form with live validation logic
    - [ ] Implement "Add Question" button with duplicate checking
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
