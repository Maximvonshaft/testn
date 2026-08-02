(() => {
  'use strict';

  const IMAGE_URLS = {
    bathroom: 'https://images.pexels.com/photos/8082561/pexels-photo-8082561.jpeg?auto=compress&cs=tinysrgb&w=1800',
    interior: 'https://images.unsplash.com/photo-1758448755778-90ebf4d0f1e7?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=75&w=1800',
    kitchen: 'https://images.unsplash.com/photo-1560185127-2d06c6d08d3d?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=75&w=1800',
    hospitality: 'https://images.unsplash.com/photo-1758448755778-90ebf4d0f1e7?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=75&w=1800',
    furniture: 'https://images.unsplash.com/photo-1777014547456-7d94a04382ee?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=75&w=1800',
    exterior: 'https://images.unsplash.com/photo-1745761264735-bb67c685b82b?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=75&w=1800'
  };

  const SYSTEM_COPY = {
    en: {
      bathroom: { eyebrow: 'Bathrooms & wet areas', title: 'Designed for<br>beauty that lasts.', alt: 'Warm beige bathroom with integrated mineral surfaces' },
      interior: { eyebrow: 'Interior wall systems', title: 'Quiet surfaces.<br>Powerful spaces.', alt: 'Luxury interior with coordinated mineral wall surfaces' },
      kitchen: { eyebrow: 'Kitchen surfaces', title: 'Performance,<br>beautifully resolved.', alt: 'Warm modern kitchen with durable surface system' },
      hospitality: { eyebrow: 'Hospitality suites', title: 'Elevated for<br>every arrival.', alt: 'Refined hospitality suite with premium wall surfaces' },
      furniture: { eyebrow: 'Furniture & vanity', title: 'Made to fit.<br>Built to belong.', alt: 'Custom vanity with mineral composite surface' },
      exterior: { eyebrow: 'Exterior cladding', title: 'Enduring form.<br>Architectural clarity.', alt: 'Modern villa with mineral exterior cladding' }
    },
    de: {
      bathroom: { eyebrow: 'Bäder & Nassbereiche', title: 'Schönheit,<br>die Bestand hat.', alt: 'Warmes beigefarbenes Bad mit integrierten Mineraloberflächen' },
      interior: { eyebrow: 'Innenwandsysteme', title: 'Ruhige Flächen.<br>Starke Räume.', alt: 'Luxuriöser Innenraum mit mineralischen Wandoberflächen' },
      kitchen: { eyebrow: 'Küchenoberflächen', title: 'Leistung,<br>schön gelöst.', alt: 'Warme moderne Küche mit robustem Oberflächensystem' },
      hospitality: { eyebrow: 'Hospitality Suiten', title: 'Veredelt für<br>jede Ankunft.', alt: 'Anspruchsvolle Hospitality-Suite' },
      furniture: { eyebrow: 'Möbel & Waschtisch', title: 'Passgenau.<br>Stimmig gebaut.', alt: 'Individueller Waschtisch mit Mineralverbundoberfläche' },
      exterior: { eyebrow: 'Fassadenbekleidung', title: 'Beständige Form.<br>Klare Architektur.', alt: 'Moderne Villa mit mineralischer Fassadenbekleidung' }
    },
    fr: {
      bathroom: { eyebrow: 'Salles de bains & zones humides', title: 'Une beauté<br>faite pour durer.', alt: 'Salle de bains beige avec surfaces minérales intégrées' },
      interior: { eyebrow: 'Systèmes muraux intérieurs', title: 'Des surfaces calmes.<br>Des espaces forts.', alt: 'Intérieur haut de gamme avec surfaces murales minérales' },
      kitchen: { eyebrow: 'Surfaces de cuisine', title: 'La performance,<br>parfaitement maîtrisée.', alt: 'Cuisine moderne avec système de surface durable' },
      hospitality: { eyebrow: 'Suites hôtelières', title: 'Élevé pour<br>chaque arrivée.', alt: 'Suite hôtelière raffinée' },
      furniture: { eyebrow: 'Mobilier & vasques', title: 'Sur mesure.<br>Naturellement intégré.', alt: 'Vasque sur mesure en composite minéral' },
      exterior: { eyebrow: 'Bardage extérieur', title: 'Forme durable.<br>Clarté architecturale.', alt: 'Villa moderne avec bardage minéral' }
    }
  };

  const I18N = {
    en: {
      'nav.collections': 'Collections', 'nav.inspiration': 'Inspiration', 'nav.technical': 'Technical', 'nav.sustainability': 'Sustainability', 'nav.about': 'About',
      'actions.samples': 'Request samples', 'actions.viewAll': 'View all systems', 'actions.details': 'View system details', 'actions.explore': 'Explore all systems', 'actions.discuss': 'Discuss your project',
      'systems.title': 'Product systems', 'systems.bathroom': 'Bathrooms &<br>wet areas', 'systems.interior': 'Interior<br>wall systems', 'systems.kitchen': 'Kitchen<br>surfaces', 'systems.hospitality': 'Hospitality<br>suites', 'systems.furniture': 'Furniture<br>& vanity', 'systems.exterior': 'Exterior<br>cladding', 'systems.kicker': 'Application portfolio', 'systems.heading': 'Our Product Systems',
      'materials.kicker': 'Stone collection', 'materials.heading': 'Select a finish', 'materials.selected': 'Selected',
      'technology.kicker': 'Material engineering', 'technology.title': 'From Surface<br>to System.', 'technology.body': 'A coordinated mineral-composite architecture brings finish, structure and installation logic together in one system.',
      'features.water': 'Water resistant', 'features.hygiene': 'Hygienic & easy to clean', 'features.fire': 'Fire-performance options', 'features.impact': 'Durable & impact resistant', 'features.maintenance': 'Low maintenance',
      'values.precisionTitle': 'Precision engineering', 'values.precisionBody': 'System-level detailing for cleaner installation.', 'values.solutionTitle': 'Complete solutions', 'values.solutionBody': 'Surfaces, profiles and coordinated accessories.', 'values.choiceTitle': 'Responsible choice', 'values.choiceBody': 'Material documentation prepared per product.', 'values.testedTitle': 'Tested performance', 'values.testedBody': 'Declarations linked to verified test evidence.', 'values.supportTitle': 'European support', 'values.supportBody': 'Project, distributor and technical workflows.',
      'project.kicker': 'Project partnership', 'project.title': 'Crafted for Vision.<br>Built to Last.', 'project.body': 'From concept to completion, AQUASTONE supports architects, designers, distributors and installers with coordinated surface systems.',
      'sample.kicker': 'Material sample service', 'sample.title': 'Request Samples', 'sample.body': 'Experience the texture, scale and tone in person.'
    },
    de: {
      'nav.collections': 'Kollektionen', 'nav.inspiration': 'Inspiration', 'nav.technical': 'Technik', 'nav.sustainability': 'Nachhaltigkeit', 'nav.about': 'Über uns',
      'actions.samples': 'Muster anfordern', 'actions.viewAll': 'Alle Systeme', 'actions.details': 'Systemdetails ansehen', 'actions.explore': 'Alle Systeme entdecken', 'actions.discuss': 'Projekt besprechen',
      'systems.title': 'Produktsysteme', 'systems.bathroom': 'Bäder &<br>Nassbereiche', 'systems.interior': 'Innenwand-<br>systeme', 'systems.kitchen': 'Küchen-<br>oberflächen', 'systems.hospitality': 'Hospitality-<br>Suiten', 'systems.furniture': 'Möbel &<br>Waschtische', 'systems.exterior': 'Fassaden-<br>bekleidung', 'systems.kicker': 'Anwendungsportfolio', 'systems.heading': 'Unsere Produktsysteme',
      'materials.kicker': 'Steinkollektion', 'materials.heading': 'Oberfläche wählen', 'materials.selected': 'Ausgewählt',
      'technology.kicker': 'Materialtechnik', 'technology.title': 'Von der Oberfläche<br>zum System.', 'technology.body': 'Eine koordinierte Mineralverbund-Architektur verbindet Oberfläche, Struktur und Montagelogik in einem System.',
      'features.water': 'Wasserbeständig', 'features.hygiene': 'Hygienisch & leicht zu reinigen', 'features.fire': 'Brandschutzoptionen', 'features.impact': 'Langlebig & schlagfest', 'features.maintenance': 'Pflegeleicht',
      'values.precisionTitle': 'Präzisionstechnik', 'values.precisionBody': 'Systemdetails für eine saubere Montage.', 'values.solutionTitle': 'Komplettlösungen', 'values.solutionBody': 'Oberflächen, Profile und Zubehör.', 'values.choiceTitle': 'Verantwortliche Wahl', 'values.choiceBody': 'Materialdokumentation je Produkt.', 'values.testedTitle': 'Geprüfte Leistung', 'values.testedBody': 'Aussagen mit verifizierten Nachweisen.', 'values.supportTitle': 'Support in Europa', 'values.supportBody': 'Projekt-, Händler- und Technikprozesse.',
      'project.kicker': 'Projektpartnerschaft', 'project.title': 'Für Visionen geschaffen.<br>Für Dauer gebaut.', 'project.body': 'Von der Idee bis zur Fertigstellung unterstützt AQUASTONE Architekten, Designer, Händler und Verarbeiter mit abgestimmten Oberflächensystemen.',
      'sample.kicker': 'Materialmuster-Service', 'sample.title': 'Muster anfordern', 'sample.body': 'Erleben Sie Textur, Maßstab und Farbton persönlich.'
    },
    fr: {
      'nav.collections': 'Collections', 'nav.inspiration': 'Inspiration', 'nav.technical': 'Technique', 'nav.sustainability': 'Durabilité', 'nav.about': 'À propos',
      'actions.samples': 'Demander des échantillons', 'actions.viewAll': 'Voir tous les systèmes', 'actions.details': 'Voir le système', 'actions.explore': 'Explorer les systèmes', 'actions.discuss': 'Parler de votre projet',
      'systems.title': 'Systèmes produits', 'systems.bathroom': 'Salles de bains<br>& zones humides', 'systems.interior': 'Systèmes<br>muraux intérieurs', 'systems.kitchen': 'Surfaces de<br>cuisine', 'systems.hospitality': 'Suites<br>hôtelières', 'systems.furniture': 'Mobilier<br>& vasques', 'systems.exterior': 'Bardage<br>extérieur', 'systems.kicker': "Portefeuille d'applications", 'systems.heading': 'Nos Systèmes Produits',
      'materials.kicker': 'Collection pierre', 'materials.heading': 'Choisir une finition', 'materials.selected': 'Sélection',
      'technology.kicker': 'Ingénierie matière', 'technology.title': 'De la Surface<br>au Système.', 'technology.body': "Une architecture minérale coordonnée réunit finition, structure et logique de pose au sein d'un même système.",
      'features.water': "Résistant à l'eau", 'features.hygiene': 'Hygiénique & facile à nettoyer', 'features.fire': 'Options de performance au feu', 'features.impact': 'Durable & résistant aux chocs', 'features.maintenance': 'Entretien réduit',
      'values.precisionTitle': 'Ingénierie de précision', 'values.precisionBody': 'Des détails système pour une pose plus nette.', 'values.solutionTitle': 'Solutions complètes', 'values.solutionBody': 'Surfaces, profils et accessoires coordonnés.', 'values.choiceTitle': 'Choix responsable', 'values.choiceBody': 'Documentation matière par produit.', 'values.testedTitle': 'Performance testée', 'values.testedBody': 'Déclarations liées à des preuves vérifiées.', 'values.supportTitle': 'Support européen', 'values.supportBody': 'Processus projet, distribution et technique.',
      'project.kicker': 'Partenariat projet', 'project.title': 'Pensé pour la Vision.<br>Conçu pour Durer.', 'project.body': "De la conception à la réalisation, AQUASTONE accompagne architectes, designers, distributeurs et installateurs avec des systèmes coordonnés.",
      'sample.kicker': "Service d'échantillons", 'sample.title': 'Demander des Échantillons', 'sample.body': "Découvrez la texture, l'échelle et la teinte en personne."
    }
  };

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const storage = {
    get(key) { try { return window.localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { window.localStorage.setItem(key, value); } catch { /* storage may be blocked in hardened previews */ } }
  };
  const state = { system: 'bathroom', material: 'Bianco Lumen', language: storage.get('aquastone-language') || 'en' };

  const heroStage = $('[data-hero-stage]');
  const heroImage = $('[data-hero-image]');
  const heroEyebrow = $('[data-hero-eyebrow]');
  const heroTitle = $('[data-hero-title]');
  const sceneIndex = $('[data-scene-index]');
  const selectedMaterial = $('[data-selected-material]');
  const finishInput = $('[data-finish-input]');
  const header = $('[data-header]');

  function emit(name, detail = {}) {
    document.dispatchEvent(new CustomEvent(`aquastone:${name}`, { detail }));
  }

  function setSystem(system, sourceButton) {
    if (!IMAGE_URLS[system]) return;
    const copy = SYSTEM_COPY[state.language]?.[system] || SYSTEM_COPY.en[system];
    state.system = system;

    $$('[data-system]').forEach(button => {
      const active = button.dataset.system === system;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });

    heroStage.classList.add('is-changing');
    window.setTimeout(() => {
      heroImage.hidden = false;
      heroImage.src = IMAGE_URLS[system];
      heroImage.alt = copy.alt;
      heroEyebrow.textContent = copy.eyebrow;
      heroTitle.innerHTML = copy.title;
      sceneIndex.textContent = String(Object.keys(IMAGE_URLS).indexOf(system) + 1).padStart(2, '0');
      window.setTimeout(() => heroStage.classList.remove('is-changing'), 50);
    }, 260);

    if (sourceButton?.closest('.mobile-system-strip')) sourceButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    emit('system-change', { system });
  }

  function setMaterial(button) {
    state.material = button.dataset.material;
    $$('.material-card').forEach(card => {
      const active = card === button;
      card.classList.toggle('is-active', active);
      card.setAttribute('aria-pressed', String(active));
    });
    selectedMaterial.textContent = state.material;
    if (finishInput && !finishInput.value) finishInput.value = state.material;
    button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    emit('material-change', { material: state.material });
  }

  function setLayer(layer) {
    $$('[data-layer]').forEach(element => {
      const active = element.dataset.layer === layer;
      element.classList.toggle('is-active', active);
      if (element.matches('button')) element.setAttribute('aria-pressed', String(active));
    });
    emit('layer-change', { layer });
  }

  function setLanguage(language) {
    if (!I18N[language]) language = 'en';
    state.language = language;
    storage.set('aquastone-language', language);
    document.documentElement.lang = language;
    $$('[data-i18n]').forEach(element => {
      const value = I18N[language][element.dataset.i18n] || I18N.en[element.dataset.i18n];
      if (value) element.innerHTML = value;
    });
    $$('[data-language]').forEach(button => button.setAttribute('aria-current', String(button.dataset.language === language)));
    const currentCopy = SYSTEM_COPY[language][state.system];
    heroEyebrow.textContent = currentCopy.eyebrow;
    heroTitle.innerHTML = currentCopy.title;
    heroImage.alt = currentCopy.alt;
    closeLanguageMenu();
    emit('language-change', { language });
  }

  function openLanguageMenu() {
    const toggle = $('[data-language-toggle]');
    const menu = $('#language-menu');
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    $('[data-language][aria-current="true"]', menu)?.focus();
  }

  function closeLanguageMenu() {
    const toggle = $('[data-language-toggle]');
    const menu = $('#language-menu');
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  }

  function toggleMobileMenu() {
    const toggle = $('[data-menu-toggle]');
    const nav = $('#mobile-navigation');
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav.hidden = !open;
    document.body.classList.toggle('is-locked', open);
    if (open) $('a', nav)?.focus();
  }

  function closeMobileMenu() {
    const toggle = $('[data-menu-toggle]');
    const nav = $('#mobile-navigation');
    toggle.setAttribute('aria-expanded', 'false');
    nav.hidden = true;
    document.body.classList.remove('is-locked');
  }

  function showDialog(dialog) {
    if (!dialog) return;
    closeMobileMenu();
    $$('dialog[open]').forEach(openDialog => {
      if (openDialog !== dialog) openDialog.close();
    });
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    document.body.classList.add('is-locked');
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    document.body.classList.remove('is-locked');
  }

  function bindDialogs() {
    const samples = $('[data-samples-dialog]');
    const contact = $('[data-contact-dialog]');
    $$('[data-open-samples]').forEach(button => button.addEventListener('click', () => {
      if (contact.open) closeDialog(contact);
      if (finishInput && !finishInput.value) finishInput.value = state.material;
      showDialog(samples);
    }));
    $$('[data-open-contact]').forEach(button => button.addEventListener('click', () => showDialog(contact)));
    $$('[data-close-dialog]').forEach(button => button.addEventListener('click', () => closeDialog(button.closest('dialog'))));
    $$('dialog').forEach(dialog => {
      dialog.addEventListener('click', event => {
        if (event.target === dialog) closeDialog(dialog);
      });
      dialog.addEventListener('close', () => document.body.classList.remove('is-locked'));
    });
  }

  function bindForm() {
    const form = $('[data-request-form]');
    const status = $('[data-form-status]');
    if (!form) return;
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) return;
      const isNetlify = /\.netlify\.app$/.test(location.hostname) || document.documentElement.dataset.netlify === 'true';
      if (!isNetlify) {
        event.preventDefault();
        status.textContent = 'This preview has no live form endpoint. Deploy the repository on Netlify to activate secure form delivery.';
        status.dataset.state = 'warning';
        emit('form-unavailable', { hostname: location.hostname });
      }
    });
  }

  function bindReveal() {
    const elements = $$('.reveal');
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(element => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    elements.forEach(element => observer.observe(element));
  }

  function preloadScenes() {
    Object.values(IMAGE_URLS).forEach(url => {
      const image = new Image();
      image.decoding = 'async';
      image.src = url;
    });
  }

  function init() {
    $$('[data-system]').forEach(button => button.addEventListener('click', () => setSystem(button.dataset.system, button)));
    $$('.material-card').forEach(button => button.addEventListener('click', () => setMaterial(button)));
    $$('[data-layer]').forEach(button => button.addEventListener('click', () => setLayer(button.dataset.layer)));

    $('[data-language-toggle]')?.addEventListener('click', event => {
      event.stopPropagation();
      const open = event.currentTarget.getAttribute('aria-expanded') === 'true';
      open ? closeLanguageMenu() : openLanguageMenu();
    });
    $$('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
    document.addEventListener('click', event => {
      if (!event.target.closest('.language-picker')) closeLanguageMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeLanguageMenu();
        closeMobileMenu();
      }
    });

    $('[data-menu-toggle]')?.addEventListener('click', toggleMobileMenu);
    $$('[data-mobile-link]').forEach(link => link.addEventListener('click', closeMobileMenu));

    $('[data-material-carousel]')?.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const cards = $$('.material-card');
      const index = cards.findIndex(card => card.classList.contains('is-active'));
      const next = event.key === 'ArrowRight' ? Math.min(cards.length - 1, index + 1) : Math.max(0, index - 1);
      cards[next].focus();
      setMaterial(cards[next]);
    });

    heroImage.addEventListener('error', () => {
      heroImage.hidden = true;
      heroStage.classList.remove('is-changing');
      emit('image-fallback', { system: state.system });
    });
    heroImage.addEventListener('load', () => {
      heroImage.hidden = false;
      heroStage.classList.remove('is-changing');
    });

    window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 18), { passive: true });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) closeMobileMenu();
    });

    $('[data-current-year]').textContent = new Date().getFullYear();
    setLanguage(state.language);
    bindDialogs();
    bindForm();
    bindReveal();
    window.requestIdleCallback?.(preloadScenes, { timeout: 1800 }) || window.setTimeout(preloadScenes, 900);
  }

  init();
})();
