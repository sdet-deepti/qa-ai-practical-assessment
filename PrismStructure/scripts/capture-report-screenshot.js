import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(fileURLToPath(import.meta.url), '..', '..');
const reportPath = path.join(root, 'reports', 'html-report', 'index.html');
const outPath = path.join(root, '..', 'execution-evidence', 'html-report-passing.png');

if (!fs.existsSync(reportPath)) {
  console.error(`Report not found: ${reportPath}. Run playwright test first.`);
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(`file://${reportPath.replace(/\\/g, '/')}`);
await page.waitForLoadState('domcontentloaded');
await page.waitForTimeout(3000);
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();
console.log(`Screenshot saved: ${outPath}`);
