# Material Studio Commercial Website v0.7 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver one runnable commercial website demo that closes the five approved workstreams: homepage, Golden Wall construction, governed product compatibility, traceable lead flow, and CMS/trust/resources.

**Architecture:** A dependency-free ES-module frontend consumes governed JSON content. A Python local server provides static delivery, CRM-style lead routing, event capture, CMS status endpoints, and downloadable resources. Golden Wall states are offline rendered, scene-aligned overlays with an inset construction reveal and fixed architectural frame.

**Tech Stack:** HTML5, CSS, JavaScript ES modules, Python 3 standard library, Pillow, OpenCV, Node test runner, Python unittest.

## Global Constraints

- No fabricated official SKUs, certifications, test values, capacity or warranty claims.
- Customer-visible UI must not expose internal QA language or demo-code labels.
- Unsupported material/profile/size combinations must be disabled at the data-contract layer.
- Every claim must have an evidence status and owner before it can be published.
- Every CTA must create a traceable lead with route, SLA and reference.
- The Golden Wall remains the only interactive surface until it passes construction acceptance.
- Source and generated assets must remain reproducible from checked-in scripts and source images.

---

### Task 1: Production Homepage Shell

**Files:**
- Create: `index.html`
- Create: `assets/css/site.css`
- Create: `assets/js/app.mjs`
- Create: `assets/js/content.mjs`
- Test: `tests/test_homepage_contract.py`

**Interfaces:**
- Consumes: `data/site.json`, `data/systems.json`, `data/applications.json`, `data/projects.json`, `data/resources.json`
- Produces: semantic homepage sections, responsive navigation, commercial CTA entry points

- [ ] Write contract tests for the nine homepage sections, customer-facing copy and accessibility landmarks.
- [ ] Run tests and confirm RED because implementation is absent.
- [ ] Implement the semantic homepage and responsive design.
- [ ] Run tests and confirm GREEN.
- [ ] Commit the workstream.

### Task 2: Golden Wall Visual Construction Fix

**Files:**
- Create: `tools/build_golden_wall.py`
- Create: `assets/js/material-studio.mjs`
- Create: `assets/images/wall/base.webp`
- Create: `assets/images/wall/construction-frame.webp`
- Create: `assets/images/wall/overlays/*.webp`
- Test: `tests/test_golden_wall_pipeline.py`

**Interfaces:**
- Consumes: `assets/images/wall/hotel-suite-master.png`, `assets/images/wall/material-board.png`
- Produces: `GoldenWallCatalog`, exact-size overlays, inner mask, frame, thumbnails

- [ ] Write failing tests for inner architectural reveal, fixed dimensions, zero outside-inner-mask alpha and no top/bottom overrun.
- [ ] Run tests and confirm RED.
- [ ] Implement inset wall geometry, non-repeating texture synthesis, lightmap, shadow reveals, lower brightness and profile relief.
- [ ] Run tests and confirm GREEN.
- [ ] Generate audit images and commit the workstream.

### Task 3: Product Data and Compatibility

**Files:**
- Create: `data/materials.json`
- Create: `data/profiles.json`
- Create: `data/products.json`
- Create: `data/compatibility.json`
- Create: `assets/js/compatibility.mjs`
- Test: `tests/compatibility.test.mjs`
- Test: `tests/test_product_data.py`

**Interfaces:**
- Produces: `resolveOptions(state)`, `resolveVariant(state)`, governed public product data

- [ ] Write failing tests for supported and unsupported combinations.
- [ ] Run tests and confirm RED.
- [ ] Implement normalized product entities, evidence status and compatibility rules.
- [ ] Integrate disabled states and clear customer explanations into Material Studio.
- [ ] Run tests and confirm GREEN.
- [ ] Commit the workstream.

### Task 4: CRM / Lead Flow

**Files:**
- Create: `server.py`
- Create: `assets/js/leads.mjs`
- Create: `data/lead-routing.json`
- Test: `tests/test_lead_api.py`

**Interfaces:**
- POST `/api/leads`
- POST `/api/events`
- GET `/api/health`
- Produces: reference, route, SLA, persisted JSONL record

- [ ] Write failing tests for sample, quote, technical-support and distributor intents.
- [ ] Run tests and confirm RED.
- [ ] Implement validation, consent capture, route selection, rate limits, idempotency and persistence.
- [ ] Integrate confirmation UI and configuration attachment.
- [ ] Run tests and confirm GREEN.
- [ ] Commit the workstream.

### Task 5: CMS / Trust Evidence / Resources

**Files:**
- Create: `data/evidence.json`
- Create: `data/claims.json`
- Create: `data/resources.json`
- Create: `admin/index.html`
- Create: `assets/js/admin.mjs`
- Create: `assets/js/cms.mjs`
- Test: `tests/test_content_governance.py`

**Interfaces:**
- GET `/api/cms/status`
- Produces: public-only claims/resources and internal governance dashboard

- [ ] Write failing tests that block unsupported claims and missing resource files.
- [ ] Run tests and confirm RED.
- [ ] Implement evidence-linked claims, draft/review/published states and an internal status dashboard.
- [ ] Add resource cards and safe placeholder handling.
- [ ] Run tests and confirm GREEN.
- [ ] Commit the workstream.

### Task 6: Integrated Verification and Handoff

**Files:**
- Create: `tools/validate_release.py`
- Create: `tests/browser_smoke.py`
- Create: `docs/verification/V0_7_VERIFICATION_REPORT.md`
- Create: `README.md`
- Create: `START_WINDOWS.bat`
- Create: `START_MAC_LINUX.sh`

- [ ] Run all Python and Node tests.
- [ ] Run JavaScript syntax checks.
- [ ] Run release validator and local HTTP/API smoke checks.
- [ ] Record browser automation environment result without overstating it.
- [ ] Build the ZIP and record SHA-256.
- [ ] Create five independent GitHub work orders and reviewable PRs or stacked PRs.
