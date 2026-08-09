# AI Prompts – Test Design

Prompts for manual test cases and automated spec design (UI + API).  
**Implemented artifacts:** `FunctionalTestCase.csv`, `PrismStructure/tests/ui/`, `PrismStructure/tests/api/`.

---

## Entry 1 — Toolshop manual test cases

- **Prompt:** Generate 6 UI and 6 API manual cases for Toolshop AC1/AC2. Include positive and negative paths. Tag @Smoke and @Regression.
- **AI Response Summary:** Initial CSV with generic security/rate-limit cases not tied to Toolshop.
- **Validation Notes:** Rewrote to TC_UI_001–006 and TC_API_001–006 mapped to register, login, catalog, COD double-confirm, My Invoices, API token, cart, invoice, 401, 422.

---

## Entry 2 — Smoke vs regression classification

- **Prompt:** Classify cases as @Smoke (sanity) vs @Regression for checkout double-confirm and API negatives.
- **AI Response Summary:** Happy paths as Smoke; double-confirm, invoice verify, 401, 422 as Regression.
- **Validation Notes:** Matches tags in CSV and all Playwright spec titles.

---

## Entry 3 — Automated UI spec design

- **Prompt:** Create Playwright UI specs with Prism POM for auth, catalog, and E2E COD checkout + invoice verification.
- **AI Response Summary:** Suggested single E2E spec; generic locators in early drafts.
- **Validation Notes:** Final **4 UI spec files, 6 tests:** `healthcheck.spec.js`, `prism-auth.spec.js` (2), `prism-catalog.spec.js` (2), `prism-checkout.spec.js` (1). Locators use `data-test` / `getByRole` in POMs only.

---

## Entry 4 — Automated API spec design

- **Prompt:** Build API tier with AuthApi, CartApi, InvoiceApi and Playwright `request` context.
- **AI Response Summary:** Single E2E spec with add-item via `POST /carts/{id}/items`.
- **Validation Notes:** Split into **6 API tests** in `prism-api.spec.js`: login token, create cart, get cart, E2E invoice, 401 invalid login, 422 missing cart_id. Add-item endpoint not available on live API (404); manual TC_API_004 documents intent; automation validates cart retrieval instead.

---

## Entry 5 — Review gap manual + automation expansion

- **Prompt:** Add manual cases for profile, logout, invoice format, password boundaries; deepen API/UI assertions per review.
- **AI Response Summary:** 8 new CSV rows (TC_UI_007–012, TC_API_007–008); 17 automated tests (9 API + 8 UI).
- **Validation Notes:** See `review-improvement-plan.md`; env matrix in `docs/environment-and-data-strategy.md`.

---

## Coverage Summary (implemented)

| Tier | Spec files | Tests | Tags |
|------|------------|-------|------|
| UI | 4 | 8 | @smoke / @regression |
| API | 1 | 9 | @smoke / @regression |
| Manual CSV | — | 20 rows | @Smoke / @Regression |
