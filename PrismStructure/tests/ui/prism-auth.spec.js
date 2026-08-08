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
    const newUser = TestDataFactory.generateUserData();

    // 1. Register
    await registerPage.navigate();
    await registerPage.registerUser(newUser);
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 });

    // 2. Login
    await loginPage.login(newUser.email, newUser.password);

    // 3. Verify Account Navigation State (Targeting exact user menu button)
    const userNavMenu = page.locator('[data-test="nav-menu"]');
    await expect(userNavMenu).toContainText(newUser.first_name);
  });

  test('[@regression] Negative Login - Invalid Password Validation', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('invalid.user@practice-qa.com', 'WrongPassword123!');

    const loginError = page.locator('[data-test="login-error"], .alert-danger, [role="alert"]');
    await expect(loginError).toBeVisible({ timeout: 5000 });
    await expect(loginError).toContainText('Invalid email or password');
  });
});