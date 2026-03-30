#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function filePath(rel) {
  return path.join(root, rel);
}

function readText(rel) {
  return fs.readFileSync(filePath(rel), "utf8");
}

function assertFile(rel) {
  if (!fs.existsSync(filePath(rel))) {
    throw new Error(`Missing file: ${rel}`);
  }
}

function assertContains(content, expected, label) {
  if (!content.includes(expected)) {
    throw new Error(`Expected "${expected}" in ${label}`);
  }
}

function assertNotContains(content, unexpected, label) {
  if (content.includes(unexpected)) {
    throw new Error(`Did not expect "${unexpected}" in ${label}`);
  }
}

function run() {
  const indexRel = "index.html";
  const cssRel = "styles/main.css";
  const jsRel = "scripts/main.js";
  const avatarRel = "assets/img/chibi-avatar.jpg";

  assertFile(indexRel);
  assertFile(cssRel);
  assertFile(jsRel);
  assertFile(avatarRel);

  const index = readText(indexRel);
  const css = readText(cssRel);
  const js = readText(jsRel);

  [
    'href="styles/main.css"',
    'src="scripts/main.js"',
    'id="lang-toggle"',
    'id="theme-toggle"',
    'href="https://linkedin.com/in/franciscovale"',
    'href="https://github.com/chicojunior"',
    'href="old/CV-Current.pdf"',
    'target="_blank"',
    'src="assets/img/chibi-avatar.jpg"',
    'class="hero-card panel"',
    'class="link-btn primary"',
    'data-i18n="ctaContact"',
    'data-i18n="about"',
    'data-i18n="impactTitle"',
    'data-i18n="impactItem1"',
    'data-i18n="impactItem2"',
    'data-i18n="impactItem3"',
    'data-i18n="recruiterTitle"',
    'data-i18n="recruiterSummary"',
    'data-i18n="stackFrontendTitle"',
    'data-i18n="stackBackendTitle"',
    'data-i18n="stackToolsTitle"',
    "stack-chip",
  ].forEach((expected) => assertContains(index, expected, indexRel));

  assertNotContains(index, "<style>", indexRel);
  assertNotContains(index, "<script>", indexRel);

  [
    "--bg: #f4f6fb;",
    '[data-theme="dark"]',
    "--bg: #000000;",
    "border-radius: 50%",
    "object-position: center center;",
  ].forEach((expected) => assertContains(css, expected, cssRel));

  [
    "const translations",
    "localStorage",
    "preferred-theme",
    'applyTheme(getStored("preferred-theme") || "light")',
    "impactTitle",
    "recruiterSummary",
    "strong mid-level / early senior",
  ].forEach((expected) => assertContains(js, expected, jsRel));

  console.log("site_acceptance: PASS");
}

try {
  run();
} catch (error) {
  console.error("site_acceptance: FAIL");
  console.error(error.message);
  process.exit(1);
}
