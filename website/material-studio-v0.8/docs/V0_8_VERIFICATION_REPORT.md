# Material Studio v0.8 Verification Report

## Automated evidence

- **PASS** — 30 Python contract and integration tests
- **PASS** — 3 Node compatibility tests
- **PASS** — JavaScript syntax checks for all runtime files
- **PASS** — release validator: 0 errors, 0 warnings
- **PASS** — HTTP integration smoke for Home, Studio, Systems, Projects, Quality, Resources, CSS, JavaScript, catalog, base scene, initial overlay, health and content-status endpoints
- **PASS** — extracted ZIP was revalidated after packaging

## Asset evidence

- Base, mask, construction reveal and all overlays use the 1672×941 scene coordinate system.
- 24 material/profile overlays exist.
- Overlay alpha is zero outside the approved wall surface mask.
- The material plane follows the true sloped wall boundary and remains outside the ceiling and floor junctions.
- Customer-facing concept imagery uses optimized WebP with intrinsic dimensions.

## Product and governance evidence

- Every compatibility rule references known material and profile entities.
- Every enabled rule has available dimensions.
- Every disabled rule has a customer-readable reason.
- Public data contains no legacy `demoCode` field.
- Every published claim references approved evidence.
- Every public download points to an existing file.

## API and security evidence

- Valid leads return reference, queue, owner and response target.
- Duplicate leads return the existing reference.
- Invalid email and missing consent are rejected.
- Events and leads persist to separate JSONL stores.
- Security headers include CSP, `nosniff`, same-origin framing and strict referrer policy.
- Request size, rate limit and idempotency boundaries are implemented.

## Browser boundary

Managed Chromium rejects both localhost and file navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`. No browser-pass claim is made. The package includes `tests/browser_smoke.py` for desktop, tablet and mobile screenshots in an unrestricted environment.

## Release claim

Automated source, asset, data-governance, API, security-header, compatibility and release checks pass. Final visual acceptance remains a local browser/device gate.