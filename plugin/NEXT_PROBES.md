# Plugin Probe Plan

## Goal

Make website misses diagnosable in one run.

## Probe events

The next plugin build should emit a compact JSON/CSV row for every attempted business detail panel:

- query
- lead name from list
- clicked element text
- panel title
- panel text length
- panel load time
- website button count
- external anchor count
- visible domain candidates
- selected website candidate
- rejected candidates with reason
- final website value
- failure reason

## Probe modes

### 1. Details-only probe

Do not scroll. Use the current visible list and open N visible details only. This isolates website extraction.

### 2. One-business probe

User selects or clicks one business manually. Plugin exports all visible detail panel signals for that one business.

### 3. Failure screenshot marker

When website is empty but a domain-like text exists in the panel, add a `needs_selector_review` flag and save the panel text sample.

## Acceptance

A missed website should become one of these explicit categories:

- detail_not_opened
- panel_title_mismatch
- website_button_absent
- website_candidate_rejected
- website_candidate_found_but_not_written
- timeout_before_panel_stable
- selector_unknown
