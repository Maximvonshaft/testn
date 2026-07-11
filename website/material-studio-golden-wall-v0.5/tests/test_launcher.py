from __future__ import annotations

import json
import socket
import threading
import unittest
import urllib.request
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from server import create_server, create_server_with_fallback, find_available_port  # noqa: E402


class LauncherTests(unittest.TestCase):
    def test_find_available_port_skips_an_occupied_preferred_port(self):
        blocker = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        blocker.bind(("127.0.0.1", 0))
        blocker.listen(1)
        occupied_port = blocker.getsockname()[1]
        self.addCleanup(blocker.close)

        selected = find_available_port("127.0.0.1", occupied_port, search_span=5)

        self.assertNotEqual(selected, occupied_port)
        self.assertGreater(selected, 0)

    def test_create_server_with_fallback_binds_after_occupied_port(self):
        blocker = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        blocker.bind(("127.0.0.1", 0))
        blocker.listen(1)
        occupied_port = blocker.getsockname()[1]
        self.addCleanup(blocker.close)

        server = create_server_with_fallback("127.0.0.1", occupied_port, search_span=5)
        self.addCleanup(server.server_close)

        self.assertNotEqual(server.server_address[1], occupied_port)

    def test_server_serves_required_assets_from_its_bound_port(self):
        server = create_server("127.0.0.1", 0)
        port = server.server_address[1]
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        self.addCleanup(server.shutdown)
        self.addCleanup(server.server_close)

        required = {
            "/": "text/html",
            "/data/catalog.json": "application/json",
            "/assets/app.mjs": "javascript",
            "/assets/state.mjs": "javascript",
            "/assets/scene/base.webp": "image/webp",
            "/assets/wall/overlays/smoked-walnut-flat.webp": "image/webp",
        }
        for path, expected_type in required.items():
            with self.subTest(path=path):
                with urllib.request.urlopen(f"http://127.0.0.1:{port}{path}", timeout=5) as response:
                    body = response.read()
                    self.assertEqual(response.status, 200)
                    self.assertIn(expected_type, response.headers.get("Content-Type", ""))
                    self.assertGreater(len(body), 0)

        with urllib.request.urlopen(f"http://127.0.0.1:{port}/api/health", timeout=5) as response:
            health = json.loads(response.read().decode("utf-8"))
        self.assertEqual(health, {"ok": True, "version": "0.5.1"})


if __name__ == "__main__":
    unittest.main()
