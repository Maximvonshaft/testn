# AQUASTONE Production Website

A production architecture for AQUASTONE mineral-composite surface systems, implemented from the approved desktop and mobile design baselines.

## Architecture

- Astro 7 server output on Cloudflare Workers
- React 19 islands for the scene configurator, lead dialog and 3D layer viewer
- TypeScript strictest mode
- Tailwind CSS 4 plus scoped CSS Modules
- Base UI accessible dialog primitives
- Motion for state and scene transitions
- React Three Fiber / Three.js for the interactive five-layer system
- Optional Sanity Content Lake and Studio with a verified local-content fallback
- Server-validated lead delivery with Turnstile, idempotency and fail-closed routing
- Playwright cross-browser acceptance, axe accessibility checks, Vitest and static integrity auditing

## Local development

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

The website is available at `http://127.0.0.1:4321/en/`.

The pnpm workspace explicitly allows the required deterministic install scripts for `esbuild` and `workerd`; all other dependency build scripts remain denied by default.

## Production gates

```bash
pnpm qa
```

The command executes static integrity checks, unit tests, Astro/TypeScript checks, a production build and five Playwright projects: Chromium, Firefox, WebKit, Mobile Chrome and Mobile Safari.

## Required production configuration

The public lead flow deliberately fails closed until the following are configured in the deployment environment:

- `PUBLIC_SITE_URL`
- `PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `LEAD_WEBHOOK_URL`
- optional `LEAD_WEBHOOK_BEARER_TOKEN`

Sanity is optional. Without Sanity variables, the versioned and fully localized content in `src/data/` is used. When enabled, configure:

- `PUBLIC_SANITY_PROJECT_ID`
- `PUBLIC_SANITY_DATASET`
- optional `SANITY_API_READ_TOKEN` for draft preview

## Content integrity

The repository does not invent legal entities, certification numbers, report references, warranty, MOQ, lead time or commercial policy. Technical and environmental claims are published as product-specific status statements until verified source documents are loaded into the CMS.

## Deployment

The production target is Cloudflare Workers. Set the GitHub environment variables and secrets described in `.github/workflows/deploy-cloudflare.yml`, then enable repository variable `PRODUCTION_DEPLOY_ENABLED=true`.

The deployment workflow will refuse to publish if the production domain, anti-abuse keys, lead endpoint or Cloudflare credentials are missing.
