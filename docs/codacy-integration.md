# Codacy integration

This repository is ready for Codacy analysis with a repository-level configuration in `/home/runner/work/chicojunior.github.io/chicojunior.github.io/.codacy.yaml` and a CI workflow in `/home/runner/work/chicojunior.github.io/chicojunior.github.io/.github/workflows/ci.yaml`.

## What is configured in the repository

- Codacy analysis exclusions for generated and legacy content:
  - `dist/**`
  - `old/**`
  - `scripts/generated/**`
- CI validation for `pull_request` and pushes to `main` / `master`
- Existing build and test commands:
  - `npm run build`
  - `npm test`

## Manual steps in Codacy

1. Install the Codacy GitHub App for the account or organization that owns `chicojunior/chicojunior.github.io`.
2. Grant the app access to this repository.
3. Import the repository in Codacy.
4. Confirm the default branch in Codacy matches the repository default branch.
5. Enable pull request analysis, annotations, and status checks.
6. If desired, require the Codacy quality check before merge in the repository branch protection rules.

## Coverage

This repository currently runs acceptance checks with `node tests/site_acceptance.js` and does not publish LCOV coverage reports.

If coverage is later required in Codacy, add a coverage tool that generates LCOV and then wire that report into the Codacy project settings or upload flow.
