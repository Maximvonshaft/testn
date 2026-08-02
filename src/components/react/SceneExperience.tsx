import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { materials, systems, type MaterialId, type SystemId, type SystemVisual, type MaterialVisual } from '@/data/catalog';
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

function SystemIcon({ id }: { id: SystemId }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[id]}</svg>;
}

const benefitIcons = [
  <path key="1" d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/>,
  <path key="2" d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/>,
  <path key="3" d="M13 3s1 4-2 6c-2-2-4-1-5 2-1.4 4.2 1.4 8 6 8 4 0 7-2.8 6-7-.5-2.2-2-4.5-5-9Z"/>,
  <path key="4" d="M12 3 5 6v5c0 4.8 2.8 8.2 7 10 4.2-1.8 7-5.2 7-10V6z"/>,
  <path key="5" d="M20 4C11 4 5 8 5 15c0 3 2 5 5 5 7 0 10-7 10-16Z M4 21c3-6 7-9 13-12"/>,
];

const defaultSystem: SystemVisual = systems[0]!;
const defaultMaterial: MaterialVisual = materials[0]!;

export default function SceneExperience({ copy }: Props) {
  const reduceMotion = useReducedMotion();
  const [systemId, setSystemId] = useState<SystemId>('bathroom');
  const [materialId, setMaterialId] = useState<MaterialId>('bianco-lumen');
  const system = useMemo<SystemVisual>(() => systems.find((item) => item.id === systemId) ?? defaultSystem, [systemId]);
  const material = useMemo<MaterialVisual>(() => materials.find((item) => item.id === materialId) ?? defaultMaterial, [materialId]);
  const text = copy.systems[systemId];

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('aquastone:selection', { detail: { system: systemId, material: material.name } }));
  }, [systemId, material.name]);

  const changeSystem = (id: SystemId) => setSystemId(id);
  const changeMaterial = (id: MaterialId) => setMaterialId(id);

  return (
    <section className={styles.root} aria-label={copy.hero.railTitle} data-scene-experience>
      <div className={styles.stageShell}>
        <aside className={styles.rail}>
          <p className={styles.railTitle}>{copy.hero.railTitle}</p>
          <div className={styles.systemList} role="tablist" aria-orientation="vertical">
            {systems.map((item) => (
              <button key={item.id} type="button" className={styles.systemButton} data-active={item.id === systemId} role="tab" aria-selected={item.id === systemId} onClick={() => changeSystem(item.id)}>
                <SystemIcon id={item.id} /><span className={styles.systemLabel}>{copy.systems[item.id].label}</span><span className={styles.chevron}>›</span>
              </button>
            ))}
          </div>
          <a className={styles.allSystems} href="#systems">{copy.actions.allSystems} →</a>
        </aside>

        <div className={styles.hero} style={{ '--focus': system.focalPoint } as CSSProperties}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.img key={`${system.id}-desktop`} className={`${styles.heroImage} ${styles.heroImageDesktop}`} src={system.desktopImage} alt="" aria-hidden="true" initial={{ opacity: 0, scale: 1.025 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .99 }} transition={{ duration: reduceMotion ? 0 : .65 }} fetchPriority={system.id === 'bathroom' ? 'high' : 'auto'} />
          </AnimatePresence>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.img key={`${system.id}-mobile`} className={`${styles.heroImage} ${styles.heroImageMobile}`} src={system.mobileImage} alt="" aria-hidden="true" initial={{ opacity: 0, scale: 1.025 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .99 }} transition={{ duration: reduceMotion ? 0 : .65 }} />
          </AnimatePresence>
          <motion.div className={styles.materialOverlay} data-mask={system.materialMask} style={{ backgroundImage: `url(${material.image})` }} animate={{ opacity: material.id === 'bianco-lumen' ? .32 : .58 }} transition={{ duration: reduceMotion ? 0 : .45 }} aria-hidden="true" />
          <div className={styles.heroShade} />
          <div className={styles.sceneIndex}><span>{String(systems.findIndex((item) => item.id === systemId) + 1).padStart(2, '0')}</span><span>/</span><span>06</span></div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={systemId} className={styles.copyBlock} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: reduceMotion ? 0 : .45 }}>
              <p className={styles.heroEyebrow}>{text.eyebrow}</p>
              <h1 className={styles.heroTitle}>{text.title}</h1>
              <p className={styles.heroDescription}>{text.description}</p>
              <a className={styles.heroLink} href="#technology">{copy.actions.details} &nbsp;→</a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className={styles.mobileSystemStrip} role="tablist" aria-label={copy.hero.railTitle}>
        {systems.map((item) => <button key={item.id} type="button" className={styles.mobileSystemButton} data-active={item.id === systemId} role="tab" aria-selected={item.id === systemId} onClick={() => changeSystem(item.id)}><SystemIcon id={item.id}/><span>{copy.systems[item.id].label}</span></button>)}
      </div>

      <div className={styles.materialDock}>
        <div className={styles.materialDockHeader}><span>{copy.hero.materialTitle}</span><span aria-live="polite">{copy.hero.selected}: {material.name}</span></div>
        <div className={styles.materialTrack} role="listbox" aria-label={copy.hero.materialTitle}>
          {materials.map((item) => <button key={item.id} type="button" className={styles.materialButton} data-active={item.id === materialId} role="option" aria-selected={item.id === materialId} onClick={() => changeMaterial(item.id)}><span className={styles.slab} style={{ backgroundImage: `url(${item.image})` }} /><span className={styles.materialName}>{item.name}</span></button>)}
        </div>
      </div>

      <div className={styles.benefits} aria-label="System benefits">
        {copy.benefits.map((benefit, index) => <div className={styles.benefit} key={benefit.title}><svg className={styles.benefitIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{benefitIcons[index]}</svg><span><strong className={styles.benefitTitle}>{benefit.title}</strong><small className={styles.benefitDetail}>{benefit.detail}</small></span></div>)}
      </div>
    </section>
  );
}
