# Execution Summary — QA AI Practical Assessment

**Run date:** August 8, 2026  
**Command:** `npm run test:evidence` (from `PrismStructure/`)  
**Browser:** chromium  
**Local result:** 12 passed, 0 failed  
**CI result (GitHub Actions `master`):** 11 passed, 1 skipped (registration smoke skipped on CI), 0 failed

| Suite | Spec | Tests | Status |
|-------|------|-------|--------|
| API | prism-api.spec.js | 6 | Passed |
| UI | healthcheck.spec.js | 1 | Passed |
| UI | prism-auth.spec.js | 2 | Passed |
| UI | prism-catalog.spec.js | 2 | Passed |
| UI | prism-checkout.spec.js | 1 | Passed |

**Reports:** `PrismStructure/reports/html-report/index.html` (12 passed — run from `PrismStructure/`)  
**JSON:** `PrismStructure/reports/test-results/results.json`  
**Terminal log:** `execution-evidence/terminal-execution.log`

_Open HTML report:_ `npx playwright show-report reports/html-report` (from `PrismStructure/`)
