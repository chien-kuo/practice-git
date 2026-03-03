import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load .env file for tests
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

test.describe('Admin Authentication Flow', () => {
  const adminEmail = process.env.VITE_ADMIN_EMAIL || '';
  const adminPassword = process.env.VITE_ADMIN_PASSWORD || '';

  test.beforeEach(async ({ page }) => {
    // Log console messages from the browser for debugging
    page.on('console', msg => {
      if (msg.type() === 'error') console.log(`BROWSER ERROR: ${msg.text()}`);
    });
  });

  test.beforeAll(() => {
    if (!adminEmail || !adminPassword) {
      throw new Error('VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD must be set in .env');
    }
  });

  test('should allow admin login and show admin dashboard', async ({ page }) => {
    // 1. Submit a survey to ensure data exists for the dashboard
    const uniqueOpinion = `Admin Test Opinion - ${Math.random().toString(36).substring(7)}`;
    const houseNumber = '7';

    await page.goto('/');

    // Handle alert dialogs
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    // Wait for auth to be ready
    const submitBtn = page.locator('[data-testid="submit-button"]');
    await expect(submitBtn).toBeEnabled({ timeout: 15000 });

    // Fill and submit form
    await page.selectOption('[data-testid="house-select"]', houseNumber);
    await page.fill('[data-testid="opinion-input"]', uniqueOpinion);
    await submitBtn.click();

    // Verify submission appeared in the table
    await expect(page.locator('[data-testid="opinion-row"]').filter({ hasText: uniqueOpinion })).toBeVisible({ timeout: 10000 });

    // 2. Perform Admin Login
    await page.click('[data-testid="admin-header-button"]');
    await expect(page.getByTestId('admin-email-input')).toBeVisible();

    await page.fill('[data-testid="admin-email-input"]', adminEmail);
    await page.fill('[data-testid="admin-password-input"]', adminPassword);
    await page.click('[data-testid="admin-login-button"]');

    // Wait for login to complete
    await expect(page.getByTestId('admin-email-input')).not.toBeVisible();
    
    // Check for elements specific to the AdminDashboard
    await expect(page.getByText('後台操作')).toBeVisible({ timeout: 15000 });
    
    // Check if the progress summary section is present
    await expect(page.getByText('填寫進度總覽')).toBeVisible();
    
    // Check if the action buttons are present (Export, etc.)
    await expect(page.locator('button[title="匯出 CSV"]')).toBeVisible();
  });

  test('should log out admin and hide admin dashboard', async ({ page }) => {
    // First, log in as admin
    await page.goto('/');
    
    // Wait for the app to be ready (at least the header button)
    await expect(page.getByTestId('admin-header-button')).toBeVisible({ timeout: 10000 });
    await page.click('[data-testid="admin-header-button"]');
    
    // Wait for the login modal to be visible
    await expect(page.getByTestId('admin-email-input')).toBeVisible({ timeout: 5000 });
    
    await page.fill('[data-testid="admin-email-input"]', adminEmail);
    await page.fill('[data-testid="admin-password-input"]', adminPassword);
    await page.click('[data-testid="admin-login-button"]');

    // Wait for admin elements to be visible
    await expect(page.getByText('後台操作')).toBeVisible({ timeout: 15000 });

    // Click the header button again, which should now trigger logout
    await page.click('[data-testid="admin-header-button"]'); 

    // Wait for admin elements to disappear and user view to return
    await expect(page.getByText('後台操作')).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('opinion-input')).toBeVisible(); // Should be back to survey form
  });
});
