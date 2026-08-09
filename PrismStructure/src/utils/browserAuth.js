import { AuthApi } from '../api/AuthApi.js';
import { testConfig } from '../../config/testConfig.js';

const AUTH_TOKEN_KEY = 'auth-token';

/**
 * Establish UI session via API token (avoids extra POST /users/login on shared runners).
 */
export async function authenticateBrowser(page, request) {
  const authApi = new AuthApi(request);
  const { email, password } = testConfig.credentials;
  const token = await authApi.login(email, password);

  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.evaluate(
    ([key, value]) => localStorage.setItem(key, value),
    [AUTH_TOKEN_KEY, token],
  );
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
}
