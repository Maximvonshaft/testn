# Material Studio Commercial Website v0.7 Verification Report

**Release:** 0.7.0  
**Verification time:** 2026-07-11T21:34:15Z  
**Scope:** Integrated closure of W1–W5 under the commercial website specification.

## Release decision

- **Integrated commercial demonstration:** GO.
- **Unrestricted public production launch:** CONDITIONAL NO-GO.

The software workflows are implemented and verified locally. Public launch remains gated by organization-owned external inputs: approved factory master data, official product identifiers, verified certifications and test reports, legal privacy/retention approval, production CRM/CMS credentials and owners, installed-project references, domain/CDN/monitoring/backups, and unrestricted browser acceptance testing.

## Workstream status

| Workstream | Status | Primary evidence |
|---|---|---|
| W1 Production Homepage Shell | Closed | Nine required sections, responsive navigation, customer-facing copy and semantic contract tests |
| W2 Golden Wall Construction | Closed for one approved feature-wall path | Inset material plane, independent construction frame, 24 scene-aligned overlays and alpha-boundary tests |
| W3 Product Compatibility | Closed for governed demonstration data | Normalized entities, enabled/disabled rules, customer explanations and Python/Node tests |
| W4 CRM / Lead Flow | Closed for local end-to-end operation | Four intents, consent, routing, SLA, references, idempotency, rate limiting and HTTP tests |
| W5 CMS / Trust / Resources | Closed for governed local content | Evidence-linked claims, public filtering, resources, internal status page and release validator |

## Fresh verification evidence

### Python contract and integration suite

```bash
python -m unittest discover -s tests -p "test_*.py" -v
```

Result: 17 tests passed, 0 failures, 0 errors.

Coverage includes homepage structure, customer-visible copy, accessibility landmarks, Golden Wall construction invariants, product compatibility contracts, lead validation/routing/idempotency, HTTP endpoints, claim evidence and resource integrity.

### Node compatibility suite

```bash
node --test tests/compatibility.test.mjs
```

Result: 2 tests passed, 0 failed.

### JavaScript syntax

```bash
for f in assets/js/*.mjs; do node --check "$f"; done
```

Result: all ES modules passed syntax checking.

### Integrated release validator

```bash
python tools/validate_release.py
```

Result:

```text
Errors: 0
Warnings: 0
PASS: release contract satisfied
index sha256: c7b11d863e5e01994deed17ba55618323e5fbb154d711e0a75e6ab3218dde5bb
```

### HTTP/API smoke

Verified by `tests/test_http_server.py`:

- `GET /api/health` → 200
- `GET /` → 200
- `GET /api/cms/status` → 200
- `POST /api/leads` → accepted route and traceable reference

### Browser automation

Attempted with system Chromium:

```bash
python tests/browser_smoke.py --url http://127.0.0.1:8767/ --chromium /usr/bin/chromium
```

Result:

```text
BLOCKED: managed Chromium policy prevented localhost browser QA.
BROWSER_EXIT=2
```

This is an environment limitation, not a browser-pass result. The script remains in the package and must be executed on an unrestricted Windows/macOS/Linux browser environment before production release.

## Golden Wall acceptance evidence

- Base image, inner mask, construction frame and all overlays use the same 1672×941 coordinate system.
- Twenty-four material/profile overlay states are generated.
- Overlay alpha is zero outside the approved inner wall mask.
- The material plane is inset from the original opening, retaining visible top, base and side terminations.
- Floor, ceiling, trim and door-wall rendering are explicitly out of scope.

Visual evidence:

- `docs/verification/golden-wall-before-after.jpg`
- `docs/verification/golden-wall-construction-audit.png`
- `docs/verification/golden-wall-detail.jpg`

## Product and claim integrity

- Public data does not present demonstration references as official factory SKUs.
- Unsupported combinations are disabled with customer-readable reasons.
- Published claims require approved evidence records.
- The unverified waterproof-performance claim remains blocked/review-only.
- Project imagery that is not an installed reference is labelled as concept content.

## Commercial workflow integrity

Supported request intents:

- sample
- quote
- technical support
- distributor enquiry

Each accepted lead returns a reference, queue, owner and target response time.

The local JSONL store proves end-to-end behavior but is not a production CRM.

## Remaining production gates

1. Factory-approved products, official SKUs, dimensions and compatibility ownership.
2. Verified certification/test/warranty evidence and legal claim approval.
3. Real installed project references and publication permissions.
4. Production CRM/email provider, credentials, monitoring and sales ownership.
5. Permissioned CMS, approval workflow and evidence review schedule.
6. Final privacy notice, cookie policy, retention/deletion process and legal owner.
7. Production domain, HTTPS, CDN, observability, backups and rollback.
8. Unrestricted cross-browser, responsive, accessibility and performance acceptance testing.

No production-launch claim should be made until these gates are closed.
