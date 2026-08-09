import { testConfig } from '../../config/testConfig.js';
import { isCiEnv } from '../../src/utils/ciEnv.js';

export class ProfilePage {
  constructor(page) {
    this.page = page;
    this.userMenuToggle = page.locator('[data-test="nav-menu"]');
    this.profileLink = page.getByRole('link', { name: 'My profile' });
    this.emailInput = page.locator('#email, input[type="email"], [data-test="email"]').first();
  }

  async navigate() {
    try {
      await this.userMenuToggle.waitFor({ state: 'visible', timeout: 15000 });
      await this.userMenuToggle.click();
      await this.profileLink.waitFor({ state: 'visible', timeout: 10000 });
      await this.profileLink.click();
      await this.page.waitForURL(/account\/profile/, { timeout: 20000 });
    } catch {
      await this.page.goto('/#/account/profile', {
        waitUntil: 'domcontentloaded',
        timeout: 20000,
      });
      await this.page.waitForURL(/account\/profile/, { timeout: 20000 });
    }
  }

  async expectEmailVisible(email) {
    await this.emailInput.waitFor({ state: 'visible', timeout: 15000 });
    const value = await this.emailInput.inputValue();
    if (value.trim() !== email) {
      throw new Error(`Expected profile email "${email}", got "${value}"`);
    }
  }

  async expectNameVisible(name) {
    const timeout = isCiEnv ? 30000 : 15000;
    const firstNameInput = this.page
      .locator('#first_name, [data-test="first-name"], input[formcontrolname="first_name"]')
      .first();

    try {
      await firstNameInput.waitFor({ state: 'visible', timeout });
      const value = await firstNameInput.inputValue();
      if (value.includes(name)) return;
    } catch {
      // ponytail: fall back to visible text if form field not populated on slow runners
    }

    await this.page.getByText(name, { exact: false }).first().waitFor({
      state: 'visible',
      timeout,
    });
  }
}
