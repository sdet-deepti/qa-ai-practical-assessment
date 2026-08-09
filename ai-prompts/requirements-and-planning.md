# AI Prompts – Requirements and Planning

Record prompts used for Toolshop requirement analysis, AC extraction, and risk mapping.  
**Implemented artifacts:** `project-info.md` (Requirements section), `FunctionalTestCase.csv`, `PrismStructure/tests/`.

---

## Entry 1 — SUT analysis and acceptance criteria

- **Prompt:** Analyze PracticeSoftwareTesting (Toolshop) for UI and API. Extract AC1 (auth/profile) and AC2 (cart, COD checkout, double-confirm invoice). Map risks to mitigation strategies.
- **AI Response Summary:** Produced AC1/AC2 for UI and API; flagged double-confirm as high risk; 3-row risk matrix (cart IDs, session collision, double-confirm).
- **Validation Notes:** Confirmed invoice POST requires `cart_id` + billing fields (TG/Hesselbury example). Added UI risks: out-of-stock catalog, Angular checkout validation. **API note:** live API supports `POST /carts` and `POST /invoices` with auth; `POST /carts/{id}/items` returns 404 — automated API suite uses login → create cart → get cart → invoice (see `prism-api.spec.js`).

---

## Entry 2 — Smoke vs regression strategy

- **Prompt:** Define @Smoke vs @Regression for Toolshop UI and API tiers aligned to assessment ACs.
- **AI Response Summary:** Smoke = login, catalog add, token, cart create; Regression = double-confirm checkout, invoice verify, 401/422 API negatives.
- **Validation Notes:** Final tags on 12 automated tests and `FunctionalTestCase.csv` (6 UI + 6 API manual cases).

---

## Entry 3 — Profile, logout, and invoice number format

- **Prompt:** Extend AC1/AC2 for profile page verification, logout/session end, and invoice number format on UI and API.
- **AI Response Summary:** AC1b profile name/email; AC1c logout; AC2b invoice `INV-` + digits (live sample `INV-2026000005`).
- **Validation Notes:** Manual TC_UI_007–012, TC_API_007–008; `GET /users/me` for session; `POST /users/logout` returns 405 — UI logout + invalid-token 401 test.

---

## Risk Mitigation Matrix (as implemented)

| Risk | Mitigation in code |
|------|-------------------|
| Double-confirm invoice | `CheckoutPage.confirmInvoiceWithDoubleClick()` — two clicks on `[data-test="finish"]` |
| Out-of-stock products | `CatalogPage` in-stock filter + fallback search keyword from `testConfig` |
| Dynamic cart IDs | Chain `cart.id` from create → invoice payload |
| Session collision | Faker dynamic users in `prism-auth.spec.js` register test |
| Angular billing form | `fillAndTrigger()` + country selected first in `CheckoutPage` |
| API billing validation | TG/Hesselbury payload in `InvoiceApi` / `TestDataFactory` |
| Parallel test flake | `workers: 2` in `playwright.config.js` |
| No API logout endpoint | UI logout test; API uses invalid-token 401 on `/users/me` |
| Invoice number drift | Assert `/^INV-\d+$/` on UI and API `invoice_number` |
| Add-item API 404 | Document in manual TC_API_004; API regression asserts 404 |

---

## SUT Reference

- UI: https://practicesoftwaretesting.com/
- API: https://api.practicesoftwaretesting.com/
- Docs: https://api.practicesoftwaretesting.com/api/documentation
