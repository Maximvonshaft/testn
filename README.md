# AQUASTONE Production Website

A production architecture for AQUASTONE mineral-composite surface systems, implemented from the approved desktop and mobile design baselines.

## Architecture

- Astro 7 server output on Cloudflare Workers
- React 19 islands for the scene configurator, lead dialog and 3D layer viewer
- TypeScript strictest mode
- Tailwind CSS 4 plus scoped CSS Modules
- Base UI accessible dialog primitives
- Motion for atomic state and scene transitions
- Complete pre-rendered room states packaged as responsive material atlases
- React Three Fiber / Three.js limited to slab and five-layer product geometry
- Optional Sanity Content Lake and Studio with a verified local-content fallback
- Server-validated lead delivery with Turnstile, idempotency and fail-closed routing
- Playwright cross-browser acceptance, axe accessibility checks, Vitest and static integrity auditing

## Visual system

The hero does not project textures in the browser. The six product systems and nine material finishes are packaged into complete desktop and mobile state matrices. The active device matrix is loaded and decoded before React commits a system change; material changes select a fully rendered frame already present in that matrix.

This removes generic masks, CSS `clip-path` replacement and runtime relighting from the customer-facing experience. Three.js remains responsible only for product-scale geometry where real-time inspection creates value.

See `docs/VISUAL_SYSTEM.md` and `docs/VISUAL_ASSET_PROVENANCE.md` for the frozen runtime contract and product-claim boundary.

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

The static audit materializes and verifies the packed WebP assets, enforces complete responsive state matrices, deterministic material indices, removal of the old runtime overlay path, per-asset budgets and an aggregate image budget.

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

## Content and asset integrity

The repository does not invent legal entities, certification numbers, report references, warranty, MOQ, lead time or commercial policy. Technical and environmental claims are published as product-specific status statements until verified source documents are loaded into the CMS.

The room and finish states are controlled digital visualisations, not installed-project photography or physical measurement. Exact product-colour claims require replacement sources calibrated from approved physical samples; material IDs, frame order and web integration remain unchanged during that calibration.

## Deployment

The production target is Cloudflare Workers. Set the GitHub environment variables and secrets described in `.github/workflows/deploy-cloudflare.yml`, then enable repository variable `PRODUCTION_DEPLOY_ENABLED=true`.

The deployment workflow will refuse to publish if the production domain, anti-abuse keys, lead endpoint or Cloudflare credentials are missing.
