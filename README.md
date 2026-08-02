# AQUASTONE Website

Production-oriented static brand website for AQUASTONE mineral composite surface systems.

The implementation follows the approved desktop and mobile design baseline and is intentionally dependency-light: semantic HTML, modern CSS and browser-native JavaScript. There is no framework runtime, package bundle or third-party script on the public page.

## Product scope

- Desktop product-system rail and immersive hero scene
- Mobile-first scene and material selection experience
- Nine-finish 3D material selector
- Interactive exploded material-system diagram
- Six application-system cards
- Project partnership and sample-request conversion flows
- English, German and French interface switching
- Accessible dialogs, keyboard interactions and live regions
- Reduced-motion support
- SEO metadata, Open Graph metadata, sitemap and robots rules
- GitHub Pages preview deployment
- Netlify production configuration with native form handling
- Automated desktop and mobile Chromium acceptance checks

## Repository structure

```text
.
├── index.html
├── styles.css
├── app.js
├── thanks.html
├── 404.html
├── site.webmanifest
├── robots.txt
├── sitemap.xml
├── netlify.toml
├── assets/
│   ├── icons/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   └── images/
│       └── bathroom-fallback.svg
├── qa/
│   └── browser_smoke.py
├── docs/
│   ├── QA.md
│   ├── qa-results.json
│   └── static-audit.json
└── .github/workflows/deploy-pages.yml
```

## Local preview

```bash
python -m http.server 4173
```

Open `http://127.0.0.1:4173/`.

## Browser QA

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-qa.txt
python -m playwright install chromium
python qa/browser_smoke.py
```

QA evidence is written to `qa-artifacts/`. The GitHub workflow runs the same acceptance checks before deployment.

## Deployment

### GitHub Pages preview

The workflow deploys `main` after static validation and Chromium QA pass. Enable **Settings → Pages → Source: GitHub Actions** once for the repository.

### Netlify production

Connect the repository to Netlify with the repository root as the publish directory. `netlify.toml` provides security and caching headers. The sample-request form uses Netlify Forms and activates automatically during deployment.

For another form backend, replace the form `action` and submission handling in `index.html` / `app.js` with the verified CRM or lead-routing endpoint.

## Content and compliance boundary

Company legal identity, addresses, contacts, certification numbers, report references, exact product performance values, warranty, MOQ, lead time and commercial policy are not invented in this repository. The documentation strip explicitly marks references as pending or product-specific until verified source documents are available.

Before the public launch, insert only verified:

- legal entity and privacy-controller details;
- technical data sheets and declarations;
- certification and test report references;
- customer-facing contact and CRM routing;
- product warranty and commercial terms.

## Photography

The production layout currently references fixed, free-use Pexels and Unsplash image CDN assets and includes a local SVG fallback for the primary hero. Replace the photography with owned AQUASTONE renders before long-term brand launch when the final product visual library is available.

## Asset replacement

Hero image URLs are centralized in `IMAGE_URLS` in `app.js`. Application cards and project-gallery images are defined in `index.html`. Keep equivalent aspect ratios and supply responsive, optimized WebP/AVIF assets when migrating to owned media.
