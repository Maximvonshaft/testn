# SourcePilot Commercial Suite v0.2

A cloud-ready commercial sourcing suite derived from the Zhongxin Europe Lead OS work.

This repository is now the central management platform for three parallel tracks:

1. **Browser Plugin Track** — small-sample Google Maps research helper, retained as a tactical assistant.
2. **Cloud Business Track** — general-purpose B2B sourcing platform for lead import, dedupe, scoring, enrichment and export.
3. **Building Materials Website Track** — future front door for composite materials brand, distributor program and sample requests.

## Operating model

GitHub is treated as the central control plane:

- Issues = task cards / agent mandates.
- Pull requests = execution packages.
- Branches = isolated delivery lanes.
- Reviews = acceptance gates.

## Product stance

This is not positioned as a Google Maps scraping SaaS. The product value is:

> from public lead signals and user-supplied data to a clean, scored, actionable B2B buyer database.

## Tracks

### A证 Cloud

Responsible for SourcePilot cloud business product.

First branch:

```text
feat/sourcepilot-cloud-suite-v0-2
```

### A证 Plugin

Responsible for browser plugin diagnostics, small-sample helper and selector probes.

First branch:

```text
feat/maps-plugin-agent-v1-9
```

## Cloud business quick start

```bash
cd sourcepilot/cloud
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m app.seed
uvicorn app.main:app --reload --host 127.0.0.1 --port 8088
```

Open:

```text
http://127.0.0.1:8088
```

## Core workflow

1. Create or select a campaign.
2. Import CSV leads from the browser plugin, gosom/google-maps-scraper, or another user-supplied source.
3. SourcePilot normalizes, dedupes and scores the leads.
4. Review Lead Inbox.
5. Export clean CSV for outreach or CRM.

## Product direction

The long-term product is not a scraper. It is a commercial sourcing loop:

```text
playbook -> import/collect -> clean -> dedupe -> score -> enrich -> review -> export/outreach -> feedback
```
