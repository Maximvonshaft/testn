# AQUASTONE Website QA Acceptance

## Acceptance baseline

- Desktop design baseline supplied by the project owner
- Mobile design baseline supplied by the project owner
- Acceptance viewports: 1440 × 900 and 390 × 844
- Browser engine: Chromium
- Test date: 2026-08-02

## Automated browser acceptance

Result: **35 / 35 checks passed** in the local acceptance run.

Verified on both desktop and mobile:

- document title and semantic main landmark;
- exactly one H1;
- no horizontal overflow;
- all nine material finishes rendered;
- product-system switching updates hero content and synchronized controls;
- material selection updates visual, ARIA and live-region state;
- exploded-layer selection synchronizes diagram and labels;
- sample dialog opens and closes correctly;
- required lead-form controls are present;
- mobile navigation opens and closes;
- desktop language switching updates the interface;
- footer and full page remain reachable;
- no JavaScript runtime errors.

The reusable CI test is `qa/browser_smoke.py`. It blocks external photography during testing to verify that the local hero fallback and the application-card base surfaces remain functional without third-party image delivery.

## Static and integrity audit

Result: **18 / 18 checks passed**.

Verified:

- unique IDs;
- valid heading structure;
- header, main and footer landmarks;
- image alternative text;
- explicit button types;
- dialog label references;
- internal anchor resolution;
- required form fields and anti-spam honeypot;
- no TODO, FIXME or lorem-ipsum residue;
- strict-mode JavaScript;
- hardened storage access;
- reduced-motion support;
- local hero fallback;
- valid sitemap XML;
- complete production file set;
- no embedded secrets;
- no fabricated certification-status claims.

## Visual inspection

The following components were inspected at full size and component level:

1. Desktop header, application rail, hero composition and material dock
2. Mobile header, hero, horizontal application strip and material carousel
3. Exploded five-layer material system
4. Performance and value strip
5. Six-card product-system portfolio
6. Project partnership panel
7. Sample-request CTA and modal form
8. Documentation-status strip and footer

## Production gates already implemented

- CI blocks deployment on static-validation or browser-QA failure.
- GitHub Pages deployment occurs only after both gates pass.
- QA screenshots and machine-readable report are retained as workflow artifacts for 30 days.
- Netlify configuration includes content-type, referrer, permissions, framing and cache headers.
- Sample form includes required validation, consent and honeypot protection.
- Certification references remain pending until matched to verified evidence.

## External dependencies requiring launch-owner confirmation

- Final owned product and room-scene photography
- Verified company identity and privacy contact
- Final production domain and canonical URL
- Verified certification/report references
- Final CRM or Netlify Forms routing

These are business-source dependencies, not unresolved implementation defects.
