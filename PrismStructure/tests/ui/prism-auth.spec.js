// tests/ui/prism-auth.spec.js

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../src/pages/RegisterPage';
import { LoginPage } from '../../src/pages/LoginPage';
import { TestDataFactory } from '../../src/utils/TestDataFactory';

test.describe('Authentication & User Lifecycle Suite', () => {
  let registerPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    loginPage = new LoginPage(page);
  });

  test('[@smoke] User Registration & Subsequent Login Validation', async ({ page }) => {
    test.skip(
      !!process.env.CI,
      'Live registration is flaky on shared CI runners against Toolshop',
    );

    const newUser = TestDataFactory.generateUserData();

    // 1. Register
    await registerPage.navigate();
    await registerPage.registerUser(newUser);
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 });

    // 2. Login
    await loginPage.login(newUser.email, newUser.password);

    // 3. Verify logged-in nav state (menu shows user name after session is established)
    const userNavMenu = page.locator('[data-test="nav-menu"]');
    await expect(userNavMenu).toBeVisible({ timeout: 20000 });
    await expect(userNavMenu).toContainText(newUser.first_name, { timeout: 15000 });
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