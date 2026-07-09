# Details Probe v2 Acceptance Plan

## Purpose

The next test package must diagnose why some visible business websites are missed after opening Google Maps detail panels.

## Modes

### Collect visible list

Collect only currently visible Google Maps result cards. This avoids long scrolling and memory spikes.

### Probe visible details

Open only the first N visible detail cards, wait for the panel to stabilize, then export the extraction decision for each business.

### Probe current detail

The user manually opens one business. The plugin reads only the current detail panel and exports all website candidates and the selected website.

## Required exports

### Lead CSV

- name
- phone
- website
- address
- rating
- reviews
- latitude
- longitude
- googleMapsUrl
- capturedAt
- needsSelectorReview
- failureReason

### Probe CSV

- stage
- listName
- clickedText
- panelTitle
- panelTextLength
- externalAnchorCount
- domainCandidateCount
- topCandidates
- selectedWebsite
- rejectedCandidates
- failureReason
- waitedMs
- capturedAt

## Failure categories

- detail_not_opened
- panel_title_mismatch
- website_button_absent
- website_candidate_rejected
- website_candidate_found_but_not_written
- timeout_before_panel_stable
- selector_unknown

## Safe defaults

- Max visible details per run: 10
- Wait per detail: 2500 ms
- Hard timeout: 12000 ms
- No full DOM dump
- No HAR by default
- No long-running scroll loop

## Testing requested from user

1. Open one Google Maps search result page.
2. Run Collect visible list.
3. Run Probe visible details with limit 10.
4. Export Lead CSV and Probe CSV.
5. Send both files back for analysis.
