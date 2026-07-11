# Material Studio v0.4 Engineering Report

## Fixed in this release

1. Canvas now uses a real cover-coordinate transform rather than stretching 1920×1080 into every viewport.
2. Desktop, tablet and mobile scene assets are selected at runtime.
3. Material and gloss canvases are reused instead of allocated on every slider event.
4. Slider changes use requestAnimationFrame and update only dynamic UI and the visual compositor.
5. Image loading uses an LRU cache; scene changes release unrelated assets.
6. Parameter panels are surface-specific.
7. Small-screen layout has a sticky conversion bar, horizontally scrollable surface controls and tighter parameter panels.
8. Loading and fatal-error states are present.

## Additional production work completed

- Responsive mask and edge variants generated for all four scenes.
- Low-resolution color hit maps generated for click detection.
- Profile relief maps generated and integrated into material rendering.
- Demonstration product and profile codes added to the manifest.
- Local sample/quote backend added; submissions are stored in `data/leads.jsonl`.
- Playwright smoke-test script added.
- Performance-budget checker added and passing.

## Validation

- JavaScript syntax: passed
- Asset references: passed
- Performance budget: passed
- Local API health: passed
- Local sample submission: passed

## Environment limitation

The supplied Playwright test is executable in a normal development machine. This managed container blocks Chromium navigation to local addresses with `ERR_BLOCKED_BY_ADMINISTRATOR`, so browser automation could not be completed here even though the local HTTP/API checks pass.

## Remaining production work

- Pixel-by-pixel art-direction review of masks in a real browser
- Calibrated product scans and final codes from the manufacturer
- External production backend, authentication and CRM routing
- Lighthouse run in an unrestricted browser environment
- Accessibility audit and multilingual content
