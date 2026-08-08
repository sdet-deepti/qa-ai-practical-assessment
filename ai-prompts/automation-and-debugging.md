# AI Prompts – Automation and Debugging

Prompts for POM construction, spec fixes, and failure analysis.  
**Implemented artifacts:** `PrismStructure/src/pages/`, `PrismStructure/tests/`, `playwright.config.js`.

---

## Entry 1 — POM locator strategy

- **Prompt:** Refactor Page Objects to use `getByRole`, `getByTestId`, `getByLabel` instead of fragile XPath/CSS chains.
- **AI Response Summary:** Suggested locator replacements per page.
- **Debugging Outcome:** All UI specs use POM locators; no selectors in spec files. `.cursor/rules/prism-playwright.md` enforces this.

---

## Entry 2 — `expect` in Page Object (ReferenceError)

- **Prompt:** Fix `ReferenceError: expect is not defined` in `CheckoutPage.js` without importing `@playwright/test` into POM.
- **AI Response Summary:** Use `waitFor` instead of `expect` in page classes.
- **Debugging Outcome:** Replaced `expect()` in POM with `locator.waitFor({ state: 'visible' })`.

---

## Entry 3 — Checkout step 2 → 3 transition

- **Prompt:** Test hangs after login on checkout step 2 waiting for address fields.
- **AI Response Summary:** Toolshop requires clicking `proceed-2` after login before step 3.
- **Debugging Outcome:** Added explicit `proceed2.click()` after credential submit in `proceedThroughSteps()`.

---

## Entry 4 — Angular form validation (proceed-3 disabled)

- **Prompt:** `[data-test="proceed-3"]` stays disabled after filling billing fields.
- **AI Response Summary:** Dispatch `input`/`change`/`blur` events for Angular reactive forms; select country first.
- **Debugging Outcome:** `fillAndTrigger()` helper + country-first selection + `waitForFunction` for enabled button.

---

## Entry 5 — Out-of-stock catalog freeze

- **Prompt:** Quantity input disabled when product out of stock; test times out on `.clear()`.
- **AI Response Summary:** Filter in-stock cards before selecting product.
- **Debugging Outcome:** `CatalogPage.searchProduct()` fallback keyword; `selectFirstInStockProduct()` filters `.card:not(:has-text("Out of stock"))`.

---

## Entry 6 — Double-confirm invoice (UI business rule)

- **Prompt:** Implement Toolshop rule: press Confirm **twice** to generate invoice ID.
- **AI Response Summary:** Early draft used single `finishButton.click()` aliased as `confirmInvoiceWithDoubleClick()`.
- **Debugging Outcome:** **Fixed:** two explicit clicks on `[data-test="finish"]` with scroll and visibility wait between clicks in `confirmInvoiceWithDoubleClick()`.

---

## Entry 7 — My Invoices dropdown navigation

- **Prompt:** `getByRole('link', { name: /my invoices/i })` not visible — link inside user menu.
- **AI Response Summary:** Open `[data-test="nav-menu"]` before clicking My Invoices.
- **Debugging Outcome:** `InvoicePage.navigateToMyInvoices()` opens menu first; fallback `page.goto('/#/account/invoices')`.

---

## Entry 8 — API cart add-item 404

- **Prompt:** `POST /carts/{id}/items` returns 404 Resource not found on live Toolshop API.
- **AI Response Summary:** Suggested alternate endpoints; none available on current API version.
- **Debugging Outcome:** Removed `addItemToCart` from automated path. API suite tests: login → create cart → **get cart** → invoice with TG billing. Manual TC_API_004 retains add-item intent.

---

## Entry 9 — API invoice billing 422

- **Prompt:** Invoice POST returns 422 billing_country does not match address.
- **AI Response Summary:** Use assessment example TG/Hesselbury payload exactly.
- **Debugging Outcome:** `TestDataFactory.generateInvoiceBillingDetails()` locked to TG/1234AA; 201 Created confirmed.

---

## Entry 10 — Parallel run checkout timeout

- **Prompt:** Full suite fails checkout at `proceed-3` when 10 workers run concurrently against SUT.
- **AI Response Summary:** Reduce workers or isolate checkout spec.
- **Debugging Outcome:** `workers: 2` in `playwright.config.js`; checkout passes in full suite (12/12).

---

## Entry 11 — Reports written to wrong folder

- **Prompt:** HTML report at repo root `reports/` shows "No tests found" when opening wrong path.
- **AI Response Summary:** Playwright cwd affects output paths when using `--config` from wrong directory.
- **Debugging Outcome:** Documented: always `cd PrismStructure` before `npx playwright test`. Reports only in `PrismStructure/reports/html-report/`. Root `reports/` removed.

---

## Entry 12 — CI login race (catalog/checkout timeouts)

- **Prompt:** GitHub Actions fails on catalog/checkout with search input timeout; same tests pass locally.
- **AI Response Summary:** `LoginPage.login()` clicked submit and returned immediately; CI continued before redirect/session finished.
- **Debugging Outcome:** Wait for `POST /users/login` response (200), redirect off `/auth/login`, then `goto('/#/')` and wait for catalog search input — single click only.

---

## Entry 13 — CI negative login + registration

- **Prompt:** After adding login redirect wait, negative login test timed out (invalid login stays on login page).
- **AI Response Summary:** Use `expectSuccess: false` for negative path; skip live registration on `process.env.CI`.
- **Debugging Outcome:** Negative test does not wait for redirect. Registration smoke skipped in CI; fixed demo user login covers pipeline auth.

---

## Entry 14 — CI `nav-menu` wait too strict

- **Prompt:** CI logs showed redirect succeeded but `[data-test="nav-menu"]` not visible within 20s.
- **AI Response Summary:** Nav renders slower on CI; catalog only needs home page + search box.
- **Debugging Outcome:** Removed `nav-menu` wait from `LoginPage.login()`; wait for search input on `/#/` instead. `fullyParallel: false` on CI to reduce login hammering.

---

## Entry 15 — CI: guest catalog + checkout-step login

- **Prompt:** After login API wait, catalog search still timed out on CI only (guest catalog test passed).
- **AI Response Summary:** Pre-login via `/auth/login` unreliable on GitHub runners; guest browse works; login at checkout step 2 matches real user flow.
- **Debugging Outcome:** Removed pre-login from `prism-catalog` cart test and `prism-checkout` E2E; `CheckoutPage` waits on login API response at step 2. CI runs 11 passed + 1 skipped (registration).

---

## Final execution status

- **Command:** `npx playwright test --project=chromium` from `PrismStructure/`
- **Local result:** 12 passed, 0 failed (registration smoke included)
- **CI result:** 11 passed, 1 skipped (registration), 0 failed — after login stability fixes
- **Report:** `PrismStructure/reports/html-report/index.html`
