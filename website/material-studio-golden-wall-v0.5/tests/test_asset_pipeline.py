import json
import unittest
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SCENE_SIZE = (1672, 941)
MATERIALS = [
    "smoked-walnut",
    "soft-oak",
    "warm-grey-stone",
    "white-marble",
    "gold-vein-marble",
    "ivory-panel",
]
PROFILES = ["flat", "slat", "fluted", "wide-rib"]


class AssetPipelineTests(unittest.TestCase):
    def test_base_scene_and_mask_have_canonical_dimensions(self):
        with Image.open(ROOT / "assets/scene/base.webp") as scene, Image.open(ROOT / "assets/wall/mask.png") as mask:
            self.assertEqual(scene.size, SCENE_SIZE)
            self.assertEqual(mask.size, SCENE_SIZE)

    def test_catalog_declares_exact_variant_matrix(self):
        catalog = json.loads((ROOT / "data/catalog.json").read_text("utf-8"))
        self.assertEqual([m["id"] for m in catalog["materials"]], MATERIALS)
        self.assertEqual([p["id"] for p in catalog["profiles"]], PROFILES)
        self.assertEqual(catalog["scene"]["width"], SCENE_SIZE[0])
        self.assertEqual(catalog["scene"]["height"], SCENE_SIZE[1])

    def test_every_material_profile_overlay_exists_and_matches_scene(self):
        for material in MATERIALS:
            for profile in PROFILES:
                path = ROOT / f"assets/wall/overlays/{material}-{profile}.webp"
                self.assertTrue(path.exists(), path)
                with Image.open(path) as overlay:
                    self.assertEqual(overlay.size, SCENE_SIZE, path)

    def test_profile_thumbnails_exist(self):
        for profile in PROFILES:
            path = ROOT / f"assets/wall/profile-thumbs/{profile}.webp"
            self.assertTrue(path.exists(), path)
            with Image.open(path) as thumbnail:
                self.assertEqual(thumbnail.size, (220, 140))

    def test_overlay_alpha_is_zero_outside_approved_wall(self):
        mask = np.asarray(Image.open(ROOT / "assets/wall/mask.png").convert("L"))
        outside = mask < 8
        for path in sorted((ROOT / "assets/wall/overlays").glob("*.webp")):
            alpha = np.asarray(Image.open(path).convert("RGBA"))[:, :, 3]
            leaked = np.count_nonzero(alpha[outside] > 8)
            self.assertEqual(leaked, 0, f"{path.name} leaks into {leaked} outside pixels")

    def test_wall_interior_is_covered(self):
        mask = np.asarray(Image.open(ROOT / "assets/wall/mask.png").convert("L"))
        interior = mask > 250
        self.assertGreater(np.count_nonzero(interior), 150_000)
        for path in sorted((ROOT / "assets/wall/overlays").glob("*.webp")):
            alpha = np.asarray(Image.open(path).convert("RGBA"))[:, :, 3]
            ratio = np.count_nonzero(alpha[interior] > 245) / np.count_nonzero(interior)
            self.assertGreater(ratio, 0.995, f"{path.name} only covers {ratio:.3%}")

    def test_compositing_does_not_change_any_outside_wall_pixel(self):
        base = np.asarray(Image.open(ROOT / "assets/scene/base.webp").convert("RGB"), dtype=np.uint8)
        mask = np.asarray(Image.open(ROOT / "assets/wall/mask.png").convert("L"))
        outside = mask < 8
        sample = Image.open(ROOT / "assets/wall/overlays/smoked-walnut-slat.webp").convert("RGBA")
        rgba = np.asarray(sample, dtype=np.uint8)
        alpha = rgba[:, :, 3:4].astype(np.float32) / 255.0
        composited = (rgba[:, :, :3].astype(np.float32) * alpha + base.astype(np.float32) * (1 - alpha)).round().astype(np.uint8)
        self.assertTrue(np.array_equal(composited[outside], base[outside]))


if __name__ == "__main__":
    unittest.main()
