#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const contentDir = path.join(root, "content", "blog");
const outputDir = path.join(root, "scripts", "generated");
const outputFile = path.join(outputDir, "blog-posts.js");
const supportedLocales = new Set(["pt-BR", "en-US"]);

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function stripQuotes(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function parseArray(value) {
  const inner = value.slice(1, -1).trim();
  if (!inner) {
    return [];
  }
  return inner
    .split(",")
    .map((item) => stripQuotes(item.trim()))
    .filter(Boolean);
}

function parseValue(value) {
  if (value.startsWith("[") && value.endsWith("]")) {
    return parseArray(value);
  }
  return stripQuotes(value);
}

function parseFrontmatter(filePath, raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`Missing or invalid frontmatter in ${filePath}`);
  }

  const data = {};
  match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const separator = line.indexOf(":");
      if (separator === -1) {
        return;
      }
      const key = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim();
      data[key] = parseValue(value);
    });

  return { data, body: match[2].trim() };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInline(text) {
  let output = escapeHtml(text);
  output = output.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  output = output.replace(/`([^`]+)`/g, "<code>$1</code>");
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return output;
}

function closeList(html, state) {
  if (!state.listType) {
    return;
  }
  html.push(state.listType === "ol" ? "</ol>" : "</ul>");
  state.listType = null;
}

function flushParagraph(html, buffer) {
  if (!buffer.length) {
    return;
  }
  html.push(`<p>${renderInline(buffer.join(" "))}</p>`);
  buffer.length = 0;
}

function renderMarkdown(markdown) {
  const lines = markdown.split("\n");
  const html = [];
  const paragraph = [];
  const state = { listType: null, inCode: false, codeLines: [] };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      flushParagraph(html, paragraph);
      closeList(html, state);
      if (state.inCode) {
        html.push(`<pre><code>${escapeHtml(state.codeLines.join("\n"))}</code></pre>`);
        state.inCode = false;
        state.codeLines = [];
      } else {
        state.inCode = true;
      }
      return;
    }

    if (state.inCode) {
      state.codeLines.push(line);
      return;
    }

    if (!trimmed) {
      flushParagraph(html, paragraph);
      closeList(html, state);
      return;
    }

    const heading = trimmed.match(/^(#{2,6})\s+(.*)$/);
    if (heading) {
      flushParagraph(html, paragraph);
      closeList(html, state);
      html.push(`<h${heading[1].length}>${renderInline(heading[2])}</h${heading[1].length}>`);
      return;
    }

    const unordered = trimmed.match(/^[-*]\s+(.*)$/);
    if (unordered) {
      flushParagraph(html, paragraph);
      if (state.listType !== "ul") {
        closeList(html, state);
        state.listType = "ul";
        html.push("<ul>");
      }
      html.push(`<li>${renderInline(unordered[1])}</li>`);
      return;
    }

    const ordered = trimmed.match(/^\d+\.\s+(.*)$/);
    if (ordered) {
      flushParagraph(html, paragraph);
      if (state.listType !== "ol") {
        closeList(html, state);
        state.listType = "ol";
        html.push("<ol>");
      }
      html.push(`<li>${renderInline(ordered[1])}</li>`);
      return;
    }

    closeList(html, state);
    paragraph.push(trimmed);
  });

  flushParagraph(html, paragraph);
  closeList(html, state);

  if (state.inCode) {
    html.push(`<pre><code>${escapeHtml(state.codeLines.join("\n"))}</code></pre>`);
  }

  return html.join("\n");
}

function computeReadingTime(markdown) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`\-]/g, " ")
    .replace(/\[[^\]]+\]\(([^)]+)\)/g, " $1 ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function loadPosts() {
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const files = fs
    .readdirSync(contentDir)
    .filter((fileName) => fileName.endsWith(".md"))
    .sort();

  const posts = new Map();

  files.forEach((fileName) => {
    const absolutePath = path.join(contentDir, fileName);
    const raw = fs.readFileSync(absolutePath, "utf8");
    const { data, body } = parseFrontmatter(absolutePath, raw);

    ["slug", "locale", "title", "description", "date", "tags"].forEach((field) => {
      if (!data[field]) {
        throw new Error(`Missing ${field} in ${absolutePath}`);
      }
    });

    if (!supportedLocales.has(data.locale)) {
      throw new Error(`Unsupported locale ${data.locale} in ${absolutePath}`);
    }

    const key = `${data.date}::${data.slug}`;
    const existing = posts.get(key) || {
      slug: data.slug,
      date: data.date,
      tags: Array.isArray(data.tags) ? data.tags : [],
      sourceNewsletter: data.source_newsletter || "",
      locales: {}
    };

    existing.locales[data.locale] = {
      id: data.id || `${data.date}-${data.slug}-${data.locale}`,
      title: data.title,
      description: data.description,
      html: renderMarkdown(body),
      readingTimeMinutes: computeReadingTime(body)
    };
    posts.set(key, existing);
  });

  return Array.from(posts.values()).sort((left, right) => {
    if (left.date === right.date) {
      return left.slug.localeCompare(right.slug);
    }
    return right.date.localeCompare(left.date);
  });
}

function writeOutput(posts) {
  ensureDir(outputDir);
  const content = `window.__BLOG_POSTS__ = ${JSON.stringify(posts, null, 2)};\n`;
  fs.writeFileSync(outputFile, content, "utf8");
}

function main() {
  const posts = loadPosts();
  writeOutput(posts);
  console.log(`build-blog: wrote ${posts.length} posts to ${path.relative(root, outputFile)}`);
}

try {
  main();
} catch (error) {
  console.error("build-blog: FAIL");
  console.error(error.message);
  process.exit(1);
}