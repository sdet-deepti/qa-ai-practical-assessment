---
description: Prism Framework Standards for Playwright UI & API Automation
globs: **/*.js, **/*.ts
---
# Prism Playwright Engineering Rules

1. **Page Object Model (POM):**
   - Place all Page Objects in `PrismStructure/src/pages/`.
   - Never hardcode element locators inside spec files (`tests/ui/`).
   - Use user-facing locators (`getByRole`, `getByTestId`, `getByLabel`, `getByText`) over fragile XPaths or CSS chains.

2. **API Controllers:**
   - Place API controllers in `PrismStructure/src/api/`.
   - Re-use Playwright's native `request` context for API calls.
   - Separate payload construction into `PrismStructure/src/utils/`.

3. **Handling Async State & Unique SUT Behaviors:**
   - Handle the Toolshop double-confirm invoice generation logic cleanly using explicit click routines and state assertions.
   - Always await assertions (`await expect(locator).toBeVisible()`).

4. **Tagging & Execution:**
   - Annotate all test descriptions with `@smoke` or `@regression`.