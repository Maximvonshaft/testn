const app = document.getElementById('app');

const PLAYBOOKS = {
  ch: {
    label: 'Switzerland',
    region: 'ch',
    language: 'en-US',
    cities: ['Zurich Switzerland', 'Bern Switzerland', 'Lausanne Switzerland', 'Geneva Switzerland', 'Basel Switzerland'],
    keywords: ['building materials supplier', 'builders merchant', 'bathroom wall panels', 'wall panel supplier', 'flooring supplier'],
  },
  de: {
    label: 'Germany',
    region: 'de',
    language: 'de-DE',
    cities: ['Munich Germany', 'Stuttgart Germany', 'Frankfurt Germany', 'Nuremberg Germany', 'Berlin Germany'],
    keywords: ['Baustoffhandel', 'Baumarkt', 'Wandpaneele Händler', 'Bauzentrum', 'Bodenbelag Händler'],
  },
  fr: {
    label: 'France',
    region: 'fr',
    language: 'fr-FR',
    cities: ['Paris France', 'Lyon France', 'Marseille France', 'Lille France', 'Strasbourg France'],
    keywords: ['négoce matériaux construction', 'magasin matériaux bâtiment', 'panneaux muraux fournisseur', 'revêtement mural intérieur'],
  },
  pl: {
    label: 'Poland',
    region: 'pl',
    language: 'pl-PL',
    cities: ['Warsaw Poland', 'Krakow Poland', 'Wroclaw Poland', 'Poznan Poland', 'Gdansk Poland'],
    keywords: ['materiały budowlane hurtownia', 'sklep budowlany', 'panele ścienne dostawca', 'hurtownia budowlana'],
  },
  ua: {
    label: 'Ukraine',
    region: 'ua',
    language: 'uk-UA',
    cities: ['Lviv Ukraine', 'Kyiv Ukraine', 'Uzhhorod Ukraine', 'Ivano-Frankivsk Ukraine', 'Ternopil Ukraine'],
    keywords: ['будівельні матеріали', 'магазин будматеріалів', 'постачальник стінових панелей', 'будівельний магазин'],
  },
  ro: {
    label: 'Romania',
    region: 'ro',
    language: 'ro-RO',
    cities: ['Bucharest Romania', 'Cluj-Napoca Romania', 'Timisoara Romania', 'Iasi Romania', 'Brasov Romania'],
    keywords: ['materiale de construcții', 'depozit materiale construcții', 'magazin bricolaj', 'panouri de perete furnizor'],
  },
  balkans: {
    label: 'Balkans',
    region: 'me',
    language: 'en-US',
    cities: ['Podgorica Montenegro', 'Belgrade Serbia', 'Skopje North Macedonia', 'Tirana Albania', 'Sarajevo Bosnia and Herzegovina'],
    keywords: ['building materials supplier', 'construction materials store', 'bathroom wall panels', 'flooring supplier'],
  },
};

const STORAGE_KEY = 'zx_europe_lead_finder_v1';
const API_KEY_STORAGE = 'zx_gmp_browser_key';

const state = {
  googleReady: false,
  map: null,
  markers: [],
  leads: [],
  running: false,
  activePlaybook: 'ch',
};

app.innerHTML = `
  <header class="topbar">
    <div>
      <p class="eyebrow">Zhongxin Europe Growth OS</p>
      <h1>Building Materials Lead Finder</h1>
      <p class="subtitle">Commercial lead-research workbench for distributors, building-materials merchants and renovation suppliers in Europe.</p>
    </div>
    <div class="status-card"><span id="statusDot" class="status-dot idle"></span><span id="statusText">Not loaded</span></div>
  </header>

  <main class="layout">
    <section class="panel controls">
      <h2>1. Market playbook</h2>
      <label>Target market
        <select id="playbook"></select>
      </label>
      <button id="applyPlaybook" class="secondary">Apply playbook</button>

      <hr />
      <h2>2. Google setup</h2>
      <label>Google Maps Platform browser key
        <input id="apiKey" type="password" autocomplete="off" placeholder="Paste browser API key" />
      </label>
      <label class="checkbox-row"><input id="rememberKey" type="checkbox" /><span>Remember key in this browser only</span></label>
      <button id="loadGoogle" class="secondary">Load Google Maps</button>
      <p class="hint">Enable Maps JavaScript API and Places API (New). Restrict the key by referrer before publishing.</p>

      <hr />
      <h2>3. Search batch</h2>
      <label>Keywords, one per line<textarea id="keywords" rows="5"></textarea></label>
      <label>Cities / areas, one per line<textarea id="cities" rows="5"></textarea></label>
      <div class="grid-two">
        <label>Region code<input id="region" value="ch" maxlength="3" /></label>
        <label>Language<input id="language" value="en-US" /></label>
      </div>
      <div class="grid-two">
        <label>Max / query<input id="maxResults" type="number" min="1" max="20" value="20" /></label>
        <label>Delay ms<input id="delayMs" type="number" min="0" max="10000" value="500" /></label>
      </div>
      <button id="runBatch" class="primary">Run batch search</button>
      <button id="stopBatch" class="ghost">Stop after current query</button>

      <hr />
      <h2>4. Export / workspace</h2>
      <div class="button-row">
        <button id="exportCsv" class="secondary">Export CSV</button>
        <button id="exportJson" class="secondary">Export JSON</button>
        <button id="saveLocal" class="secondary">Save</button>
        <button id="loadLocal" class="secondary">Load</button>
        <button id="clearAll" class="ghost">Clear</button>
      </div>
    </section>

    <section class="workspace">
      <div id="map" class="map"></div>
      <section class="panel result-panel">
        <div class="result-header">
          <div><h2>Lead database</h2><p id="summary" class="hint">No leads yet.</p></div>
          <div class="metric"><strong id="leadCount">0</strong><span>leads</span></div>
        </div>
        <div class="toolbar">
          <input id="filterText" placeholder="Filter by name, website, city, country, query..." />
          <select id="statusFilter">
            <option value="">All status</option>
            <option>New</option><option>Qualified</option><option>Contacted</option><option>Not relevant</option>
          </select>
        </div>
        <div class="table-wrap"><table><thead><tr><th>Score</th><th>Name</th><th>Contact</th><th>Location</th><th>Rating</th><th>Source</th><th>Status</th><th>Notes</th></tr></thead><tbody id="tbody"></tbody></table></div>
      </section>
    </section>
  </main>
`;

const $ = (id) => document.getElementById(id);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const lines = (value) => String(value || '').split(/[\n;]/).map(v => v.trim()).filter(Boolean);
const safe = (value) => String(value ?? '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));

init();

function init() {
  Object.entries(PLAYBOOKS).forEach(([key, book]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = book.label;
    $('playbook').appendChild(opt);
  });
  const savedKey = localStorage.getItem(API_KEY_STORAGE);
  if (savedKey) { $('apiKey').value = savedKey; $('rememberKey').checked = true; }
  applyPlaybook('ch');
  bindEvents();
  render();
}

function bindEvents() {
  $('applyPlaybook').addEventListener('click', () => applyPlaybook($('playbook').value));
  $('loadGoogle').addEventListener('click', loadGoogleMaps);
  $('runBatch').addEventListener('click', runBatch);
  $('stopBatch').addEventListener('click', () => { state.running = false; setStatus('busy', 'Stopping after current query'); });
  $('exportCsv').addEventListener('click', exportCsv);
  $('exportJson').addEventListener('click', exportJson);
  $('saveLocal').addEventListener('click', saveLocal);
  $('loadLocal').addEventListener('click', loadLocal);
  $('clearAll').addEventListener('click', clearAll);
  $('filterText').addEventListener('input', render);
  $('statusFilter').addEventListener('change', render);
  $('tbody').addEventListener('change', updateLeadField);
  $('tbody').addEventListener('input', updateLeadField);
}

function applyPlaybook(key) {
  const book = PLAYBOOKS[key] || PLAYBOOKS.ch;
  state.activePlaybook = key;
  $('playbook').value = key;
  $('keywords').value = book.keywords.join('\n');
  $('cities').value = book.cities.join('\n');
  $('region').value = book.region;
  $('language').value = book.language;
}

function setStatus(kind, text) {
  $('statusDot').className = `status-dot ${kind}`;
  $('statusText').textContent = text;
}

function loadGoogleMaps() {
  const key = $('apiKey').value.trim();
  if (!key) { alert('Paste a Google Maps Platform browser key first.'); return; }
  if ($('rememberKey').checked) localStorage.setItem(API_KEY_STORAGE, key);
  else localStorage.removeItem(API_KEY_STORAGE);
  if (window.google?.maps) return initMap();
  setStatus('busy', 'Loading Google Maps');
  window.__zxMapsReady = initMap;
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&loading=async&callback=__zxMapsReady`;
  script.async = true;
  script.onerror = () => setStatus('error', 'Google Maps failed');
  document.head.appendChild(script);
}

async function initMap() {
  const { Map } = await google.maps.importLibrary('maps');
  state.map = new Map($('map'), { center: { lat: 47.3769, lng: 8.5417 }, zoom: 6, mapTypeControl: false, streetViewControl: false });
  state.googleReady = true;
  setStatus('ok', 'Google Maps ready');
  drawMarkers();
}

async function runBatch() {
  if (!state.googleReady) loadGoogleMaps();
  await sleep(600);
  if (!state.googleReady) return;
  const keywords = lines($('keywords').value);
  const cities = lines($('cities').value);
  if (!keywords.length || !cities.length) { alert('Enter at least one keyword and one city.'); return; }

  const total = keywords.length * cities.length;
  let done = 0;
  state.running = true;
  const delayMs = Number($('delayMs').value || 0);
  const { Place } = await google.maps.importLibrary('places');

  for (const city of cities) {
    for (const keyword of keywords) {
      if (!state.running) break;
      const query = `${keyword} in ${city}`;
      setStatus('busy', `Searching ${++done}/${total}: ${query}`);
      await runOneSearch(Place, query, city, keyword);
      render();
      drawMarkers();
      if (delayMs) await sleep(delayMs);
    }
  }
  state.running = false;
  setStatus('ok', `Done: ${state.leads.length} leads`);
}

async function runOneSearch(Place, textQuery, city, keyword) {
  const maxResultCount = Math.max(1, Math.min(20, Number($('maxResults').value || 20)));
  const request = {
    textQuery,
    fields: ['id', 'displayName', 'formattedAddress', 'location', 'businessStatus', 'rating', 'userRatingCount', 'googleMapsURI', 'types'],
    maxResultCount,
    region: $('region').value.trim().toLowerCase() || undefined,
    language: $('language').value.trim() || 'en-US',
  };
  try {
    const { places } = await Place.searchByText(request);
    for (const place of places || []) {
      if (!place.id || state.leads.some(x => x.placeId === place.id)) continue;
      try {
        await place.fetchFields({ fields: ['id', 'displayName', 'formattedAddress', 'location', 'businessStatus', 'rating', 'userRatingCount', 'googleMapsURI', 'types', 'nationalPhoneNumber', 'internationalPhoneNumber', 'websiteURI', 'regularOpeningHours'] });
      } catch (err) { console.warn('detail load skipped', err); }
      state.leads.push(normalizePlace(place, city, keyword, textQuery));
    }
  } catch (err) {
    console.error(err);
  }
}

function normalizePlace(place, city, keyword, query) {
  const lat = place.location?.lat?.() ?? '';
  const lng = place.location?.lng?.() ?? '';
  const row = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    score: 0,
    priority: 'Medium',
    status: 'New',
    notes: '',
    name: String(place.displayName || ''),
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
    city,
    keyword,
    query,
    capturedAt: new Date().toISOString(),
  };
  row.score = scoreLead(row);
  row.priority = row.score >= 70 ? 'High' : row.score >= 45 ? 'Medium' : 'Low';
  return row;
}

function scoreLead(row) {
  let score = 0;
  if (row.website) score += 25;
  if (row.phone) score += 20;
  if (Number(row.rating) >= 4) score += 15;
  if (Number(row.reviewCount) >= 50) score += 15;
  if (/supplier|merchant|bouw|bau|material|panel|construction|floor|wall|bath|bricolage|budowl|буд/i.test(`${row.name} ${row.types} ${row.query}`)) score += 20;
  if (row.businessStatus === 'OPERATIONAL') score += 5;
  return Math.min(100, score);
}

function getFilteredLeads() {
  const q = $('filterText').value.trim().toLowerCase();
  const status = $('statusFilter').value;
  return state.leads
    .filter(row => !status || row.status === status)
    .filter(row => !q || JSON.stringify(row).toLowerCase().includes(q))
    .sort((a, b) => b.score - a.score || String(a.name).localeCompare(String(b.name)));
}

function render() {
  const rows = getFilteredLeads();
  $('leadCount').textContent = state.leads.length;
  const high = state.leads.filter(x => x.priority === 'High').length;
  const withSite = state.leads.filter(x => x.website).length;
  $('summary').textContent = `${rows.length} shown / ${state.leads.length} total. High priority: ${high}. With website: ${withSite}.`;
  $('tbody').innerHTML = rows.length ? rows.map(rowHtml).join('') : '<tr><td colspan="8" class="empty">No leads. Run a batch search or load saved workspace.</td></tr>';
}

function rowHtml(row) {
  return `<tr>
    <td><strong>${row.score}</strong><br><small>${safe(row.priority)}</small></td>
    <td><strong>${safe(row.name)}</strong><br><small>${safe(row.types)}</small></td>
    <td>${row.phone ? safe(row.phone) + '<br>' : ''}${row.website ? `<a href="${safe(row.website)}" target="_blank" rel="noopener">Website</a>` : ''}</td>
    <td>${safe(row.address)}<br><small>${safe(row.lat)}, ${safe(row.lng)}</small></td>
    <td>${safe(row.rating)} ${row.reviewCount ? `(${safe(row.reviewCount)})` : ''}</td>
    <td><small>${safe(row.keyword)}<br>${safe(row.city)}</small><br>${row.mapsUrl ? `<a href="${safe(row.mapsUrl)}" target="_blank" rel="noopener">Maps</a>` : ''}</td>
    <td><select data-id="${row.id}" data-field="status"><option${sel(row.status,'New')}>New</option><option${sel(row.status,'Qualified')}>Qualified</option><option${sel(row.status,'Contacted')}>Contacted</option><option${sel(row.status,'Not relevant')}>Not relevant</option></select></td>
    <td><input data-id="${row.id}" data-field="notes" value="${safe(row.notes)}" placeholder="outreach notes" /></td>
  </tr>`;
}

function sel(a, b) { return a === b ? ' selected' : ''; }

function updateLeadField(event) {
  const id = event.target.dataset.id;
  const field = event.target.dataset.field;
  if (!id || !field) return;
  const row = state.leads.find(x => x.id === id);
  if (row) row[field] = event.target.value;
}

function drawMarkers() {
  if (!state.map || !window.google?.maps) return;
  state.markers.forEach(m => m.setMap(null));
  state.markers = [];
  const bounds = new google.maps.LatLngBounds();
  for (const row of state.leads) {
    if (row.lat === '' || row.lng === '') continue;
    const marker = new google.maps.Marker({ map: state.map, position: { lat: Number(row.lat), lng: Number(row.lng) }, title: row.name });
    marker.addListener('click', () => window.open(row.mapsUrl || row.website || '#', '_blank'));
    state.markers.push(marker);
    bounds.extend({ lat: Number(row.lat), lng: Number(row.lng) });
  }
  if (!bounds.isEmpty()) state.map.fitBounds(bounds);
}

function exportCsv() {
  const headers = ['score','priority','status','name','phone','website','address','rating','reviewCount','lat','lng','mapsUrl','businessStatus','types','openingHours','placeId','city','keyword','query','notes','capturedAt'];
  const csv = [headers.join(',')].concat(state.leads.map(row => headers.map(h => csvCell(row[h])).join(','))).join('\n');
  download(`zhongxin-europe-leads-${stamp()}.csv`, '\uFEFF' + csv, 'text/csv;charset=utf-8');
}

function exportJson() {
  download(`zhongxin-europe-leads-${stamp()}.json`, JSON.stringify(state.leads, null, 2), 'application/json;charset=utf-8');
}

function saveLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.leads));
  setStatus('ok', 'Workspace saved');
}

function loadLocal() {
  try {
    state.leads = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    render(); drawMarkers(); setStatus('ok', `Loaded ${state.leads.length} leads`);
  } catch { alert('Saved workspace could not be loaded.'); }
}

function clearAll() {
  if (!confirm('Clear all current leads?')) return;
  state.leads = [];
  render(); drawMarkers();
}

function csvCell(value) { return `"${String(value ?? '').replaceAll('"', '""')}"`; }
function stamp() { return new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-'); }
function download(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
}
