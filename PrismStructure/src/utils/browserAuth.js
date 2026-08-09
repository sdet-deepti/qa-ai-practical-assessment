import { AuthApi } from '../api/AuthApi.js';
import { testConfig } from '../../config/testConfig.js';
import { isCiEnv } from './ciEnv.js';

const AUTH_TOKEN_KEY = 'auth-token';

/** API login + localStorage token only (no nav-menu wait). */
export async function injectBrowserAuthToken(page, request) {
  const authApi = new AuthApi(request);
  const { email, password } = testConfig.credentials;
  const token = await authApi.login(email, password);

  await page.goto('/#/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.evaluate(
    ([key, value]) => localStorage.setItem(key, value),
    [AUTH_TOKEN_KEY, token],
  );
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
}

export async function waitForAuthenticatedNav(page) {
  const navMenu = page.locator('[data-test="nav-menu"]');
  const readyTimeout = isCiEnv ? 30000 : 20000;
  try {
    await navMenu.waitFor({ state: 'visible', timeout: readyTimeout });
  } catch {
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
    await navMenu.waitFor({ state: 'visible', timeout: readyTimeout });
  }
}

/** Token injection + authenticated nav shell (for logout via menu). */
export async function authenticateBrowser(page, request) {
  await injectBrowserAuthToken(page, request);
  await waitForAuthenticatedNav(page);
}

export async function openProfilePage(page) {
  await page.goto('/#/account/profile', {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
  await page.waitForURL(/account\/profile/, { timeout: 20000 });
}
