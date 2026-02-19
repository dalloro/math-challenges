# Specification - Admin Content Management Dashboard

## Goal
Implement a secure, admin-only dashboard within the web application to manage the question bank, allowing for bulk JSON uploads and single-question creation with robust validation.

## Functional Requirements
1.  **Secure Admin Access:**
    - Enforcement via **Firebase Auth Custom Claims** (`admin: true`).
    - The `/admin` route is protected by a route guard that verifies the admin claim.
    - Firestore rules updated to allow `write` operations on the `questions` collection ONLY if `request.auth.token.admin == true`.
2.  **Admin Dashboard UI:**
    - Accessible via manual URL entry (`/admin`).
    - Displays the required **JSON Schema** prominently for reference.
3.  **Bulk Management Modality:**
    - Text area for pasting a JSON array of questions.
    - **Refresh/Append Toggle:** Allows clearing existing questions for the targeted Grade/Level or appending new ones.
    - **Duplicate Prevention:** Before saving, the system checks the incoming batch and existing database for duplicate question text within the same grade.
4.  **Single Question Wizard ("Nicer UI"):**
    - Form with fields for all question properties (Grade, Level, Type, Question, Options A-E, Correct Answer, Ideal Solution, Failure Modes).
    - **Live Validation:**
        - Grade must be 1-12.
        - Level must be 1-10.
        - Exactly 5 options.
        - Correct answer must match one of the options.
5.  **Admin Setup Utility:**
    - Provide a standalone script (`scripts/set-admin.ts`) to assign the `admin` claim to a specific UID via `firebase-admin`.

## Technical Details
- **Route:** `/admin`
- **Security Claim:** `admin: boolean`
- **Validation Logic:** Client-side validation + Firestore Rule enforcement.

## Acceptance Criteria
- [ ] Non-admin users are redirected away from `/admin` or shown a 403 error.
- [ ] Pasting malformed JSON in the bulk editor shows a clear syntax error.
- [ ] Submitting a question with invalid parameters (e.g., Level 11) is blocked by the UI.
- [ ] Successfully added questions appear immediately in the student testing pool.
- [ ] "Refresh" mode correctly purges only the targeted Grade/Level before upload.

## Out of Scope
- Editing existing questions individually (initial scope is create/delete).
- Image uploads for questions (text-only for now).
