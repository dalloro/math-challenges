# Specification - Admin Content Management Dashboard

## Goal
Implement a secure, admin-only dashboard within the web application to manage the question bank, allowing for bulk JSON uploads, single-question creation, and data export with robust validation.

## Functional Requirements
1.  **Secure Admin Access:**
    - Enforcement via **Firebase Auth Custom Claims** (`admin: true`).
    - The `/admin` route is protected by a route guard that verifies the admin claim.
    - Firestore rules updated to allow `write` operations on the `questions` collection ONLY if `request.auth.token.admin == true`.
2.  **Admin Dashboard UI:**
    - Accessible via manual URL entry (`/admin`) or footer login.
    - Displays the required **JSON Schema** prominently for reference.
3.  **Bulk Management Modality:**
    - Text area for pasting a JSON array of questions.
    - **Refresh/Append Toggle:** Allows clearing existing questions for the targeted Grade/Level or appending new ones.
    - **Duplicate Prevention:** Before saving, the system checks the incoming batch and existing database for duplicate question text within the same grade.
4.  **Single Question Wizard ("Nicer UI"):**
    - Form with fields for all question properties (Grade, Level, Type, Question, Options A-E, Correct Answer, Ideal Solution, Failure Modes).
    - **Live Validation:** Ensure all fields are filled and a correct answer is selected.
    - **Dynamic Failure Modes:** Support up to 3 custom failure modes with titles and content.
5.  **Live Question Explorer:**
    - Browse questions by grade.
    - Support for **deleting** individual questions from the live database.
6.  **Backup & Export:**
    - Download questions as JSON files formatted for the project's seeding scripts.
    - Support for single-grade export or batch export of all grades.
7.  **Admin Setup Utility:**
    - Provide a standalone script (`scripts/set-admin.ts`) to assign the `admin` claim to a specific UID via `firebase-admin`.

## Technical Details
- **Route:** `/admin`
- **Security Claim:** `admin: boolean`
- **Validation Logic:** Client-side validation + Firestore Rule enforcement.

## Acceptance Criteria
- [x] Non-admin users are redirected away from `/admin` or shown a 403 error.
- [x] Pasting malformed JSON in the bulk editor shows a clear syntax error.
- [x] Submitting a question with invalid parameters is blocked by the UI.
- [x] Successfully added questions appear immediately in the student testing pool.
- [x] "Refresh" mode correctly purges only the targeted Grade/Level before upload.
- [x] Exported files are compatible with `seed_grade_X.json` format.

## Out of Scope
- Editing existing questions individually (creation and deletion are supported).
- Image uploads for questions.
