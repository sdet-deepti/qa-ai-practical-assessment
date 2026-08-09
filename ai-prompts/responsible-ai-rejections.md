# AI Prompts – Responsible AI rejections

Explicit moments where AI output was **rejected** (not merely iterated).  
Complements iteration logs in `automation-and-debugging.md` and `test-design.md`.

---

## Rejection 1 — XPath/CSS selectors inside spec files

- **AI output:** Playwright specs with inline `page.locator('div.class > span')` chains for catalog and checkout.
- **Why rejected:** Fragile against UI refactors; violates Prism POM rule and assessment locator standards.
- **Replacement:** All selectors moved to `src/pages/` using `getByRole`, `getByTestId`, `getByLabel`. Enforced in `.cursor/rules/prism-playwright.md`.

---

## Rejection 2 — `expect()` imported inside Page Object classes

- **AI output:** `CheckoutPage.js` calling `expect(locator).toBeVisible()` inside the POM.
- **Why rejected:** Couples page layer to `@playwright/test`; caused `ReferenceError: expect is not defined` when POM loaded without test runner.
- **Replacement:** `locator.waitFor({ state: 'visible' })` and URL/network waits in POMs; `expect` only in spec files.

---

## Rejection 3 — Single-click invoice confirmation

- **AI output:** `confirmInvoiceWithDoubleClick()` implemented as one click on `[data-test="finish"]`.
- **Why rejected:** Toolshop business rule requires **two** Confirm presses; single click does not generate invoice ID (AC2 failure).
- **Replacement:** Two explicit clicks with scroll + visibility wait between clicks in `CheckoutPage.confirmInvoiceWithDoubleClick()`.

---

## Rejection 4 — Generic manual test cases (rate limits, SQL injection)

- **AI output:** `FunctionalTestCase.csv` rows for generic security scanning not tied to Toolshop ACs.
- **Why rejected:** Assessment requires AC-mapped cases for the SUT; generic cases add noise without traceability.
- **Replacement:** Rewrote to TC_UI_001–006 / TC_API_001–006 mapped to register, login, catalog, COD double-confirm, My Invoices, API token, cart, invoice, 401, 422.

---

## Rejection 5 — API billing country `US` for invoice POST

- **AI output:** Invoice payload with `billing_country: 'US'` copied from registration examples.
- **Why rejected:** Live API returns validation errors; assessment example uses **TG** / Hesselbury billing.
- **Replacement:** `TestDataFactory.generateInvoiceBillingDetails()` and `InvoiceApi` default to TG postal payload; documented in `requirements-and-planning.md`.

---

## Rejection 6 — Automating `POST /carts/{id}/items` despite 404

- **AI output:** API E2E spec that always calls add-item endpoint per OpenAPI diagram.
- **Why rejected:** Live SUT returns **404** on add-item; test would be permanently red without SUT change.
- **Replacement:** API suite chains login → create cart → **GET cart** (structure assertions) → invoice; manual TC_API_004 retains add-item intent; regression test documents 404 response.
