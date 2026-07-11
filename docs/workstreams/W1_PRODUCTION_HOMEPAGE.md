# W1 Production Homepage

**Release:** Material Studio Commercial Website v0.7.0

## Closure evidence

This workstream is implemented in the integrated local package. The manifest below records the exact files and checksums used for release verification.

| File | Bytes | SHA-256 |
|---|---:|---|
| `index.html` | 15310 | `c7b11d863e5e01994deed17ba55618323e5fbb154d711e0a75e6ab3218dde5bb` |
| `assets/css/site.css` | 25920 | `ecfa46e7152a7fe9d6d3adccd89777d367303e9948268d54d25ae40bbc5c02b5` |
| `assets/js/app.mjs` | 5874 | `7f5be6034cd877d1579d83aea5e8d42273329ca7aa58ee273f39e42d377eb5b8` |
| `assets/js/content.mjs` | 690 | `a55c14c5988b289d5d9a3e69b7b0dec482ad51b4e6c6ce30eb7911db8b213dd7` |
| `assets/js/analytics.mjs` | 735 | `8785eaba0eb2017963947b5457de869db2b76b84ae7b6619f297967338dd853f` |
| `data/site.json` | 1300 | `99c0e720e2b28c323bc1e443be6087ecf9024f4bc8790b22bc7669520b5d07ab` |
| `data/systems.json` | 1729 | `de9dbf9262047d973b7765f941ea5757006bf638e2ad51b5316d0ccf0ad2d295` |
| `data/applications.json` | 806 | `54be1b580c15836d77600e41ee978555e1bc9ed4993e04dd66ab78d45e4fcdd7` |
| `data/projects.json` | 1109 | `480c1d94318155565790ad1da7d688736a1cf48c40e39a3759fbff5f54a33425` |
| `privacy.html` | 1163 | `312577b3919f792ba8d5c68a9da4efc9d09bcefcac95edebb76cb64845f90b74` |
| `site.webmanifest` | 258 | `c0c78cb2d28fe9f1d4e9cac3f765e0c67efda6ae2fd959e1a0b2c75873edd5ab` |
| `robots.txt` | 61 | `a7821667ebe3ce27c0d211ae02babb637e0892c9c7e0f4f82a7dcd379fc2e50b` |
| `tests/test_homepage_contract.py` | 1284 | `a32ee0df6fab88ffbab24af1a589bca7acb4b07fb5fc55fb0c4c539324a2d30a` |

## Verification

- Python contract/integration suite: 17 tests passed.
- Node compatibility suite: 2 tests passed.
- JavaScript syntax checks: passed.
- Release validator: 0 errors, 0 warnings.
- Managed Chromium browser automation: blocked by `ERR_BLOCKED_BY_ADMINISTRATOR`; script is included for unrestricted local execution.

## Artifact boundary

The complete runnable source and generated binary assets are delivered in `material_studio_commercial_site_v0_7.zip`. GitHub review branches record workstream scope and release evidence; binary assets require direct Git, Git LFS, a release asset or object storage.
