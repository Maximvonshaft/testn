# W4 CRM Lead Flow

**Release:** Material Studio Commercial Website v0.7.0

## Closure evidence

This workstream is implemented in the integrated local package. The manifest below records the exact files and checksums used for release verification.

| File | Bytes | SHA-256 |
|---|---:|---|
| `server.py` | 12982 | `330ccdb598d694b9bce33a8995e8600c5812e618cc92b3500da17607d333ab77` |
| `assets/js/leads.mjs` | 4777 | `2c5394b14cf161ffa3f6bcff9038cb584f4a69163384a82ec94336b8156e93a2` |
| `data/lead-routing.json` | 921 | `f2f489bdc8a6afc9c9b457a5935edf7f70eb77e48bed76f744e687e929e9c8e7` |
| `tests/test_lead_api.py` | 1507 | `51afb7e69b1e8b3275b1e2aa16c52ab5ad636ac3c684a651edc8bb4610dee754` |
| `tests/test_http_server.py` | 2462 | `6d0213e9a652a3638893b5ab05ea39bf838fe7507c7a332c6c936a9034f9d938` |
| `START_WINDOWS.bat` | 228 | `85fa18cbe369d19a71832524fa6051f95171764cd72dcc55d68f521a0b100187` |
| `START_MAC_LINUX.sh` | 65 | `4268f099f295cee9da2e463229ab0169704fcb60bfe0f908a10532fa73c2935a` |

## Verification

- Python contract/integration suite: 17 tests passed.
- Node compatibility suite: 2 tests passed.
- JavaScript syntax checks: passed.
- Release validator: 0 errors, 0 warnings.
- Managed Chromium browser automation: blocked by `ERR_BLOCKED_BY_ADMINISTRATOR`; script is included for unrestricted local execution.

## Artifact boundary

The complete runnable source and generated binary assets are delivered in `material_studio_commercial_site_v0_7.zip`. GitHub review branches record workstream scope and release evidence; binary assets require direct Git, Git LFS, a release asset or object storage.
