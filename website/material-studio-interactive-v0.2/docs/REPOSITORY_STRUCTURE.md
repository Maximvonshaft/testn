# Repository Structure

```text
website/material-studio-interactive-v0.2/
├── index.html
├── README.md
├── START_WINDOWS.bat
├── assets/
│   ├── app.js
│   ├── styles.css
│   ├── asset-manifest.json
│   ├── scenes/
│   ├── textures/
│   ├── masks/
│   ├── profiles/
│   └── aroma/
└── docs/
    ├── IMPLEMENTATION_PLAN.md
    ├── ASSET_PIPELINE.md
    ├── INTERACTION_SPEC.md
    ├── ACCEPTANCE_CRITERIA.md
    └── REPOSITORY_STRUCTURE.md
```

## GitHub operating model

- Issue #9 is the work order.
- `feat/material-studio-interactive-v0-2` is the isolated implementation lane.
- The PR is stacked on the v0.1 website branch until PR #8 is merged.
- Binary assets are versioned with the implementation because they are part of the interaction contract.
