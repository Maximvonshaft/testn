# Verification Report — Material Studio Golden Wall v0.5

Verification date: 2026-07-11

## Fresh command evidence

### Python behavior and asset tests

```text
Ran 9 tests
OK
```

Covered:

- canonical scene/mask dimensions
- exact 6×4 variant matrix
- 24 scene-aligned overlays
- profile thumbnails
- zero alpha leakage outside the wall mask
- >99.5% wall-interior alpha coverage
- zero changed pixels outside the approved wall plane after compositing
- lead validation

### Node state tests

```text
3 tests
3 pass
0 fail
```

Covered:

- deterministic overlay path
- configuration code construction
- saved-state normalization

### Package validation

```text
VALIDATION PASSED
Materials: 6
Profiles: 4
Overlays: 24
Package files: 64
Package size: 15.18 MiB
HTML PARSE PASSED
```

### Local HTTP and API smoke

Verified HTTP 200 for:

- `/`
- `/api/health`
- `/data/catalog.json`
- `/assets/scene/base.webp`
- `/assets/wall/overlays/soft-oak-slat.webp`

Verified `POST /api/leads` returns success and appends one JSONL record. The verification record was removed after the test.

## Browser automation limitation

A Playwright smoke script is included at `tests/browser_smoke.py`. The managed execution environment blocks Chromium navigation to localhost with `ERR_BLOCKED_BY_ADMINISTRATOR`, so an actual browser screenshot cannot honestly be claimed from this environment. Run the script on a normal local machine or in Codex after starting the server.

## Product boundary

This verification applies only to the right-side Feature Wall golden path. It does not claim that floor, ceiling, trim or door-wall replacement is implemented.
