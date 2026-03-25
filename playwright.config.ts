import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load emulator env for tests
dotenv.config({ path: path.resolve(__dirname, '.env.emulator') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npx firebase emulators:start --only auth,firestore',
      url: 'http://localhost:9099',
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
    {
      command: 'npm run dev -- --mode emulator',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      env: {
        ...process.env,
        VITE_USE_EMULATOR: 'true',
      },
    },
  ],
});
