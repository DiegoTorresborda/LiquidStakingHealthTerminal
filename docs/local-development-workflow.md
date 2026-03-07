# Local Development Workflow (without Vercel build on every change)

This project can be developed fully in local mode and pushed to GitHub only when you decide a batch is ready.

## 1) Run locally

```bash
npm install
npm run dev
```

Use `npm run dev` for fast iteration and visual review.

## 2) Optional data refresh

If you want to refresh the CoinGecko snapshot manually:

```bash
npm run data:sync:coingecko
```

This updates `data/coingecko-basics.json` and is intended to be run on demand.

## 3) Quick local checks before commit

```bash
npm run lint
```

Run `npm run build` only when you want release-level validation.

## 4) GitHub push strategy (batch changes)

Recommended loop:

1. Work locally (`npm run dev`)
2. Save a coherent batch of changes
3. Run `npm run lint` (and `npm run build` only when needed)
4. Commit locally
5. Push to GitHub when ready

## 5) Vercel behavior

To avoid deployments for every experimental commit, use one of these approaches in Vercel project settings:

- Keep automatic production deploys only from `main`
- Disable or limit preview deployments for non-release branches
- Use a dedicated release branch and deploy manually from that branch

> Vercel deploy trigger policy is controlled in Vercel settings, not in this repository.
