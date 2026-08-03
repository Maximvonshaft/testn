# AQUASTONE Production Acceptance Contract

A release is eligible for merge and production deployment only when every code-controlled gate below passes on the exact candidate head.

## Required automated gates

- dependency installation from the committed pnpm lockfile;
- static integrity and secret-placeholder audit;
- unit tests;
- Astro and strict TypeScript validation;
- production Cloudflare build;
- production dependency vulnerability audit at high severity;
- Chromium, Firefox and WebKit browser acceptance;
- Mobile Chrome and Mobile Safari emulation;
- axe accessibility assertions;
- runtime JavaScript error and horizontal-overflow checks;
- localized routing, language switching and metadata checks;
- material, scene, layer and lead-dialog interaction checks;
- Sanity Studio build validation against the same hardened lock graph.

## Fail-closed production dependencies

Production deployment remains disabled until verified values are configured for:

- production canonical domain;
- Cloudflare account and deployment credentials;
- Turnstile public and secret keys;
- production lead-delivery webhook and authentication;
- verified privacy-controller and legal-entity content;
- owned final room-scene and product imagery;
- verified certification and technical-report references.

No deployment workflow may substitute invented or test data for these business-source dependencies.
