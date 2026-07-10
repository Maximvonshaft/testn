# Asset Pipeline

## Asset classes

### 1. Scene base

A clean, high-resolution image without navigation or controls.

Production target:

- 2560 x 1440 master
- AVIF/WebP responsive derivatives
- separate desktop and mobile compositions

### 2. Surface masks

One high-contrast mask per interactive area:

- wall
- floor
- door-wall
- ceiling
- trim
- aroma zone

Production masks must be traced against the final scene master rather than the approximate MVP polygons.

### 3. Material textures

Required per sellable pattern:

- product code
- square seamless texture
- directional information
- color family
- compatible systems
- compatible profiles
- finish options
- aroma compatibility

The v0.2 pack includes texture crops derived from the Zhongxin product catalog for demonstration.

### 4. Profiles

SVG cross-section icons:

- flat
- slat
- fluted
- wide rib
- groove
- decking

The production profile list must be reconciled with actual molds and dimensions.

### 5. Aroma assets

Each aroma profile requires:

- name
- visual motif
- palette
- animation curve
- product compatibility
- intensity wording
- defensible release-duration wording

Aroma is represented visually; the website must not make unverified duration or health claims.

### 6. Installation and layer sequences

Production assets should include:

- wall preparation
- alignment
- fixing/locking
- trim/edge finish
- optional layer exploded view

## Replacement rule

Every placeholder asset must have an entry in `assets/asset-manifest.json`. Production assets replace files without changing the frontend state contract.
