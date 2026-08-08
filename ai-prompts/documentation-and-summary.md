# AI Prompts – Documentation and Summary

Prompts for README, project-info, execution evidence, and submission packaging.  
**Implemented artifacts:** `readme.md`, `project-info.md`, `execution-evidence/`, `cursor-implementation.md`.

---

## Entry 1 — README and npx run commands

- **Prompt:** Document Playwright setup and `npx playwright test` for full suite and per-spec runs.
- **AI Response Summary:** Basic setup + npm script shortcuts.
- **Edits You Made:** Full per-spec command list, config/data architecture table, reports section clarifying `PrismStructure/reports/` only, warning to always `cd PrismStructure`.
- **Reason for Edits:** Assessment expects runnable suite from README; prevent wrong report path when run from repo root.

---



## Entry 2 — project-info.md (Part A submission doc)

- **Prompt:** Answer all 10 AI workflow questions, traceability matrix, execution status for GDoc export.
- **AI Response Summary:** Generic workflow bullets without Toolshop depth.
- **Edits You Made:** Full GDoc-ready structure: AC/risk, manual table, automation coverage, architecture, run commands, evidence paths, prompt index, token strategy, repo layout, git checklist.
- **Reason for Edits:** Part A = 30% of assessment; single self-contained doc for Google Doc conversion.

---



## Entry 3 — Implementation gap tracker

- **Prompt:** Compare repo against official QA Practical Assessment deliverable checklist.
- **AI Response Summary:** High-level missing items list.
- **Edits You Made:** `cursor-implementation.md` with phase checkboxes, Definition of Done, file status at a glance.
- **Reason for Edits:** Living tracker separate from submission doc; updated as phases completed.

---



## Entry 4 — Execution evidence packaging

- **Prompt:** Capture terminal log and execution summary for 100% pass submission evidence.
- **AI Response Summary:** `tee` log redirection and HTML report path.
- **Edits You Made:** `scripts/run-with-log.js`, `execution-evidence/terminal-execution.log`, `execution-evidence/execution-summary.md` (12-test breakdown by spec).
- **Reason for Edits:** Assessment requires execution evidence; summary table easier for evaluators than raw log alone.

---



## Submission map (repo vs GDoc)


| Deliverable     | Repo path                   | GDoc                 |
| --------------- | --------------------------- | -------------------- |
| Part A workflow | `project-info.md`           | Export to Google Doc |
| Setup / run     | `readme.md`                 | Link in GDoc         |
| Prompt history  | `ai-prompts/` (this folder) | Link or appendix     |
| Manual cases    | `FunctionalTestCase.csv`    | Paste table in GDoc  |
| Code + tests    | `PrismStructure/`           | Public Git URL       |
| Evidence        | `execution-evidence/`       | Summary + screenshot |


