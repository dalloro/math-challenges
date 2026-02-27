# Math Challenges: Gifted Adaptive Learning

A minimalist, distraction-free adaptive testing platform for gifted students, featuring dual-modality (MCQ and Open Reasoning) and AI-powered Socratic feedback.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Firebase CLI (`npm install -g firebase-tools`)
- A Google Gemini API Key (for content generation)

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🛠 Development Workflow

### Local Development
Run the development server. The app connects directly to the **Remote Firestore Database**.
```bash
npm run dev
```

### Content Generation
Generate gifted-level math questions across 10 difficulty levels using the Gemini API.
```bash
# Usage: npx tsx scripts/generate_content.ts <grade> <total_count>
npx tsx scripts/generate_content.ts 5 100
```
Questions are saved to `content_bank/grade_N.json`.

### Seeding the Database
Upload your JSON content banks to the remote Firestore database.

**Note:** Because production rules restrict writes to admins, the seeding script requires a temporary rules bypass. Use the provided "safe-seed" workflow:

```bash
# 1. Open rules, 2. Seed, 3. Restore rules
mv firestore.rules firestore.rules.bak && \
mv firestore.rules.open firestore.rules && \
firebase deploy --only firestore:rules && \
npx tsx scripts/seed_simple.ts scripts/seed_grade_5.json && \
mv firestore.rules firestore.rules.open && \
mv firestore.rules.bak firestore.rules && \
firebase deploy --only firestore:rules
```

**Seeding Flags:**
- `scripts/seed_grade_1.json` (Full Refresh - default)
- `scripts/seed_grade_1.json --append` (Add new questions without deleting old ones)
- `scripts/seed_grade_1.json --clean` (Remove questions for that grade only)

---

## 🏗 Project Structure

- `src/hooks/`: Data access logic (`useQuestions`, `useSession`).
- `src/pages/`: Core UI screens (Landing, Test, Settings).
- `scripts/`: Utilities for content generation and DB management.
- `conductor/`: Project plans, specs, and architectural guidelines.

---

## 🔐 Security & Rules
The project uses strict Firestore Security Rules. 
- **Questions:** Publicly readable, writeable only by admins (via CLI).
- **Sessions:** Writeable/Readable only by the authenticated owner (supports anonymous auth).

---

## 📦 Deployment
```bash
npm run build
firebase deploy
```
\n## Versioning\nThis project follows automated semantic versioning.
