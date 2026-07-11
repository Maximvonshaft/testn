import {
  variantPath,
  buildConfigurationCode,
  normalizeState,
} from './state.mjs';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const elements = {
  app: $('#app'),
  base: $('#baseScene'),
  overlays: [$('#overlayA'), $('#overlayB')],
  frame: $('#sceneFrame'),
  wallLoading: $('#wallLoading'),
  initialLoading: $('#initialLoading'),
  fatalError: $('#fatalError'),
  fatalMessage: $('#fatalMessage'),
  materialGrid: $('#materialGrid'),
  profileGrid: $('#profileGrid'),
  finishGrid: $('#finishGrid'),
  dimensionGrid: $('#dimensionGrid'),
  materialCode: $('#materialCode'),
  profileCode: $('#profileCode'),
  finishLabel: $('#finishLabel'),
  configurationCode: $('#configurationCode'),
  dialogCode: $('#dialogCode'),
  sceneStatus: $('#sceneStatus'),
  actionSummary: $('#actionSummary'),
  summaryMaterial: $('#summaryMaterial'),
  summaryProfile: $('#summaryProfile'),
  summaryFinish: $('#summaryFinish'),
  disclaimer: $('#catalogDisclaimer'),
  beforeToggle: $('#beforeToggle'),
  copyCode: $('#copyCode'),
  saveScheme: $('#saveScheme'),
  downloadSpec: $('#downloadSpec'),
  toast: $('#toast'),
  dialog: $('#leadDialog'),
  leadForm: $('#leadForm'),
  requestType: $('#requestType'),
  dialogEyebrow: $('#dialogEyebrow'),
  dialogTitle: $('#dialogTitle'),
  dialogIntro: $('#dialogIntro'),
  submitLead: $('#submitLead'),
  retryButton: $('#retryButton'),
};

let catalog;
let state;
let activeOverlayIndex = 0;
let transitionSequence = 0;
let beforeMode = false;
let toastTimer;

function itemById(items, id) {
  return items.find((item) => item.id === id);
}

function currentMaterial() {
  return itemById(catalog.materials, state.material);
}

function currentProfile() {
  return itemById(catalog.profiles, state.profile);
}

function currentFinish() {
  return itemById(catalog.finishes, state.finish);
}

function configurationCode() {
  return buildConfigurationCode(state, catalog);
}

function showToast(message, type = 'info') {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.toggle('error', type === 'error');
  elements.toast.classList.add('show');
  toastTimer = setTimeout(() => elements.toast.classList.remove('show'), 2600);
}

async function decodeElement(image, src) {
  image.src = src;
  if (typeof image.decode === 'function') {
    await image.decode();
    return;
  }
  await new Promise((resolve, reject) => {
    if (image.complete && image.naturalWidth) return resolve();
    image.addEventListener('load', resolve, { once: true });
    image.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
  });
}

function renderMaterials() {
  elements.materialGrid.replaceChildren(...catalog.materials.map((material) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `material-button${material.id === state.material ? ' active' : ''}`;
    button.setAttribute('role', 'radio');
    button.setAttribute('aria-checked', String(material.id === state.material));
    button.dataset.material = material.id;
    button.title = material.name;
    button.innerHTML = `<img src="${material.thumbnail}" alt=""><span>${material.name}</span>`;
    button.addEventListener('click', () => updateVariant({ material: material.id }));
    return button;
  }));
}

function renderProfiles() {
  elements.profileGrid.replaceChildren(...catalog.profiles.map((profile) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `profile-button${profile.id === state.profile ? ' active' : ''}`;
    button.setAttribute('role', 'radio');
    button.setAttribute('aria-checked', String(profile.id === state.profile));
    button.dataset.profile = profile.id;
    button.innerHTML = `<img src="${profile.thumbnail}" alt=""><span>${profile.name}</span>`;
    button.addEventListener('click', () => updateVariant({ profile: profile.id }));
    return button;
  }));
}

function renderFinishes() {
  elements.finishGrid.replaceChildren(...catalog.finishes.map((finish) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = finish.id === state.finish ? 'active' : '';
    button.setAttribute('role', 'radio');
    button.setAttribute('aria-checked', String(finish.id === state.finish));
    button.textContent = finish.name;
    button.addEventListener('click', () => {
      state = { ...state, finish: finish.id };
      updateReadout();
      renderFinishes();
    });
    return button;
  }));
}

function renderDimensions() {
  elements.dimensionGrid.replaceChildren(...catalog.dimensions.map((dimension) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = dimension === state.dimension ? 'active' : '';
    button.setAttribute('role', 'radio');
    button.setAttribute('aria-checked', String(dimension === state.dimension));
    button.textContent = `${dimension} mm`;
    button.addEventListener('click', () => {
      state = { ...state, dimension };
      updateReadout();
      renderDimensions();
    });
    return button;
  }));
}

function updateReadout() {
  const material = currentMaterial();
  const profile = currentProfile();
  const finish = currentFinish();
  const code = configurationCode();

  elements.frame.dataset.finish = state.finish;
  elements.summaryMaterial.textContent = material.name;
  elements.summaryProfile.textContent = profile.name;
  elements.summaryFinish.textContent = finish.name;
  elements.materialCode.textContent = `${material.demoCode} · demo code`;
  elements.profileCode.textContent = `${profile.demoCode} · demo code`;
  elements.finishLabel.textContent = finish.name;
  elements.configurationCode.textContent = code;
  elements.dialogCode.textContent = code;
  elements.sceneStatus.textContent = `${material.name} · ${profile.name}`;
  elements.actionSummary.textContent = `Feature Wall · ${material.name} · ${profile.name}`;
}

function renderAllControls() {
  renderMaterials();
  renderProfiles();
  renderFinishes();
  renderDimensions();
  updateReadout();
}

async function updateVariant(patch, { initial = false } = {}) {
  const nextState = normalizeState({ ...state, ...patch }, catalog);
  const path = variantPath(nextState.material, nextState.profile);
  const mySequence = ++transitionSequence;
  const nextIndex = initial ? activeOverlayIndex : 1 - activeOverlayIndex;
  const nextLayer = elements.overlays[nextIndex];
  const currentLayer = elements.overlays[activeOverlayIndex];

  elements.wallLoading.classList.add('show');
  try {
    nextLayer.classList.remove('visible');
    await decodeElement(nextLayer, path);
    if (mySequence !== transitionSequence) return;

    state = nextState;
    renderAllControls();

    if (initial) {
      nextLayer.classList.add('visible');
      elements.wallLoading.classList.remove('show');
      return;
    }

    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    if (mySequence !== transitionSequence) return;
    nextLayer.classList.add('visible');
    window.setTimeout(() => {
      if (mySequence !== transitionSequence) return;
      currentLayer.classList.remove('visible');
      currentLayer.removeAttribute('src');
      activeOverlayIndex = nextIndex;
      elements.wallLoading.classList.remove('show');
    }, 620);
  } catch (error) {
    if (mySequence === transitionSequence) {
      elements.wallLoading.classList.remove('show');
      showToast('Material could not be loaded. The current wall was kept.', 'error');
      console.error(error);
    }
  }
}

function toggleBefore() {
  beforeMode = !beforeMode;
  elements.frame.classList.toggle('before-mode', beforeMode);
  elements.beforeToggle.setAttribute('aria-pressed', String(beforeMode));
  elements.beforeToggle.lastChild.textContent = beforeMode ? ' Show configured wall' : ' Show original wall';
}

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function openDialog(type) {
  elements.requestType.value = type;
  if (type === 'sample') {
    elements.dialogEyebrow.textContent = 'Sample request';
    elements.dialogTitle.textContent = 'Request this wall scheme';
    elements.dialogIntro.textContent = 'The current material, profile and specification code will be attached automatically.';
  } else {
    elements.dialogEyebrow.textContent = 'Project enquiry';
    elements.dialogTitle.textContent = 'Ask for a project quotation';
    elements.dialogIntro.textContent = 'Share the project scale and commercial requirements for this configured wall system.';
  }
  elements.dialogCode.textContent = configurationCode();
  elements.dialog.showModal();
}

async function submitLead(event) {
  event.preventDefault();
  const formData = new FormData(elements.leadForm);
  const payload = Object.fromEntries(formData.entries());
  payload.configurationCode = configurationCode();
  payload.configuration = { ...state };
  payload.scene = catalog.scene.id;
  payload.createdAt = new Date().toISOString();

  const originalText = elements.submitLead.textContent;
  elements.submitLead.disabled = true;
  elements.submitLead.textContent = 'Submitting…';
  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    elements.dialog.close();
    elements.leadForm.reset();
    showToast('Request saved locally.');
  } catch (error) {
    showToast('The request could not be saved. Keep the local server running and try again.', 'error');
    console.error(error);
  } finally {
    elements.submitLead.disabled = false;
    elements.submitLead.textContent = originalText;
  }
}

function preloadVariants() {
  const paths = [];
  for (const material of catalog.materials) {
    for (const profile of catalog.profiles) {
      if (material.id === state.material || profile.id === state.profile) {
        paths.push(variantPath(material.id, profile.id));
      }
    }
  }
  const preload = () => paths.forEach((path) => {
    const image = new Image();
    image.decoding = 'async';
    image.src = path;
  });
  if ('requestIdleCallback' in window) requestIdleCallback(preload, { timeout: 2500 });
  else window.setTimeout(preload, 800);
}

function attachStaticEvents() {
  elements.beforeToggle.addEventListener('click', toggleBefore);
  elements.copyCode.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(configurationCode());
      showToast('Configuration code copied.');
    } catch {
      showToast('Clipboard access was unavailable.', 'error');
    }
  });
  elements.saveScheme.addEventListener('click', () => {
    localStorage.setItem('materialStudioGoldenWall', JSON.stringify(state));
    showToast('Scheme saved in this browser.');
  });
  elements.downloadSpec.addEventListener('click', () => {
    const material = currentMaterial();
    const profile = currentProfile();
    const finish = currentFinish();
    downloadJson(`${configurationCode()}-spec.json`, {
      version: catalog.version,
      scene: catalog.scene.id,
      surface: 'feature-wall',
      material: { id: material.id, name: material.name, demoCode: material.demoCode },
      profile: { id: profile.id, name: profile.name, demoCode: profile.demoCode },
      finish: { id: finish.id, name: finish.name },
      dimensionMm: state.dimension,
      configurationCode: configurationCode(),
      disclaimer: catalog.disclaimer,
      generatedAt: new Date().toISOString(),
    });
  });
  $$('[data-dialog]').forEach((button) => button.addEventListener('click', () => openDialog(button.dataset.dialog)));
  elements.leadForm.addEventListener('submit', submitLead);
  elements.retryButton.addEventListener('click', () => window.location.reload());
  $('.wall-hotspot').addEventListener('click', () => showToast('Feature Wall is the verified editable plane in this iteration.'));
}

async function init() {
  attachStaticEvents();
  try {
    const response = await fetch('data/catalog.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Catalog returned HTTP ${response.status}`);
    catalog = await response.json();

    let saved = {};
    try { saved = JSON.parse(localStorage.getItem('materialStudioGoldenWall') || '{}'); } catch { saved = {}; }
    state = normalizeState(saved, catalog);

    elements.disclaimer.textContent = catalog.disclaimer;
    elements.base.src = catalog.scene.base;
    await decodeElement(elements.base, catalog.scene.base);
    renderAllControls();
    await updateVariant(state, { initial: true });

    elements.app.setAttribute('aria-busy', 'false');
    elements.initialLoading.classList.add('hidden');
    preloadVariants();
  } catch (error) {
    console.error(error);
    elements.initialLoading.classList.add('hidden');
    elements.fatalMessage.textContent = error.message || String(error);
    elements.fatalError.hidden = false;
  }
}

init();
