# Zhongxin Europe Growth OS

This repository is the working web/tooling base for the Zhongxin New Materials Europe expansion project.

> Current repository placeholder: `Maximvonshaft/testn`  
> Recommended final repository name: `zhongxin-europe`

## Purpose

Build practical commercial tools for the European building-materials market:

1. Lead discovery from map/business directories
2. Product and SKU landing pages
3. Competitor and price research
4. Buyer and distributor database preparation
5. Ukraine factory evaluation materials
6. Quotation, logistics and container-loading calculators

## First tool: Google Maps Merchant Finder

The first MVP is a browser-based lead-finding tool for building-materials merchants.

It lets the user search Google Places by keyword and location, then export merchant leads to CSV/JSON.

### Export fields

- Business name
- Address
- Phone number
- Website
- Google Maps URL
- Latitude / longitude
- Rating and review count
- Business status
- Google Place ID
- Opening hours when available
- Source query

### Technical approach

This MVP uses the official Google Maps JavaScript API and Places API (New). It does **not** scrape the Google Maps web UI.

## Local usage

Open `index.html` in a browser, enter a Google Maps Platform API key, then search.

For production usage, enable GitHub Pages on the repository and restrict the API key by HTTP referrer.

## Suggested project structure

```text
/
├── index.html
├── assets/
│   ├── app.js
│   └── styles.css
├── docs/
│   └── google-maps-lead-finder.md
└── README.md
```

## Roadmap

- MVP 1: single keyword/location search and CSV export
- MVP 2: batch country/city search
- MVP 3: duplicate cleaning and lead scoring
- MVP 4: CRM-style buyer database
- MVP 5: competitor price collector
- MVP 6: quotation and container-loading calculator
