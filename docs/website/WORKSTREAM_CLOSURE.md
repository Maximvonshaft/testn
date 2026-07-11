# Material Studio v0.7 Workstream Closure

## Closure definition

A workstream is closed in this release when its customer path, data contract, error boundary, test coverage and local operational path are implemented. Organization-controlled external credentials or unverified factory facts remain deployment gates rather than fabricated website content.

## 1. Production Homepage Shell — Closed

Implemented:

- nine-section commercial homepage
- semantic landmarks and responsive navigation
- audience segmentation
- system, application, technology, quality, project and resource sections
- mobile and tablet layouts
- SEO metadata, manifest, favicon and robots policy
- privacy boundary for the local demonstration

Evidence:

- `index.html`
- `assets/css/site.css`
- `assets/js/app.mjs`
- `tests/test_homepage_contract.py`

## 2. Golden Wall Visual Construction Fix — Closed for the approved golden path

Implemented:

- smaller inner wall plane inside the existing architectural opening
- visible top, base and side terminations
- restrained internal shadow rather than a full-picture overlay
- non-mirrored deterministic texture synthesis
- material lightmap and profile relief
- 24 same-size overlays
- fixed construction frame
- customer-facing original/configured comparison

Evidence:

- `tools/build_golden_wall.py`
- `data/golden-wall.json`
- `assets/images/wall/`
- `docs/verification/golden-wall-detail.jpg`
- `tests/test_golden_wall_pipeline.py`

Boundary:

- only the feature wall is interactive
- floor, ceiling, trim and door-wall are not claimed as completed

## 3. Product Data and Compatibility — Closed for governed demonstration data

Implemented:

- normalized products, materials and profiles
- public configuration references without presenting them as factory SKUs
- enabled and disabled compatibility rules
- dimension availability per material/profile combination
- disabled controls and customer explanations

Evidence:

- `data/materials.json`
- `data/profiles.json`
- `data/products.json`
- `data/compatibility.json`
- `assets/js/compatibility.mjs`
- `tests/compatibility.test.mjs`
- `tests/test_product_data.py`

Production gate:

- replace demonstration references with approved factory master data after owner confirmation

## 4. CRM / Lead Flow — Closed for local end-to-end operation

Implemented:

- sample, quote, technical and distributor intents
- validation and explicit consent
- configuration attachment
- country and intent routing
- SLA and owner response
- reference generation
- idempotency
- rate limiting
- JSONL persistence
- analytics event capture

Evidence:

- `server.py`
- `data/lead-routing.json`
- `assets/js/leads.mjs`
- `tests/test_lead_api.py`
- `tests/test_http_server.py`

Production gate:

- replace local JSONL persistence with the organization-approved CRM/email provider and production secrets

## 5. CMS / Trust Evidence / Resources — Closed for governed local content

Implemented:

- claim, evidence and resource contracts
- public claim filtering by approved evidence
- downloadable and request-only resources
- internal governance status page
- blocked unverified performance claim
- concept labelling for non-installed project imagery

Evidence:

- `data/claims.json`
- `data/evidence.json`
- `data/resources.json`
- `assets/js/cms.mjs`
- `admin/index.html`
- `assets/js/admin.mjs`
- `tests/test_content_governance.py`

Production gate:

- migrate JSON content to a permissioned CMS and assign real content owners/review cycles

## Overall release decision

**Integrated commercial demonstration:** Go.

**Unrestricted public production launch:** Conditional No-Go until factory master data, legal review, external CRM/CMS, verified technical evidence and deployment controls are supplied.
