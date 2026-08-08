import { test, expect } from '@playwright/test';

test.describe('Health Check Tier @smoke', () => {
  test('Verify PracticeSoftwareTesting SUT Homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Practice Software Testing/i);
  });
});