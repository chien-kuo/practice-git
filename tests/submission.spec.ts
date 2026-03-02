import { test, expect } from '@playwright/test';

test.describe('Survey Submission Flow', () => {
  test('should allow a user to submit an opinion and see it in the table', async ({ page }) => {
    // Generate a unique opinion to avoid collision with existing data
    const uniqueOpinion = `E2E Test Opinion - ${Math.random().toString(36).substring(7)}`;
    const houseNumber = '10';

    await page.goto('/');

    // 1. Fill out the form
    await page.selectOption('[data-testid="house-select"]', houseNumber);
    await page.fill('[data-testid="opinion-input"]', uniqueOpinion);

    // 2. Handle the success alert that SurveyForm.tsx triggers
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('提交成功');
      await dialog.accept();
    });

    // 3. Submit
    await page.click('[data-testid="submit-button"]');

    // 4. Verify the data appears in the table
    // The table is real-time (Firebase onSnapshot), so it should update automatically
    const row = page.locator('[data-testid="opinion-row"]').filter({ hasText: uniqueOpinion });
    await expect(row).toBeVisible({ timeout: 10000 });
    
    // Check if the house number is correct in that row
    const houseBadge = row.locator('[data-testid="house-number"]');
    await expect(houseBadge).toHaveText(`${houseNumber}`);
    
    // Check if the opinion text matches
    const opinionText = row.locator('[data-testid="opinion-text"]');
    await expect(opinionText).toHaveText(uniqueOpinion);
  });

  test('should show validation alert for empty opinion', async ({ page }) => {
    await page.goto('/');

    // Handle the validation alert
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('請輸入您的意見');
      await dialog.accept();
    });

    await page.click('[data-testid="submit-button"]');
  });
});
