import { test, expect } from '@playwright/test';
import { CatalogPage } from '../../src/pages/CatalogPage';

import { testConfig } from '../../config/testConfig.js';

test.describe('Catalog & Cart UI Suite', () => {
  test('[@regression] Catalog search filters product results', async ({ page }) => {
    const catalogPage = new CatalogPage(page);
    const { searchKeyword } = testConfig.product;
    await catalogPage.navigate();
    await catalogPage.searchInput.fill(searchKeyword);
    await catalogPage.searchButton.click();
    await catalogPage.productCards.first().waitFor({ state: 'visible', timeout: 15000 });
    await expect(page.locator('.card').first()).toContainText(/plier/i);
  });

  test('[@regression] Cart quantity update before checkout', async ({ page }) => {
    const catalogPage = new CatalogPage(page);
    const { searchKeyword, cartQuantity } = testConfig.product;

    await catalogPage.searchProduct(searchKeyword);
    await catalogPage.selectFirstProduct();
    await catalogPage.setQuantityAndAddToCart(cartQuantity);
    await catalogPage.goToCart();
    await expect(page).toHaveURL(/cart|checkout/i);
  });
});
