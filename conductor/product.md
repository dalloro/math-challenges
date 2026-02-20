# Initial Concept

An application to test your math skills and learn by doing.

# Product Definition - Math Challenges

## Vision
A gifted-level math testing and learning web application designed for students across various grades. The app provides a rigorous, adaptive environment that mirrors the challenges faced by high-performing students using official, high-quality materials.

## Target Audience
- Gifted and talented students in elementary and middle school grades.
- Students preparing for advanced math competitions (e.g., MATHCOUNTS, Kangaroo Math).

## Core Features
- **Gifted-Level Assessments:** Content sourced from AoPS/MATHCOUNTS, Common Core Advanced standards, and IMO/Kangaroo Math.
- **Session Persistence (Test Rooms):** 
  - Progress is automatically saved and synchronized via unique, human-friendly room codes (e.g., `MATH-BRAIN-42`).
  - Students can resume their tests across different devices or after a page refresh.
  - **Smart Timer Recovery:** Inactivity-aware timer that pauses after 5 minutes of no interaction and resumes accurately upon return.
- **Adaptive Testing Engine:** 
  - Starts with 100 questions.
  - Adds 50 additional questions if the first 100 are completed in under 60 minutes.
  - Difficulty adjusts dynamically based on student performance.
- **Learning Intervention:** An automated learning mode that activates after two consecutive failures on similar problem types, providing step-by-step walkthroughs and simplified foundational exercises.
- **Dual Modalities:**
  - **Closed Choice:** 5-option multiple-choice questions.
  - **Open Reasoning:** A text area for the final answer and a detailed explanation of the process.
- **AI-Powered Evaluation:** Integration with `gemini-3-flash-preview` to provide real-time, qualitative feedback on the student's reasoning, identifying strengths and flaws in their logic.

## Deployment & Tech Goals
- Fully functional and deployed web application.
- Real-time interaction for feedback and adaptive question delivery.
