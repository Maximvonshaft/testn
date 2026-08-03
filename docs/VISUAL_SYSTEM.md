# AQUASTONE Hybrid Visual System

## Frozen architecture

The website hero uses complete pre-rendered scene states. The browser never applies a texture, mask, clip-path or synthetic lighting pass to the room image.

The complete system ships two global 9 × 6 state matrices:

- desktop: 9 columns × 6 rows, 600 × 375 pixels per state;
- mobile: 9 columns × 6 rows, 300 × 400 pixels per state.

The material index is identical across all systems. The active device matrix is loaded and decoded before committing any system change. A material change selects another already-decoded column and cross-fades atomically.

## Runtime responsibilities

The browser is responsible only for:

- selecting the correct system row;
- selecting the correct material column;
- decoding before scene commit;
- cross-fading complete states;
- respecting reduced-motion preferences.

It is explicitly not responsible for material projection, UV mapping, masking, relighting or occlusion.

## Real-time 3D boundary

React Three Fiber remains limited to simple product geometry:

- slab thickness and edge inspection;
- five-layer exploded construction;
- future installation details and AR-compatible product models.

Full rooms are not rendered in real time.

## Asset integrity boundary

The committed visual states are commercial design visualisations. Exact product colour and physical surface claims require controlled photography or scanning of approved physical samples. Replacing calibrated material sources does not require changing the web architecture.

## Acceptance contract

- no `materialOverlay` or `data-mask` implementation in the hero;
- no generic CSS `clip-path` material replacement;
- active device matrix decoded before a product-system commit;
- nine deterministic material indices across six systems;
- dedicated mobile composition for every system/material state;
- initial atlas and total image budgets enforced by static audit;
- Chromium, Firefox, WebKit, Mobile Chrome and Mobile Safari acceptance.
