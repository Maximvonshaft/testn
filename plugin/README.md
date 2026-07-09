# Maps Lead Assistant Plugin Track

This track owns the tactical browser extension used for small-sample Google Maps lead research and diagnostics.

## Positioning

The plugin is **not** the long-running production collector. It is a tactical helper for:

- small-sample collection
- selector and DOM diagnostics
- website extraction probes
- exporting CSV files into SourcePilot Cloud

## Current facts from user tests

- List collection works.
- Scrolling works.
- Detail enrichment can collect websites.
- Some websites remain missing even when visible in the Google Maps detail panel.
- Long browser sessions can create Chrome memory pressure.

## Latest package

Latest local artifact under active test:

```text
zhongxin_maps_lead_assistant_extension_v1_9_watchdog.zip
```

The next plugin PR should unpack the full latest source package and add an explicit probe mode for missed website extraction.

## Next probe design

The plugin should add a compact probe export for each detail card:

- lead id
- visible business name
- detail panel title
- panel text length
- website button text
- website button aria-label
- external links in detail panel
- candidate domains
- selected website
- failure reason
- screenshot marker if extraction failed

This lets the Cloud track compare lead CSV against debug diagnostics without guessing from the UI.
