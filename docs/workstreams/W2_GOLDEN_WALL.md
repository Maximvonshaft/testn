# W2 Golden Wall

**Release:** Material Studio Commercial Website v0.7.0

## Closure evidence

This workstream is implemented in the integrated local package. The manifest below records the exact files and checksums used for release verification.

| File | Bytes | SHA-256 |
|---|---:|---|
| `tools/build_golden_wall.py` | 13147 | `d6aa05c27e5593ca50252cee44d2c53effb67fef9abd6b1e4f1dbe07f290d272` |
| `assets/js/material-studio.mjs` | 9247 | `d1ff24806ea57430cfa259cdef01b1b68a78c991d70baa47036bbea7abc3fbf3` |
| `data/golden-wall.json` | 3083 | `eeda704f617b09238b7482ab67387eaad27595cf8f4a03ef766e08f7741dc4a2` |
| `tests/test_golden_wall_pipeline.py` | 1962 | `2e090ddf7201fdb1ec7456b104c73f36bd4c17029739f7e0a2a4d27e8e86a2ce` |
| `docs/verification/golden-wall-construction-audit.png` | 2353702 | `8b89ac08e4e4d033981eb2758bc8f1091fb77b5d71c4bc35ab8a5a3158339115` |
| `docs/verification/golden-wall-before-after.jpg` | 599209 | `67936784f4fee01aa9f8285b39ee2772a11288cd2bde21f45fdd59506c0f84c5` |
| `docs/verification/golden-wall-detail.jpg` | 165389 | `4f05ca6582648e00e2340d1fa73925e9a7df972615ad1e8f0732fb9ea3afe7f2` |

## Verification

- Python contract/integration suite: 17 tests passed.
- Node compatibility suite: 2 tests passed.
- JavaScript syntax checks: passed.
- Release validator: 0 errors, 0 warnings.
- Managed Chromium browser automation: blocked by `ERR_BLOCKED_BY_ADMINISTRATOR`; script is included for unrestricted local execution.

## Artifact boundary

The complete runnable source and generated binary assets are delivered in `material_studio_commercial_site_v0_7.zip`. GitHub review branches record workstream scope and release evidence; binary assets require direct Git, Git LFS, a release asset or object storage.
