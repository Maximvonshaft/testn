#!/usr/bin/env python3
"""Deterministic browser acceptance checks for the AQUASTONE static site."""

from __future__ import annotations

import contextlib
import functools
import http.server
import json
import shutil
import socketserver
import threading
from pathlib import Path

from playwright.sync_api import Page, sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = ROOT / "qa-artifacts"
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


def assert_true(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def reveal_complete_page(page: Page) -> None:
    """Exercise the real scroll path so every progressive section is rendered."""
    reveals = page.locator(".reveal")
    for index in range(reveals.count()):
        reveals.nth(index).scroll_into_view_if_needed()
        page.wait_for_timeout(140)
    page.evaluate("window.scrollTo({top: 0, behavior: 'instant'})")
    page.wait_for_timeout(300)


def exercise(page: Page, base_url: str, label: str) -> dict[str, object]:
    page.set_default_timeout(12_000)
    js_errors: list[str] = []
    console_errors: list[str] = []
    page.on("pageerror", lambda error: js_errors.append(str(error)))
    page.on(
        "console",
        lambda message: console_errors.append(message.text)
        if message.type == "error" and "ERR_NAME_NOT_RESOLVED" not in message.text
        else None,
    )

    page.goto(base_url, wait_until="domcontentloaded")
    page.wait_for_timeout(900)

    assert_true(page.title().startswith("AQUASTONE"), "Unexpected document title")
    assert_true(page.locator("h1").count() == 1, "Document must contain exactly one H1")
    assert_true(page.locator("#main").count() == 1, "Main landmark is missing")
    assert_true(page.locator(".material-card").count() == 9, "Material collection is incomplete")
    assert_true(page.locator(".system-card").count() == 6, "Application-system portfolio is incomplete")
    assert_true(page.locator(".layer").count() == 5, "Material layer architecture is incomplete")
    assert_true(
        page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1"),
        "Page has horizontal overflow",
    )

    baseline = ARTIFACTS / f"{label}-baseline.png"
    page.screenshot(path=str(baseline), full_page=False)

    page.locator('[data-system="kitchen"]:visible').first.click()
    page.wait_for_timeout(500)
    assert_true("Performance" in page.locator("#hero-title").inner_text(), "System switch did not update hero copy")
    assert_true(page.locator('[data-system="kitchen"].is-active').count() >= 1, "System state did not synchronize")

    material = page.locator('[data-material="Pietra Grey"]')
    material.click()
    assert_true(material.get_attribute("aria-pressed") == "true", "Material ARIA state is incorrect")
    assert_true(page.locator("[data-selected-material]").inner_text() == "Pietra Grey", "Material live region is stale")

    page.locator('.layer-note[data-layer="core"]').click()
    assert_true(
        page.locator('.layer[data-layer="core"]').get_attribute("aria-pressed") == "true",
        "Layer explorer did not synchronize",
    )

    page.locator("[data-open-samples]:visible").first.click()
    dialog = page.locator("[data-samples-dialog]")
    form = page.locator("[data-request-form]")
    assert_true(dialog.evaluate("element => element.open"), "Sample request dialog did not open")
    assert_true(form.locator("[required]").count() >= 6, "Required form fields are missing")
    assert_true(form.get_attribute("data-netlify") == "true", "Netlify form contract is missing")

    form.locator('[name="name"]').fill("AQUASTONE QA")
    form.locator('[name="email"]').fill("qa@example.com")
    form.locator('[name="country"]').fill("Switzerland")
    form.locator('[name="projectType"]').select_option(label="Residential")
    form.locator('[name="application"]').select_option(label="Bathrooms & wet areas")
    form.locator('[name="privacy"]').check()
    form.locator('button[type="submit"]').click()
    assert_true(
        "preview has no live form endpoint" in page.locator("[data-form-status]").inner_text().lower(),
        "Preview form guard did not prevent an invalid local submission",
    )
    assert_true(dialog.evaluate("element => element.open"), "Preview submission unexpectedly navigated away")

    page.locator("[data-close-dialog]").first.click()
    assert_true(not dialog.evaluate("element => element.open"), "Sample request dialog did not close")

    if page.viewport_size and page.viewport_size["width"] <= 760:
        page.locator("[data-menu-toggle]").click()
        assert_true(page.locator("#mobile-navigation").is_visible(), "Mobile menu did not open")
        page.locator("[data-menu-toggle]").click()
        assert_true(not page.locator("#mobile-navigation").is_visible(), "Mobile menu did not close")
    else:
        page.locator("[data-language-toggle]").click()
        page.locator('[data-language="de"]').click()
        assert_true(
            page.locator('[data-i18n="nav.technical"]').first.inner_text().strip().lower() == "technik",
            "Language switch did not update navigation",
        )
        page.locator("[data-language-toggle]").click()
        page.locator('[data-language="en"]').click()

    page.evaluate(
        """() => {
          const image = document.querySelector('[data-hero-image]');
          image.dispatchEvent(new Event('error'));
        }"""
    )
    assert_true(page.locator("[data-hero-image]").is_hidden(), "Hero fallback state did not activate")
    page.locator('[data-system="bathroom"]:visible').first.click()
    page.wait_for_timeout(350)

    reveal_complete_page(page)
    assert_true(page.locator(".reveal:not(.is-visible)").count() == 0, "Scroll reveal left invisible production content")
    assert_true(not js_errors, f"JavaScript errors detected: {js_errors}")
    assert_true(not console_errors, f"Console errors detected: {console_errors}")

    page.add_style_tag(content=".site-header{position:absolute!important;inset:0 0 auto 0!important}")
    full_page = ARTIFACTS / f"{label}-full.png"
    page.screenshot(path=str(full_page), full_page=True)
    return {
        "label": label,
        "status": "passed",
        "baseline_screenshot": baseline.name,
        "full_page_screenshot": full_page.name,
    }


def main() -> None:
    results: list[dict[str, object]] = []
    with local_site() as base_url, sync_playwright() as playwright:
        system_chromium = shutil.which("chromium") or shutil.which("chromium-browser")
        browser = playwright.chromium.launch(headless=True, executable_path=system_chromium)
        try:
            desktop = browser.new_page(viewport={"width": 1440, "height": 900})
            results.append(exercise(desktop, base_url, "desktop-1440x900"))
            desktop.close()

            mobile = browser.new_page(
                viewport={"width": 390, "height": 844},
                is_mobile=True,
                has_touch=True,
                device_scale_factor=1,
            )
            results.append(exercise(mobile, base_url, "mobile-390x844"))
            mobile.close()
        finally:
            browser.close()

    report = {"status": "passed", "checks": results}
    (ARTIFACTS / "browser-smoke.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
