# chicojunior.github.io

Custom static site and blog published to GitHub Pages.

## Stack

- Node.js 20+
- custom build scripts in `scripts/`
- generated static output in `dist/`
- acceptance checks in `tests/site_acceptance.js`

## Main commands

Install dependencies:

```bash
npm install
```

Build the site:

```bash
npm run build
```

Run acceptance checks:

```bash
npm test
```

## Layout

- `content/blog/`: source blog posts
- `scripts/build-blog.js`: blog generation step
- `scripts/build-site.js`: static site assembly
- `styles/`: site styling
- `docs/codacy-integration.md`: current Codacy notes
- `docs/superpowers/`: spec and plan artifacts for larger changes

## AI / SSD workflow

This repo is one of the workspace pilot repos for spec-driven delivery.

- `docs/superpowers/specs/`: approved designs
- `docs/superpowers/plans/`: implementation plans

Use that workflow for:

- new sections or information architecture changes
- build-pipeline adjustments
- non-trivial visual or content-system changes
- CI, Pages, or Codacy-related automation changes
