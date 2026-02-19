# Specification - Automated CI/CD Deployment and Project URL Optimization

## Goal
Automate the deployment of the "Math Challenges" web application to Firebase Hosting using GitHub Actions, ensuring all quality gates (tests, lint, type-check) are passed first. Additionally, investigate and attempt to migrate to a cleaner project ID (`math-challenges`) if available.

## Functional Requirements
1.  **CI/CD Pipeline (GitHub Actions):**
    - Create a workflow file (e.g., `deploy.yml`).
    - Trigger only on pushes to the `main` branch.
    - **Step 1: Environment Setup** (Node.js, dependency installation).
    - **Step 2: Quality Gates** (Must run in parallel or sequence):
        - Linting: `npm run lint`
        - Type Checking: `tsc` (or `npm run build`'s internal check)
        - Testing: `npm test`
    - **Step 3: Build:** `npm run build` (ensures `dist/` is fresh).
    - **Step 4: Deploy:** Deploy to Firebase Hosting using a service account or Firebase Token stored in GitHub Secrets.
2.  **Project ID Migration Investigation:**
    - Check if the Firebase project ID `math-challenges` is available.
    - If available, create the new project and update the local `.firebaserc` and `firebase.json` configuration.
    - If unavailable, report findings and stick with `math-challenges-gifted-99` or suggest alternative custom subdomains.

## Non-Functional Requirements
- **Security:** Use GitHub Actions Secrets to store sensitive credentials (e.g., `FIREBASE_SERVICE_ACCOUNT`).
- **Reliability:** The deployment MUST halt immediately if any quality gate fails.
- **Speed:** Optimize build and test execution within the CI environment (e.g., caching `node_modules`).

## Acceptance Criteria
- [ ] A push to the `main` branch on GitHub automatically starts a deployment job.
- [ ] If tests fail, the deployment is cancelled and the status is reported as "Failed" in GitHub.
- [ ] Upon success, the live website is updated with the latest changes.
- [ ] A definitive answer/action is provided regarding the `math-challenges` URL.

## Out of Scope
- Automated deployment for branches other than `main`.
- Preview deployments for Pull Requests (per user preference).
- Automated migration of Firestore data (manual seeding will be used if the project changes).
