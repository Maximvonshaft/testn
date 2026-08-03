import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { materialSlabAtlas, materials, systems, type MaterialId, type SystemId, type SystemVisual } from '@/data/catalog';
import type { SiteCopy } from '@/data/copy';
import styles from './SceneExperience.module.css';

type Props = { copy: SiteCopy; locale: string };

const icons: Record<SystemId, ReactNode> = {
  bathroom: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />,
  interior: <><circle cx="8" cy="8" r="4"/><circle cx="16" cy="8" r="4"/><circle cx="8" cy="16" r="4"/><circle cx="16" cy="16" r="4"/></>,
  kitchen: <><path d="M5 9h14v11H5zM8 9V5h8v4"/><path d="M9 14h6"/></>,
  hospitality: <path d="M4 20V8h16v12M7 8V4h10v4M7 13h3M14 13h3M7 17h3M14 17h3" />,
  furniture: <path d="M5 12h14v7H5zM7 12V7h10v5M8 19v2M16 19v2" />,
  exterior: <path d="M4 21V9l6-4v16M10 21V3l10 5v13M7 12h1M7 16h1M14 10h2M14 14h2M14 18h2" />,
};

const benefitIcons = [
  <path key="1" d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/>,
  <path key="2" d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/>,
  <path key="3" d="M13 3s1 4-2 6c-2-2-4-1-5 2-1.4 4.2 1.4 8 6 8 4 0 7-2.8 6-7-.5-2.2-2-4.5-5-9Z"/>,
  <path key="4" d="M12 3 5 6v5c0 4.8 2.8 8.2 7 10 4.2-1.8 7-5.2 7-10V6z"/>,
  <path key="5" d="M20 4C11 4 5 8 5 15c0 3 2 5 5 5 7 0 10-7 10-16Z M4 21c3-6 7-9 13-12"/>,
];

const atlasCache = new Map<string, Promise<void>>();

function SystemIcon({ id }: { id: SystemId }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[id]}</svg>;
}

function atlasUrl(system: SystemVisual): string {
  if (typeof window === 'undefined') return system.desktopAtlas;
  return window.matchMedia('(max-width: 760px)').matches ? system.mobileAtlas : system.desktopAtlas;
}

function preloadSystemAtlas(system: SystemVisual): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  const url = atlasUrl(system);
  const existing = atlasCache.get(url);
  if (existing) return existing;

  const promise = (async () => {
    const image = new Image();
    image.decoding = 'async';
    image.src = url;
    if (!image.complete) {
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error(`Unable to load scene atlas: ${url}`));
      });
    }
    if (typeof image.decode === 'function') await image.decode();
  })().catch((error) => {
    atlasCache.delete(url);
    throw error;
  });

  atlasCache.set(url, promise);
  return promise;
}

function SceneLayer({ system, materialIndex, priority, reduceMotion }: { system: SystemVisual; materialIndex: number; priority: boolean; reduceMotion: boolean }) {
  const translateX = `${materialIndex * -(100 / 9)}%`;
  return (
    <motion.div
      className={styles.sceneLayer}
      initial={{ opacity: 0, scale: 1.012 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: .996 }}
      transition={{ duration: reduceMotion ? 0 : .58, ease: [.22, 1, .36, 1] }}
    >
      <picture className={styles.atlasPicture}>
        <source media="(max-width: 760px)" srcSet={system.mobileAtlas} type="image/avif" />
        <img
          className={styles.atlasImage}
          data-state-atlas
          src={system.desktopAtlas}
          alt=""
          aria-hidden="true"
          width="4500"
          height="312"
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          style={{ transform: `translate3d(${translateX},0,0)` }}
        />
      </picture>
    </motion.div>
  );
}

export default function SceneExperience({ copy }: Props) {
  const reduceMotion = useReducedMotion();
  const [systemId, setSystemId] = useState<SystemId>('bathroom');
  const [requestedSystemId, setRequestedSystemId] = useState<SystemId>('bathroom');
  const [materialId, setMaterialId] = useState<MaterialId>('bianco-lumen');
  const [loading, setLoading] = useState(false);
  const requestSequence = useRef(0);
  const system = useMemo(() => systems.find((item) => item.id === systemId) ?? systems[0]!, [systemId]);
  const material = useMemo(() => materials.find((item) => item.id === materialId) ?? materials[0]!, [materialId]);
  const text = copy.systems[systemId];

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('aquastone:selection', { detail: { system: systemId, material: material.name } }));
  }, [systemId, material.name]);

  useEffect(() => {
    const current = systems.findIndex((item) => item.id === systemId);
    const next = systems[(current + 1) % systems.length]!;
    const idle = window.requestIdleCallback?.(() => { void preloadSystemAtlas(next); }, { timeout: 1800 });
    if (idle) return () => window.cancelIdleCallback?.(idle);
    const timer = window.setTimeout(() => { void preloadSystemAtlas(next); }, 900);
    return () => window.clearTimeout(timer);
  }, [systemId]);

  const changeSystem = async (id: SystemId) => {
    if (id === systemId) return;
    const target = systems.find((item) => item.id === id) ?? systems[0]!;
    const sequence = requestSequence.current + 1;
    requestSequence.current = sequence;
    setRequestedSystemId(id);
    setLoading(true);
    try {
      await preloadSystemAtlas(target);
      if (requestSequence.current === sequence) setSystemId(id);
    } catch {
      if (requestSequence.current === sequence) setRequestedSystemId(systemId);
    } finally {
      if (requestSequence.current === sequence) setLoading(false);
    }
  };

  return (
    <section className={styles.root} aria-label={copy.hero.railTitle} data-scene-experience>
      <div className={styles.stageShell}>
        <aside className={styles.rail}>
          <p className={styles.railTitle}>{copy.hero.railTitle}</p>
          <div className={styles.systemList} role="tablist" aria-orientation="vertical">
            {systems.map((item) => (
              <button key={item.id} type="button" className={styles.systemButton} data-active={item.id === systemId} data-pending={loading && item.id === requestedSystemId} role="tab" aria-selected={item.id === systemId} aria-busy={loading && item.id === requestedSystemId} onClick={() => void changeSystem(item.id)}>
                <SystemIcon id={item.id} /><span className={styles.systemLabel}>{copy.systems[item.id].label}</span><span className={styles.chevron}>›</span>
              </button>
            ))}
          </div>
          <a className={styles.allSystems} href="#systems">{copy.actions.allSystems} →</a>
        </aside>

        <div className={styles.hero} data-loading={loading} data-scene-state={`${systemId}:${materialId}`} data-scene-system={systemId} data-scene-material={materialId} aria-busy={loading} aria-label={`${text.label}: ${material.name}`}>
          <AnimatePresence mode="sync" initial={false}>
            <SceneLayer key={`${systemId}-${materialId}`} system={system} materialIndex={material.atlasIndex} priority={systemId === 'bathroom'} reduceMotion={Boolean(reduceMotion)} />
          </AnimatePresence>
          <div className={styles.heroShade} />
          <div className={styles.loadingVeil} aria-hidden="true"><span /></div>
          <div className={styles.sceneIndex}><span>{String(systems.findIndex((item) => item.id === systemId) + 1).padStart(2, '0')}</span><span>/</span><span>06</span></div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={systemId} className={styles.copyBlock} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: reduceMotion ? 0 : .45 }}>
              <p className={styles.heroEyebrow}>{text.eyebrow}</p>
              <h1 className={styles.heroTitle}>{text.title}</h1>
              <p className={styles.heroDescription}>{text.description}</p>
              <a className={styles.heroLink} href="#technology">{copy.actions.details} &nbsp;→</a>
            </motion.div>
          </AnimatePresence>
          <span className="sr-only" aria-live="polite">{loading ? `Loading ${copy.systems[requestedSystemId].label}` : `${text.label}, ${material.name}`}</span>
        </div>
      </div>

      <div className={styles.mobileSystemStrip} role="tablist" aria-label={copy.hero.railTitle}>
        {systems.map((item) => <button key={item.id} type="button" className={styles.mobileSystemButton} data-active={item.id === systemId} data-pending={loading && item.id === requestedSystemId} role="tab" aria-selected={item.id === systemId} onClick={() => void changeSystem(item.id)}><SystemIcon id={item.id}/><span>{copy.systems[item.id].label}</span></button>)}
      </div>

      <div className={styles.materialDock}>
        <div className={styles.materialDockHeader}><span>{copy.hero.materialTitle}</span><span aria-live="polite">{copy.hero.selected}: {material.name}</span></div>
        <div className={styles.materialTrack} role="listbox" aria-label={copy.hero.materialTitle}>
          {materials.map((item) => {
            const position = item.atlasIndex === 0 ? 0 : (item.atlasIndex / (materials.length - 1)) * 100;
            return <button key={item.id} type="button" className={styles.materialButton} data-active={item.id === materialId} role="option" aria-selected={item.id === materialId} onClick={() => setMaterialId(item.id)}><span className={styles.slab} style={{ backgroundImage: `url(${materialSlabAtlas})`, backgroundPosition: `${position}% 50%` } as CSSProperties} /><span className={styles.materialName}>{item.name}</span></button>;
          })}
        </div>
      </div>

      <div className={styles.benefits} role="region" tabIndex={0} aria-label="System benefits">
        {copy.benefits.map((benefit, index) => <div className={styles.benefit} key={benefit.title}><svg className={styles.benefitIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{benefitIcons[index]}</svg><span><strong className={styles.benefitTitle}>{benefit.title}</strong><small className={styles.benefitDetail}>{benefit.detail}</small></span></div>)}
      </div>
    </section>
  );
}
