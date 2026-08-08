import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: process.env.CI ? 90 * 1000 : 60 * 1000,
  expect: { timeout: process.env.CI ? 20000 : 10000 },
  fullyParallel: !process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 2,
  outputDir: './reports/test-results',
  reporter: [
    ['list'],
    ['html', { outputFolder: './reports/html-report', open: 'never' }],
    ['json', { outputFile: './reports/test-results/results.json' }],
    ...(process.env.CI
      ? [['junit', { outputFile: './reports/test-results/junit.xml' }]]
      : []),
  ],
  use: {
    baseURL: 'https://practicesoftwaretesting.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
