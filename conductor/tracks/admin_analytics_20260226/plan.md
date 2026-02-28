# Implementation Plan - Admin Question Analytics Dashboard

## Phase 1: Performance Tracking Infrastructure
- [ ] Task: Create Analytics Storage Service
    - [ ] Update `src/services/storage.ts` or create `src/services/analytics.ts`.
    - [ ] Implement `incrementQuestionStats` using Firestore `increment()`.
    - [ ] **Write failing tests** for counter increments.
    - [ ] **Implement** and verify counters.
- [ ] Task: Integrate Tracking into Submission Flow
    - [ ] Update `src/pages/TestPage.tsx` to call the increment logic on answer submission.
    - [ ] Ensure tracking handles both Combined and Blind modes.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Performance Tracking Infrastructure' (Protocol in workflow.md)

## Phase 2: Analytics UI & Cohort Visualization
- [ ] Task: Install & Setup Recharts
    - [ ] Run `npm install recharts`.
    - [ ] Verify setup with a simple placeholder chart.
- [ ] Task: Build Admin Analytics Components
    - [ ] Create `src/components/AdminAnalytics.tsx`.
    - [ ] Implement "Global Distribution" Bar Chart (Success Rate per Grade/Level).
    - [ ] Implement "Cohort Composition" Pie/Bar Chart (Question Types per Grade+Level).
    - [ ] Implement "Question Performance Table" with type filters.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Analytics UI & Cohort Visualization' (Protocol in workflow.md)

## Phase 3: Historical Trends & Calibration
- [ ] Task: Implement Time-Series Tracking
    - [ ] Add `incrementDailyStats` logic.
    - [ ] Update submission flow to record daily data points.
- [ ] Task: Build Trend Visualization
    - [ ] Implement "Question Detail" view with Line Chart for 30-day performance trends.
    - [ ] Add "Discrimination Index" calculation logic.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Historical Trends & Calibration' (Protocol in workflow.md)
