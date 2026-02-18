# Specification - Core Adaptive Testing Engine and Firebase Integration

## Goal
Establish the foundational web application for "Math Challenges," including the adaptive testing logic, dual modalities (Multiple Choice and Open Reasoning), and Firebase integration for hosting and data storage.

## Core Requirements
- **Project Scaffold:** React (Vite) with Tailwind CSS.
- **Firebase Integration:** 
  - Hosting for deployment.
  - Firestore for question bank (Scale: 2,000 questions per grade, 12 grades total).
  - Auth for anonymous/session tracking.
- **Adaptive Engine Logic:**
  - 100 initial questions; +50 if completed in < 60 minutes.
  - Dynamic difficulty adjustment based on performance across all grades (1-12).
- **Dual Modalities:**
  - **MC5:** 5-option multiple choice.
  - **Open Reasoning:** Text box for answer and process description.
- **AI Feedback & Fallback:**
  - Integration with `gemini-3-flash-preview` for live reasoning analysis (BYOK).
  - Graceful degradation using a library of pre-generated failure-mode walkthroughs.
- **UI/UX:**
  - Clean & Focused aesthetic.
  - Progressive Challenge Bar to show difficulty/rank.
  - Thematic shift (color change) during learning interventions.

## Data Schema (Firestore)
- **Questions:** `{ id, grade, difficulty, type, content, options, correct_answer, walkthroughs: { failure_mode: explanation } }`
- **Sessions:** `{ userId, startTime, endTime, questionsAnswered, currentDifficulty, score }`