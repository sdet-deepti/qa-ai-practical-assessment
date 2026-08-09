export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.submitButton = page.locator('[data-test="login-submit"]');
    this.searchInput = page
      .getByPlaceholder('Search')
      .or(page.locator('[data-test="search-query"]'));
    this.userMenuToggle = page.locator('[data-test="nav-menu"]');
    this.logoutLink = page
      .locator('[data-test="nav-logout"]')
      .or(page.getByText('Sign out', { exact: true }))
      .or(page.getByRole('link', { name: /sign out|log out|logout/i }))
      .or(page.getByRole('button', { name: /sign out|log out|logout/i }));
  }

  async navigate() {
    await this.page.goto('/auth/login', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
  }

  /**
   * @param {string} email
   * @param {string} password
   * @param {{ expectSuccess?: boolean }} options
   */
  async login(email, password, { expectSuccess = true } = {}) {
    await this.emailInput.waitFor({ state: 'visible', timeout: 20000 });
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    if (!expectSuccess) {
      await this.submitButton.click();
      return;
    }

    const submitLogin = async () => {
      const [loginResponse] = await Promise.all([
        this.page.waitForResponse(
          (response) =>
            response.url().includes('/users/login') &&
            response.request().method() === 'POST',
          { timeout: 30000 },
        ),
        this.submitButton.click(),
      ]);
      return loginResponse;
    };

    let loginResponse;
    try {
      loginResponse = await submitLogin();
    } catch {
      if (!this.page.url().includes('/auth/login')) {
        loginResponse = null;
      } else {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        loginResponse = await submitLogin();
      }
    }

    if (loginResponse && loginResponse.status() !== 200) {
      throw new Error(`Login failed with HTTP ${loginResponse.status()}`);
    }

    await this.page.waitForURL(
      (url) => !url.pathname.includes('/auth/login'),
      { timeout: 30000 },
    );
  }

  async logout() {
    await this.userMenuToggle.waitFor({ state: 'visible', timeout: 15000 });
    await this.userMenuToggle.click();
    await this.logoutLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.logoutLink.click();
    await this.page.waitForURL((url) => !url.pathname.includes('/account/'), { timeout: 20000 });
    await this.page.evaluate(() => localStorage.removeItem('auth-token'));
  }
}
