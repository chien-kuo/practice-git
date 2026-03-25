import { test, expect } from '@playwright/test';

const HOUSE_NUMBERS = [
  1, 3, 5, 7, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29,
  2, 6, 8, 10, 12, 16, 18, 20, 22, 26, 28, 30, 32, 36, 38
];

const SAMPLE_OPINIONS = [
  '社區環境整潔，非常滿意',
  '希望增加停車位',
  '公共區域燈光需要維修',
  '管理員服務態度很好',
  '垃圾分類請大家配合',
  '電梯保養需要加強',
  '希望加裝監視器',
  '社區綠化做得不錯',
  '門禁系統建議升級',
  '希望舉辦住戶聯誼活動',
];

function randomOpinion(houseNumber: number): string {
  const base = SAMPLE_OPINIONS[Math.floor(Math.random() * SAMPLE_OPINIONS.length)];
  return `[${houseNumber}號] ${base}`;
}

// Single test that submits all houses in one page session (one anonymous sign-in)
test('submit opinions for all house numbers', async ({ page }) => {
  test.setTimeout(120000);

  await page.goto('/');

  // Wait for Firebase anonymous auth to complete once
  const submitBtn = page.locator('[data-testid="submit-button"]');
  await expect(submitBtn).toBeEnabled({ timeout: 30000 });

  for (const house of HOUSE_NUMBERS) {
    const opinion = randomOpinion(house);

    await page.selectOption('[data-testid="house-select"]', String(house));
    await page.fill('[data-testid="opinion-input"]', opinion);

    page.once('dialog', async dialog => {
      await dialog.accept();
    });

    await submitBtn.click();

    // Wait for button to be re-enabled before next submission
    await expect(submitBtn).toBeEnabled({ timeout: 10000 });
  }
});
