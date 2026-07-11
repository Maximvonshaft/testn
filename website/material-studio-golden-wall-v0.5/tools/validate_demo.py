from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
EXPECTED_SIZE = (1672, 941)


def require(path: Path) -> None:
    if not path.exists():
        raise AssertionError(f'Missing required file: {path.relative_to(ROOT)}')


def main() -> None:
    catalog_path = ROOT / 'data/catalog.json'
    require(catalog_path)
    catalog = json.loads(catalog_path.read_text('utf-8'))

    required_text = [
        ROOT / 'index.html', ROOT / 'assets/styles.css', ROOT / 'assets/app.mjs',
        ROOT / 'assets/state.mjs', ROOT / 'server.py', ROOT / 'README.md',
    ]
    for path in required_text:
        require(path)
        if path.stat().st_size == 0:
            raise AssertionError(f'Empty file: {path.relative_to(ROOT)}')

    base_path = ROOT / catalog['scene']['base']
    require(base_path)
    with Image.open(base_path) as base:
        if base.size != EXPECTED_SIZE:
            raise AssertionError(f'Base scene is {base.size}, expected {EXPECTED_SIZE}')

    overlay_count = 0
    for material in catalog['materials']:
        require(ROOT / material['thumbnail'])
        for profile in catalog['profiles']:
            path = ROOT / f"assets/wall/overlays/{material['id']}-{profile['id']}.webp"
            require(path)
            with Image.open(path) as overlay:
                if overlay.size != EXPECTED_SIZE:
                    raise AssertionError(f'{path.name} has size {overlay.size}')
                if overlay.mode not in {'RGBA', 'LA'}:
                    raise AssertionError(f'{path.name} has no alpha channel: {overlay.mode}')
            overlay_count += 1

    for profile in catalog['profiles']:
        require(ROOT / profile['thumbnail'])

    html = (ROOT / 'index.html').read_text('utf-8')
    for marker in ['scene-frame', 'overlayA', 'overlayB', 'materialGrid', 'profileGrid']:
        if marker not in html:
            raise AssertionError(f'HTML marker missing: {marker}')

    total_bytes = sum(path.stat().st_size for path in ROOT.rglob('*') if path.is_file())
    print('VALIDATION PASSED')
    print(f'Materials: {len(catalog["materials"])}')
    print(f'Profiles: {len(catalog["profiles"])}')
    print(f'Overlays: {overlay_count}')
    print(f'Package files: {sum(1 for p in ROOT.rglob("*") if p.is_file())}')
    print(f'Package size: {total_bytes / 1024 / 1024:.2f} MiB')


if __name__ == '__main__':
    main()
