#!/usr/bin/env python3
"""Record deterministic desktop and mobile AQUASTONE runtime walkthroughs."""

from __future__ import annotations

import contextlib
import functools
import http.server
import json
import socketserver
import threading
from pathlib import Path

from playwright.sync_api import Browser, Locator, Page, sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = ROOT / "runtime-artifacts"
ARTIFACTS.mkdir(exist_ok=True)


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args: object) -> None:
        return


@contextlib.contextmanager
def local_site():
    handler = functools.partial(QuietHandler, directory=str(ROOT))
    with socketserver.TCPServer(("127.0.0.1", 0), handler) as server:
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            yield f"http://127.0.0.1:{server.server_address[1]}/"
        finally:
            server.shutdown()
            thread.join(timeout=5)


def install_qa_overlay(page: Page, label: str, touch: bool = False) -> None:
    page.add_style_tag(
        content="""
        #aquastone-qa-badge {
          position: fixed; z-index: 2147483647; top: 16px; left: 16px;
          padding: 9px 13px; border-radius: 999px;
          background: rgba(25, 22, 19, .82); color: #fff;
          font: 600 11px/1.1 ui-sans-serif, system-ui, -apple-system, sans-serif;
          letter-spacing: .09em; text-transform: uppercase;
          box-shadow: 0 8px 28px rgba(0,0,0,.18); backdrop-filter: blur(10px);
          pointer-events: none;
        }
        #aquastone-qa-cursor {
          position: fixed; z-index: 2147483647; left: 0; top: 0;
          width: 22px; height: 22px; margin: -11px 0 0 -11px;
          border: 2px solid rgba(255,255,255,.95); border-radius: 50%;
          background: rgba(104, 73, 51, .78);
          box-shadow: 0 2px 10px rgba(0,0,0,.28);
          transform: translate(-80px,-80px); transition: transform .34s cubic-bezier(.2,.8,.2,1);
          pointer-events: none;
        }
        #aquastone-qa-cursor.is-touch { width: 28px; height: 28px; margin: -14px 0 0 -14px; opacity: .86; }
        .aquastone-qa-pulse {
          position: fixed; z-index: 2147483646; width: 24px; height: 24px;
          margin: -12px 0 0 -12px; border: 2px solid rgba(104,73,51,.72);
          border-radius: 50%; pointer-events: none;
          animation: aquastoneQaPulse .65s ease-out forwards;
        }
        @keyframes aquastoneQaPulse { to { transform: scale(2.6); opacity: 0; } }
        """
    )
    page.evaluate(
        """({label, touch}) => {
          const badge = document.createElement('div');
          badge.id = 'aquastone-qa-badge';
          badge.textContent = label;
          document.body.appendChild(badge);

          const cursor = document.createElement('div');
          cursor.id = 'aquastone-qa-cursor';
          if (touch) cursor.classList.add('is-touch');
          document.body.appendChild(cursor);

          window.__aquastoneQaCursor = { x: 0, y: 0 };
          window.__aquastoneQaMove = (x, y) => {
            window.__aquastoneQaCursor = { x, y };
            cursor.style.transform = `translate(${x}px, ${y}px)`;
          };
          window.__aquastoneQaPulse = () => {
            const ring = document.createElement('div');
            ring.className = 'aquastone-qa-pulse';
            ring.style.left = `${window.__aquastoneQaCursor.x}px`;
            ring.style.top = `${window.__aquastoneQaCursor.y}px`;
            document.body.appendChild(ring);
            setTimeout(() => ring.remove(), 700);
          };
        }""",
        {"label": label, "touch": touch},
    )


def pause(page: Page, milliseconds: int = 650) -> None:
    page.wait_for_timeout(milliseconds)


def smooth_scroll(page: Page, locator: Locator, block: str = "center") -> None:
    locator.evaluate("(element, block) => element.scrollIntoView({behavior:'smooth', block, inline:'center'})", block)
    pause(page, 1150)


def point_at(page: Page, locator: Locator) -> None:
    locator.scroll_into_view_if_needed()
    pause(page, 180)
    box = locator.bounding_box()
    if box is None:
        raise RuntimeError("Unable to locate interaction target")
    x = box["x"] + box["width"] / 2
    y = box["y"] + box["height"] / 2
    page.evaluate("([x, y]) => window.__aquastoneQaMove(x, y)", [x, y])
    pause(page, 440)


def qa_click(page: Page, locator: Locator, after: int = 900) -> None:
    point_at(page, locator)
    page.evaluate("window.__aquastoneQaPulse()")
    locator.click()
    pause(page, after)


def type_into(page: Page, locator: Locator, value: str) -> None:
    point_at(page, locator)
    locator.fill(value)
    pause(page, 420)


def record_desktop(browser: Browser, base_url: str) -> Path:
    context = browser.new_context(
        viewport={"width": 1440, "height": 900},
        record_video_dir=str(ARTIFACTS),
        record_video_size={"width": 1280, "height": 800},
        color_scheme="light",
    )
    page = context.new_page()
    page.set_default_timeout(15_000)
    page.goto(base_url, wait_until="domcontentloaded")
    pause(page, 2400)
    install_qa_overlay(page, "AQUASTONE • Desktop runtime QA")
    page.screenshot(path=str(ARTIFACTS / "desktop-runtime-start.png"), full_page=False)
    pause(page, 900)

    qa_click(page, page.locator('[data-system="interior"]:visible').first)
    qa_click(page, page.locator('[data-system="kitchen"]:visible').first)
    qa_click(page, page.locator('[data-system="exterior"]:visible').first)
    qa_click(page, page.locator('[data-system="bathroom"]:visible').first)

    qa_click(page, page.locator('[data-material="Pietra Grey"]'))
    qa_click(page, page.locator('[data-material="Calacatta Oro"]'))
    qa_click(page, page.locator('[data-material="Bianco Lumen"]'))

    technology = page.locator("#technology")
    smooth_scroll(page, technology)
    qa_click(page, page.locator('.layer-note[data-layer="core"]'))
    qa_click(page, page.locator('.layer-note[data-layer="surface"]'))

    systems = page.locator("#systems")
    smooth_scroll(page, systems, "start")
    pause(page, 1300)

    contact = page.locator("#contact")
    smooth_scroll(page, contact)
    qa_click(page, page.locator("[data-open-samples]:visible").last)
    dialog = page.locator("[data-samples-dialog]")
    type_into(page, dialog.locator('input[name="name"]'), "Maxim QA")
    type_into(page, dialog.locator('input[name="email"]'), "qa@example.com")
    type_into(page, dialog.locator('input[name="country"]'), "Switzerland")
    qa_click(page, dialog.locator("[data-close-dialog]"), after=700)

    page.evaluate("window.scrollTo({top: 0, behavior: 'smooth'})")
    pause(page, 1500)
    qa_click(page, page.locator("[data-language-toggle]"), after=450)
    qa_click(page, page.locator('[data-language="de"]'), after=1100)
    qa_click(page, page.locator("[data-language-toggle]"), after=450)
    qa_click(page, page.locator('[data-language="en"]'), after=900)

    page.screenshot(path=str(ARTIFACTS / "desktop-runtime-end.png"), full_page=False)
    pause(page, 900)
    video = page.video
    context.close()
    output = ARTIFACTS / "aquastone-desktop-runtime.webm"
    Path(video.path()).replace(output)
    return output


def record_mobile(browser: Browser, base_url: str) -> Path:
    context = browser.new_context(
        viewport={"width": 390, "height": 844},
        is_mobile=True,
        has_touch=True,
        device_scale_factor=1,
        record_video_dir=str(ARTIFACTS),
        record_video_size={"width": 390, "height": 844},
        color_scheme="light",
    )
    page = context.new_page()
    page.set_default_timeout(15_000)
    page.goto(base_url, wait_until="domcontentloaded")
    pause(page, 2400)
    install_qa_overlay(page, "AQUASTONE • Mobile runtime QA", touch=True)
    page.screenshot(path=str(ARTIFACTS / "mobile-runtime-start.png"), full_page=False)
    pause(page, 850)

    qa_click(page, page.locator("[data-menu-toggle]"), after=900)
    qa_click(page, page.locator("[data-menu-toggle]"), after=700)

    qa_click(page, page.locator('[data-system="kitchen"]:visible').first)
    qa_click(page, page.locator('[data-system="hospitality"]:visible').first)
    qa_click(page, page.locator('[data-system="bathroom"]:visible').first)

    qa_click(page, page.locator('[data-material="Dune Rift"]'))
    qa_click(page, page.locator('[data-material="Pietra Grey"]'))

    smooth_scroll(page, page.locator("#technology"))
    qa_click(page, page.locator('.layer-note[data-layer="decorative"]'))
    qa_click(page, page.locator('.layer-note[data-layer="core"]'))

    smooth_scroll(page, page.locator("#systems"), "start")
    pause(page, 1200)
    smooth_scroll(page, page.locator("#contact"))
    qa_click(page, page.locator("[data-open-samples]:visible").last)
    dialog = page.locator("[data-samples-dialog]")
    type_into(page, dialog.locator('input[name="name"]'), "Mobile QA")
    type_into(page, dialog.locator('input[name="email"]'), "mobile@example.com")
    qa_click(page, dialog.locator("[data-close-dialog]"), after=700)

    page.evaluate("window.scrollTo({top: 0, behavior: 'smooth'})")
    pause(page, 1500)
    page.screenshot(path=str(ARTIFACTS / "mobile-runtime-end.png"), full_page=False)
    pause(page, 900)
    video = page.video
    context.close()
    output = ARTIFACTS / "aquastone-mobile-runtime.webm"
    Path(video.path()).replace(output)
    return output


def main() -> None:
    with local_site() as base_url, sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        try:
            desktop = record_desktop(browser, base_url)
            mobile = record_mobile(browser, base_url)
        finally:
            browser.close()

    report = {
        "status": "passed",
        "source": "live local HTTP runtime from checked-out repository",
        "videos": [desktop.name, mobile.name],
        "screenshots": [
            "desktop-runtime-start.png",
            "desktop-runtime-end.png",
            "mobile-runtime-start.png",
            "mobile-runtime-end.png",
        ],
    }
    (ARTIFACTS / "runtime-video-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
