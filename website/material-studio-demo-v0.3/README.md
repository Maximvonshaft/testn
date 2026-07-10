# Material Studio Interactive Demo v0.3

Asset-engineered website demo for the composite building-materials brand.

## Operating model

- Issue #11 is the work order.
- Branch: `feat/material-studio-demo-v0-3`.
- This track is stacked on the v0.2 interactive frontend.
- The GitHub repository stores the text/code layer and asset contract.
- The complete binary asset pack is delivered separately as `material_studio_demo_v0_3.zip` because the connector cannot upload the generated WebP/PNG files reliably.

## Demo scope

- Four scenes: Hotel Suite, Bathroom, Outdoor Terrace and Showroom
- Canvas-based 2.5D surface compositing
- Direct scene-region selection
- Wall / Floor / Door-Wall / Ceiling / Trim / Aroma
- Pattern / Profile / Tone / Finish / Aroma / Dimension
- Design / Layer / Install / Aroma modes
- Live configuration code
- Save scheme, spec download, sample request and quote flow
- Optional sound, disabled by default

## Asset engineering completed

- 16 responsive scene files
- 24 masks and 24 edge masks
- 28 full material textures and 28 thumbnails
- 10 rendered profile/system assets
- 6 installation steps and 6 accessories
- 5 aroma SVG layers
- Machine-readable asset manifest

## Local run

```text
START_WINDOWS.bat
```

Then open `http://127.0.0.1:8080`.

## Validation

- Asset validator: passed, 142 files checked
- JavaScript syntax: passed
- HTML parser: passed
- Sampled local HTTP paths: 89 checked, 0 errors

## Production blockers

The public release still needs final product codes/dimensions, pixel-refined masks, color-calibrated seamless textures, verified performance/aroma claims, real form routing, privacy text and accessibility/browser QA.
