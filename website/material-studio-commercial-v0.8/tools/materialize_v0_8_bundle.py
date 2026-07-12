from __future__ import annotations

import argparse
import base64
import gzip
import json
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Reconstruct the Material Studio v0.8 UTF-8 source tree."
    )
    parser.add_argument(
        "--destination",
        default="material_studio_commercial_site_v0_8",
        help="Directory where the reconstructed source tree will be written.",
    )
    args = parser.parse_args()

    package_root = Path(__file__).resolve().parents[1]
    bundle_path = (
        package_root
        / "source"
        / "material-studio-v0.8-text-bundle.json.gz.b64"
    )

    encoded = bundle_path.read_text(encoding="utf-8")
    compressed = base64.b64decode(encoded)
    payload = json.loads(gzip.decompress(compressed).decode("utf-8"))

    files = payload.get("files")
    if not isinstance(files, dict):
        raise ValueError("Bundle payload does not contain a valid files object.")

    destination = Path(args.destination).resolve()
    destination.mkdir(parents=True, exist_ok=True)

    for relative_path, content in files.items():
        if not isinstance(relative_path, str) or not isinstance(content, str):
            raise ValueError("Bundle contains a non-text file entry.")

        target = (destination / relative_path).resolve()
        try:
            target.relative_to(destination)
        except ValueError as error:
            raise ValueError(
                f"Unsafe bundle path outside destination: {relative_path}"
            ) from error

        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")

    print(f"Wrote {len(files)} UTF-8 files to {destination}")


if __name__ == "__main__":
    main()
