export class LoginPage {
    constructor(page) {
      this.page = page;
      // Use exact data-test attributes to avoid strict mode collisions
      this.emailInput = page.locator('[data-test="email"]');
      this.passwordInput = page.locator('[data-test="password"]');
      this.submitButton = page.locator('[data-test="login-submit"]');
    }
  
    async navigate() {
      await this.page.goto('/auth/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    }
  
    async login(email, password, { expectSuccess = true } = {}) {
      await this.emailInput.waitFor({ state: 'visible', timeout: 20000 });
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.submitButton.click();

      if (!expectSuccess) {
        return;
      }

      await this.page.waitForURL(
        (url) => !url.pathname.includes('/auth/login'),
        { timeout: 30000 },
      );
      await this.page.locator('[data-test="nav-menu"]').waitFor({ state: 'visible', timeout: 20000 });
      await this.page.goto('/#/', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await this.page.waitForLoadState('domcontentloaded');
    }
  }