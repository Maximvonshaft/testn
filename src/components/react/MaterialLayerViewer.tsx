import { Component, type ErrorInfo, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { materials, type MaterialId, type MaterialVisual } from '@/data/catalog';
import type { SiteCopy } from '@/data/copy';
import styles from './MaterialLayerViewer.module.css';

type Props = { copy: SiteCopy };

type BoundaryProps = { children: ReactNode; fallback: ReactNode };
type BoundaryState = { failed: boolean };
class WebGLBoundary extends Component<BoundaryProps, BoundaryState> {
  override state: BoundaryState = { failed: false };
  static override getDerivedStateFromError(): BoundaryState { return { failed: true }; }
  override componentDidCatch(error: Error, info: ErrorInfo) { console.warn('3D fallback activated', error.message, info.componentStack); }
  override render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

const layerSpecs = [
  { id: 'surface', height: .09, y: 1.45, color: '#eee9e2' },
  { id: 'decorative', height: .12, y: .9, color: '#d5cabd' },
  { id: 'core', height: .28, y: .26, color: '#9b8b7b' },
  { id: 'reinforced', height: .18, y: -.45, color: '#c5b5a6' },
  { id: 'balance', height: .14, y: -1.05, color: '#39332f' },
] as const;

function LayerMesh({ layer, index, active, texture, selected }: {
  layer: (typeof layerSpecs)[number];
  index: number;
  active: boolean;
  texture: THREE.Texture | null;
  selected: MaterialVisual;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const baseY = layer.y;

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const targetScale = active ? 1.04 : 1;
    mesh.scale.x = THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.12);
    mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, targetScale, 0.12);
    mesh.scale.z = THREE.MathUtils.lerp(mesh.scale.z, targetScale, 0.12);
    mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, baseY + (active ? 0.13 : 0), 0.12);
  });

  const isSurface = layer.id === 'surface';
  return (
    <mesh ref={ref} position={[0, baseY, index * .04]} castShadow receiveShadow>
      <boxGeometry args={[5.4, layer.height, 3.35]} />
      <meshStandardMaterial
        map={isSurface && texture ? texture : null}
        color={isSurface ? '#ffffff' : layer.color}
        roughness={isSurface ? selected.roughness : .7}
        metalness={0.02}
      />
    </mesh>
  );
}

function Stack({ active, materialId }: { active: string; materialId: MaterialId }) {
  const selected: MaterialVisual = materials.find((item) => item.id === materialId) ?? materials[0]!;
  const texture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = selected.base; ctx.fillRect(0,0,512,256);
    const gradient = ctx.createLinearGradient(0,0,512,256);
    gradient.addColorStop(0, selected.secondary); gradient.addColorStop(.5, selected.base); gradient.addColorStop(1, selected.secondary);
    ctx.globalAlpha = .55; ctx.fillStyle = gradient; ctx.fillRect(0,0,512,256);
    ctx.globalAlpha = .38; ctx.strokeStyle = selected.vein; ctx.lineWidth = 3;
    for (let i=0; i<7; i+=1) { ctx.beginPath(); ctx.moveTo(-30, 24+i*36); ctx.bezierCurveTo(130, i*22, 300, 80+i*18, 550, 20+i*30); ctx.stroke(); }
    const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 4; return map;
  }, [selected]);

  useEffect(() => () => texture?.dispose(), [texture]);
  useFrame(({ clock, scene }) => { scene.rotation.y = Math.sin(clock.elapsedTime * .18) * .05; });

  return (
    <group rotation={[-.42, -.35, -.08]} position={[0, -.1, 0]}>
      {layerSpecs.map((layer, index) => (
        <LayerMesh
          key={layer.id}
          layer={layer}
          index={index}
          active={active === layer.id}
          texture={texture}
          selected={selected}
        />
      ))}
    </group>
  );
}

export default function MaterialLayerViewer({ copy }: Props) {
  const [active, setActive] = useState('core');
  const [materialId, setMaterialId] = useState<MaterialId>('bianco-lumen');
  const [mounted, setMounted] = useState(false);
  const fallback = <img className={styles.viewerFallback} src="/assets/materials/layer-system.svg" alt="Exploded five-layer AQUASTONE material system" />;

  useEffect(() => {
    setMounted(true);
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ material?: string }>).detail;
      const selected = materials.find((item) => item.name === detail.material);
      if (selected) setMaterialId(selected.id);
    };
    window.addEventListener('aquastone:selection', handler);
    return () => window.removeEventListener('aquastone:selection', handler);
  }, []);

  return (
    <section className={styles.section} id="technology">
      <div className={styles.grid}>
        <div className={styles.intro}>
          <p className="eyebrow">{copy.technology.eyebrow}</p>
          <h2 className="section-title">{copy.technology.title}</h2>
          <p className="body-copy">{copy.technology.body}</p>
          <div className={styles.featureList}>{copy.benefits.map((item) => <div className={styles.feature} key={item.title}>{item.title}</div>)}</div>
          <a className="button button--warm" href="#systems">{copy.actions.explore}</a>
        </div>
        <div className={styles.viewer} aria-label="Interactive material layer model">
          {fallback}
          {mounted && <WebGLBoundary fallback={fallback}>
            <Canvas dpr={[1, 1.6]} camera={{ position: [6.8, 5.4, 8], fov: 36 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
              <ambientLight intensity={1.3} />
              <directionalLight position={[4, 8, 6]} intensity={3.5} castShadow shadow-mapSize={[1024,1024]} />
              <pointLight position={[-5, 2, 4]} intensity={1.1} color="#d6bda8" />
              <Stack active={active} materialId={materialId} />
              <ContactShadows position={[0,-1.5,0]} opacity={.28} scale={10} blur={2.5} far={5} />
              <OrbitControls enablePan={false} minDistance={7} maxDistance={13} autoRotate autoRotateSpeed={.35} />
            </Canvas>
          </WebGLBoundary>}
          <span className={styles.viewerCaption}>Drag to inspect • scroll-safe controls</span>
        </div>
        <div className={styles.notes}>{copy.technology.layers.map((layer) => <button key={layer.id} type="button" className={styles.note} data-active={active === layer.id} aria-pressed={active === layer.id} onClick={() => setActive(layer.id)}><strong className={styles.noteTitle}>{layer.title}</strong><span className={styles.noteBody}>{layer.body}</span></button>)}</div>
      </div>
      <div className={styles.performance}>{copy.values.map((value, index) => <div className={styles.value} key={value.title}><span className={styles.valueIcon}>{String(index + 1).padStart(2,'0')}</span><strong>{value.title}</strong><span>{value.body}</span></div>)}</div>
    </section>
  );
}
