#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { minify: minifyHtml } = require("html-minifier-terser");
const { minify: minifyJs } = require("terser");
const CleanCSS = require("clean-css");

const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");

const publicFiles = ["CNAME", "index.html"];
const publicDirs = ["assets", "blog", "old"];
const publicScriptFiles = ["scripts/main.js", "scripts/generated/blog-posts.js"];
const publicStyleFiles = ["styles/main.css"];

const htmlOptions = {
  collapseWhitespace: true,
  conservativeCollapse: true,
  continueOnParseError: false,
  keepClosingSlash: true,
  minifyCSS: {
    level: 1,
    rebase: false,
  },
  minifyJS: {
    compress: {
      passes: 2,
    },
    format: {
      ascii_only: true,
      comments: false,
    },
    mangle: false,
  },
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
};

const cssOptions = {
  level: 2,
  rebase: false,
};

const jsOptions = {
  compress: {
    passes: 2,
  },
  format: {
    ascii_only: true,
    comments: false,
  },
  mangle: false,
};

function rootPath(relativePath) {
  return path.join(root, relativePath);
}

function distPath(relativePath) {
  return path.join(distDir, relativePath);
}

function toRelative(targetPath) {
  return path.relative(distDir, targetPath).split(path.sep).join("/");
}

async function ensureParent(targetPath) {
  await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
}

async function copyFile(relativePath) {
  const sourcePath = rootPath(relativePath);
  if (!fs.existsSync(sourcePath)) {
    return;
  }
  const targetPath = distPath(relativePath);
  await ensureParent(targetPath);
  await fs.promises.copyFile(sourcePath, targetPath);
}

async function copyDir(relativePath) {
  const sourcePath = rootPath(relativePath);
  if (!fs.existsSync(sourcePath)) {
    return;
  }
  await fs.promises.cp(sourcePath, distPath(relativePath), { recursive: true });
}

async function listFiles(dirPath) {
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(entryPath)));
      continue;
    }
    files.push(entryPath);
  }

  return files;
}

function reportWrite(relativePath, originalSize, nextSize) {
  console.log(`build-site: ${relativePath} ${originalSize}B -> ${nextSize}B`);
}

function pickSmallerOutput(source, candidate) {
  return Buffer.byteLength(candidate) < Buffer.byteLength(source) ? candidate : source;
}

async function minifyHtmlFile(filePath) {
  const source = await fs.promises.readFile(filePath, "utf8");
  const output = await minifyHtml(source, htmlOptions);
  const next = pickSmallerOutput(source, output);
  await fs.promises.writeFile(filePath, next, "utf8");
  reportWrite(toRelative(filePath), Buffer.byteLength(source), Buffer.byteLength(next));
}

async function minifyCssFile(filePath) {
  const source = await fs.promises.readFile(filePath, "utf8");
  const output = new CleanCSS(cssOptions).minify(source);
  if (output.errors.length) {
    throw new Error(`CSS minification failed for ${toRelative(filePath)}: ${output.errors.join("; ")}`);
  }
  const next = pickSmallerOutput(source, output.styles);
  await fs.promises.writeFile(filePath, next, "utf8");
  reportWrite(toRelative(filePath), Buffer.byteLength(source), Buffer.byteLength(next));
}

async function minifyJsFile(filePath) {
  const source = await fs.promises.readFile(filePath, "utf8");
  const output = await minifyJs(source, jsOptions);
  if (!output.code) {
    throw new Error(`JS minification returned no output for ${toRelative(filePath)}`);
  }
  const next = pickSmallerOutput(source, output.code);
  await fs.promises.writeFile(filePath, next, "utf8");
  reportWrite(toRelative(filePath), Buffer.byteLength(source), Buffer.byteLength(next));
}

async function build() {
  await fs.promises.rm(distDir, { force: true, recursive: true });
  await fs.promises.mkdir(distDir, { recursive: true });

  for (const relativePath of publicFiles) {
    await copyFile(relativePath);
  }

  for (const relativePath of publicDirs) {
    await copyDir(relativePath);
  }

  for (const relativePath of publicScriptFiles) {
    await copyFile(relativePath);
  }

  for (const relativePath of publicStyleFiles) {
    await copyFile(relativePath);
  }

  const files = await listFiles(distDir);

  for (const filePath of files) {
    const extension = path.extname(filePath).toLowerCase();
    if (extension === ".html") {
      await minifyHtmlFile(filePath);
      continue;
    }
    if (extension === ".css") {
      await minifyCssFile(filePath);
      continue;
    }
    if (extension === ".js") {
      await minifyJsFile(filePath);
    }
  }
}

build().catch((error) => {
  console.error("build-site: FAIL");
  console.error(error.message);
  process.exit(1);
});
