from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, Tuple

import cv2
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE_SCENE = ROOT / 'sources/hotel-suite-master.png'
SOURCE_BOARD = ROOT / 'sources/material-board.png'

SCENE_W, SCENE_H = 1672, 941
RECT_W, RECT_H = 900, 1800
WALL_QUAD = np.float32([
    [1362, 0],
    [1671, 0],
    [1671, 688],
    [1362, 637],
])
RECT_CORNERS = np.float32([
    [0, 0],
    [RECT_W - 1, 0],
    [RECT_W - 1, RECT_H - 1],
    [0, RECT_H - 1],
])

MATERIALS: Dict[str, dict] = {
    'smoked-walnut': {
        'name': 'Smoked Walnut', 'code': 'ZX-DWC-SW51',
        'crop': (1060, 710, 1305, 955), 'family': 'wood', 'tone': 'warm',
    },
    'soft-oak': {
        'name': 'Soft Oak', 'code': 'ZX-WPC-SO02',
        'crop': (410, 55, 655, 315), 'family': 'wood', 'tone': 'warm',
    },
    'warm-grey-stone': {
        'name': 'Warm Grey Stone', 'code': 'ZX-SPC-WG11',
        'crop': (1053, 55, 1306, 315), 'family': 'stone', 'tone': 'neutral',
    },
    'white-marble': {
        'name': 'White Marble', 'code': 'ZX-UV-WM21',
        'crop': (95, 398, 345, 635), 'family': 'stone', 'tone': 'cool',
    },
    'gold-vein-marble': {
        'name': 'Gold Vein Marble', 'code': 'ZX-UV-GV22',
        'crop': (410, 398, 655, 635), 'family': 'stone', 'tone': 'warm',
    },
    'ivory-panel': {
        'name': 'Ivory Panel', 'code': 'ZX-BWF-IV41',
        'crop': (95, 712, 345, 955), 'family': 'solid', 'tone': 'neutral',
    },
}

PROFILES = {
    'flat': {'name': 'Flat Panel', 'code': 'P-FLAT'},
    'slat': {'name': 'Slat Panel', 'code': 'P-SLAT18'},
    'fluted': {'name': 'Fluted Panel', 'code': 'P-FLUTED'},
    'wide-rib': {'name': 'Wide Rib', 'code': 'P-RIB60'},
}


def ensure_dirs() -> None:
    for path in [
        ROOT / 'assets/scene', ROOT / 'assets/wall/overlays',
        ROOT / 'assets/wall/thumbs', ROOT / 'assets/wall/profile-thumbs',
        ROOT / 'data', ROOT / 'docs',
    ]:
        path.mkdir(parents=True, exist_ok=True)


def normalize_illumination(rgb: np.ndarray) -> np.ndarray:
    lab = cv2.cvtColor(rgb, cv2.COLOR_RGB2LAB).astype(np.float32)
    light = lab[:, :, 0]
    blur = cv2.GaussianBlur(light, (0, 0), sigmaX=35, sigmaY=35)
    target = np.mean(blur)
    corrected = light / np.maximum(blur, 1.0) * target
    lab[:, :, 0] = np.clip(corrected, 0, 255)
    return cv2.cvtColor(lab.astype(np.uint8), cv2.COLOR_LAB2RGB)


def mirrored_tile(crop: Image.Image, size: int = 1024) -> np.ndarray:
    rgb = np.asarray(crop.convert('RGB'))
    rgb = normalize_illumination(rgb)
    rgb = cv2.resize(rgb, (size // 2, size // 2), interpolation=cv2.INTER_CUBIC)
    top = np.concatenate([rgb, np.fliplr(rgb)], axis=1)
    return np.concatenate([top, np.flipud(top)], axis=0)


def profile_shading(profile: str, width: int, height: int) -> np.ndarray:
    x = np.arange(width, dtype=np.float32)
    if profile == 'flat':
        shade = np.ones(width, dtype=np.float32)
        for seam in (width // 3, 2 * width // 3):
            shade[max(0, seam - 2):min(width, seam + 2)] = 0.83
            shade[min(width - 1, seam + 2):min(width, seam + 5)] = 1.06
    elif profile == 'slat':
        period = 48.0
        phase = np.mod(x, period)
        rib = np.clip(phase / 33.0, 0, 1)
        shade = 1.13 - 0.28 * rib
        shade[phase >= 33] = 0.55 + 0.10 * (phase[phase >= 33] - 33) / 15.0
    elif profile == 'fluted':
        period = 22.0
        shade = 0.88 + 0.22 * (0.5 + 0.5 * np.cos(2 * np.pi * x / period))
    elif profile == 'wide-rib':
        period = 130.0
        phase = np.mod(x, period)
        shade = np.full(width, 0.95, dtype=np.float32)
        rib = phase < 95
        shade[rib] = 1.12 - 0.20 * (phase[rib] / 95.0)
        shade[~rib] = 0.58 + 0.09 * ((phase[~rib] - 95.0) / 35.0)
    else:
        raise ValueError(f'Unknown profile: {profile}')
    return np.repeat(shade[None, :], height, axis=0)


def build_material_rect(tile: np.ndarray, profile: str, lightmap: np.ndarray, family: str) -> np.ndarray:
    material = cv2.resize(tile, (RECT_W, RECT_H), interpolation=cv2.INTER_CUBIC).astype(np.float32) / 255.0
    shading = profile_shading(profile, RECT_W, RECT_H)
    material *= shading[:, :, None]
    material *= lightmap[:, :, None]
    if family == 'stone':
        material = 0.96 * material + 0.04
    elif family == 'solid':
        material = 0.92 * material + 0.08
    return np.clip(material * 255.0, 0, 255).astype(np.uint8)


def create_lightmap(scene_rgb: np.ndarray, matrix_to_rect: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
    wall_rect = cv2.warpPerspective(scene_rgb, matrix_to_rect, (RECT_W, RECT_H), flags=cv2.INTER_CUBIC)
    gray = cv2.cvtColor(wall_rect, cv2.COLOR_RGB2GRAY).astype(np.float32) / 255.0
    low = cv2.GaussianBlur(gray, (0, 0), sigmaX=58, sigmaY=58)
    low /= max(float(np.mean(low)), 1e-6)
    low = np.clip(low, 0.72, 1.22)
    light_vis = ((low - low.min()) / max(low.max() - low.min(), 1e-6) * 255).astype(np.uint8)
    return low, light_vis


def make_mask(matrix_to_scene: np.ndarray) -> np.ndarray:
    rect_alpha = np.full((RECT_H, RECT_W), 255, dtype=np.uint8)
    return cv2.warpPerspective(
        rect_alpha, matrix_to_scene, (SCENE_W, SCENE_H),
        flags=cv2.INTER_NEAREST, borderMode=cv2.BORDER_CONSTANT, borderValue=0,
    )


def render_overlay(rect_rgb: np.ndarray, matrix_to_scene: np.ndarray, mask: np.ndarray) -> Image.Image:
    warped = cv2.warpPerspective(
        rect_rgb, matrix_to_scene, (SCENE_W, SCENE_H),
        flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0),
    )
    return Image.fromarray(np.dstack([warped, mask]), mode='RGBA')


def composite(base: Image.Image, overlay: Image.Image) -> Image.Image:
    return Image.alpha_composite(base.convert('RGBA'), overlay.convert('RGBA')).convert('RGB')


def save_webp(image: Image.Image, path: Path, *, alpha: bool = False) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if alpha:
        image.save(path, 'WEBP', lossless=True, method=6)
    else:
        image.convert('RGB').save(path, 'WEBP', quality=90, method=6)


def draw_audit(base: Image.Image, mask: np.ndarray) -> None:
    base_rgba = base.convert('RGBA')
    red = Image.new('RGBA', base.size, (255, 36, 36, 0))
    red.putalpha(Image.fromarray((mask.astype(np.float32) * 0.42).astype(np.uint8)))
    audit = Image.alpha_composite(base_rgba, red)
    draw = ImageDraw.Draw(audit)
    draw.line([tuple(map(int, p)) for p in WALL_QUAD] + [tuple(map(int, WALL_QUAD[0]))], fill=(255, 225, 92, 255), width=4)
    audit.save(ROOT / 'docs/wall-mask-audit.png')


def make_contact_sheet(base: Image.Image, overlays: Dict[Tuple[str, str], Image.Image]) -> None:
    cards = []
    for material_id, material in MATERIALS.items():
        preview = composite(base, overlays[(material_id, 'flat')]).resize((480, 270), Image.Resampling.LANCZOS)
        cards.append((preview, material['name']))
    for profile_id, profile in PROFILES.items():
        preview = composite(base, overlays[('smoked-walnut', profile_id)]).resize((480, 270), Image.Resampling.LANCZOS)
        cards.append((preview, f"Smoked Walnut · {profile['name']}"))
    cols = 2
    rows = (len(cards) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * 500, rows * 310), (18, 16, 14))
    draw = ImageDraw.Draw(sheet)
    for i, (card, label) in enumerate(cards):
        x = (i % cols) * 500 + 10
        y = (i // cols) * 310 + 10
        sheet.paste(card, (x, y))
        draw.text((x, y + 278), label, fill=(235, 216, 184))
    sheet.save(ROOT / 'docs/wall-variants-contact-sheet.jpg', quality=90)


def main() -> None:
    ensure_dirs()
    if not SOURCE_SCENE.exists() or not SOURCE_BOARD.exists():
        raise FileNotFoundError('Required generated source scene or material board is missing.')
    base = Image.open(SOURCE_SCENE).convert('RGB')
    if base.size != (SCENE_W, SCENE_H):
        raise ValueError(f'Unexpected scene size: {base.size}')
    save_webp(base, ROOT / 'assets/scene/base.webp')
    scene_rgb = np.asarray(base)
    board = Image.open(SOURCE_BOARD).convert('RGB')
    matrix_to_rect = cv2.getPerspectiveTransform(WALL_QUAD, RECT_CORNERS)
    matrix_to_scene = cv2.getPerspectiveTransform(RECT_CORNERS, WALL_QUAD)
    lightmap, light_vis = create_lightmap(scene_rgb, matrix_to_rect)
    Image.fromarray(light_vis).save(ROOT / 'assets/wall/lightmap.webp', 'WEBP', quality=90)
    mask = make_mask(matrix_to_scene)
    Image.fromarray(mask).save(ROOT / 'assets/wall/mask.png')
    draw_audit(base, mask)

    catalog_materials = []
    overlays: Dict[Tuple[str, str], Image.Image] = {}
    for material_id, meta in MATERIALS.items():
        crop = board.crop(meta['crop'])
        tile = mirrored_tile(crop)
        thumb = Image.fromarray(tile).resize((320, 320), Image.Resampling.LANCZOS)
        save_webp(thumb, ROOT / f'assets/wall/thumbs/{material_id}.webp')
        catalog_materials.append({
            'id': material_id,
            'name': meta['name'],
            'demoCode': meta['code'],
            'family': meta['family'],
            'tone': meta['tone'],
            'thumbnail': f'assets/wall/thumbs/{material_id}.webp',
        })
        for profile_id in PROFILES:
            rect_rgb = build_material_rect(tile, profile_id, lightmap, meta['family'])
            if material_id == 'smoked-walnut':
                y0 = max(0, (RECT_H - 570) // 2)
                profile_thumb = Image.fromarray(rect_rgb[y0:y0 + 570]).resize((220, 140), Image.Resampling.LANCZOS)
                save_webp(profile_thumb, ROOT / f'assets/wall/profile-thumbs/{profile_id}.webp')
            overlay = render_overlay(rect_rgb, matrix_to_scene, mask)
            save_webp(overlay, ROOT / f'assets/wall/overlays/{material_id}-{profile_id}.webp', alpha=True)
            overlays[(material_id, profile_id)] = overlay

    catalog = {
        'version': '0.5.0',
        'scene': {
            'id': 'hotel-suite-golden-wall',
            'name': 'Luxe Hotel Suite',
            'width': SCENE_W,
            'height': SCENE_H,
            'base': 'assets/scene/base.webp',
            'wallMask': 'assets/wall/mask.png',
            'wallQuad': WALL_QUAD.astype(int).tolist(),
        },
        'materials': catalog_materials,
        'profiles': [
            {'id': k, 'name': v['name'], 'demoCode': v['code'], 'thumbnail': f'assets/wall/profile-thumbs/{k}.webp'}
            for k, v in PROFILES.items()
        ],
        'finishes': [
            {'id': 'matte', 'name': 'Silk Matte'},
            {'id': 'satin', 'name': 'Satin'},
            {'id': 'soft-gloss', 'name': 'Soft Gloss'},
        ],
        'dimensions': [2400, 2800, 3000],
        'defaults': {
            'material': 'smoked-walnut',
            'profile': 'flat',
            'finish': 'satin',
            'dimension': 2800,
        },
        'disclaimer': 'Product and profile codes are demonstration identifiers pending factory confirmation.',
    }
    (ROOT / 'data/catalog.json').write_text(json.dumps(catalog, indent=2), encoding='utf-8')
    make_contact_sheet(base, overlays)
    print(f'Built {len(overlays)} aligned wall overlays.')


if __name__ == '__main__':
    main()
