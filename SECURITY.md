# Security Policy

## Reporting a vulnerability

Please report suspected security issues **privately** rather than in a public issue — use GitHub's
**Security → Report a vulnerability** tab, or email **odvprabhakar@gmail.com**. We aim to acknowledge
reports within a few days.

## Secrets

This repository is public, but it contains **no secrets**. All credentials live only as **GitHub
Actions repository secrets** (Settings → Secrets and variables → Actions):

- `LLM_PROVIDER`, `LLM_MODEL`, `OPENROUTER_API_KEY`
- `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

Repository secrets are:
- **Admin-only** to create, edit or delete — the public cannot view or change them.
- **Write-only** — values cannot be read back after saving, and are masked as `***` in logs.
- **Never exposed** to workflow runs triggered by pull requests from forks.

## For contributors

- **Never commit credentials.** `.env` is git-ignored; `.env.example` contains placeholders only.
- **Workflow changes get reviewed.** Anything under `.github/` is covered by `CODEOWNERS`, because a
  modified workflow runs with the repository's secrets. Describe such changes clearly so they can be
  reviewed before merge.
- If you believe a credential has been exposed, report it immediately so it can be rotated.
