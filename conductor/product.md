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
  - **Low-Pressure Mode:** Users can toggle the timer's numeric countdown to reduce testing anxiety, replacing it with a "Show Timer" prompt.
- **Adaptive Testing Engine:** 
  - **Intelligent Selection:** Multi-tier logic that prioritizes un-seen questions by grade, level, and type.
  - **Robust Randomization:** Seeded Fisher-Yates shuffle ensures uniform distribution and variety across sessions.
  - **Fallback Mechanism:** Automatically switches question types within a level to prevent repetition until the entire cohort pool is exhausted.
  - **Dynamic Scaling:** Starts with 100 questions; adds 50 if completed efficiently.
  - Difficulty adjusts dynamically based on student performance.
- **Learning Intervention:** An automated learning mode that activates after two consecutive failures on similar problem types, providing step-by-step walkthroughs and simplified foundational exercises.
  - **Socratic Hinting:** All ideal solutions are parsed to separate pedagogy from derivation, displaying a hint-first interface to encourage discovery.
- **Unified Reasoning Modality:**
  - **Exclusive Reasoning Mode:** All questions now require step-by-step reasoning process before submission.
  - **Combined Mode:** Multiple-choice options are visible alongside the reasoning input.
  - **Blind Mode:** Multiple-choice options are hidden; users must provide both reasoning and a manual final answer.
- **AI-Powered Evaluation:** Integration with `gemini-3-flash-preview` to provide real-time, qualitative feedback on the student's reasoning, identifying strengths and flaws in their logic.
  - **LaTeX Math Rendering:** Support for complex mathematical notation (fractions, roots, etc.) in both AI feedback and static solutions via KaTeX.
  - **Visual Progressive Feedback:** "Heart-beat" animations and overlays celebrating correct answers, correcting mistakes, and honoring test completion.
  - **Focused Review Period:** A mandatory 5-second reading delay for static "Ideal Solutions" to ensure pedagogical absorption before proceeding.
- **Content Management Dashboard:** 
  - Secure, admin-only interface for managing the question bank.
  - Support for single question entry via wizard, bulk JSON imports, and data export for backups.
  - Real-time question explorer with deletion capabilities.
- **Branded Webapp Experience:**
  - Custom application logo integrated across all user and admin interfaces.
  - Browser favicon and Apple Touch Icon support for a native-like experience when added to mobile home screens.
- **Admin Analytics Dashboard:**
  - **Real-time Performance Tracking:** Global success rates per level and grade visualized via dynamic bar charts.
  - **Cohort Composition:** Pie charts showing the distribution of question types (Geometry, Logic, Arithmetic) within each cohort.
  - **Historical Trends:** 7-day performance trend lines for high-level calibration monitoring.
  - **Statistical Calibration:** Automated identification of "Too Easy" or "Too Hard" questions based on live success rates and attempt volume.

## Deployment & Tech Goals
- Fully functional and deployed web application.
- Real-time interaction for feedback and adaptive question delivery.
