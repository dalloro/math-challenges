# Implementation Plan - User-Specific API Keys and Enhanced Static Fallback

## Phase 1: Storage & Key Management [checkpoint: 04baf47]
- [x] Task: Implement Secure localStorage Wrapper [edfa0f4]
    - [x] Write unit tests for a utility that handles getting/setting/removing the API key
    - [x] Implement the utility in `src/services/storage.ts`
- [x] Task: Enhance Settings UI [04baf47]
    - [x] Update `SettingsPage.tsx` with fields for API Key input and deletion
    - [x] Implement "Test Connection" logic calling Gemini `models.list()` or a simple prompt
- [x] Task: Conductor - User Manual Verification 'Phase 1: Storage & Key Management' (Protocol in workflow.md)

## Phase 2: Dynamic Fallback Logic [checkpoint: 9138f7e]
- [x] Task: Implement Modality Switcher [9138f7e]
    - [x] Refactor reasoning logic to check for the presence of a key in `localStorage`
    - [x] Logic: `IF key EXISTS -> call AI Service ELSE -> show Ideal Solution`
- [x] Task: Build "Static Mode" UI Components [9138f7e]
    - [x] Create a banner/indicator for the reasoning screen when in static mode
    - [x] Ensure the "Ideal Solution" transition is smooth and consistent with the AI feedback UI
- [x] Task: Conductor - User Manual Verification 'Phase 2: Dynamic Fallback Logic' (Protocol in workflow.md)

## Phase 3: Privacy & UX Polish [checkpoint: 13e8280]
- [x] Task: Add Privacy Disclaimers [13e8280]
    - [x] Add info tooltips/banners explaining that keys are browser-only
- [x] Task: Final Build & Verification [13e8280]
    - [x] Verify that clearing cache successfully resets the app to static mode
    - [x] Ensure multiple tabs/users remain isolated as per spec
- [x] Task: Conductor - User Manual Verification 'Phase 3: Privacy & UX Polish' (Protocol in workflow.md)
