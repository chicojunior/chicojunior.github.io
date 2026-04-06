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
  const blogIndexRel = "blog/index.html";
  const blogPostRel = "blog/post/index.html";
  const indexRel = "index.html";
  const cssRel = "styles/main.css";
  const jsRel = "scripts/main.js";
  const buildBlogRel = "scripts/build-blog.js";
  const generatedBlogRel = "scripts/generated/blog-posts.js";
  const postPtRel = "content/blog/2026-04-06-from-vibe-coding-to-spec-driven-engineering.pt-BR.md";
  const postEnRel = "content/blog/2026-04-06-from-vibe-coding-to-spec-driven-engineering.en-US.md";
  const avatarRel = "assets/img/chibi-avatar.jpg";
  const faviconRel = "assets/img/favicon-fv.svg";

  assertFile(blogIndexRel);
  assertFile(blogPostRel);
  assertFile(indexRel);
  assertFile(cssRel);
  assertFile(jsRel);
  assertFile(buildBlogRel);
  assertFile(generatedBlogRel);
  assertFile(postPtRel);
  assertFile(postEnRel);
  assertFile(avatarRel);
  assertFile(faviconRel);

  const blogIndex = readText(blogIndexRel);
  const blogPost = readText(blogPostRel);
  const index = readText(indexRel);
  const css = readText(cssRel);
  const js = readText(jsRel);
  const buildBlog = readText(buildBlogRel);
  const generatedBlog = readText(generatedBlogRel);
  const favicon = readText(faviconRel);

  [
    'href="styles/main.css"',
    '<link rel="icon" type="image/svg+xml" href="assets/img/favicon-fv.svg"',
    'href="blog/index.html"',
    'src="scripts/main.js"',
    'src="scripts/generated/blog-posts.js"',
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
    'data-i18n="blogTitle"',
    'data-blog-preview',
    "stack-chip",
  ].forEach((expected) => assertContains(index, expected, indexRel));

  [
    'data-blog-list',
    'src="../scripts/generated/blog-posts.js"',
    'data-i18n="blogAllTitle"',
  ].forEach((expected) => assertContains(blogIndex, expected, blogIndexRel));

  [
    'data-blog-post',
    'src="../../scripts/generated/blog-posts.js"',
    'data-i18n="blogBackToList"',
  ].forEach((expected) => assertContains(blogPost, expected, blogPostRel));

  assertNotContains(index, "<style>", indexRel);
  assertNotContains(index, "<script>", indexRel);
  assertNotContains(index, "blowfish", indexRel);

  [
    "--bg: #f4f6fb;",
    '[data-theme="dark"]',
    "--bg: #000000;",
    "border-radius: 50%",
    "object-position: center center;",
    ".blog-grid",
    ".blog-body",
  ].forEach((expected) => assertContains(css, expected, cssRel));

  [
    "const translations",
    '"en-US"',
    '"pt-BR"',
    "const DEFAULT_THEME = \"light\";",
    "localStorage",
    "window.__BLOG_POSTS__",
    "renderBlogPreview",
    "renderBlogPost",
    "preferred-theme",
    'applyTheme(getStored("preferred-theme") || DEFAULT_THEME)',
    "impactTitle",
    "recruiterSummary",
    "strong mid-level / early senior",
  ].forEach((expected) => assertContains(js, expected, jsRel));

  [
    'path.join(root, "content", "blog")',
    'path.join(root, "scripts", "generated")',
    'path.join(outputDir, "blog-posts.js")',
    "renderMarkdown",
  ].forEach((expected) => assertContains(buildBlog, expected, buildBlogRel));

  [
    "window.__BLOG_POSTS__",
    "from-vibe-coding-to-spec-driven-engineering",
    '"pt-BR"',
    '"en-US"',
  ].forEach((expected) => assertContains(generatedBlog, expected, generatedBlogRel));

  [
    "&lt;FV&gt;",
    "#F7DF1E",
    "#1A1A1A",
    "Fira Code",
    "JetBrains Mono",
    "IBM Plex Mono",
  ].forEach((expected) => assertContains(favicon, expected, faviconRel));

  assertNotContains(favicon, "prefers-color-scheme", faviconRel);

  console.log("site_acceptance: PASS");
}

try {
  run();
} catch (error) {
  console.error("site_acceptance: FAIL");
  console.error(error.message);
  process.exit(1);
}
