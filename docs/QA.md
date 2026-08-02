# AQUASTONE Website QA Acceptance

## Baseline

- Desktop design baseline supplied by the project owner
- Mobile design baseline supplied by the project owner
- Acceptance viewports: 1440 × 900 and 390 × 844
- Browser engine: Chromium
- Acceptance date: 2026-08-02

## Runtime acceptance

The production runtime source at `30071a73b8ca517a46a4fe113f29b2238605103e` passed both required CI gates in GitHub Actions run `30739948669`:

- `static-validation`: passed
- `browser-qa`: passed

The later documentation-only commit does not alter the accepted HTML, CSS, JavaScript, forms or QA runtime.

The accepted run generated:

- `desktop-1440x900-baseline.png`
- `desktop-1440x900-full.png`
- `mobile-390x844-baseline.png`
- `mobile-390x844-full.png`
- `browser-smoke.json`

Artifact digest:

```text
sha256:df3bd7b9fa07ad7793575ad3862730dd6fb1b8814bb6d60f6ffd12f9d57a603c
```

## Browser coverage

Verified on desktop and mobile:

- semantic landmarks and exactly one H1;
- no horizontal overflow;
- nine material finishes, six application systems and five material layers;
- synchronized product-system, material and layer interactions;
- ARIA and live-region state;
- sample dialog, required fields, consent and Netlify form contract;
- safe interception of valid submissions on unsupported local previews;
- mobile navigation and desktop language switching;
- local hero fallback;
- complete scroll and reveal path;
- viewport and full-page visual captures;
- no JavaScript runtime or browser-console errors.

The reusable acceptance runner is `qa/browser_smoke.py`.

## Static and integrity coverage

Verified:

- complete production file set;
- JavaScript and Python syntax;
- semantic structure, internal anchors and dialog labels;
- explicit button types and image alternative text;
- required form controls, consent and honeypot;
- Netlify custom-domain form-routing contract;
- local and GitHub Pages preview form guard;
- reduced-motion support and local hero fallback;
- valid sitemap XML;
- no TODO, FIXME, lorem-ipsum residue, embedded secrets or fabricated certification claims.

## Production gates

- Deployment is blocked when static validation or browser QA fails.
- GitHub Pages deployment runs only after both gates pass on `main`.
- QA evidence is retained as a workflow artifact for 30 days.
- Netlify configuration supplies security and cache headers.
- Sample requests are accepted on Netlify deployments, including custom domains, while unsupported previews fail safely.

## Business-source dependencies

These are launch-owner inputs rather than implementation defects:

- final owned AQUASTONE product and room-scene photography;
- verified legal entity and privacy-controller details;
- final production domain and canonical URL;
- verified certification, declaration and test-report references;
- final CRM ownership and lead-routing policy.
