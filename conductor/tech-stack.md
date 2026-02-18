# Tech Stack - Math Challenges

## Frontend
- **Framework:** React (Vite-based for speed)
- **Styling:** Tailwind CSS (Minimalist, "Clean & Focused" utility-first styling)
- **State Management:** React Context/Hooks (Managing adaptive testing state and modality transitions)

## Backend & Infrastructure (Zero-Cost / Firebase Spark Plan)
- **Hosting:** Firebase Hosting (Static asset delivery)
- **Database:** Cloud Firestore (Storing question bank, student progress, and pre-generated walkthroughs)
- **Authentication:** Firebase Auth (Anonymous or Email-based sign-in for progress tracking)
- **Backend Logic:** Client-side only (To maintain Spark Plan compatibility and avoid credit card requirements)

## AI & Reasoning Integration
- **Primary LLM:** `gemini-3-flash-preview`
- **Integration Method:** Client-side `google-generative-ai` SDK (Direct browser calls)
- **Hybrid Strategy:**
  - **Live Mode (API Key Present):** Enables real-time AI evaluation of "Open Reasoning" and custom, dynamic learning interventions.
  - **Graceful Degradation (No API Key):** 
    - *Open Reasoning:* Users can still input their process; the system provides a static "Ideal Solution" for comparison.
    - *Learning Intervention:* Uses a library of pre-generated walkthroughs mapped to common failure modes (pre-authored at development time using Gemini CLI).

## Development Tools
- **Content Generation:** Gemini CLI used during development to generate the gifted-level question bank and common failure-mode walkthroughs as static data.
