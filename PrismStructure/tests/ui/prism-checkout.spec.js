import { test, expect } from '@playwright/test';
import { testConfig } from '../../config/testConfig.js';
import { CatalogPage } from '../../src/pages/CatalogPage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { InvoicePage } from '../../src/pages/InvoicePage';

test.describe('Prism UI End-to-End Automation Suite (Dynamic Data)', () => {
  let catalogPage;
  let checkoutPage;
  let invoicePage;

  test.beforeEach(async ({ page }) => {
    catalogPage = new CatalogPage(page);
    checkoutPage = new CheckoutPage(page);
    invoicePage = new InvoicePage(page);
  });

  test('E2E COD Checkout Flow & Invoice Verification @smoke @regression', async ({ page }) => {
    const { searchKeyword, quantity } = testConfig.product;

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
