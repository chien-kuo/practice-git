# Hotpot Survey (社區意見調查)

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

1.  **Service Layer (`src/services/`):** Singleton Firebase initialization.
2.  **Hook Layer (`src/hooks/`):** All Firebase interactions (Auth, Firestore) and business logic are encapsulated here.
3.  **Store Layer (`src/store/`):** Zustand stores for global state.
4.  **UI Layer (`src/components/`):** Presentational components using Tailwind CSS and Lucide React icons.

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
    npm run dev
    ```
    Access the site at: `http://localhost:5173`

## 🧪 Testing with Playwright

We use Playwright for End-to-End (E2E) testing to verify critical flows like survey submission and admin dashboard access.

*   **Run All Tests (Headless):**
    ```bash
    npm run test:e2e
    ```
*   **Debug Tests (UI Mode):**
    ```bash
    npx playwright test --ui
    ```
*   **View Last Test Report:**
    ```bash
    npx playwright show-report
    ```

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
