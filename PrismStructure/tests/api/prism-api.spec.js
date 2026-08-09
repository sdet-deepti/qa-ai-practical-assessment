import { test, expect } from '@playwright/test';
import { AuthApi } from '../../src/api/AuthApi';
import { CartApi } from '../../src/api/CartApi';
import { InvoiceApi } from '../../src/api/InvoiceApi';
import { TestDataFactory } from '../../src/utils/TestDataFactory';

import { testConfig } from '../../config/testConfig.js';

test.describe('Prism API Automation Tier', () => {
  let authApi, cartApi, invoiceApi;

  test.beforeEach(async ({ request }) => {
    authApi = new AuthApi(request);
    cartApi = new CartApi(request);
    invoiceApi = new InvoiceApi(request);
  });

  test('[@smoke] Login and obtain bearer token', async () => {
    const { email, password } = testConfig.credentials;
    const token = await authApi.login(email, password);
    expect(token).toBeTruthy();
  });

  test('[@smoke] GET /users/me returns authenticated user email', async () => {
    const { email, password } = testConfig.credentials;
    const token = await authApi.login(email, password);
    const user = await authApi.getCurrentUser(token);
    expect(user.email).toBe(email);
  });

  test('[@smoke] Create new cart session', async () => {
    const { email, password } = testConfig.credentials;
    const token = await authApi.login(email, password);
    const cart = await cartApi.createCart(token);
    expect(cart.id).toBeTruthy();
  });

  test('[@smoke] Retrieve cart by id with cart_items array', async () => {
    const { email, password } = testConfig.credentials;
    const token = await authApi.login(email, password);
    const cart = await cartApi.createCart(token);
    const details = await cartApi.getCart(token, cart.id);
    expect(details.id).toBe(cart.id);
    expect(Array.isArray(details.cart_items)).toBe(true);
  });

  test('[@smoke] [@regression] E2E API: login, cart, COD invoice with invoice_number', async () => {
    const { email, password } = testConfig.credentials;
    const token = await authApi.login(email, password);
    const cart = await cartApi.createCart(token);
    const billing = TestDataFactory.generateInvoiceBillingDetails();
    const invoice = await invoiceApi.createInvoice(token, cart.id, billing);
    expect(invoice.id).toBeTruthy();
    expect(invoice.invoice_number).toMatch(/^INV-\d+$/);
  });

  test('[@regression] Invalid login returns 401', async () => {
    const result = await authApi.loginWithResponse('invalid.user@practice-qa.com', 'WrongPassword123!');
    expect(result.status).toBe(401);
  });

  test('[@regression] Invalid bearer token returns 401 on /users/me', async () => {
    const result = await authApi.getCurrentUserWithResponse('invalid.bearer.token.value');
    expect(result.status).toBe(401);
  });

  test('[@regression] Add item to cart returns 404 on live API (documented SUT limit)', async () => {
    const { email, password } = testConfig.credentials;
    const productId = testConfig.product.id;
    const token = await authApi.login(email, password);
    const cart = await cartApi.createCart(token);
    const result = await cartApi.addItemWithResponse(token, cart.id, productId, 2);
    expect(result.status).toBe(404);
  });

  test('[@regression] Invoice without cart_id returns 422', async () => {
    const { email, password } = testConfig.credentials;
    const token = await authApi.login(email, password);
    const billing = TestDataFactory.generateInvoiceBillingDetails();
    const result = await invoiceApi.createInvoiceWithResponse(token, {
      payment_method: 'cash-on-delivery',
      billing_street: billing.billing_street,
      billing_city: billing.billing_city,
      billing_state: billing.billing_state,
      billing_country: billing.billing_country,
      billing_postal_code: billing.billing_postal_code,
      payment_details: {},
    });
    expect(result.status).toBe(422);
  });
});
