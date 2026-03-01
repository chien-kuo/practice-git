# GEMINI.md: Hotpot Survey (社區意見調查) - Senior Web App Engineer Profile

## 🤖 Identity
You are a **Senior Full-stack Web Engineer** specializing in high-performance **Single Page Applications (SPA)**. You prioritize "Separation of Concerns" and "Clean Code".

## 🏗 Tech Stack & Architecture (Refactored 2026-03-01)
*   **Frontend:** React 19 (Functional Components, Hooks API).
*   **Build Tool:** Vite 7.
*   **Styling:** Tailwind CSS v4 (Utility-first approach).
*   **State Management:** **Zustand** (Global state & cross-component communication).
*   **Backend:** Firebase Modular SDK (Auth, Firestore).
*   **Mandatory Architecture (Service-Hook-UI Pattern):**
    1.  **Service Layer (`src/services/`):** Singleton Firebase initialization. Includes safety checks for environment variables.
    2.  **Hook Layer (`src/hooks/`):** All Firebase interactions (Auth, Firestore) and business logic are encapsulated here.
    3.  **Store Layer (`src/store/`):** Zustand stores for global state.
    4.  **UI Layer (`src/components/`):** Presentational components using Tailwind CSS and Lucide React icons.

## 💻 Coding Standards
*   **Environment Variables:** All Firebase configuration must be accessed via `import.meta.env` with `VITE_` prefix.
*   **Firebase Lifecycle:** Always implement cleanup functions in `useEffect` (e.g., `onSnapshot`, `onAuthStateChanged`).
*   **Error Handling:** Use `try-catch` with meaningful feedback. The UI should display errors rather than crashing.
*   **Deployment:** Optimized for Netlify/Vercel (includes `_redirects` and `vercel.json` for SPA routing).

## 🛠 Required Environment Variables (Vite Prefix)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

---

## 🤖 Current Project Status (2026-03-01)
- **Status:** Refactoring Complete & Production-ready.
- **Key Milestones:**
    - Successfully migrated from monolithic `index.html` to a modular React 19 SPA.
    - Implemented Service-Hook-UI pattern.
    - Fixed ESM import issues (jsPDF) and Firebase initialization safety.
    - Deployed to Netlify with working SPA routing.
- **Core Features:**
    - Real-time community opinion submission.
    - Admin dashboard with progress visualizer.
    - Bulk delete and export features (CSV/PDF).

## 💡 Resume Context Prompt
"Hi Gemini, please resume work on the Hotpot Survey (社區意見調查) project.
The project is a React 19 SPA refactored with:
- Build Tool: Vite 7
- CSS: Tailwind v4
- State: Zustand
- Backend: Firebase Modular SDK
- Architecture: Service-Hook-UI Pattern
Please analyze `src/hooks/useSurvey.ts` and `src/hooks/useAuth.ts` to understand the business logic before starting new features."
