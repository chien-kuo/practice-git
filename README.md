# 社區意見調查

A high-performance Community Opinion Survey application built with a modern React 19 Single Page Application (SPA) architecture and Firebase real-time backend.

- [Live Demo](https://wangtzu.netlify.app/)

## 🚀 Tech Stack

*   **Frontend:** React 19 (Functional Components, Hooks API).
*   **Build Tool:** Vite 7.
*   **Styling:** Tailwind CSS v4 (Utility-first).
*   **State Management:** **Zustand** (Global state & cross-component communication).
*   **Backend:** Firebase Modular SDK (Auth, Firestore).
*   **Testing:** Playwright (End-to-End testing).

## 🏗 Architecture (Service-Hook-UI Pattern)

1.  **Service Layer (`src/services/`):** Singleton Firebase initialization with environment variable safety checks.
2.  **Hook Layer (`src/hooks/`):** Refined into **Listeners** (for global side-effects like real-time data syncing) and **Actions** (for UI-triggered operations). This minimizes redundant listeners and optimizes resource usage.
3.  **Store Layer (`src/store/`):** Zustand stores for global/persisted state and cross-component communication.
4.  **UI Layer (`src/components/`):** Presentational components using Tailwind CSS and Lucide React icons.

## ⚡️ Performance & Optimization

*   **Code-Splitting:** The `AdminDashboard` is non-critically lazy-loaded using `React.lazy()` and `Suspense` to optimize initial load time and reduce the main bundle size by splitting heavy libraries like `jspdf` and `html2canvas`.
*   **Resource Management:** Shared listeners at the application root prevent duplicate Firestore connections, ensuring consistent state across all components.

## 🛠 Local Setup & Running

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Environment Variables:** Create a `.env` file in the root directory and add the following:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

    # For E2E Testing
    VITE_ADMIN_EMAIL=your_admin_email
    VITE_ADMIN_PASSWORD=your_admin_password
    ```
3.  **Run Development Server:**
    ```bash
    npm run dev          # connects to production Firebase
    npm run dev:emulator # connects to local Firebase Emulator (no real data written)
    ```
    Access the site at: `http://localhost:5173`

## 🧪 Testing with Playwright

Tests use **Firebase Emulator** (Auth + Firestore) — no real data is written to production.

**Prerequisites (first time only):**
- Install Java: `brew install --cask temurin`
- Install Firebase CLI: `npm install -g firebase-tools && firebase login`
- Create `.env.emulator` by copying `.env` and adding `VITE_USE_EMULATOR=true`

**Running tests:**
```bash
npm run test:e2e        # Playwright auto-starts emulators, runs tests, then shuts down
npx playwright test --ui  # Debug mode with UI
npx playwright show-report  # View last test report
```

> **Note:** Firebase anonymous auth is blocked in headless browsers (reCAPTCHA). Always use the emulator for Playwright tests — never point tests at the real Firebase project.

---

## 📂 Project Structure
```text
src/
  ├── components/     # UI Components (Tailwind-styled)
  ├── hooks/          # Business Logic & Firebase Custom Hooks
  ├── services/       # Firebase Init & Auth configuration
  ├── store/          # Zustand Global Store
  ├── pages/          # SPA Route Views
  ├── utils/          # Helpers & Constants
  └── main.tsx        # App Entry point
tests/                # Playwright E2E Test Suite
```

## 📜 Deployment

Optimized for **Netlify** or **Vercel** with SPA routing support via `_redirects` and `vercel.json`.
