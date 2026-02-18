# Implementation Plan - Core Adaptive Testing Engine and Firebase Integration

## Phase 1: Project Initialization & Firebase Setup [checkpoint: 266979e]
- [x] Task: Initialize Vite Project with React and Tailwind CSS
    - [x] Run Vite scaffold and install Tailwind
    - [x] Configure Tailwind for minimalist "Clean & Focused" theme
- [x] Task: Initialize Firebase Project
    - [x] Run `firebase init` for Hosting, Firestore, and Auth
    - [x] Configure Firebase environment for React
- [x] Task: Implement Base Layout and Navigation
    - [x] Create main shell with placeholder for test screen
    - [x] Add basic routing (Landing, Test, Settings)
- [x] Task: Conductor - User Manual Verification 'Phase 1: Project Initialization & Firebase Setup' (Protocol in workflow.md)

## Phase 2: Data Models & Content Seeding
- [x] Task: Define Firestore Security Rules and Schema [3aca1bc]
    - [x] Write Firestore rules for anonymous access
- [ ] Task: Seed Initial Question Bank via Gemini CLI
    - [ ] Generate 20 gifted-level Grade 5 questions with MC5 and Open options
    - [ ] Generate 10 Common Failure Mode Walkthroughs per problem type
- [ ] Task: Implement Data Access Layer
    - [ ] Write hooks for fetching questions and saving session progress
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Data Models & Content Seeding' (Protocol in workflow.md)

## Phase 3: Core Adaptive Testing Engine
- [ ] Task: Implement Adaptive Difficulty Logic (TDD)
    - [ ] Write tests for question selection based on performance
    - [ ] Implement logic for the 100+50 question rule and difficulty tiers
- [ ] Task: Build Testing Interface (MC5 and Timer)
    - [ ] Implement 5-option multiple choice UI
    - [ ] Add 60-minute countdown timer and session tracking
- [ ] Task: Build Open Reasoning Interface
    - [ ] Create text box for answer + process
    - [ ] Implement toggle logic between MC5 and Open modalities
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Core Adaptive Testing Engine' (Protocol in workflow.md)

## Phase 4: AI Reasoning & Fallback Logic
- [ ] Task: Implement BYOK (Bring Your Own Key) and AI Client
    - [ ] Create settings UI for Gemini API Key storage (local storage)
    - [ ] Implement client-side wrapper for `gemini-3-flash-preview`
- [ ] Task: Implement Graceful Degradation & Learning UI
    - [ ] Write logic to switch between live AI and pre-generated walkthroughs
    - [ ] Implement "Thematic Shift" UI (color change) for learning mode
- [ ] Task: Conductor - User Manual Verification 'Phase 4: AI Reasoning & Fallback Logic' (Protocol in workflow.md)

## Phase 5: Final Polish & Deployment
- [ ] Task: Implement Progressive Challenge Bar
    - [ ] Build visual difficulty meter based on current session rank
- [ ] Task: Final Build and Firebase Deploy
    - [ ] Run production build and deploy to Firebase Hosting
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Final Polish & Deployment' (Protocol in workflow.md)