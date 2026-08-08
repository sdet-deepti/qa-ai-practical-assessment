import { test, expect } from '@playwright/test';
import { testConfig } from '../../config/testConfig.js';
import { LoginPage } from '../../src/pages/LoginPage';
import { CatalogPage } from '../../src/pages/CatalogPage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { InvoicePage } from '../../src/pages/InvoicePage';

test.describe('Prism UI End-to-End Automation Suite (Dynamic Data)', () => {
  let loginPage;
  let catalogPage;
  let checkoutPage;
  let invoicePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    catalogPage = new CatalogPage(page);
    checkoutPage = new CheckoutPage(page);
    invoicePage = new InvoicePage(page);
  });

  test('E2E COD Checkout Flow & Invoice Verification @smoke @regression', async ({ page }) => {
    const { email, password } = testConfig.credentials;
    const { searchKeyword, quantity } = testConfig.product;

    await loginPage.navigate();
    await loginPage.login(email, password);

    await catalogPage.searchProduct(searchKeyword);
    await catalogPage.selectFirstProduct();
    await catalogPage.setQuantityAndAddToCart(quantity);
    await catalogPage.goToCart();

    await checkoutPage.proceedThroughSteps();
    await checkoutPage.selectCashOnDelivery();
    await checkoutPage.confirmInvoiceWithDoubleClick();

    await invoicePage.navigateToMyInvoices();
    await invoicePage.verifyLatestInvoice();

    await expect(invoicePage.invoiceStatusTag).toBeVisible();
  });
});
