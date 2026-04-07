#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const buildRoot = process.argv[2]
  ? path.resolve(root, process.argv[2])
  : path.join(root, "dist");

function sourceFilePath(rel) {
  return path.join(root, rel);
}

function buildFilePath(rel) {
  return path.join(buildRoot, rel);
}

function assertFile(rel) {
  if (!fs.existsSync(buildFilePath(rel))) {
    throw new Error(`Missing file: ${rel}`);
  }
}

function assertMissing(rel) {
  if (fs.existsSync(buildFilePath(rel))) {
    throw new Error(`Did not expect file in build artifact: ${rel}`);
  }
}

function readBuiltText(rel) {
  return fs.readFileSync(buildFilePath(rel), "utf8");
}

function assertMinified(rel) {
  const sourceSize = fs.statSync(sourceFilePath(rel)).size;
  const builtSize = fs.statSync(buildFilePath(rel)).size;
  if (builtSize >= sourceSize) {
    throw new Error(`Expected ${rel} to be smaller in build artifact (${builtSize} >= ${sourceSize})`);
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

function assertMatches(content, pattern, label) {
  pattern.lastIndex = 0;
  if (!pattern.test(content)) {
    throw new Error(`Expected pattern ${pattern} in ${label}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function createNode(attributes = {}) {
  return {
    attributes: { ...attributes },
    innerHTML: "",
    textContent: "",
    addEventListener() { },
    getAttribute(name) {
      return this.attributes[name] || null;
    },
    setAttribute(name, value) {
      this.attributes[name] = String(value);
    },
  };
}

function evaluateBlogData(scriptSource) {
  const sandbox = { window: {} };
  vm.runInNewContext(scriptSource, sandbox, { filename: "scripts/generated/blog-posts.js" });
  return sandbox.window.__BLOG_POSTS__;
}

function runMainScript(scriptSource, posts) {
  const langToggle = createNode();
  const themeToggle = createNode();
  const preview = createNode();
  const list = createNode();
  const post = createNode();
  const i18nNodes = [
    createNode({ "data-i18n": "blogTitle" }),
    createNode({ "data-i18n": "blogAllTitle" }),
    createNode({ "data-i18n": "blogBackToList" }),
  ];
  const documentElement = createNode();
  documentElement.lang = "en-US";

  const document = {
    documentElement,
    title: "",
    getElementById(id) {
      if (id === "lang-toggle") {
        return langToggle;
      }
      if (id === "theme-toggle") {
        return themeToggle;
      }
      return null;
    },
    querySelector(selector) {
      if (selector === "[data-blog-preview]") {
        return preview;
      }
      if (selector === "[data-blog-list]") {
        return list;
      }
      if (selector === "[data-blog-post]") {
        return post;
      }
      return null;
    },
    querySelectorAll(selector) {
      if (selector === "[data-i18n]") {
        return i18nNodes;
      }
      return [];
    },
  };

  const storage = {};
  const sandbox = {
    URLSearchParams,
    console,
    Date,
    Intl,
    document,
    localStorage: {
      getItem(key) {
        return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null;
      },
      setItem(key, value) {
        storage[key] = String(value);
      },
    },
    window: {
      __BLOG_POSTS__: posts,
      location: {
        search: `?slug=${encodeURIComponent(posts[0].slug)}`,
      },
    },
  };

  vm.runInNewContext(scriptSource, sandbox, { filename: "scripts/main.js" });

  assert(document.documentElement.lang === "en-US", "Expected main.js to apply the default locale");
  assert(themeToggle.textContent === "Dark", "Expected theme toggle label to reflect the next available theme");
  assert(themeToggle.getAttribute("aria-label") === "Dark. Toggle color theme", "Expected theme toggle accessible name to include the visible label");
  assert(themeToggle.getAttribute("aria-pressed") === "false", "Expected theme toggle to expose the current pressed state");
  assert(langToggle.textContent === "PT", "Expected language toggle label to reflect the alternate locale");
  assert(langToggle.getAttribute("aria-label") === "PT. Toggle language", "Expected language toggle accessible name to include the visible label");
  assert(preview.innerHTML.includes("blog/post/index.html?slug="), "Expected preview cards to be rendered");
  assert(list.innerHTML.includes("post/index.html?slug="), "Expected blog index cards to be rendered");
  assert(post.innerHTML.includes(posts[0].locales["en-US"].title), "Expected article page to render the selected post");
}

function run() {
  const blogIndexRel = "blog/index.html";
  const blogPostRel = "blog/post/index.html";
  const indexRel = "index.html";
  const cssRel = "styles/main.css";
  const jsRel = "scripts/main.js";
  const buildBlogRel = "scripts/build-blog.js";
  const generatedBlogRel = "scripts/generated/blog-posts.js";
  const avatarRel = "assets/img/chibi-avatar.jpg";
  const faviconRel = "assets/img/favicon-fv.svg";
  const oldCvRel = "old/CV-Current.pdf";
  const oldIndexRel = "old/index.html";

  assertFile(blogIndexRel);
  assertFile(blogPostRel);
  assertFile(indexRel);
  assertFile(cssRel);
  assertFile(jsRel);
  assertFile(generatedBlogRel);
  assertFile(avatarRel);
  assertFile(faviconRel);
  assertFile(oldCvRel);
  assertFile(oldIndexRel);

  assertMissing(buildBlogRel);
  assertMissing("tests/site_acceptance.js");
  assertMissing("content/blog/2026-04-06-from-vibe-coding-to-spec-driven-engineering.pt-BR.md");

  [
    indexRel,
    blogIndexRel,
    blogPostRel,
    cssRel,
    jsRel,
    generatedBlogRel,
  ].forEach(assertMinified);

  const blogIndex = readBuiltText(blogIndexRel);
  const blogPost = readBuiltText(blogPostRel);
  const index = readBuiltText(indexRel);
  const css = readBuiltText(cssRel);
  const js = readBuiltText(jsRel);
  const generatedBlog = readBuiltText(generatedBlogRel);
  const favicon = readBuiltText(faviconRel);

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
    "--bg:#f4f6fb",
    "--bg:#000000",
    "object-position:center center",
    ".blog-grid",
    ".blog-body",
  ].forEach((expected) => assertContains(css, expected, cssRel));
  assertMatches(css, /border-radius:\s*50%/, cssRel);
  assertMatches(css, /\[data-theme=(?:["']?dark["']?)\]/, cssRel);

  [
    '"en-US"',
    '"pt-BR"',
    "localStorage",
    "preferred-theme",
    "preferred-language",
    "recruiterSummary",
    "strong mid-level / early senior",
  ].forEach((expected) => assertContains(js, expected, jsRel));

  [
    "window.__BLOG_POSTS__",
    "from-vibe-coding-to-spec-driven-engineering",
    "intentional-engineering-needs-explicit-decision-frameworks",
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

  const posts = evaluateBlogData(generatedBlog);
  assert(Array.isArray(posts), "Expected generated blog data to expose an array of posts");
  assert(posts.length >= 3, "Expected at least three posts in generated blog data");
  assert(
    posts.some((post) =>
      post.locales
      && post.locales["en-US"]
      && post.locales["en-US"].description === "In an environment shaped by AI, legacy systems, and cross-functional delivery, engineering consistency depends less on individual heroics and more on clear models for deciding, reviewing, and validating work."
    ),
    "Expected generated blog data to preserve the key article description"
  );
  runMainScript(js, posts);

  console.log("site_acceptance: PASS");
}

try {
  run();
} catch (error) {
  console.error("site_acceptance: FAIL");
  console.error(error.message);
  process.exit(1);
}
