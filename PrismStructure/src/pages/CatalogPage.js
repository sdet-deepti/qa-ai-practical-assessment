import { testConfig } from '../../config/testConfig.js';

export class CatalogPage {
    constructor(page) {
      this.page = page;
  
      // Search elements
      this.searchInput = page.getByPlaceholder('Search').or(page.locator('[data-test="search-query"]'));
      this.searchButton = page.getByRole('button', { name: 'Search' }).or(page.locator('[data-test="search-submit"]'));
  
      // Results & Cards
      this.searchHeader = page.locator('h3, [data-test="search-caption"]');
      this.productCards = page.locator('.card');
  
      // Detail page locators
      this.addToCartButton = page.locator('[data-test="add-to-cart"]')
        .or(page.locator('#btn-add-to-cart'))
        .or(page.getByRole('button', { name: /add to cart/i }));
  
      this.quantityInput = page.locator('[data-test="quantity"]').or(page.locator('#quantity'));
    }
  
    async navigate() {
      await this.page.goto('/#/', { waitUntil: 'domcontentloaded' });
    }
  
    /**
     * Searches for a product. If all results are out of stock (or empty),
     * automatically falls back to searching for an alternative available item (e.g. 'Hammers').
     * @param {string} keyword - Primary search term
     * @param {string} fallbackKeyword - Secondary term if primary is out of stock
     */
  async searchProduct(
    keyword = testConfig.product.searchKeyword,
    fallbackKeyword = testConfig.product.searchFallback,
  ) {
      await this.navigate();
      await this.searchInput.waitFor({ state: 'visible', timeout: 15000 });
      await this.searchInput.fill(keyword);
      await this.searchButton.click();
  
      // Wait for initial cards to populate
      await this.productCards.first().waitFor({ state: 'visible', timeout: 15000 });
  
      // Count available in-stock items
      const inStockCards = this.page.locator('.card').filter({ hasNotText: 'Out of stock' });
      const inStockCount = await inStockCards.count();
  
      // Fall back if no items are currently in stock
      if (inStockCount === 0) {
        console.warn(`[Catalog] Search for '${keyword}' returned 0 in-stock items. Falling back to '${fallbackKeyword}'.`);
        await this.searchInput.clear();
        await this.searchInput.fill(fallbackKeyword);
        await this.searchButton.click();
        await this.productCards.first().waitFor({ state: 'visible', timeout: 15000 });
      }
    }
  
    async selectFirstProduct() {
      await this.selectFirstInStockProduct();
    }
  
    async selectFirstInStockProduct() {
      // Filter for in-stock cards and target the product link
      const inStockCard = this.page.locator('.card').filter({ hasNotText: 'Out of stock' }).first();
      await inStockCard.waitFor({ state: 'visible', timeout: 10000 });
  
      const productLink = inStockCard.locator('a, [data-test="product-name"], img').first();
      await productLink.click();
  
      // Wait for detail view element to be ready
      await this.addToCartButton.waitFor({ state: 'visible', timeout: 15000 });
    }
  
    async setQuantityAndAddToCart(quantity = 1) {
      await this.addToCartButton.waitFor({ state: 'visible', timeout: 15000 });
  
      if (await this.quantityInput.isVisible()) {
        await this.quantityInput.clear();
        await this.quantityInput.fill(String(quantity));
      }
  
      await this.addToCartButton.click();
    }
  
    async goToCart() {
      const cartNav = this.page.locator('[data-test="nav-cart"]').or(this.page.locator('a[href*="/checkout"]'));
      await cartNav.waitFor({ state: 'visible', timeout: 10000 });
      await cartNav.click();
    }
  }