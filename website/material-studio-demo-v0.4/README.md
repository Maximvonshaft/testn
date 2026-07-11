# Material Studio Interactive Demo v0.4

Production-hardening iteration of the composite-surface website demo.

## Start

Windows: double-click `START_WINDOWS.bat`.

macOS/Linux:

```bash
./START_MAC_LINUX.sh
```

Open `http://127.0.0.1:8080`.

## Main improvements

- Correct Canvas cover coordinates
- Runtime desktop/tablet/mobile assets
- Reused compositor canvases
- requestAnimationFrame rendering
- LRU image cache and scene cleanup
- Surface-specific parameter panels
- Redesigned mobile fallback
- Loading and error states
- Refined responsive masks and hit maps
- Pre-rendered profile relief
- Demonstration product codes
- Local sample/quote backend
- Browser smoke-test and performance-budget scripts

## Lead data

Sample and quote submissions are stored locally in:

```text
data/leads.jsonl
```

This is a local demo backend, not the final cloud/CRM integration.

## Checks

```bash
node --check assets/app.js
python tools/validate_v04.py
python tools/check_performance_budget.py
python tests/browser_smoke.py
```

The browser test requires a local Chromium environment without administrator URL blocking.
