/**
 * Central test configuration for UI + API suites.
 * Override via environment variables when needed (e.g. CI or different SUT data).
 */
export const testConfig = {
  credentials: {
    email: process.env.PLAYWRIGHT_USER_EMAIL || 'customer@practicesoftwaretesting.com',
    password: process.env.PLAYWRIGHT_USER_PASSWORD || 'welcome01',
  },

  product: {
    /** API product id (Combination Pliers — verified in-stock on Toolshop API) */
    id: process.env.PLAYWRIGHT_PRODUCT_ID || '01KZFVWJVB996WQ7182R8P1C8R',
    /** UI catalog search term to locate the product */
    searchKeyword: process.env.PLAYWRIGHT_SEARCH_KEYWORD || 'Pliers',
    searchFallback: process.env.PLAYWRIGHT_SEARCH_FALLBACK || 'Hammers',
    /** Default add-to-cart quantity (checkout / API) */
    quantity: Number(process.env.PLAYWRIGHT_PRODUCT_QUANTITY || 1),
    /** Quantity used in cart quantity regression test */
    cartQuantity: Number(process.env.PLAYWRIGHT_CART_QUANTITY || 2),
  },

  api: {
    baseUrl: process.env.PLAYWRIGHT_API_BASE_URL || 'https://api.practicesoftwaretesting.com',
  },
};
