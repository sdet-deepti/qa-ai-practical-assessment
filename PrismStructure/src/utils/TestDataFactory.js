import { faker } from '@faker-js/faker';
import { testConfig } from '../../config/testConfig.js';

export class TestDataFactory {
  /**
   * Generates a dynamic user registration payload
   */
  static generateUserData() {
    return {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: 'US',
      postcode: faker.location.zipCode('#####'),
      phone: faker.string.numeric('##########'),
      email: faker.internet.email({ provider: 'practice-qa.com' }),
      password: `TestP@ss${faker.number.int({ min: 1000, max: 9999 })}!`
    };
  }

  /**
   * Generates dynamic checkout shipping and billing payloads
   */
  static generateShippingDetails() {
    return {
      fullName: faker.person.fullName(),
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      postalCode: faker.location.zipCode('#####'),
      paymentMethod: 'cash-on-delivery'
    };
  }

  /**
   * Generates API payloads for cart items and invoices
   */
  static generateApiCheckoutPayload(cartId, productId = testConfig.product.id) {
    return {
      cart_id: cartId,
      product_id: productId,
      quantity: testConfig.product.quantity,
      payment_method: 'cash-on-delivery',
    };
  }

  static generateInvoiceBillingDetails() {
    return {
      billing_street: 'Zoey Shore',
      billing_city: 'Hesselbury',
      billing_state: 'Florida',
      billing_country: 'TG',
      billing_postal_code: '1234AA',
      payment_method: 'cash-on-delivery',
      payment_details: {},
    };
  }
}