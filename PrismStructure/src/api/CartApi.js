import { testConfig } from '../../config/testConfig.js';

export class CartApi {
  constructor(request) {
    this.request = request;
    this.baseUrl = testConfig.api.baseUrl;
  }

  async createCart(token) {
    const response = await this.request.post(`${this.baseUrl}/carts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok()) throw new Error(`Create cart failed: ${response.status()}`);
    return await response.json();
  }

  async getCart(token, cartId) {
    const response = await this.request.get(`${this.baseUrl}/carts/${cartId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok()) throw new Error(`Get cart failed: ${response.status()}`);
    return await response.json();
  }

  async addItemWithResponse(token, cartId, productId, quantity) {
    const response = await this.request.post(`${this.baseUrl}/carts/${cartId}/items`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: { product_id: productId, quantity },
    });

    let body = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    return { status: response.status(), body };
  }
}
