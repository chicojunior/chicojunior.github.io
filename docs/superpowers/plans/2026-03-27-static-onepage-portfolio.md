# Static One-Page Portfolio Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Hugo runtime usage with a single static `index.html` portfolio page (EN default, PT toggle), keeping the site extremely simple.

**Architecture:** Build one standalone HTML file with inline CSS/JS, backed by a tiny translation object (`en`/`pt`) and `localStorage` persistence. Keep existing image/CV assets and link them directly. Use shell-based acceptance checks as the test harness.

**Tech Stack:** HTML, CSS, Vanilla JavaScript, POSIX shell tests (`bash`, `grep`)

---

## Chunk 1: Static Migration

### Task 1: Create failing acceptance checks (TDD RED)

**Files:**
- Create: `tests/site_acceptance.sh`
- Test: `tests/site_acceptance.sh`

- [ ] **Step 1: Write failing test script**

```bash
#!/usr/bin/env bash
set -euo pipefail

FILE="index.html"
test -f "$FILE"
grep -q 'id="lang-toggle"' "$FILE"
grep -q 'const translations' "$FILE"
grep -q 'localStorage' "$FILE"
grep -q 'href="https://linkedin.com/in/franciscovale"' "$FILE"
grep -q 'href="https://github.com/chicojunior"' "$FILE"
grep -q 'href="old/CV-Current.pdf"' "$FILE"
grep -q 'target="_blank"' "$FILE"
grep -q 'data-i18n="about"' "$FILE"
grep -q 'data-i18n="stackFrontendTitle"' "$FILE"
grep -q 'data-i18n="stackBackendTitle"' "$FILE"
grep -q 'data-i18n="stackToolsTitle"' "$FILE"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bash tests/site_acceptance.sh`  
Expected: FAIL because `index.html` does not exist yet.

- [ ] **Step 3: Commit test harness**

```bash
git add tests/site_acceptance.sh
git commit -m "test: add static portfolio acceptance checks"
```

### Task 2: Implement static one-page portfolio (TDD GREEN)

**Files:**
- Create: `index.html`
- Modify: `tests/site_acceptance.sh` (optional chmod only)
- Test: `tests/site_acceptance.sh`

- [ ] **Step 1: Write minimal implementation**

Create `index.html` with:
- semantic layout (`header`, `main`, `section`, `footer`)
- top bar with `EN | PT` toggle (`id="lang-toggle"`)
- hero (avatar, name, headline)
- action links: LinkedIn, GitHub, CV (`target="_blank"` for CV)
- about section
- stack section with categories Frontend / Backend / Tools
- `translations` object for `en` + `pt`
- language switch + `localStorage` persistence
- `document.documentElement.lang` updates
- basic SEO tags (`title`, `description`, OG tags)

- [ ] **Step 2: Run acceptance test**

Run: `bash tests/site_acceptance.sh`  
Expected: PASS.

- [ ] **Step 3: Manual smoke verification**

Run:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173` and verify:
- EN renders by default
- Toggle changes content to PT and back
- Refresh keeps selected language
- LinkedIn/GitHub/CV links work
- Layout remains clear on mobile viewport

- [ ] **Step 4: Commit implementation**

```bash
git add index.html
git commit -m "feat: add static one-page bilingual portfolio"
```

### Task 3: Remove active Hugo dependency entrypoints

**Files:**
- Delete: `hugo.toml`
- Delete: `config/_default/config.toml`
- Delete: `config/_default/languages.en.toml`
- Delete: `config/_default/markup.toml`
- Delete: `config/_default/menus.en.toml`
- Delete: `config/_default/module.toml`
- Delete: `config/_default/params.toml`
- Modify: `.gitignore`
- Test: `bash tests/site_acceptance.sh`

- [ ] **Step 1: Remove Hugo config files**

Delete Hugo configuration files so the repository's active site path is unambiguously static HTML.

- [ ] **Step 2: Ignore brainstorming runtime artifacts**

Append to `.gitignore`:

```gitignore
.superpowers/
```

- [ ] **Step 3: Re-run acceptance test**

Run: `bash tests/site_acceptance.sh`  
Expected: PASS.

- [ ] **Step 4: Commit cleanup**

```bash
git add .gitignore tests/site_acceptance.sh index.html
git rm -r hugo.toml config/_default
git commit -m "chore: remove hugo configs and ignore brainstorm artifacts"
```

### Task 4: Final verification and change summary

**Files:**
- Test: `tests/site_acceptance.sh`

- [ ] **Step 1: Run acceptance checks**

Run: `bash tests/site_acceptance.sh`  
Expected: PASS.

- [ ] **Step 2: Confirm repo status and commits**

Run:

```bash
git status --short
git log --oneline -n 5
```

- [ ] **Step 3: Prepare concise handoff**

Include:
- what was changed
- verification evidence
- any follow-up suggestions
