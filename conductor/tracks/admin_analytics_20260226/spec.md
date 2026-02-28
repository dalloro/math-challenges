# Specification - Admin Question Analytics Dashboard

## Overview
Implement a comprehensive analytics suite within the Admin dashboard to track global question performance and cohort composition. This will help identify "well-calibrated" questions and visualize the curriculum balance.

## Functional Requirements

### 1. Global Performance Tracking (Real-time)
- **Mechanism:** Use Firestore atomic increments to update a `question_stats` collection whenever a student submits an answer.
- **Data Points:** `total_attempts`, `total_correct`, `total_time_ms`, derived `success_rate`, and `avg_time`.

### 2. Cohort Composition (Question Type Distribution)
- **Visualization:** Show the distribution of different question "types" (e.g., Geometry, Algebra, Logic) within each `grade+level` cohort.
- **Goal:** Allow Admins to see if a certain level is over-represented by a specific topic.

### 3. Trend Analysis (Daily/Weekly/Monthly)
- **Tracking:** Implement a `question_daily_stats` collection recording YYYY-MM-DD performance.
- **Visualization:** Recharts line graphs showing performance trends per question and aggregate per cohort.

### 4. Calibration & Statistical Metrics
- **Success Rate** & **Avg Time Spent**.
- **Discrimination Index:** Identifying if questions successfully differentiate between high and low performers.

### 5. Admin UI Features
- **Global Dashboard:** Cohort performance bar charts + Curriculum composition pie charts.
- **Question Explorer:** Table with sorting/filtering by metric and type.
- **Bulk Actions:** Flag questions for review based on statistical outliers.

## Technical Implementation
- **Zero-Cost:** Client-side Firestore logic only.
- **Libraries:** Recharts.

## Acceptance Criteria
- [ ] Answer submissions correctly increment global and daily counters.
- [ ] Admin can view a pie/bar chart showing the distribution of "types" (Geometry, Logic, etc.) for any selected grade+level.
- [ ] Discrimination Index is calculated and displayed for questions with sufficient data.

## Out of Scope
- Server-side compute.
- Real-time websocket updates (refresh button is sufficient).
