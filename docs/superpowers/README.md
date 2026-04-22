# Superpowers Workflow

This repo uses `docs/superpowers/` as the local home for larger design and implementation artifacts.

## Contract

- `README.md` is the human entrypoint.
- `specs/` stores approved designs.
- `plans/` stores implementation plans.

## Use this flow for

- structural site changes
- new portfolio/content capabilities
- build or deployment pipeline changes
- automation around CI, PR review, or Codacy checks

## Validation baseline

```bash
npm run build
npm test
```
