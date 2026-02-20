# Implementation Plan - User-Specific API Keys and Enhanced Static Fallback

## Phase 1: Storage & Key Management
- [ ] Task: Implement Secure localStorage Wrapper
    - [ ] Write unit tests for a utility that handles getting/setting/removing the API key
    - [ ] Implement the utility in `src/services/storage.ts`
- [ ] Task: Enhance Settings UI
    - [ ] Update `SettingsPage.tsx` with fields for API Key input and deletion
    - [ ] Implement "Test Connection" logic calling Gemini `models.list()` or a simple prompt
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Storage & Key Management' (Protocol in workflow.md)

## Phase 2: Dynamic Fallback Logic
- [ ] Task: Implement Modality Switcher
    - [ ] Refactor reasoning logic to check for the presence of a key in `localStorage`
    - [ ] Logic: `IF key EXISTS -> call AI Service ELSE -> show Ideal Solution`
- [ ] Task: Build "Static Mode" UI Components
    - [ ] Create a banner/indicator for the reasoning screen when in static mode
    - [ ] Ensure the "Ideal Solution" transition is smooth and consistent with the AI feedback UI
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Dynamic Fallback Logic' (Protocol in workflow.md)

## Phase 3: Privacy & UX Polish
- [ ] Task: Add Privacy Disclaimers
    - [ ] Add info tooltips/banners explaining that keys are browser-only
- [ ] Task: Final Build & Verification
    - [ ] Verify that clearing cache successfully resets the app to static mode
    - [ ] Ensure multiple tabs/users remain isolated as per spec
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Privacy & UX Polish' (Protocol in workflow.md)
