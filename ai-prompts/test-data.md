# AI Prompts – Test Data

Prompts for test data factories, central config, and API payloads.  
**Implemented artifacts:** `PrismStructure/config/testConfig.js`, `PrismStructure/src/utils/TestDataFactory.js`.

---

## Entry 1 — Faker registration payloads

- **Prompt:** Create `TestDataFactory` using `@faker-js/faker` for dynamic user registration and checkout helpers.
- **AI Response Summary:** `generateUserData()`, `generateShippingDetails()`, API payload helper.
- **Validation Notes:** Registration test in `prism-auth.spec.js` uses Faker only; fixed login/checkout uses `testConfig.credentials`.

---

## Entry 2 — Central test configuration

- **Prompt:** Externalize product id, quantity, search keyword, and login credentials — avoid hardcoding `pid` in specs.
- **AI Response Summary:** Env-var-driven `testConfig` module proposed.
- **Validation Notes:** `config/testConfig.js` exports:

```text
credentials: { email, password }     → PLAYWRIGHT_USER_EMAIL / PASSWORD
product: { id, searchKeyword, searchFallback, quantity, cartQuantity }
api: { baseUrl }
```

Used by specs, `CatalogPage` defaults, `TestDataFactory.generateApiCheckoutPayload()`, and all API controllers.

---

## Entry 3 — Invoice billing payload (API)

- **Prompt:** Match invoice POST to assessment example body (TG country, Hesselbury, Florida).
- **AI Response Summary:** Add `billing_street`, `billing_city`, `billing_state`, `billing_country`, `billing_postal_code` to POST `/invoices`.
- **Validation Notes:** `generateInvoiceBillingDetails()` + `InvoiceApi.createInvoice()` use TG/1234AA payload — verified 201 on live API. AT/US combinations returned 422 (country/city mismatch).

---

## Entry 4 — CheckoutPage credential fallback

- **Prompt:** Ensure checkout step login uses same credentials as specs without duplicating strings.
- **AI Response Summary:** Import `testConfig` in CheckoutPage for default email/password.
- **Validation Notes:** `proceedThroughSteps()` falls back to `testConfig.credentials` when `loginData` not passed.
