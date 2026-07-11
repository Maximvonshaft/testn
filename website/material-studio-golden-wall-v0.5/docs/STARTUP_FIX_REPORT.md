# Startup Failure Root-Cause and Fix Report — v0.5.1

## Reported symptom

The page displayed:

```text
Required assets could not be loaded.
```

## Reproduced root cause

The v0.5 Windows launcher opened `http://127.0.0.1:8080` before starting its own server and assumed port 8080 was free.

When another Material Studio demo or any other process already owned port 8080:

1. The browser connected to the existing process.
2. Requests for `data/catalog.json`, `assets/app.mjs`, the base scene, and the initial wall overlay returned HTTP 404.
3. The new v0.5 server failed to bind with `OSError: address already in use`.
4. The frontend entered the fatal asset-loading state.

This failure was reproduced with an occupied port 8080.

## Fix

v0.5.1 changes startup behavior:

- Bind the local HTTP server before opening the browser.
- Prefer port 8080, but automatically try 8081–8129 if it is occupied.
- Open the exact successfully bound URL.
- Explicitly serve `.mjs`, `.json`, `.webp`, `.css`, and `.svg` with browser-safe MIME types.
- Add a regression test that occupies the preferred port and verifies fallback binding.
- Verify required HTML, catalog, JavaScript modules, base scene, first overlay, and API health through the bound server.

## Fresh verification evidence

```text
Python tests: 12 passed
Node tests: 3 passed
Package validation: passed
Required HTTP assets: HTTP 200
API health: HTTP 200, version 0.5.1
Occupied 8080 fallback: selected 8081 and served catalog/base scene successfully
```
