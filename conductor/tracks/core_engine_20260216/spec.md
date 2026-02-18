# Specification - Core Adaptive Testing Engine and Firebase Integration

## Goal
Establish the foundational web application for "Math Challenges," including the adaptive testing logic, dual modalities (Multiple Choice and Open Reasoning), and Firebase integration for hosting and data storage.

## Core Requirements
- **Project Scaffold:** React (Vite) with Tailwind CSS.
- **Firebase Integration:** 
  - Hosting for deployment.
  - Firestore for question bank and student sessions.
  - Auth for anonymous/session tracking.
- **Adaptive Engine Logic:**
  - 100 initial questions; +50 if completed in < 60 minutes.
  - Dynamic difficulty adjustment based on performance.
- **Dual Modalities:**
  - **MC5:** 5-option multiple choice.
  - **Open Reasoning:** Text box for answer and process description.
- **AI Feedback & Fallback:**
  - Integration with `gemini-3-flash-preview` for live reasoning analysis (BYOK).
  - Graceful degradation using pre-generated walkthroughs for learning interventions.
- **UI/UX:**
  - Clean & Focused aesthetic.
  - Progressive Challenge Bar to show difficulty/rank.
  - Thematic shift (color change) during learning interventions.

## Data Schema (Firestore)
- **Questions:** `{ id, grade, difficulty, type, content, options, correct_answer, walkthroughs: { failure_mode: explanation } }`
- **Sessions:** `{ userId, startTime, endTime, questionsAnswered, currentDifficulty, score }`