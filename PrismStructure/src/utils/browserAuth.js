import { AuthApi } from '../api/AuthApi.js';
import { testConfig } from '../../config/testConfig.js';
import { isCiEnv } from './ciEnv.js';

const AUTH_TOKEN_KEY = 'auth-token';

/**
 * Establish UI session via API token (avoids extra POST /users/login on shared runners).
 * @param {{ waitForNav?: boolean }} options — skip nav-menu wait when opening profile directly on CI
 */
export async function authenticateBrowser(page, request, options = {}) {
  const { waitForNav = true } = options;
  const authApi = new AuthApi(request);
  const { email, password } = testConfig.credentials;
  const token = await authApi.login(email, password);

  await page.goto('/#/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.evaluate(
    ([key, value]) => localStorage.setItem(key, value),
    [AUTH_TOKEN_KEY, token],
  );

  if (!waitForNav) {
    const meResponse = page.waitForResponse(
      (res) => res.url().includes('/users/me') && res.status() === 200,
      { timeout: 45000 },
    );
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
    try {
      await meResponse;
    } catch {
      // ponytail: retry once if SUT is slow after token inject on shared runners
      await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForResponse(
        (res) => res.url().includes('/users/me') && res.status() === 200,
        { timeout: 45000 },
      );
    }
    return;
  }

  await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
  const navMenu = page.locator('[data-test="nav-menu"]');
  const readyTimeout = isCiEnv ? 45000 : 20000;
  try {
    await navMenu.waitFor({ state: 'visible', timeout: readyTimeout });
  } catch {
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
    await navMenu.waitFor({ state: 'visible', timeout: readyTimeout });
  }
}

export async function openProfilePage(page) {
  const profileMe = page.waitForResponse(
    (res) => res.url().includes('/users/me') && res.status() === 200,
    { timeout: 45000 },
  );
  await page.goto('/#/account/profile', {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
  await page.waitForURL(/account\/profile/, { timeout: 20000 });
  try {
    await profileMe;
  } catch {
    // ponytail: profile form may still hydrate from cached session state
  }
  const emailInput = page.locator('#email, input[type="email"], [data-test="email"]').first();
  await emailInput.waitFor({ state: 'visible', timeout: isCiEnv ? 30000 : 15000 });
}
