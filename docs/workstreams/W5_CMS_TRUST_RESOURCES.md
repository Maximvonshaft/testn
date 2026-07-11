# W5 CMS, Trust Evidence and Resources

**Release:** Material Studio Commercial Website v0.7.0

## Closure evidence

This workstream is implemented in the integrated local package. The manifest below records the exact files and checksums used for release verification.

| File | Bytes | SHA-256 |
|---|---:|---|
| `data/claims.json` | 1480 | `0662a9e5afb572e6631a2bf18ee07c24484e3ebb1d4832794808c04a5e5f3df7` |
| `data/evidence.json` | 1088 | `40ea0a1a2a06e84b347cabdea39bdce1392007f0da9c15dcb9d96781dda9927f` |
| `data/resources.json` | 1200 | `532ead080610ff380229e7f6a09f6b08b1e22633113e64e89d9ed7564ac37857` |
| `assets/js/cms.mjs` | 521 | `6d27e8227f54cbbbd96101bb1d86f306040d8beade3d2f2c2a1da26b12b7c85f` |
| `admin/index.html` | 2540 | `dd7818ef63bc6e8f0ec4d861af59edf8e3f59ac89c2c54a818f1f10698b1b93d` |
| `assets/js/admin.mjs` | 2147 | `a87af940c38bb31ac68dae1ba3e49a5a7fc746dddad3dc7aba19b2dc2f00d666` |
| `tools/validate_release.py` | 9520 | `da8d3eca3ff0054dc685647bfbcd0aaa4667e3832978d9d6be1fd8e1df6e6f14` |
| `tests/test_content_governance.py` | 1425 | `e8ff71665c253367f0cdf7c85fa3f4f190473f5a1f43a9a117a5900a2d757812` |
| `docs/website/WORKSTREAM_CLOSURE.md` | 3774 | `71d8fe8576eda4b27f383cf8f9e6931fc1bc51a127598a657a7de1e12a91694f` |

## Verification

- Python contract/integration suite: 17 tests passed.
- Node compatibility suite: 2 tests passed.
- JavaScript syntax checks: passed.
- Release validator: 0 errors, 0 warnings.
- Managed Chromium browser automation: blocked by `ERR_BLOCKED_BY_ADMINISTRATOR`; script is included for unrestricted local execution.

## Artifact boundary

The complete runnable source and generated binary assets are delivered in `material_studio_commercial_site_v0_7.zip`. GitHub review branches record workstream scope and release evidence; binary assets require direct Git, Git LFS, a release asset or object storage.
