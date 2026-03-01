# Implementation Plan - Admin Question Analytics Dashboard

## Phase 1: Performance Tracking Infrastructure [checkpoint: dd4eac2]
- [x] Task: Create Analytics Storage Service [7fc801d]
    - [x] Update `src/services/storage.ts` or create `src/services/analytics.ts`. [7fc801d]
    - [x] Implement `incrementQuestionStats` using Firestore `increment()`. [7fc801d]
    - [x] **Write failing tests** for counter increments. [7fc801d]
    - [x] **Implement** and verify counters. [7fc801d]
- [x] Task: Integrate Tracking into Submission Flow [9ba6b7e]
    - [x] Update `src/pages/TestPage.tsx` to call the increment logic on answer submission. [9ba6b7e]
    - [x] Ensure tracking handles both Combined and Blind modes. [9ba6b7e]
- [x] Task: Conductor - User Manual Verification 'Phase 1: Performance Tracking Infrastructure' (Protocol in workflow.md) [dd4eac2]

## Phase 2: Analytics UI & Cohort Visualization [checkpoint: 359746f]
- [x] Task: Install & Setup Recharts [5d67c9a]
    - [x] Run `npm install recharts`. [5d67c9a]
    - [x] Verify setup with a simple placeholder chart. [5d67c9a]
- [x] Task: Build Admin Analytics Components [57c33ec]
    - [x] Create `src/components/AdminAnalytics.tsx`. [57c33ec]
    - [x] Implement "Global Distribution" Bar Chart (Success Rate per Grade/Level). [57c33ec]
    - [x] Implement "Cohort Composition" Pie/Bar Chart (Question Types per Grade+Level). [57c33ec]
    - [x] Implement "Question Performance Table" with type filters. [57c33ec]
- [x] Task: Conductor - User Manual Verification 'Phase 2: Analytics UI & Cohort Visualization' (Protocol in workflow.md) [359746f]

## Phase 3: Historical Trends & Calibration
- [x] Task: Implement Time-Series Tracking [1a0a069]
    - [x] Add `incrementDailyStats` logic. [1a0a069]
    - [x] Update submission flow to record daily data points. [1a0a069]
- [x] Task: Build Trend Visualization [145968f]
    - [x] Implement "Question Detail" view with Line Chart for 30-day performance trends. [145968f]
    - [x] Add "Discrimination Index" calculation logic. [145968f]
- [~] Task: Conductor - User Manual Verification 'Phase 3: Historical Trends & Calibration' (Protocol in workflow.md)
