const app = document.getElementById('app');

const state = {
  googleReady: false,
  map: null,
  infoWindow: null,
  markers: [],
  rows: [],
};

app.innerHTML = `
  <header class="topbar">
    <div>
      <p class="eyebrow">Zhongxin Europe Growth OS</p>
      <h1>Google Maps Merchant Finder</h1>
      <p class="subtitle">Use official Google Places data to research building-materials merchants and export a clean CSV file.</p>
    </div>
    <div class="status-card"><span id="googleStatus" class="status-dot idle"></span><span id="statusText">Google Maps not loaded</span></div>
  </header>
  <main class="layout">
    <section class="panel controls">
      <h2>1. API setup</h2>
      <label>Google Maps Platform browser key<input id="gmpKey" type="password" autocomplete="off" placeholder="Paste browser key" /></label>
      <label class="checkbox-row"><input id="rememberKey" type="checkbox" /><span>Remember key in this browser only</span></label>
      <button id="loadGoogle" class="secondary">Load Google Maps</button>
      <p class="hint">Enable Maps JavaScript API and Places API (New). Keep the key restricted by website referrer.</p>
      <hr />
      <h2>2. Search</h2>
      <label>Keywords, one per line<textarea id="keywords" rows="4">building materials supplier\nbuilders merchant\nconstruction materials store</textarea></label>
      <label>City / country / area<input id="locationText" type="text" value="Zurich Switzerland" /></label>
      <div class="grid-two">
        <label>Region code<input id="regionCode" type="text" value="ch" maxlength="3" /></label>
        <label>Language<input id="languageCode" type="text" value="en-US" /></label>
      </div>
      <div class="grid-two">
        <label>Max / keyword<input id="maxResults" type="number" min="1" max="20" value="20" /></label>
        <label>Min rating<input id="minRating" type="number" min="0" max="5" step="0.1" value="0" /></label>
      </div>
      <button id="runSearch" class="primary">Run search</button>
      <button id="clearResults" class="ghost">Clear results</button>
      <hr />
      <h2>3. Export</h2>
      <div class="button-row"><button id="exportCsv" class="secondary" disabled>Export CSV</button><button id="exportJson" class="secondary" disabled>Export JSON</button></div>
    </section>
    <section class="workspace">
      <div id="map" class="map"></div>
      <section class="panel result-panel">
        <div class="result-header"><div><h2>Results</h2><p id="resultSummary" class="hint">No leads yet.</p></div><div class="metric"><strong id="resultCount">0</strong><span>leads</span></div></div>
        <div class="table-wrap"><table><thead><tr><th>Name</th><th>Phone</th><th>Website</th><th>Address</th><th>Rating</th><th>Coordinates</th><th>Maps</th></tr></thead><tbody id="resultsBody"><tr><td colspan="7" class="empty">Run a search to collect merchant leads.</td></tr></tbody></table></div>
      </section>
    </section>
  </main>
`;

const $ = (id) => document.getElementById(id);
const savedKey = localStorage.getItem('zx_gmp_browser_key');
if (savedKey) {
  $('gmpKey').value = savedKey;
  $('rememberKey').checked = true;
}

$('loadGoogle').addEventListener('click', loadGoogleMaps);
$('runSearch').addEventListener('click', runSearch);
$('clearResults').addEventListener('click', clearResults);
$('exportCsv').addEventListener('click', exportCsv);
$('exportJson').addEventListener('click', exportJson);

function setStatus(kind, text) {
  $('googleStatus').className = `status-dot ${kind}`;
  $('statusText').textContent = text;
}

function loadGoogleMaps() {
  const key = $('gmpKey').value.trim();
  if (!key) return alert('Paste a Google Maps Platform browser key first.');
  if ($('rememberKey').checked) localStorage.setItem('zx_gmp_browser_key', key);
  else localStorage.removeItem('zx_gmp_browser_key');
  if (window.google?.maps) {
    return initMap();
  }
  setStatus('busy', 'Loading Google Maps...');
  window.__zxInitMap = initMap;
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&loading=async&callback=__zxInitMap`;
  script.async = true;
  script.onerror = () => setStatus('error', 'Google Maps failed to load');
  document.head.appendChild(script);
}

async function initMap() {
  const { Map, InfoWindow } = await google.maps.importLibrary('maps');
  state.map = new Map($('map'), {
    center: { lat: 47.3769, lng: 8.5417 },
    zoom: 8,
    mapTypeControl: false,
    streetViewControl: false,
  });
  state.infoWindow = new InfoWindow();
  state.googleReady = true;
  setStatus('ok', 'Google Maps ready');
}

function parseKeywords() {
  return $('keywords').value
    .split(/[\n,;]+/)
    .map(v => v.trim())
    .filter(Boolean);
}

async function runSearch() {
  if (!state.googleReady) await loadGoogleMaps();
  if (!state.googleReady) return;
  const keywords = parseKeywords();
  if (!keywords.length) return alert('Enter at least one keyword.');

  setStatus('busy', 'Searching places...');
  const { Place } = await google.maps.importLibrary('places');
  const locationText = $('locationText').value.trim();
  const region = $('regionCode').value.trim().toLowerCase() || undefined;
  const language = $('languageCode').value.trim() || 'en-US';
  const maxResultCount = Math.max(1, Math.min(20, Number($('maxResults').value || 20)));
  const minRating = Math.max(0, Math.min(5, Number($('minRating').value || 0)));

  for (const keyword of keywords) {
    const textQuery = locationText ? `${keyword} in ${locationText}` : keyword;
    const request = {
      textQuery,
      fields: ['id', 'displayName', 'formattedAddress', 'location', 'businessStatus', 'rating', 'userRatingCount', 'googleMapsURI', 'types'],
      maxResultCount,
      minRating,
      language,
      region,
    };
    try {
      const { places } = await Place.searchByText(request);
      for (const place of places || []) {
        if (!place.id || state.rows.some(row => row.placeId === place.id)) continue;
        await enrichPlace(place);
        addPlace(place, textQuery);
      }
    } catch (error) {
      console.error(error);
      alert(`Search failed for: ${textQuery}\n${error.message || error}`);
    }
  }
  renderResults();
  setStatus('ok', `Done. ${state.rows.length} leads collected.`);
}

async function enrichPlace(place) {
  try {
    await place.fetchFields({
      fields: ['id', 'displayName', 'formattedAddress', 'location', 'businessStatus', 'rating', 'userRatingCount', 'googleMapsURI', 'types', 'nationalPhoneNumber', 'internationalPhoneNumber', 'websiteURI', 'regularOpeningHours'],
    });
  } catch (error) {
    console.warn('Place detail fetch failed', place.id, error);
  }
}

function addPlace(place, sourceQuery) {
  const lat = place.location?.lat?.() ?? null;
  const lng = place.location?.lng?.() ?? null;
  const row = {
    name: place.displayName || '',
    phone: place.internationalPhoneNumber || place.nationalPhoneNumber || '',
    website: place.websiteURI || '',
    address: place.formattedAddress || '',
    rating: place.rating ?? '',
    reviewCount: place.userRatingCount ?? '',
    lat,
    lng,
    mapsUrl: place.googleMapsURI || '',
    businessStatus: place.businessStatus || '',
    types: Array.isArray(place.types) ? place.types.join('|') : '',
    openingHours: place.regularOpeningHours?.weekdayDescriptions?.join(' | ') || '',
    placeId: place.id || '',
    sourceQuery,
  };
  state.rows.push(row);
  if (lat !== null && lng !== null) addMarker(row);
}

function addMarker(row) {
  const marker = new google.maps.Marker({
    map: state.map,
    position: { lat: row.lat, lng: row.lng },
    title: row.name,
  });
  marker.addListener('click', () => {
    state.infoWindow.setContent(`<strong>${escapeHtml(row.name)}</strong><br>${escapeHtml(row.address)}<br>${row.website ? `<a href="${row.website}" target="_blank" rel="noopener">Website</a>` : ''}`);
    state.infoWindow.open({ map: state.map, anchor: marker });
  });
  state.markers.push(marker);
}

function renderResults() {
  $('resultCount').textContent = state.rows.length;
  $('resultSummary').textContent = state.rows.length ? `Collected ${state.rows.length} unique places.` : 'No leads yet.';
  $('exportCsv').disabled = !state.rows.length;
  $('exportJson').disabled = !state.rows.length;
  if (!state.rows.length) {
    $('resultsBody').innerHTML = '<tr><td colspan="7" class="empty">Run a search to collect merchant leads.</td></tr>';
    return;
  }
  $('resultsBody').innerHTML = state.rows.map(row => `
    <tr>
      <td><strong>${escapeHtml(row.name)}</strong><br><small>${escapeHtml(row.businessStatus || '')}</small></td>
      <td>${escapeHtml(row.phone)}</td>
      <td>${row.website ? `<a href="${row.website}" target="_blank" rel="noopener">Website</a>` : ''}</td>
      <td>${escapeHtml(row.address)}</td>
      <td>${escapeHtml(String(row.rating || ''))}${row.reviewCount ? ` (${row.reviewCount})` : ''}</td>
      <td>${row.lat ?? ''}, ${row.lng ?? ''}</td>
      <td>${row.mapsUrl ? `<a href="${row.mapsUrl}" target="_blank" rel="noopener">Open</a>` : ''}</td>
    </tr>
  `).join('');

  const bounds = new google.maps.LatLngBounds();
  state.rows.forEach(row => {
    if (row.lat !== null && row.lng !== null) bounds.extend({ lat: row.lat, lng: row.lng });
  });
  if (!bounds.isEmpty()) state.map.fitBounds(bounds);
}

function clearResults() {
  state.rows = [];
  state.markers.forEach(marker => marker.setMap(null));
  state.markers = [];
  renderResults();
  setStatus(state.googleReady ? 'ok' : 'idle', state.googleReady ? 'Google Maps ready' : 'Google Maps not loaded');
}

function exportCsv() {
  const headers = ['name', 'phone', 'website', 'address', 'rating', 'reviewCount', 'lat', 'lng', 'mapsUrl', 'businessStatus', 'types', 'openingHours', 'placeId', 'sourceQuery'];
  const csv = [headers.join(',')].concat(state.rows.map(row => headers.map(h => csvCell(row[h])).join(','))).join('\n');
  download(`zhongxin-merchant-leads-${dateStamp()}.csv`, '\uFEFF' + csv, 'text/csv;charset=utf-8');
}

function exportJson() {
  download(`zhongxin-merchant-leads-${dateStamp()}.json`, JSON.stringify(state.rows, null, 2), 'application/json;charset=utf-8');
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function dateStamp() {
  return new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
}
