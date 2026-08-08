import { testConfig } from '../../config/testConfig.js';

export class CheckoutPage {
    constructor(page) {
      this.page = page;
  
      // Stepper Navigation Buttons
      this.proceed1 = page.locator('[data-test="proceed-1"]');
      this.proceed2 = page.locator('[data-test="proceed-2"]');
      this.proceed3 = page.locator('[data-test="proceed-3"]');
  
      // Step 2: Login Controls
      this.emailInput = page.locator('[data-test="email"]');
      this.passwordInput = page.locator('[data-test="password"]');
      this.loginButton = page.locator('[data-test="login-submit"]');
  
      // Step 3: Billing Address Fields
      this.countrySelect = page.locator('[data-test="country"]')
        .or(page.getByRole('combobox', { name: /country/i }));
  
      this.postcodeInput = page.locator('[data-test="postcode"]')
        .or(page.getByLabel(/postal code/i));
  
      this.houseNumberInput = page.locator('[data-test="house-number"]')
        .or(page.getByPlaceholder(/e\.g\. 42/i))
        .or(page.getByLabel(/house number/i));
  
      this.streetInput = page.locator('[data-test="street"]')
        .or(page.locator('[data-test="address"]'))
        .or(page.getByLabel(/street/i));
  
      this.cityInput = page.locator('[data-test="city"]')
        .or(page.getByLabel(/city/i));
  
      this.stateInput = page.locator('[data-test="state"]')
        .or(page.getByLabel(/state/i));
  
      // Step 4: Payment
      this.paymentMethodDropdown = page.locator('[data-test="payment-method"]');
      this.finishButton = page.locator('[data-test="finish"]');
    }
  
    // Safe input helper to force Angular Reactive Form updates
    async fillAndTrigger(locator, value) {
      await locator.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      if (await locator.isVisible()) {
        await locator.fill(String(value));
        await locator.dispatchEvent('input');
        await locator.dispatchEvent('change');
        await locator.dispatchEvent('blur');
      }
    }
  
    async proceedThroughSteps(loginData, addressData) {
      // -------------------------------------------------------------
      // Step 1: Cart -> Proceed
      // -------------------------------------------------------------
      await this.proceed1.waitFor({ state: 'visible', timeout: 15000 });
      await this.proceed1.click();
  
      // -------------------------------------------------------------
      // Step 2: Sign-In / Login
      // -------------------------------------------------------------
      if (await this.emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        const email = loginData?.email || testConfig.credentials.email;
        const password = loginData?.password || testConfig.credentials.password;
  
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
      }
  
      // Step 2 -> Step 3 transition
      await this.proceed2.waitFor({ state: 'visible', timeout: 15000 });
      await this.proceed2.click();
  
      // -------------------------------------------------------------
      // Step 3: Billing Address
      // -------------------------------------------------------------
      await this.postcodeInput.waitFor({ state: 'visible', timeout: 15000 });
      await this.countrySelect.waitFor({ state: 'visible', timeout: 5000 });
  
      const data = addressData || {};
  
      // 1. ALWAYS select a country first (mandatory for Angular form validity)
      const targetCountry = data.country || 'Austria';
      try {
        await this.countrySelect.selectOption({ label: targetCountry });
      } catch {
        await this.countrySelect.selectOption({ index: 1 });
      }
      await this.countrySelect.dispatchEvent('change');
      await this.countrySelect.dispatchEvent('blur');
  
      // 2. Fill inputs and trigger change detection
      await this.fillAndTrigger(this.postcodeInput, data.postcode || '1010');
      await this.fillAndTrigger(this.houseNumberInput, data.houseNumber || '42');
      await this.fillAndTrigger(this.streetInput, data.address || data.street || 'Test street 150');
      await this.fillAndTrigger(this.cityInput, data.city || 'Vienna');
      await this.fillAndTrigger(this.stateInput, data.state || 'Austria');
  
      // 3. Wait for proceed button to be enabled and click
      await this.proceed3.waitFor({ state: 'visible', timeout: 10000 });
      await this.page.waitForFunction(
        () => {
          const btn = document.querySelector('[data-test="proceed-3"]');
          return btn && !btn.hasAttribute('disabled') && !btn.disabled;
        },
        { timeout: 10000 }
      );
  
      await this.proceed3.click();
    }
  
    async selectCashOnDelivery() {
      await this.paymentMethodDropdown.waitFor({ state: 'visible', timeout: 15000 });
  
      try {
        await this.paymentMethodDropdown.selectOption({ label: 'Cash on Delivery' });
      } catch {
        await this.paymentMethodDropdown.selectOption({ value: 'cash-on-delivery' });
      }
    }
  
    async confirmOrder() {
      await this.finishButton.waitFor({ state: 'visible', timeout: 10000 });
      await this.finishButton.click();
    }

    /**
     * Toolshop business rule: Confirm must be pressed twice to generate invoice ID.
     */
    async confirmInvoiceWithDoubleClick() {
      await this.finishButton.waitFor({ state: 'visible', timeout: 10000 });
      await this.finishButton.scrollIntoViewIfNeeded();
      await this.finishButton.click();
      await this.finishButton.waitFor({ state: 'visible', timeout: 5000 });
      await this.finishButton.click();
    }
  }