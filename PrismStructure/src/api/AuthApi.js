import { testConfig } from '../../config/testConfig.js';

export class AuthApi {
  constructor(request) {
    this.request = request;
    this.baseUrl = testConfig.api.baseUrl;
  }

  async login(email, password) {
    const response = await this.request.post(`${this.baseUrl}/users/login`, {
      data: { email, password },
    });

    if (!response.ok()) {
      throw new Error(`Auth failed with status ${response.status()}`);
    }

    const body = await response.json();
    return body.access_token;
  }

  async loginWithResponse(email, password) {
    const response = await this.request.post(`${this.baseUrl}/users/login`, {
      data: { email, password },
    });

    let body = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    return { status: response.status(), body };
  }

  async getCurrentUser(token) {
    const response = await this.request.get(`${this.baseUrl}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok()) {
      throw new Error(`Get current user failed: ${response.status()}`);
    }

    return await response.json();
  }

  async getCurrentUserWithResponse(token) {
    const response = await this.request.get(`${this.baseUrl}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    let body = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    return { status: response.status(), body };
  }

  async register(userData) {
    const response = await this.request.post(`${this.baseUrl}/users/register`, {
      data: userData,
    });

    if (!response.ok()) {
      throw new Error(`Registration failed with status ${response.status()}`);
    }

    return await response.json();
  }
}
