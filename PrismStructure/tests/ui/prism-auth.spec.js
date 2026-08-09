// tests/ui/prism-auth.spec.js

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../src/pages/RegisterPage';
import { LoginPage } from '../../src/pages/LoginPage';
import { ProfilePage } from '../../src/pages/ProfilePage';
import { TestDataFactory } from '../../src/utils/TestDataFactory';
import { testConfig } from '../../config/testConfig.js';
import { authenticateBrowser, openProfilePage } from '../../src/utils/browserAuth.js';
import { isCiEnv } from '../../src/utils/ciEnv.js';

test.describe('Authentication & User Lifecycle Suite', () => {
  test.describe.configure({ mode: 'serial' });
  let registerPage;
  let loginPage;
  let profilePage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    loginPage = new LoginPage(page);
    profilePage = new ProfilePage(page);
  });

  test('[@smoke] User Registration & Subsequent Login Validation', async ({ page }) => {
    test.skip(
      isCiEnv,
      'Live registration is flaky on shared CI runners against Toolshop',
    );

    const newUser = TestDataFactory.generateUserData();

    await registerPage.navigate();
    await registerPage.registerUser(newUser);
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 });

    await loginPage.login(newUser.email, newUser.password);

    const userNavMenu = page.locator('[data-test="nav-menu"]');
    await expect(userNavMenu).toBeVisible({ timeout: 20000 });
    await expect(userNavMenu).toContainText(newUser.first_name, { timeout: 15000 });
  });

  test('[@smoke] Profile page shows configured user name after login', async ({ page, request }) => {
    const { email, password } = testConfig.credentials;
    if (isCiEnv) {
      await authenticateBrowser(page, request, { waitForNav: false });
      await openProfilePage(page);
    } else {
      await loginPage.navigate();
      await loginPage.login(email, password);
      await page.goto('/#/', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await loginPage.userMenuToggle.waitFor({ state: 'visible', timeout: 30000 });
      await profilePage.navigate();
    }
    await profilePage.expectEmailVisible(email);
    await profilePage.expectNameVisible('Jane');
  });

  test('[@regression] Logout clears session and blocks profile access', async ({ page, request }) => {
    const { email, password } = testConfig.credentials;
    if (isCiEnv) {
      await authenticateBrowser(page, request);
    } else {
      await loginPage.navigate();
      await loginPage.login(email, password);
      await page.goto('/#/', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await loginPage.userMenuToggle.waitFor({ state: 'visible', timeout: 30000 });
    }
    await loginPage.logout();
    await page.goto('/#/account/profile', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await expect(loginPage.userMenuToggle).not.toBeVisible({ timeout: 15000 });
  });

  test('[@regression] Negative Login - Invalid Password Validation', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('invalid.user@practice-qa.com', 'WrongPassword123!', {
      expectSuccess: false,
    });

    const loginError = page.locator('[data-test="login-error"], .alert-danger, [role="alert"]');
    await expect(loginError).toBeVisible({ timeout: 5000 });
    await expect(loginError).toContainText('Invalid email or password');
  });
});
