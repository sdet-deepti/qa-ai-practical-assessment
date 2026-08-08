export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.submitButton = page.locator('[data-test="login-submit"]');
    this.searchInput = page
      .getByPlaceholder('Search')
      .or(page.locator('[data-test="search-query"]'));
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

    const [loginResponse] = await Promise.all([
      this.page.waitForResponse(
        (response) =>
          response.url().includes('/users/login') &&
          response.request().method() === 'POST',
        { timeout: 30000 },
      ),
      this.submitButton.click(),
    ]);

    if (loginResponse.status() !== 200) {
      throw new Error(`Login failed with HTTP ${loginResponse.status()}`);
    }

    await this.page.waitForURL(
      (url) => !url.pathname.includes('/auth/login'),
      { timeout: 30000 },
    );

    await this.page.goto('/#/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await this.searchInput.waitFor({ state: 'visible', timeout: 30000 });
  }
}
