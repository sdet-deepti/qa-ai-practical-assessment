export class ProfilePage {
  constructor(page) {
    this.page = page;
    this.userMenuToggle = page.locator('[data-test="nav-menu"]');
    this.profileLink = page.getByRole('link', { name: 'My profile' });
    this.emailInput = page.locator('#email, input[type="email"], [data-test="email"]').first();
  }

  async navigate() {
    await this.userMenuToggle.waitFor({ state: 'visible', timeout: 15000 });
    await this.userMenuToggle.click();
    await this.profileLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.profileLink.click();
    await this.page.waitForURL(/account\/profile/, { timeout: 20000 });
  }

  async expectEmailVisible(email) {
    await this.emailInput.waitFor({ state: 'visible', timeout: 15000 });
    const value = await this.emailInput.inputValue();
    if (value.trim() !== email) {
      throw new Error(`Expected profile email "${email}", got "${value}"`);
    }
  }

  async expectNameVisible(name) {
    await this.page.getByText(name, { exact: false }).first().waitFor({
      state: 'visible',
      timeout: 15000,
    });
  }
}
