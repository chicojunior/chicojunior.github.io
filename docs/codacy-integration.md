# Codacy integration

The Codacy webhook/integration is already connected for this repository. The repository-side setup is ready with `.codacy.yaml` and `.github/workflows/ci.yaml`.

## What is configured in the repository

- Codacy analysis exclusions for generated and legacy content:
  - `dist/**`
  - `old/**`
  - `scripts/generated/**`
- CI validation for `pull_request` and pushes to `main` / `master`
- Existing build and test commands:
  - `npm run build`
  - `npm test`

## Remaining checks in Codacy

1. Confirm the repository is imported and the default branch matches the repository default branch.
2. Enable pull request analysis, annotations, and status checks if they are not already active.
3. If desired, require the Codacy quality check before merge in the repository branch protection rules.

## Coverage

This repository currently runs acceptance checks with `node tests/site_acceptance.js` and does not publish LCOV coverage reports.

If coverage is later required in Codacy, add a coverage tool that generates LCOV and then wire that report into the Codacy project settings or upload flow.
