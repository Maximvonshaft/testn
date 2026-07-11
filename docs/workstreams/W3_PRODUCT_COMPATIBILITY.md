# W3 Product Compatibility

**Release:** Material Studio Commercial Website v0.7.0

## Closure evidence

This workstream is implemented in the integrated local package. The manifest below records the exact files and checksums used for release verification.

| File | Bytes | SHA-256 |
|---|---:|---|
| `data/materials.json` | 1324 | `48d10c77e816030931085d97a98b12ae33f2b7b108e922ed08ac5be7a5319467` |
| `data/profiles.json` | 747 | `f32b0775345f69793a6cbd100b7a4097783de1aea0657f511034e2b16cef97a6` |
| `data/products.json` | 849 | `edabac1711896fd842284058fa75e8c55ba3c6f1a540744d1b2f6478cf37ebc2` |
| `data/compatibility.json` | 6077 | `46cfdecbe87426b13203e1859767bfd947544d5e7963800f2ff5bce144280318` |
| `assets/js/compatibility.mjs` | 1653 | `e3e815df6412046dd150784b13987c077c0bd6c6f4bd7a8de64709ea38e4bcef` |
| `tests/compatibility.test.mjs` | 1122 | `d0760b2cdb806df0e47ec1f6f7d669741742a71ad94783441f3d1d7e88c4109b` |
| `tests/test_product_data.py` | 1487 | `d2831cd8e99aa453f6007fede927052fe8ab1797b2a294b3271cc8ff0ae656c6` |

## Verification

- Python contract/integration suite: 17 tests passed.
- Node compatibility suite: 2 tests passed.
- JavaScript syntax checks: passed.
- Release validator: 0 errors, 0 warnings.
- Managed Chromium browser automation: blocked by `ERR_BLOCKED_BY_ADMINISTRATOR`; script is included for unrestricted local execution.

## Artifact boundary

The complete runnable source and generated binary assets are delivered in `material_studio_commercial_site_v0_7.zip`. GitHub review branches record workstream scope and release evidence; binary assets require direct Git, Git LFS, a release asset or object storage.
