# Environment and data strategy — Toolshop QA

**SUT:** PracticeSoftwareTesting Toolshop (live demo — no local mock).  
**Automation root:** `PrismStructure/` (always run Playwright from here).

---

## Environment matrix

| Dimension | Local dev | GitHub Actions CI | Override |
|-----------|-----------|-------------------|----------|
| UI base URL | `https://practicesoftwaretesting.com` | Same | `playwright.config.js` `baseURL` |
| API base URL | `https://api.practicesoftwaretesting.com` | Same | `PLAYWRIGHT_API_BASE_URL` |
| Browser | Chromium (`Desktop Chrome` project) | Same | `--project=chromium` |
| Workers | 2 (local default) | 1 | `playwright.config.js` CI block |
| Retries | 0 local | 1 on CI | `process.env.CI` |
| Registration smoke | Runs | **Skipped** (`test.skip(CI)`) | Flaky on shared runners |
| Reports | `PrismStructure/reports/html-report/` | Uploaded on failure | `playwright.config.js` |

---

## Data lifecycle

| Data type | Source | Lifecycle | Used by |
|-----------|--------|-----------|---------|
| Fixed login | `testConfig.credentials` | Stable demo user | Checkout, catalog, API, profile/logout |
| Product id | `testConfig.product.id` | Stable API id (Combination Pliers) | API probes, future add-item |
| Search keywords | `testConfig.product.searchKeyword` + fallback | In-stock fallback in `CatalogPage` | UI catalog/checkout |
| Quantities | `quantity`, `cartQuantity` in config | Per-test; no shared cart state | Catalog + checkout |
| Registration user | `TestDataFactory.generateUserData()` | **New faker user per run** | Register smoke (local only) |
| Invoice billing | `TestDataFactory.generateInvoiceBillingDetails()` | TG/Hesselbury per invoice POST | API invoice tests |
| Cart session | `POST /carts` per API test | Created and discarded per test | API suite |
| Bearer token | From `POST /users/login` | Per API test / invalid-token negatives | API suite |

---

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `PLAYWRIGHT_USER_EMAIL` | `customer@practicesoftwaretesting.com` | Login |
| `PLAYWRIGHT_USER_PASSWORD` | `welcome01` | Login |
| `PLAYWRIGHT_PRODUCT_ID` | Combination Pliers id | API product reference |
| `PLAYWRIGHT_SEARCH_KEYWORD` | `Pliers` | UI search |
| `PLAYWRIGHT_SEARCH_FALLBACK` | `Hammers` | Out-of-stock fallback |
| `PLAYWRIGHT_PRODUCT_QUANTITY` | `1` | Checkout default qty |
| `PLAYWRIGHT_CART_QUANTITY` | `2` | Cart regression qty |
| `PLAYWRIGHT_API_BASE_URL` | API host | API controllers |

---

## Secrets policy

- No production credentials in repo or prompts.
- Only public Toolshop demo user and faker `@practice-qa.com` emails for registration.

---

## CI vs local expectations

| Check | Local | CI |
|-------|-------|-----|
| Total automated tests | ~18–20 | Same minus registration skip |
| Live SUT dependency | Required | Required |
| HTML report | `npx playwright show-report` | Artifact on failure |

See `execution-evidence/execution-summary.md` for last run counts.
