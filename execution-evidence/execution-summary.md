# Execution Summary — QA AI Practical Assessment

**Assessment window:** August 5–9, 2026  
**Last local run:** August 9, 2026  
**Command:** `npx playwright test --project=chromium` (from `PrismStructure/`)  
**Browser:** chromium  

| Result | Count |
|--------|-------|
| **Passed** | 17 |
| **Failed** | 0 |
| **Skipped** | 0 (registration smoke runs locally; skipped on CI) |

**CI note:** Registration smoke uses `test.skip(CI)` — expect **16 passed, 1 skipped** on GitHub Actions.

| Suite | Spec | Tests | Status |
|-------|------|-------|--------|
| API | prism-api.spec.js | 9 | Passed |
| UI | healthcheck.spec.js | 1 | Passed |
| UI | prism-auth.spec.js | 4 | Passed |
| UI | prism-catalog.spec.js | 2 | Passed |
| UI | prism-checkout.spec.js | 1 | Passed |

**Reports:** `PrismStructure/reports/html-report/index.html`  
**JSON:** `PrismStructure/reports/test-results/results.json`  
**Screenshot:** `execution-evidence/html-report-passing.png` (capture after local green run)

_Open HTML report:_ `npx playwright show-report reports/html-report` (from `PrismStructure/`)

## Improvement coverage (review follow-up)

- Profile + logout UI specs; API `/users/me`, invalid token 401, add-item 404 documented
- Invoice `INV-*` assertion on UI and API
- Cart quantity assertion on checkout cart page
- Manual cases expanded to 20 rows; env/data strategy doc added
- Responsible AI rejection log (`ai-prompts/responsible-ai-rejections.md`)
