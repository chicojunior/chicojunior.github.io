# Favicon FV2 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current favicon with the approved FV2 terminal-style mark (`<FV>`) using the JS-inspired yellow/black palette.

**Architecture:** Keep the existing static integration model: one SVG asset referenced by `index.html` via `<link rel="icon">`. Validate behavior with the existing JavaScript acceptance test, extending it to assert the approved favicon visual signature. Apply TDD with a red-green cycle.

**Tech Stack:** Static HTML, SVG, Node.js acceptance test (`tests/site_acceptance.js`).

---

### Task 1: Define Approval Checks (TDD Red)

**Files:**
- Modify: `tests/site_acceptance.js`
- Test: `tests/site_acceptance.js`

- [ ] **Step 1: Add failing assertions for FV2 signature**

Add assertions that the favicon SVG contains:
- `"<FV>"`
- `"#F7DF1E"` (background)
- `"#1A1A1A"` (foreground)

Also assert the SVG no longer contains dark-mode inversion block (`prefers-color-scheme`) because the approved design uses one canonical palette.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/site_acceptance.js`
Expected: FAIL due to favicon content mismatch.

### Task 2: Implement FV2 SVG (Green)

**Files:**
- Modify: `assets/img/favicon-fv.svg`

- [ ] **Step 1: Replace SVG content with approved design**

Use a rounded yellow background and centered `<FV>` monogram using terminal-style font stack:
- `Fira Code`
- `JetBrains Mono`
- `IBM Plex Mono`
- `ui-monospace`
- `monospace`

- [ ] **Step 2: Keep icon simple for small sizes**

Avoid extra ornaments; ensure generous padding and strong contrast.

- [ ] **Step 3: Confirm integration path remains unchanged**

`index.html` should continue pointing to `assets/img/favicon-fv.svg`.

### Task 3: Verify and Finalize

**Files:**
- Verify: `tests/site_acceptance.js`
- Verify: `index.html`

- [ ] **Step 1: Run acceptance test**

Run: `node tests/site_acceptance.js`
Expected: PASS.

- [ ] **Step 2: Sanity check diff**

Run: `git diff -- assets/img/favicon-fv.svg tests/site_acceptance.js index.html`
Expected: Only intended favicon/test changes.

- [ ] **Step 3: Report outcome**

Summarize implementation, test evidence, and any residual manual check (browser cache refresh for favicon).
