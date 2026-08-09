# project-info.md — QA AI Practical Assessment

**Primary AI Tool(s) Used:** Cursor AI (Auto / Composer 2.5 for planning & docs; Sonnet for automation & debugging)  
**Application Under Test:** PracticeSoftwareTesting Toolshop — Checkout & Application Flow  
**Assessment Start Date:** August 5, 2026  
**Submission Date:** August 8, 2026  
**Public Repo URL:** https://github.com/sdet-deepti/qa-ai-practical-assessment

---

## Project Summary

End-to-end QA automation for Toolshop covering **AC1** (registration, login, **profile**, **logout**) and **AC2** (catalog, cart quantity, COD checkout with **double-confirm**, My Invoices with **invoice number format**). The API tier validates bearer-token login, **`GET /users/me`**, cart lifecycle, COD invoice with **`invoice_number`**, invalid token 401, add-item 404 (documented), and 422 missing `cart_id`. **17 automated tests pass** locally on Chromium (16 on CI with registration skipped).

---

## Tools Used

| Category | Tools |
|----------|-------|
| Browser | Chromium (Playwright `Desktop Chrome` project) |
| Automation | Playwright (`@playwright/test`) — Prism POM pattern |
| Language | JavaScript (ES modules) |
| API testing | Playwright native `request` context |
| Test data | `@faker-js/faker`, `config/testConfig.js` |
| AI | Cursor IDE, `.cursor/rules/prism-playwright.md` |
| SUT UI | https://practicesoftwaretesting.com/ |
| SUT API | https://api.practicesoftwaretesting.com/ |

---

## Part A — AI Workflow Foundation (Setup Summary)

### 1. How you provide project and SUT context to AI

Shared assessment AC1/AC2, Toolshop UI and API URLs, and the **double-confirm invoice rule** in focused Cursor chats. Pointed AI to `.cursor/rules/prism-playwright.md` and existing `src/pages/` / `src/api/` paths so output follows Prism conventions. Used one task per chat (Caveman prompting) to limit token use.

### 2. How you use AI for requirement analysis

AI extracted AC1 (register/login/profile) and AC2 (catalog → cart → COD → double-confirm → My Invoices). Human validation confirmed API invoice payload fields and the UI confirm-twice business rule. Full analysis in `ai-prompts/requirements-and-planning.md`.

### 3. How you use AI for test planning and strategy

| Tier | @Smoke | @Regression |
|------|--------|-------------|
| UI | Register+login, profile, homepage, E2E checkout | Negative login, logout, catalog filter, cart quantity, invoice format |
| API | Login token, `/users/me`, create cart, get cart, E2E invoice | Invalid login 401, invalid token 401, add-item 404, invoice without cart_id 422 |
| Manual | TC_UI_001–004, TC_UI_007, TC_API_001–004, TC_API_008 | TC_UI_005–012, TC_API_005–007 |

### 4. How you use AI for manual test case design

Iterative prompts produced `FunctionalTestCase.csv` (**20 rows**: 12 UI + 8 API). Replaced generic AI cases with Toolshop-specific AC-mapped scenarios including profile, logout, invoice format, password boundaries, and API token/cart depth.

### 5. How you use AI for automation design

- **UI:** Page Objects in `PrismStructure/src/pages/` (Login, Register, Catalog, Checkout, Invoice, **Profile**)  
- **API:** Controllers in `src/api/` (Auth, Cart, Invoice)  
- **Config:** `config/testConfig.js` — credentials, product id, quantity, search keyword  
- **Utils:** `TestDataFactory.js` — dynamic registration users and invoice billing payloads  
- **Locators:** `data-test` attributes and `getByRole` (no raw XPath in specs)

### 6. How you validate and refine AI-generated test cases and scripts

Ran `npx playwright test --project=chromium` after each change. Rejected brittle XPath, `expect` inside POMs, single-click invoice confirm, and wrong API billing country codes. Six debugging cycles documented in `ai-prompts/automation-and-debugging.md`.

### 7. How you use AI for test data generation and API payloads

| Data | Source | Used for |
|------|--------|----------|
| Fixed login | `testConfig.credentials` | Checkout, catalog, API specs |
| Product id / quantity | `testConfig.product` | UI search, API payloads |
| Dynamic registration | `TestDataFactory.generateUserData()` | Auth register test |
| Invoice billing | TG/Hesselbury payload (assessment example) | API invoice POST |

Env overrides: `PLAYWRIGHT_USER_EMAIL`, `PLAYWRIGHT_PRODUCT_ID`, `PLAYWRIGHT_PRODUCT_QUANTITY`, etc.

### 8. How you use AI for debugging failing tests and interpreting logs

Fed Playwright traces, timeout logs, and terminal errors to Cursor. Key fixes: checkout step-3 Angular form validation, out-of-stock catalog fallback, My Invoices dropdown navigation, API billing country validation. See `automation-and-debugging.md`.

### 9. What information you avoid sharing unnecessarily with AI

No production credentials, API keys, or personal data. Only public Toolshop demo user and faker `@practice-qa.com` emails for registration tests.

### 10. How you would reuse this QA workflow in a real project

Requirements → risk matrix → manual CSV → `testConfig` layer → POM/API automation → smoke then regression → execution evidence → prompt audit in `ai-prompts/`. Token split: **~70% Auto** for docs/planning, **~30% Sonnet** for code and hard debugging. Summarize each chat into `ai-prompts/` before starting the next phase.

---

## Requirements & Risk Analysis (Toolshop)

### SUT URLs

- UI: https://practicesoftwaretesting.com/
- API: https://api.practicesoftwaretesting.com/
- API Docs: https://api.practicesoftwaretesting.com/api/documentation

### AC1 — User Registration, Authentication & Profile

- **UI:** Register with valid details, login, verify profile name in nav menu.
- **API:** `POST /users/login` → bearer token; validate 200 and `access_token`.

### AC2 — End-to-End Cart & COD Checkout

- **UI:** Browse catalog, adjust cart quantity, checkout with COD, **press Confirm twice** on summary, verify invoice under My Invoices.
- **API:** `POST /carts` → `GET /carts/{id}` → `POST /invoices` with COD billing payload → 201 + invoice `id`.

### Risk Mitigation Matrix

| Risk | Impact | Mitigation |
|------|--------|------------|
| Double-confirm invoice rule | High | `CheckoutPage.confirmInvoiceWithDoubleClick()` — two explicit clicks |
| Out-of-stock products | Medium | `CatalogPage` in-stock filter + search fallback keyword |
| Dynamic cart IDs (API) | Medium | Chain cart `id` from create → invoice payload |
| Session / email collision | Medium | Faker dynamic users for registration test |
| Angular form validation (checkout) | High | `fillAndTrigger()` + country-first billing fill |

### Engineering note (API)

Live API supports cart create and invoice with TG billing payload. `POST /carts/{id}/items` returned 404 during implementation; automated API tests validate login, cart lifecycle, and invoice flow per current API behaviour. Manual TC_API_004 documents the add-item intent.

---

## Manual Test Suite (`FunctionalTestCase.csv`)

| ID | Feature | Scenario | Type | Tags |
|----|---------|----------|------|------|
| TC_UI_001 | Registration | Valid registration | Positive | @Smoke |
| TC_UI_002 | Authentication | Valid login | Positive | @Smoke |
| TC_UI_003 | Authentication | Invalid password | Negative | @Smoke |
| TC_UI_004 | Catalog | Search and add to cart | Positive | @Smoke |
| TC_UI_005 | Checkout | COD + double-confirm | Positive | @Regression |
| TC_UI_006 | Invoice | Verify My Invoices | Positive | @Regression |
| TC_UI_007 | Profile | Profile shows name and email | Positive | @Smoke |
| TC_UI_008 | Authentication | Logout clears session | Positive | @Regression |
| TC_UI_009 | Invoice | Invoice number format INV-* | Positive | @Regression |
| TC_UI_010 | Registration | Password below minimum length | Negative | @Regression |
| TC_UI_011 | Registration | Password complexity rejected | Negative | @Regression |
| TC_UI_012 | Catalog | Invalid quantity rejected | Negative | @Regression |
| TC_API_001 | Auth | Login → bearer token | Positive | @Smoke |
| TC_API_002 | Auth | Invalid login → 401 | Negative | @Smoke |
| TC_API_003 | Cart | Create cart | Positive | @Smoke |
| TC_API_004 | Cart | Add item to cart (live 404) | Positive | @Smoke |
| TC_API_005 | Invoice | COD invoice + billing | Positive | @Regression |
| TC_API_006 | Invoice | Missing cart_id → 422 | Negative | @Regression |
| TC_API_007 | Auth | Invalid bearer token → 401 | Negative | @Regression |
| TC_API_008 | Cart | GET cart returns cart_items | Positive | @Smoke |

Full steps and expected results: `FunctionalTestCase.csv` in repo root.

---

## Automation Coverage

### UI specs (`PrismStructure/tests/ui/`)

| Spec | Tests | Tags |
|------|-------|------|
| `healthcheck.spec.js` | Homepage title | @smoke |
| `prism-auth.spec.js` | Register+login; profile; logout; negative login | @smoke, @regression |
| `prism-catalog.spec.js` | Search filter; cart quantity | @regression |
| `prism-checkout.spec.js` | E2E COD checkout + invoice format | @smoke @regression |

### API specs (`PrismStructure/tests/api/`)

| Spec | Tests | Tags |
|------|-------|------|
| `prism-api.spec.js` | Login token; `/users/me`; create cart; get cart; E2E invoice; 401 login; 401 token; add-item 404; 422 invoice | @smoke, @regression |

**Total automated:** **17 tests** (8 UI + 9 API) — all **Passed** locally; **16 passed + 1 skipped** on CI (registration skipped).

---

## Traceability Matrix (AC → Manual → Automated)

| AC | Manual Case | Automated Spec |
|----|-------------|----------------|
| AC1 UI Register+Login | TC_UI_001, TC_UI_002 | `prism-auth.spec.js` [@smoke] |
| AC1 UI Profile | TC_UI_007 | `prism-auth.spec.js` [@smoke] |
| AC1 UI Logout | TC_UI_008 | `prism-auth.spec.js` [@regression] |
| AC1 UI Invalid login | TC_UI_003 | `prism-auth.spec.js` [@regression] |
| AC2 UI Catalog+Cart | TC_UI_004, TC_UI_012 | `prism-catalog.spec.js`, `prism-checkout.spec.js` |
| AC2 UI COD + double-confirm | TC_UI_005 | `prism-checkout.spec.js` |
| AC2 UI My Invoices + format | TC_UI_006, TC_UI_009 | `prism-checkout.spec.js` |
| API Login/token | TC_API_001 | `prism-api.spec.js` [@smoke] |
| API Current user | TC_API_001 | `prism-api.spec.js` [@smoke] |
| API Invalid login | TC_API_002 | `prism-api.spec.js` [@regression] |
| API Create cart | TC_API_003 | `prism-api.spec.js` [@smoke] |
| API Get cart | TC_API_004, TC_API_008 | `prism-api.spec.js` [@smoke] |
| API Add item (404) | TC_API_004 | `prism-api.spec.js` [@regression] |
| API COD invoice | TC_API_005 | `prism-api.spec.js` [@smoke @regression] |
| API Bad invoice | TC_API_006 | `prism-api.spec.js` [@regression] |
| API Invalid token | TC_API_007 | `prism-api.spec.js` [@regression] |

---

## Architecture Flow

```text
tests/ui/*.spec.js          tests/api/*.spec.js
        │                           │
        ▼                           ▼
   src/pages/ (POM)            src/api/ (controllers)
        │                           │
        └───────────┬───────────────┘
                    ▼
         config/testConfig.js  ← credentials, product, API URL
                    │
         src/utils/TestDataFactory.js  ← dynamic users + billing
                    ▼
         PracticeSoftwareTesting (UI + API)
```

---

## How to Run Tests

All commands from **`PrismStructure/`** (where `playwright.config.js` lives):

```bash
cd PrismStructure
npm install
npx playwright install chromium

# Full suite
npx playwright test --project=chromium

# One spec at a time (examples)
npx playwright test tests/ui/prism-auth.spec.js --project=chromium
npx playwright test tests/ui/prism-checkout.spec.js --project=chromium
npx playwright test tests/api/prism-api.spec.js --project=chromium

# By tag
npx playwright test --grep @smoke --project=chromium
npx playwright test --grep @regression --project=chromium

# HTML report
npx playwright show-report reports/html-report
```

Full command list: `readme.md` in repo root.

---

## Execution Evidence

| Artifact | Location |
|----------|----------|
| HTML report (17 passed) | `PrismStructure/reports/html-report/index.html` (generated locally; not committed) |
| JSON results | `PrismStructure/reports/test-results/results.json` (generated locally) |
| Terminal log | `execution-evidence/terminal-execution.log` |
| Run summary | `execution-evidence/execution-summary.md` |
| Report screenshot | `execution-evidence/html-report-passing.png` |

**Last verified run:** 17 passed locally, 16 passed + 1 skipped on CI (registration skipped), chromium, from `PrismStructure/`.

> Reports are generated inside `PrismStructure/reports/` only. There is no `reports/` folder at the repo root.

---

## AI Prompt History (repo: `ai-prompts/`)

| File | Content |
|------|---------|
| `requirements-and-planning.md` | AC extraction, risk matrix, Phase 1 prompts |
| `test-design.md` | Manual CSV iterations, smoke/regression split |
| `test-data.md` | TestDataFactory, testConfig centralization |
| `automation-and-debugging.md` | 6 debugging cycles (checkout, catalog, invoice nav) |
| `documentation-and-summary.md` | README, project-info, implementation tracker |

Checkpoint logs (`Checkpoint1–7_Prompt_Log.md`) provide additional phase-by-phase audit detail.

**Highlight:** Double-confirm checkout debugging and API TG billing payload validation are the strongest evidence of iterative AI + human review.

---

## Repository Structure (submission layout)

```text
qa-ai-practical-assessment/
├── FunctionalTestCase.csv
├── project-info.md          ← this document
├── readme.md
├── execution-evidence/
├── ai-prompts/              ← full prompt history (5 required files)
├── .cursor/rules/
└── PrismStructure/          ← Playwright framework + reports
    ├── config/testConfig.js
    ├── playwright.config.js
    ├── src/pages/, src/api/, src/utils/
    ├── tests/ui/, tests/api/
    └── reports/             ← HTML + JSON (generated on test run)
```

---

## Cursor AI Token Strategy

| Work | Model | Rationale |
|------|-------|-----------|
| Requirements, CSV, docs, prompt logs | Auto / Composer 2.5 | Planning & writing; lower token cost |
| POMs, specs, config, debugging | Sonnet | Better JS/Playwright code quality |
| Quick readme edits | Auto | Small changes |

Rule: **one focused task per chat** → summarize to `ai-prompts/` → fresh chat for next phase.

---

## Git & Submission Checklist

- [x] Public GitHub repo pushed with iterative commit history  
- [x] Public Repo URL added above  
- [x] GitHub Actions CI on `master` (Playwright pass/fail + report artifacts; login stability fixes in PR #12+)
- [x] `readme.md` + `ai-prompts/` + `FunctionalTestCase.csv` in repo  
- [ ] This `project-info.md` exported to Google Doc for Part A submission  
- [ ] HTML report screenshot attached to GDoc or evidence folder (optional)
