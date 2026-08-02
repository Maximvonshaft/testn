import type { Locale, PageSlug, SystemId } from './catalog';

export interface SystemCopy {
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  cardDescription: string;
}

export interface PageCopy {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Array<{ title: string; body: string }>;
}

export interface SiteCopy {
  localeName: string;
  meta: { title: string; description: string };
  nav: { collections: string; inspiration: string; technical: string; sustainability: string; about: string };
  actions: { samples: string; details: string; allSystems: string; explore: string; discuss: string; submit: string; close: string };
  hero: { railTitle: string; materialTitle: string; selected: string };
  systems: Record<SystemId, SystemCopy>;
  benefits: Array<{ title: string; detail: string }>;
  technology: {
    eyebrow: string;
    title: string;
    body: string;
    layers: Array<{ id: string; title: string; body: string }>;
  };
  values: Array<{ title: string; body: string }>;
  portfolio: { eyebrow: string; title: string; viewAll: string };
  project: { eyebrow: string; title: string; body: string; cta: string };
  sample: { eyebrow: string; title: string; body: string };
  documents: string[];
  footer: { tagline: string; legal: string; privacy: string };
  form: {
    eyebrow: string;
    title: string;
    intro: string;
    fields: {
      name: string; email: string; company: string; country: string; projectType: string; application: string; finishes: string; message: string; privacy: string;
    };
    projectTypes: string[];
    select: string;
    sending: string;
    success: string;
    unavailable: string;
    error: string;
  };
  pages: Record<PageSlug, PageCopy>;
}

const commonPagesEn: Record<PageSlug, PageCopy> = {
  collections: {
    eyebrow: 'Material collections', title: 'A controlled palette for complete spaces.', intro: 'AQUASTONE finishes are organised as a coordinated architectural collection. Final availability and product compatibility are confirmed against the relevant product specification.',
    sections: [
      { title: 'Finish library', body: 'Warm mineral tones, restrained veining and low-glare surfaces designed to work across bathrooms, walls, kitchens and custom furniture.' },
      { title: 'Sample workflow', body: 'Specify application, finish and project stage. The sample team confirms the appropriate product construction before dispatch.' },
    ],
  },
  systems: {
    eyebrow: 'Product systems', title: 'One visual language. Multiple applications.', intro: 'Each system aligns finish, core construction, profiles, joints and installation logic for its intended application.',
    sections: [
      { title: 'Application-led specification', body: 'Wet areas, interior walls, furniture, hospitality and exterior applications are evaluated as separate systems rather than a single universal board.' },
      { title: 'Coordinated components', body: 'Accessories, profiles and installation details are selected with the surface system to reduce site improvisation.' },
    ],
  },
  technical: {
    eyebrow: 'Technical', title: 'Evidence before claims.', intro: 'Technical declarations, test reports and installation documents are published only when they are matched to a verified product and market.',
    sections: [
      { title: 'Product-specific documentation', body: 'Performance statements are associated with product codes, intended applications and the relevant test or declaration reference.' },
      { title: 'Specification support', body: 'Project teams can request the current technical pack for review before tender, sample approval or installation.' },
    ],
  },
  sustainability: {
    eyebrow: 'Responsible material choices', title: 'Designed for long service and accountable documentation.', intro: 'Material efficiency, service life, repairability and verified environmental documentation are treated as system requirements.',
    sections: [
      { title: 'Documentation', body: 'Environmental claims are released only with an identified methodology, scope and supporting source.' },
      { title: 'Design for service', body: 'The system approach prioritises clean detailing, replaceable components and lower-maintenance finishes.' },
    ],
  },
  about: {
    eyebrow: 'About AQUASTONE', title: 'Surface systems built around architectural intent.', intro: 'AQUASTONE develops coordinated mineral-composite surface systems for European architecture, interiors and project delivery.',
    sections: [
      { title: 'Project focus', body: 'The brand is structured to support architects, designers, distributors and installers from sample selection through technical review.' },
      { title: 'Market readiness', body: 'Legal, technical and commercial information is published only after verification by the responsible business entity.' },
    ],
  },
  privacy: {
    eyebrow: 'Privacy', title: 'Data minimisation by default.', intro: 'The website collects only the information required to respond to sample and project requests. Production contact and controller details must be configured before public lead collection is enabled.',
    sections: [
      { title: 'Purpose', body: 'Submitted details are used to evaluate and respond to the user’s material, specification or project request.' },
      { title: 'Retention and rights', body: 'The production privacy notice will state the responsible controller, retention period, legal basis and contact route for access, correction or deletion requests.' },
    ],
  },
  thanks: {
    eyebrow: 'Request received', title: 'Thank you.', intro: 'Your request has been accepted by the website. A project representative will respond after availability and routing are confirmed.',
    sections: [{ title: 'What happens next', body: 'The request is reviewed for application, geography and sample compatibility before follow-up.' }],
  },
};


const commonPagesDe: Record<PageSlug, PageCopy> = {
  collections: { eyebrow: 'Materialkollektionen', title: 'Eine kontrollierte Palette für vollständige Räume.', intro: 'AQUASTONE Oberflächen sind als koordinierte Architekturkollektion organisiert. Verfügbarkeit und Kompatibilität werden anhand der jeweiligen Produktspezifikation bestätigt.', sections: [
    { title: 'Oberflächenbibliothek', body: 'Warme Mineraltöne, zurückhaltende Maserungen und reflexionsarme Oberflächen für Bäder, Wände, Küchen und maßgefertigte Möbel.' },
    { title: 'Musterprozess', body: 'Anwendung, Oberfläche und Projektphase angeben. Das Musterteam bestätigt vor dem Versand den geeigneten Produktaufbau.' },
  ] },
  systems: { eyebrow: 'Produktsysteme', title: 'Eine visuelle Sprache. Mehrere Anwendungen.', intro: 'Jedes System stimmt Oberfläche, Kernaufbau, Profile, Fugen und Montagelogik auf die vorgesehene Anwendung ab.', sections: [
    { title: 'Anwendungsbezogene Spezifikation', body: 'Nassbereiche, Innenwände, Möbel, Hospitality und Fassaden werden als eigenständige Systeme bewertet, nicht als universelle Platte.' },
    { title: 'Koordinierte Komponenten', body: 'Zubehör, Profile und Montagedetails werden gemeinsam mit dem Oberflächensystem ausgewählt, um Improvisation auf der Baustelle zu reduzieren.' },
  ] },
  technical: { eyebrow: 'Technik', title: 'Nachweise vor Aussagen.', intro: 'Technische Erklärungen, Prüfberichte und Montageunterlagen werden nur veröffentlicht, wenn sie einem verifizierten Produkt und Markt zugeordnet sind.', sections: [
    { title: 'Produktspezifische Dokumentation', body: 'Leistungsangaben sind mit Produktcodes, vorgesehenen Anwendungen und den jeweiligen Prüf- oder Erklärungsreferenzen verknüpft.' },
    { title: 'Spezifikationsunterstützung', body: 'Projektteams können vor Ausschreibung, Musterfreigabe oder Montage das aktuelle technische Paket anfordern.' },
  ] },
  sustainability: { eyebrow: 'Verantwortliche Materialwahl', title: 'Für lange Nutzung und nachvollziehbare Dokumentation entwickelt.', intro: 'Materialeffizienz, Lebensdauer, Reparierbarkeit und verifizierte Umweltdokumentation werden als Systemanforderungen behandelt.', sections: [
    { title: 'Dokumentation', body: 'Umweltaussagen werden nur mit identifizierter Methodik, Geltungsbereich und belastbarer Quelle veröffentlicht.' },
    { title: 'Für den Betrieb gestaltet', body: 'Der Systemansatz priorisiert klare Details, austauschbare Komponenten und pflegearme Oberflächen.' },
  ] },
  about: { eyebrow: 'Über AQUASTONE', title: 'Oberflächensysteme für architektonische Absichten.', intro: 'AQUASTONE entwickelt koordinierte Mineralverbund-Oberflächensysteme für europäische Architektur, Innenräume und Projektabwicklung.', sections: [
    { title: 'Projektfokus', body: 'Die Marke unterstützt Architekten, Designer, Händler und Verarbeiter von der Musterauswahl bis zur technischen Prüfung.' },
    { title: 'Marktreife', body: 'Rechtliche, technische und kommerzielle Angaben werden erst nach Prüfung durch das verantwortliche Unternehmen veröffentlicht.' },
  ] },
  privacy: { eyebrow: 'Datenschutz', title: 'Datenminimierung als Standard.', intro: 'Die Website erhebt nur Informationen, die für Muster- und Projektanfragen erforderlich sind. Verantwortliche Stelle und Kontakt müssen vor öffentlicher Lead-Erfassung konfiguriert sein.', sections: [
    { title: 'Zweck', body: 'Übermittelte Angaben werden zur Prüfung und Beantwortung der Material-, Spezifikations- oder Projektanfrage verwendet.' },
    { title: 'Speicherung und Rechte', body: 'Die produktive Datenschutzerklärung nennt Verantwortlichen, Speicherdauer, Rechtsgrundlage sowie Kontaktwege für Auskunft, Berichtigung und Löschung.' },
  ] },
  thanks: { eyebrow: 'Anfrage erhalten', title: 'Vielen Dank.', intro: 'Ihre Anfrage wurde von der Website angenommen. Ein Projektansprechpartner meldet sich nach Prüfung von Verfügbarkeit und Zuständigkeit.', sections: [{ title: 'Nächster Schritt', body: 'Die Anfrage wird nach Anwendung, Region und Musterkompatibilität geprüft, bevor die Rückmeldung erfolgt.' }] },
};

const commonPagesFr: Record<PageSlug, PageCopy> = {
  collections: { eyebrow: 'Collections de matériaux', title: 'Une palette maîtrisée pour des espaces cohérents.', intro: 'Les finitions AQUASTONE sont organisées comme une collection architecturale coordonnée. Disponibilité et compatibilité sont confirmées selon la spécification produit.', sections: [
    { title: 'Bibliothèque de finitions', body: 'Tons minéraux chauds, veinages mesurés et surfaces peu réfléchissantes pour salles de bains, murs, cuisines et mobilier sur mesure.' },
    { title: "Processus d'échantillonnage", body: "Précisez l'application, la finition et la phase du projet. L'équipe confirme la construction adaptée avant expédition." },
  ] },
  systems: { eyebrow: 'Systèmes produits', title: 'Un langage visuel. Plusieurs applications.', intro: "Chaque système coordonne finition, noyau, profils, joints et logique de pose selon l'application prévue.", sections: [
    { title: "Spécification par application", body: "Zones humides, murs intérieurs, mobilier, hôtellerie et façades sont évalués comme des systèmes distincts, et non comme un panneau universel." },
    { title: 'Composants coordonnés', body: "Accessoires, profils et détails de pose sont sélectionnés avec le système afin de limiter l'improvisation sur chantier." },
  ] },
  technical: { eyebrow: 'Technique', title: 'Les preuves avant les déclarations.', intro: "Déclarations techniques, rapports d'essais et documents de pose ne sont publiés que lorsqu'ils sont reliés à un produit et un marché vérifiés.", sections: [
    { title: 'Documentation par produit', body: "Les performances sont associées aux codes produits, aux applications prévues et aux références d'essai ou de déclaration correspondantes." },
    { title: 'Support de prescription', body: "Les équipes projet peuvent demander le dossier technique à jour avant appel d'offres, validation des échantillons ou pose." },
  ] },
  sustainability: { eyebrow: 'Choix responsables', title: 'Conçu pour durer et documenté avec rigueur.', intro: "Efficacité matière, durée de service, réparabilité et documentation environnementale vérifiée sont traitées comme des exigences système.", sections: [
    { title: 'Documentation', body: "Les déclarations environnementales ne sont publiées qu'avec une méthodologie, un périmètre et une source identifiés." },
    { title: 'Conception pour le service', body: "L'approche système privilégie les détails propres, les composants remplaçables et les finitions à entretien réduit." },
  ] },
  about: { eyebrow: 'À propos d’AQUASTONE', title: 'Des systèmes de surfaces guidés par l’intention architecturale.', intro: "AQUASTONE développe des systèmes coordonnés en composite minéral pour l'architecture, les intérieurs et la réalisation de projets en Europe.", sections: [
    { title: 'Orientation projet', body: "La marque accompagne architectes, designers, distributeurs et installateurs, de la sélection des échantillons à la revue technique." },
    { title: 'Préparation au marché', body: "Les informations juridiques, techniques et commerciales sont publiées après vérification par l'entité responsable." },
  ] },
  privacy: { eyebrow: 'Confidentialité', title: 'Minimisation des données par défaut.', intro: "Le site ne collecte que les informations nécessaires aux demandes d'échantillons et de projets. Le responsable et le contact doivent être configurés avant la collecte publique.", sections: [
    { title: 'Finalité', body: "Les données soumises servent à évaluer et répondre à la demande de matériau, de prescription ou de projet." },
    { title: 'Conservation et droits', body: "La notice de production précisera le responsable, la durée de conservation, la base juridique et le contact pour l'accès, la rectification ou la suppression." },
  ] },
  thanks: { eyebrow: 'Demande reçue', title: 'Merci.', intro: "Votre demande a été acceptée par le site. Un représentant projet répondra après confirmation de la disponibilité et de l'acheminement.", sections: [{ title: 'Prochaine étape', body: "La demande est examinée selon l'application, la zone géographique et la compatibilité de l'échantillon avant suivi." }] },
};

const commonPagesCnr: Record<PageSlug, PageCopy> = {
  collections: { eyebrow: 'Kolekcije materijala', title: 'Kontrolisana paleta za cjelovite prostore.', intro: 'AQUASTONE završne obrade organizovane su kao usklađena arhitektonska kolekcija. Dostupnost i kompatibilnost potvrđuju se prema odgovarajućoj specifikaciji proizvoda.', sections: [
    { title: 'Biblioteka završnih obrada', body: 'Topli mineralni tonovi, odmjereni uzorci i površine sa malo odsjaja za kupatila, zidove, kuhinje i namještaj po mjeri.' },
    { title: 'Proces uzoraka', body: 'Navedite primjenu, završnu obradu i fazu projekta. Tim prije slanja potvrđuje odgovarajuću konstrukciju proizvoda.' },
  ] },
  systems: { eyebrow: 'Proizvodni sistemi', title: 'Jedan vizuelni jezik. Više primjena.', intro: 'Svaki sistem usklađuje završnu obradu, jezgro, profile, spojeve i logiku ugradnje sa planiranom primjenom.', sections: [
    { title: 'Specifikacija prema primjeni', body: 'Vlažne zone, unutrašnji zidovi, namještaj, hotelijerstvo i fasade procjenjuju se kao posebni sistemi, a ne kao univerzalna ploča.' },
    { title: 'Usklađene komponente', body: 'Dodatna oprema, profili i detalji ugradnje biraju se zajedno sa sistemom kako bi se smanjila improvizacija na gradilištu.' },
  ] },
  technical: { eyebrow: 'Tehnički podaci', title: 'Dokazi prije tvrdnji.', intro: 'Tehničke izjave, izvještaji o ispitivanju i uputstva objavljuju se samo kada su povezani sa provjerenim proizvodom i tržištem.', sections: [
    { title: 'Dokumentacija po proizvodu', body: 'Podaci o performansama vezuju se za šifre proizvoda, predviđene primjene i odgovarajuće reference ispitivanja ili izjava.' },
    { title: 'Podrška za specifikaciju', body: 'Projektni timovi mogu zatražiti aktuelni tehnički paket prije tendera, odobrenja uzorka ili ugradnje.' },
  ] },
  sustainability: { eyebrow: 'Odgovoran izbor materijala', title: 'Projektovano za dug vijek i odgovornu dokumentaciju.', intro: 'Efikasnost materijala, radni vijek, popravljivost i provjerena ekološka dokumentacija tretiraju se kao sistemski zahtjevi.', sections: [
    { title: 'Dokumentacija', body: 'Ekološke tvrdnje objavljuju se samo uz navedenu metodologiju, opseg i izvor dokaza.' },
    { title: 'Projektovanje za korišćenje', body: 'Sistemski pristup daje prednost čistim detaljima, zamjenjivim komponentama i završnim obradama sa malo održavanja.' },
  ] },
  about: { eyebrow: 'O AQUASTONE-u', title: 'Sistemi površina vođeni arhitektonskom namjerom.', intro: 'AQUASTONE razvija usklađene mineralno-kompozitne sisteme površina za evropsku arhitekturu, enterijere i realizaciju projekata.', sections: [
    { title: 'Fokus na projekat', body: 'Brend podržava arhitekte, dizajnere, distributere i instalatere od izbora uzorka do tehničke provjere.' },
    { title: 'Spremnost za tržište', body: 'Pravni, tehnički i komercijalni podaci objavljuju se tek nakon provjere odgovornog poslovnog subjekta.' },
  ] },
  privacy: { eyebrow: 'Privatnost', title: 'Minimalno prikupljanje podataka.', intro: 'Veb-sajt prikuplja samo podatke potrebne za odgovor na zahtjeve za uzorke i projekte. Odgovorni rukovalac i kontakt moraju biti podešeni prije javnog prikupljanja.', sections: [
    { title: 'Svrha', body: 'Dostavljeni podaci koriste se za procjenu i odgovor na zahtjev u vezi sa materijalom, specifikacijom ili projektom.' },
    { title: 'Čuvanje i prava', body: 'Produkcijsko obavještenje navodi rukovaoca, rok čuvanja, pravni osnov i kontakt za pristup, ispravku ili brisanje.' },
  ] },
  thanks: { eyebrow: 'Zahtjev je primljen', title: 'Hvala.', intro: 'Veb-sajt je prihvatio vaš zahtjev. Predstavnik projekta odgovoriće nakon provjere dostupnosti i usmjeravanja.', sections: [{ title: 'Šta slijedi', body: 'Zahtjev se provjerava prema primjeni, geografiji i kompatibilnosti uzorka prije daljeg kontakta.' }] },
};

export const copy: Record<Locale, SiteCopy> = {
  en: {
    localeName: 'English',
    meta: { title: 'AQUASTONE — Mineral Composite Surface Systems', description: 'Coordinated mineral-composite systems for bathrooms, interiors, kitchens, hospitality, furniture and exterior applications.' },
    nav: { collections: 'Collections', inspiration: 'Inspiration', technical: 'Technical', sustainability: 'Sustainability', about: 'About' },
    actions: { samples: 'Request samples', details: 'View system details', allSystems: 'View all systems', explore: 'Explore all systems', discuss: 'Discuss your project', submit: 'Submit request', close: 'Close' },
    hero: { railTitle: 'Product systems', materialTitle: 'Stone collection', selected: 'Selected finish' },
    systems: {
      bathroom: { label: 'Bathrooms & wet areas', eyebrow: 'Bathrooms & wet areas', title: 'Designed for beauty that lasts.', description: 'A coordinated surface system for calm, highly used wet spaces.', cardDescription: 'Refined surfaces for wet-area applications.' },
      interior: { label: 'Interior wall systems', eyebrow: 'Interior wall systems', title: 'Quiet surfaces. Powerful spaces.', description: 'Continuous wall compositions with controlled joints and detailing.', cardDescription: 'Seamless walls with lasting clarity.' },
      kitchen: { label: 'Kitchen surfaces', eyebrow: 'Kitchen surfaces', title: 'Performance, beautifully resolved.', description: 'Durable work and wall surfaces with a unified visual language.', cardDescription: 'Surfaces for contemporary kitchens.' },
      hospitality: { label: 'Hospitality suites', eyebrow: 'Hospitality suites', title: 'Elevated for every arrival.', description: 'Coordinated finishes for guest rooms, suites and shared spaces.', cardDescription: 'Elevated environments for hospitality.' },
      furniture: { label: 'Furniture & vanity', eyebrow: 'Furniture & vanity', title: 'Made to fit. Built to belong.', description: 'Custom surfaces for integrated furniture, vanity and feature elements.', cardDescription: 'Custom pieces that belong to the room.' },
      exterior: { label: 'Exterior cladding', eyebrow: 'Exterior cladding', title: 'Enduring form. Architectural clarity.', description: 'A disciplined façade language with project-specific system review.', cardDescription: 'Exterior systems with a calm identity.' },
    },
    benefits: [
      { title: 'Water resistant', detail: 'Application-specific system selection' },
      { title: 'Hygienic & easy to clean', detail: 'Low-complexity surface care' },
      { title: 'Fire-performance options', detail: 'Subject to product evidence' },
      { title: 'Durable & impact resistant', detail: 'Construction selected by use' },
      { title: 'Low maintenance', detail: 'Designed for service' },
    ],
    technology: {
      eyebrow: 'Material engineering', title: 'From Surface to System.', body: 'A coordinated construction brings finish, structure and installation logic together. Every published performance statement remains product-specific and evidence-linked.',
      layers: [
        { id: 'surface', title: 'Protective surface', body: 'The service-facing finish and maintenance layer.' },
        { id: 'decorative', title: 'Decorative layer', body: 'The visual texture, tone and scale of the selected finish.' },
        { id: 'core', title: 'Mineral composite core', body: 'The primary structural layer, configured for the application.' },
        { id: 'reinforced', title: 'Reinforced back layer', body: 'Back-side stability and impact management.' },
        { id: 'balance', title: 'Balance layer', body: 'Long-term dimensional balance and system completion.' },
      ],
    },
    values: [
      { title: 'Precision engineering', body: 'System-level detailing for cleaner installation.' },
      { title: 'Complete solutions', body: 'Surfaces, profiles and coordinated accessories.' },
      { title: 'Responsible choice', body: 'Claims tied to accountable source documents.' },
      { title: 'Tested performance', body: 'Declarations linked to verified evidence.' },
      { title: 'European support', body: 'Project, distribution and technical workflows.' },
    ],
    portfolio: { eyebrow: 'Application portfolio', title: 'Our Product Systems', viewAll: 'View all systems' },
    project: { eyebrow: 'Project partnership', title: 'Crafted for Vision. Built to Last.', body: 'From concept to completion, AQUASTONE supports architects, designers, distributors and installers with coordinated surface systems.', cta: 'Discuss your project' },
    sample: { eyebrow: 'Material sample service', title: 'Request Samples', body: 'Experience texture, scale and tone in person.' },
    documents: ['CE status by product', 'EPD status by product', 'ISO references by entity', 'Fire classification by system', 'Environmental evidence by product'],
    footer: { tagline: 'Mineral composite surface systems.', legal: 'Legal and technical details are published from verified business sources.', privacy: 'Privacy' },
    form: {
      eyebrow: 'AQUASTONE material service', title: 'Request Samples', intro: 'Tell us the application, market and preferred finish. The request is routed only after server-side validation.',
      fields: { name: 'Full name', email: 'Work email', company: 'Company', country: 'Country / region', projectType: 'Project type', application: 'Primary application', finishes: 'Preferred finishes', message: 'Project notes', privacy: 'I agree that my details may be used to respond to this request.' },
      projectTypes: ['Residential', 'Hospitality', 'Retail', 'Commercial', 'Distribution', 'Other'],
      select: 'Select', sending: 'Sending…', success: 'Request received. We will confirm routing and availability.', unavailable: 'The production lead endpoint is not configured yet.', error: 'The request could not be sent. Please try again.'
    },
    pages: commonPagesEn,
  },
  de: {
    localeName: 'Deutsch',
    meta: { title: 'AQUASTONE — Mineralverbund-Oberflächensysteme', description: 'Abgestimmte Mineralverbundsysteme für Bäder, Innenräume, Küchen, Hospitality, Möbel und Fassaden.' },
    nav: { collections: 'Kollektionen', inspiration: 'Inspiration', technical: 'Technik', sustainability: 'Nachhaltigkeit', about: 'Über uns' },
    actions: { samples: 'Muster anfordern', details: 'Systemdetails ansehen', allSystems: 'Alle Systeme', explore: 'Systeme entdecken', discuss: 'Projekt besprechen', submit: 'Anfrage senden', close: 'Schließen' },
    hero: { railTitle: 'Produktsysteme', materialTitle: 'Steinkollektion', selected: 'Gewählte Oberfläche' },
    systems: {
      bathroom: { label: 'Bäder & Nassbereiche', eyebrow: 'Bäder & Nassbereiche', title: 'Schönheit, die Bestand hat.', description: 'Ein abgestimmtes Oberflächensystem für ruhige, intensiv genutzte Nassräume.', cardDescription: 'Verfeinerte Oberflächen für Nassbereiche.' },
      interior: { label: 'Innenwandsysteme', eyebrow: 'Innenwandsysteme', title: 'Ruhige Flächen. Starke Räume.', description: 'Durchgängige Wandbilder mit kontrollierten Fugen und Details.', cardDescription: 'Klare Wände mit dauerhafter Wirkung.' },
      kitchen: { label: 'Küchenoberflächen', eyebrow: 'Küchenoberflächen', title: 'Leistung, schön gelöst.', description: 'Robuste Arbeits- und Wandflächen in einer einheitlichen Gestaltung.', cardDescription: 'Oberflächen für zeitgemäße Küchen.' },
      hospitality: { label: 'Hospitality-Suiten', eyebrow: 'Hospitality-Suiten', title: 'Veredelt für jede Ankunft.', description: 'Abgestimmte Oberflächen für Zimmer, Suiten und Gemeinschaftsbereiche.', cardDescription: 'Hochwertige Räume für Hospitality.' },
      furniture: { label: 'Möbel & Waschtische', eyebrow: 'Möbel & Waschtische', title: 'Passgenau. Stimmig gebaut.', description: 'Individuelle Flächen für Möbel, Waschtische und Akzente.', cardDescription: 'Individuelle Elemente für den Raum.' },
      exterior: { label: 'Fassadenbekleidung', eyebrow: 'Fassadenbekleidung', title: 'Beständige Form. Klare Architektur.', description: 'Eine disziplinierte Fassadensprache mit projektspezifischer Systemprüfung.', cardDescription: 'Ruhige Identität für Außenflächen.' },
    },
    benefits: [
      { title: 'Wasserbeständig', detail: 'Anwendungsspezifische Systemwahl' },
      { title: 'Hygienisch & pflegeleicht', detail: 'Einfache Oberflächenpflege' },
      { title: 'Brandschutzoptionen', detail: 'Nur mit Produktnachweis' },
      { title: 'Robust & schlagfest', detail: 'Aufbau nach Nutzung' },
      { title: 'Geringer Pflegeaufwand', detail: 'Für lange Nutzung entwickelt' },
    ],
    technology: {
      eyebrow: 'Materialtechnik', title: 'Von der Oberfläche zum System.', body: 'Ein koordinierter Aufbau verbindet Optik, Struktur und Montagelogik. Jede veröffentlichte Leistungsangabe bleibt produktspezifisch und nachweisgebunden.',
      layers: [
        { id: 'surface', title: 'Schutzoberfläche', body: 'Nutzschicht und Pflegeebene.' },
        { id: 'decorative', title: 'Dekorschicht', body: 'Textur, Ton und Maßstab der gewählten Oberfläche.' },
        { id: 'core', title: 'Mineralverbundkern', body: 'Primäre Tragschicht, abgestimmt auf die Anwendung.' },
        { id: 'reinforced', title: 'Verstärkte Rücklage', body: 'Stabilität und Stoßmanagement auf der Rückseite.' },
        { id: 'balance', title: 'Ausgleichsschicht', body: 'Langfristige Dimensionsstabilität.' },
      ],
    },
    values: [
      { title: 'Präzisionstechnik', body: 'Systemdetails für eine saubere Montage.' },
      { title: 'Komplettlösungen', body: 'Oberflächen, Profile und Zubehör.' },
      { title: 'Verantwortliche Wahl', body: 'Aussagen mit nachvollziehbaren Quellen.' },
      { title: 'Geprüfte Leistung', body: 'Erklärungen mit verifizierten Nachweisen.' },
      { title: 'Support in Europa', body: 'Projekt-, Handels- und Technikprozesse.' },
    ],
    portfolio: { eyebrow: 'Anwendungsportfolio', title: 'Unsere Produktsysteme', viewAll: 'Alle Systeme' },
    project: { eyebrow: 'Projektpartnerschaft', title: 'Für Visionen geschaffen. Für Dauer gebaut.', body: 'AQUASTONE unterstützt Architekten, Designer, Händler und Verarbeiter mit abgestimmten Oberflächensystemen.', cta: 'Projekt besprechen' },
    sample: { eyebrow: 'Materialmuster-Service', title: 'Muster anfordern', body: 'Erleben Sie Textur, Maßstab und Farbton persönlich.' },
    documents: ['CE-Status je Produkt', 'EPD-Status je Produkt', 'ISO-Bezüge je Rechtsträger', 'Brandklassifizierung je System', 'Umweltnachweise je Produkt'],
    footer: { tagline: 'Mineralverbund-Oberflächensysteme.', legal: 'Rechtliche und technische Angaben stammen aus verifizierten Geschäftsquellen.', privacy: 'Datenschutz' },
    form: {
      eyebrow: 'AQUASTONE Materialservice', title: 'Muster anfordern', intro: 'Nennen Sie Anwendung, Markt und gewünschte Oberfläche. Die Anfrage wird serverseitig validiert.',
      fields: { name: 'Vollständiger Name', email: 'Geschäftliche E-Mail', company: 'Unternehmen', country: 'Land / Region', projectType: 'Projekttyp', application: 'Hauptanwendung', finishes: 'Gewünschte Oberflächen', message: 'Projektinformationen', privacy: 'Ich stimme der Nutzung meiner Angaben zur Bearbeitung dieser Anfrage zu.' },
      projectTypes: ['Wohnen', 'Hospitality', 'Einzelhandel', 'Gewerbe', 'Vertrieb', 'Sonstiges'],
      select: 'Auswählen', sending: 'Wird gesendet…', success: 'Anfrage eingegangen. Verfügbarkeit und Routing werden bestätigt.', unavailable: 'Der produktive Lead-Endpunkt ist noch nicht konfiguriert.', error: 'Die Anfrage konnte nicht gesendet werden. Bitte erneut versuchen.'
    },
    pages: commonPagesDe,
  },
  fr: {
    localeName: 'Français',
    meta: { title: 'AQUASTONE — Systèmes de surfaces composites minérales', description: 'Systèmes coordonnés pour salles de bains, intérieurs, cuisines, hôtellerie, mobilier et façades.' },
    nav: { collections: 'Collections', inspiration: 'Inspiration', technical: 'Technique', sustainability: 'Durabilité', about: 'À propos' },
    actions: { samples: 'Demander des échantillons', details: 'Voir le système', allSystems: 'Voir tous les systèmes', explore: 'Explorer les systèmes', discuss: 'Parler de votre projet', submit: 'Envoyer la demande', close: 'Fermer' },
    hero: { railTitle: 'Systèmes produits', materialTitle: 'Collection pierre', selected: 'Finition sélectionnée' },
    systems: {
      bathroom: { label: 'Salles de bains & zones humides', eyebrow: 'Salles de bains & zones humides', title: 'Une beauté faite pour durer.', description: 'Un système coordonné pour des espaces humides calmes et intensément utilisés.', cardDescription: 'Surfaces raffinées pour zones humides.' },
      interior: { label: 'Systèmes muraux intérieurs', eyebrow: 'Systèmes muraux intérieurs', title: 'Des surfaces calmes. Des espaces forts.', description: 'Des compositions murales continues avec joints et détails maîtrisés.', cardDescription: 'Des murs continus et lisibles.' },
      kitchen: { label: 'Surfaces de cuisine', eyebrow: 'Surfaces de cuisine', title: 'La performance, parfaitement maîtrisée.', description: 'Plans et parois durables dans un langage visuel cohérent.', cardDescription: 'Surfaces pour cuisines contemporaines.' },
      hospitality: { label: 'Suites hôtelières', eyebrow: 'Suites hôtelières', title: 'Élevé pour chaque arrivée.', description: 'Des finitions coordonnées pour chambres, suites et espaces partagés.', cardDescription: 'Des espaces hôteliers élevés.' },
      furniture: { label: 'Mobilier & vasques', eyebrow: 'Mobilier & vasques', title: 'Sur mesure. Naturellement intégré.', description: 'Surfaces personnalisées pour mobilier, vasques et éléments signatures.', cardDescription: 'Des pièces qui appartiennent au lieu.' },
      exterior: { label: 'Bardage extérieur', eyebrow: 'Bardage extérieur', title: 'Forme durable. Clarté architecturale.', description: 'Un langage de façade discipliné avec revue système par projet.', cardDescription: 'Identité calme pour les extérieurs.' },
    },
    benefits: [
      { title: 'Résistant à l’eau', detail: 'Choix selon l’application' },
      { title: 'Hygiénique & facile à nettoyer', detail: 'Entretien simplifié' },
      { title: 'Options de performance au feu', detail: 'Sous réserve de preuves produit' },
      { title: 'Durable & résistant aux chocs', detail: 'Construction selon l’usage' },
      { title: 'Entretien réduit', detail: 'Conçu pour le service' },
    ],
    technology: {
      eyebrow: 'Ingénierie matière', title: 'De la Surface au Système.', body: 'Une construction coordonnée réunit finition, structure et logique de pose. Toute déclaration reste liée à un produit et à une preuve vérifiée.',
      layers: [
        { id: 'surface', title: 'Surface protectrice', body: 'Couche d’usage et d’entretien.' },
        { id: 'decorative', title: 'Couche décorative', body: 'Texture, teinte et échelle de la finition.' },
        { id: 'core', title: 'Noyau composite minéral', body: 'Couche structurelle principale selon l’application.' },
        { id: 'reinforced', title: 'Couche arrière renforcée', body: 'Stabilité arrière et gestion des impacts.' },
        { id: 'balance', title: 'Couche d’équilibrage', body: 'Équilibre dimensionnel à long terme.' },
      ],
    },
    values: [
      { title: 'Ingénierie de précision', body: 'Détails système pour une pose plus nette.' },
      { title: 'Solutions complètes', body: 'Surfaces, profils et accessoires coordonnés.' },
      { title: 'Choix responsable', body: 'Déclarations liées à des sources identifiées.' },
      { title: 'Performance testée', body: 'Documents rattachés à des preuves vérifiées.' },
      { title: 'Support européen', body: 'Processus projet, distribution et technique.' },
    ],
    portfolio: { eyebrow: "Portefeuille d'applications", title: 'Nos Systèmes Produits', viewAll: 'Voir tous les systèmes' },
    project: { eyebrow: 'Partenariat projet', title: 'Pensé pour la Vision. Conçu pour Durer.', body: 'AQUASTONE accompagne architectes, designers, distributeurs et installateurs avec des systèmes coordonnés.', cta: 'Parler de votre projet' },
    sample: { eyebrow: "Service d'échantillons", title: 'Demander des Échantillons', body: "Découvrez la texture, l'échelle et la teinte en personne." },
    documents: ['Statut CE par produit', 'Statut EPD par produit', 'Références ISO par entité', 'Classement feu par système', 'Preuves environnementales par produit'],
    footer: { tagline: 'Systèmes de surfaces composites minérales.', legal: 'Les informations juridiques et techniques proviennent de sources vérifiées.', privacy: 'Confidentialité' },
    form: {
      eyebrow: 'Service matériaux AQUASTONE', title: 'Demander des échantillons', intro: 'Indiquez l’application, le marché et la finition. La demande est validée côté serveur.',
      fields: { name: 'Nom complet', email: 'E-mail professionnel', company: 'Entreprise', country: 'Pays / région', projectType: 'Type de projet', application: 'Application principale', finishes: 'Finitions souhaitées', message: 'Informations projet', privacy: 'J’accepte que mes données soient utilisées pour répondre à cette demande.' },
      projectTypes: ['Résidentiel', 'Hôtellerie', 'Commerce', 'Tertiaire', 'Distribution', 'Autre'],
      select: 'Sélectionner', sending: 'Envoi…', success: 'Demande reçue. Nous confirmerons le routage et la disponibilité.', unavailable: "Le point de collecte de production n'est pas encore configuré.", error: "La demande n'a pas pu être envoyée. Réessayez." 
    },
    pages: commonPagesFr,
  },
  cnr: {
    localeName: 'Crnogorski',
    meta: { title: 'AQUASTONE — Sistemi mineralno-kompozitnih površina', description: 'Usklađeni sistemi za kupatila, enterijere, kuhinje, hotele, namještaj i fasade.' },
    nav: { collections: 'Kolekcije', inspiration: 'Inspiracija', technical: 'Tehnički podaci', sustainability: 'Održivost', about: 'O nama' },
    actions: { samples: 'Zatražite uzorke', details: 'Pogledajte detalje sistema', allSystems: 'Svi sistemi', explore: 'Istražite sisteme', discuss: 'Razgovarajmo o projektu', submit: 'Pošaljite zahtjev', close: 'Zatvori' },
    hero: { railTitle: 'Proizvodni sistemi', materialTitle: 'Kolekcija kamena', selected: 'Izabrana završna obrada' },
    systems: {
      bathroom: { label: 'Kupatila i vlažne zone', eyebrow: 'Kupatila i vlažne zone', title: 'Ljepota projektovana da traje.', description: 'Usklađen sistem površina za mirne i intenzivno korišćene vlažne prostore.', cardDescription: 'Prefinjene površine za vlažne zone.' },
      interior: { label: 'Unutrašnji zidni sistemi', eyebrow: 'Unutrašnji zidni sistemi', title: 'Mirne površine. Snažni prostori.', description: 'Kontinualne zidne kompozicije sa kontrolisanim spojevima i detaljima.', cardDescription: 'Čisti zidovi sa dugotrajnom jasnoćom.' },
      kitchen: { label: 'Kuhinjske površine', eyebrow: 'Kuhinjske površine', title: 'Performanse, elegantno riješene.', description: 'Izdržljive radne i zidne površine u jedinstvenom vizuelnom jeziku.', cardDescription: 'Površine za savremene kuhinje.' },
      hospitality: { label: 'Hotelski apartmani', eyebrow: 'Hotelski apartmani', title: 'Viši standard za svaki dolazak.', description: 'Usklađene završne obrade za sobe, apartmane i zajedničke prostore.', cardDescription: 'Prostori višeg standarda za hotelijerstvo.' },
      furniture: { label: 'Namještaj i umivaonici', eyebrow: 'Namještaj i umivaonici', title: 'Po mjeri. Prirodno uklopljeno.', description: 'Površine po mjeri za namještaj, umivaonike i naglašene elemente.', cardDescription: 'Elementi koji pripadaju prostoru.' },
      exterior: { label: 'Spoljašnje obloge', eyebrow: 'Spoljašnje obloge', title: 'Trajna forma. Arhitektonska jasnoća.', description: 'Disciplinovan fasadni jezik uz provjeru sistema za svaki projekat.', cardDescription: 'Smiren identitet za eksterijer.' },
    },
    benefits: [
      { title: 'Otporno na vodu', detail: 'Izbor sistema prema primjeni' },
      { title: 'Higijenski i jednostavno za čišćenje', detail: 'Jednostavno održavanje' },
      { title: 'Opcije reakcije na požar', detail: 'Isključivo uz dokaz za proizvod' },
      { title: 'Izdržljivo i otporno na udarce', detail: 'Konstrukcija prema namjeni' },
      { title: 'Malo održavanja', detail: 'Projektovano za dug radni vijek' },
    ],
    technology: {
      eyebrow: 'Inženjering materijala', title: 'Od Površine do Sistema.', body: 'Usklađena konstrukcija objedinjuje završnu obradu, strukturu i logiku ugradnje. Svaka tvrdnja ostaje vezana za konkretan proizvod i dokaz.',
      layers: [
        { id: 'surface', title: 'Zaštitna površina', body: 'Sloj izložen upotrebi i održavanju.' },
        { id: 'decorative', title: 'Dekorativni sloj', body: 'Tekstura, ton i razmjera izabrane završne obrade.' },
        { id: 'core', title: 'Mineralno-kompozitno jezgro', body: 'Glavni konstruktivni sloj prema primjeni.' },
        { id: 'reinforced', title: 'Ojačani zadnji sloj', body: 'Stabilnost poleđine i upravljanje udarima.' },
        { id: 'balance', title: 'Balansni sloj', body: 'Dugoročna dimenziona stabilnost.' },
      ],
    },
    values: [
      { title: 'Precizan inženjering', body: 'Sistemski detalji za čistiju ugradnju.' },
      { title: 'Kompletna rješenja', body: 'Površine, profili i usklađena dodatna oprema.' },
      { title: 'Odgovoran izbor', body: 'Tvrdnje povezane sa provjerljivim izvorima.' },
      { title: 'Ispitane performanse', body: 'Dokumenti povezani sa potvrđenim dokazima.' },
      { title: 'Podrška u Evropi', body: 'Projektni, distributivni i tehnički procesi.' },
    ],
    portfolio: { eyebrow: 'Portfolio primjena', title: 'Naši Proizvodni Sistemi', viewAll: 'Svi sistemi' },
    project: { eyebrow: 'Projektno partnerstvo', title: 'Stvoreno za Viziju. Napravljeno da Traje.', body: 'AQUASTONE podržava arhitekte, dizajnere, distributere i instalatere usklađenim sistemima površina.', cta: 'Razgovarajmo o projektu' },
    sample: { eyebrow: 'Usluga uzoraka', title: 'Zatražite Uzorke', body: 'Doživite teksturu, razmjeru i ton uživo.' },
    documents: ['CE status po proizvodu', 'EPD status po proizvodu', 'ISO reference po pravnom subjektu', 'Požarna klasifikacija po sistemu', 'Ekološki dokazi po proizvodu'],
    footer: { tagline: 'Sistemi mineralno-kompozitnih površina.', legal: 'Pravni i tehnički podaci objavljuju se iz provjerenih poslovnih izvora.', privacy: 'Privatnost' },
    form: {
      eyebrow: 'AQUASTONE usluga materijala', title: 'Zatražite uzorke', intro: 'Navedite primjenu, tržište i željenu završnu obradu. Zahtjev se provjerava na serveru.',
      fields: { name: 'Ime i prezime', email: 'Poslovni e-mail', company: 'Kompanija', country: 'Država / region', projectType: 'Tip projekta', application: 'Glavna primjena', finishes: 'Željene završne obrade', message: 'Podaci o projektu', privacy: 'Saglasan/na sam da se moji podaci koriste za odgovor na ovaj zahtjev.' },
      projectTypes: ['Stambeni', 'Hotelijerstvo', 'Maloprodaja', 'Komercijalni', 'Distribucija', 'Drugo'],
      select: 'Izaberite', sending: 'Slanje…', success: 'Zahtjev je primljen. Potvrdićemo usmjeravanje i dostupnost.', unavailable: 'Produkcijski sistem za prijem zahtjeva još nije podešen.', error: 'Zahtjev nije mogao biti poslat. Pokušajte ponovo.'
    },
    pages: commonPagesCnr,
  },
};

export function getCopy(locale: string | undefined): SiteCopy {
  if (locale && locale in copy) return copy[locale as Locale];
  return copy.en;
}
