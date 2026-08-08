import { testConfig } from '../../config/testConfig.js';

export class InvoiceApi {
  constructor(request) {
    this.request = request;
    this.baseUrl = testConfig.api.baseUrl;
  }

  async createInvoice(token, cartId, billing = {}) {
    const payload = {
      cart_id: cartId,
      payment_method: billing.payment_method || 'cash-on-delivery',
      billing_street: billing.billing_street || 'Zoey Shore',
      billing_city: billing.billing_city || 'Hesselbury',
      billing_state: billing.billing_state || 'Florida',
      billing_country: billing.billing_country || 'TG',
      billing_postal_code: billing.billing_postal_code || '1234AA',
      payment_details: billing.payment_details || {},
    };

    const response = await this.request.post(`${this.baseUrl}/invoices`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: payload,
    });

    if (!response.ok()) {
      throw new Error(`Invoice failed: ${response.status()}`);
    }
    return await response.json();
  }

  async createInvoiceWithResponse(token, payload) {
    const response = await this.request.post(`${this.baseUrl}/invoices`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: payload,
    });
    let body = null;
    try { body = await response.json(); } catch { /* empty */ }
    return { status: response.status(), body };
  }
}
