export const locales = ['en', 'de', 'fr', 'cnr'] as const;
export type Locale = (typeof locales)[number];

export type SystemId = 'bathroom' | 'interior' | 'kitchen' | 'hospitality' | 'furniture' | 'exterior';
export type MaterialId =
  | 'bianco-lumen'
  | 'crema-savona'
  | 'taupe-mist'
  | 'silver-cloud'
  | 'greige-honed'
  | 'dune-rift'
  | 'noce-velvet'
  | 'pietra-grey'
  | 'calacatta-oro';

export interface SystemVisual {
  id: SystemId;
  atlasRow: number;
  focalPoint: string;
}

export interface MaterialVisual {
  id: MaterialId;
  name: string;
  image: string;
  atlasIndex: number;
  base: string;
  secondary: string;
  vein: string;
  roughness: number;
}

const visualRoot = '/assets/visual';

export const sceneStateAtlases = {
  desktop: `${visualRoot}/scene-grid-desktop.webp`,
  mobile: `${visualRoot}/scene-grid-mobile.webp`,
} as const;

export const systemCardAtlas = `${visualRoot}/cards-atlas.webp`;
export const materialSlabAtlas = `${visualRoot}/materials/slab-atlas.webp`;
export const sceneAtlasColumns = 9 as const;
export const sceneAtlasRows = 6 as const;

export const systems: readonly SystemVisual[] = [
  { id: 'bathroom', atlasRow: 0, focalPoint: '56% 50%' },
  { id: 'interior', atlasRow: 1, focalPoint: '66% 50%' },
  { id: 'kitchen', atlasRow: 2, focalPoint: '62% 50%' },
  { id: 'hospitality', atlasRow: 3, focalPoint: '68% 50%' },
  { id: 'furniture', atlasRow: 4, focalPoint: '64% 50%' },
  { id: 'exterior', atlasRow: 5, focalPoint: '64% 50%' },
] as const;

export const materials: readonly MaterialVisual[] = [
  { id: 'bianco-lumen', name: 'Bianco Lumen', image: '/assets/materials/bianco-lumen.svg', atlasIndex: 0, base: '#e7ddd0', secondary: '#f4eee7', vein: '#b7a18e', roughness: 0.55 },
  { id: 'crema-savona', name: 'Crema Savona', image: '/assets/materials/crema-savona.svg', atlasIndex: 1, base: '#d8b99a', secondary: '#f0d8bd', vein: '#a77d61', roughness: 0.52 },
  { id: 'taupe-mist', name: 'Taupe Mist', image: '/assets/materials/taupe-mist.svg', atlasIndex: 2, base: '#b6a79a', secondary: '#d4c8bc', vein: '#75685f', roughness: 0.62 },
  { id: 'silver-cloud', name: 'Silver Cloud', image: '/assets/materials/silver-cloud.svg', atlasIndex: 3, base: '#d7d6d1', secondary: '#efeeea', vein: '#8f918e', roughness: 0.58 },
  { id: 'greige-honed', name: 'Greige Honed', image: '/assets/materials/greige-honed.svg', atlasIndex: 4, base: '#b5aa9c', secondary: '#d0c4b6', vein: '#756b61', roughness: 0.72 },
  { id: 'dune-rift', name: 'Dune Rift', image: '/assets/materials/dune-rift.svg', atlasIndex: 5, base: '#c79f77', secondary: '#dfbd99', vein: '#8d6549', roughness: 0.66 },
  { id: 'noce-velvet', name: 'Noce Velvet', image: '/assets/materials/noce-velvet.svg', atlasIndex: 6, base: '#76533a', secondary: '#9f7657', vein: '#d1ae88', roughness: 0.64 },
  { id: 'pietra-grey', name: 'Pietra Grey', image: '/assets/materials/pietra-grey.svg', atlasIndex: 7, base: '#4c4a49', secondary: '#77736f', vein: '#c5bbb1', roughness: 0.48 },
  { id: 'calacatta-oro', name: 'Calacatta Oro', image: '/assets/materials/calacatta-oro.svg', atlasIndex: 8, base: '#e8e1d8', secondary: '#f6f2ec', vein: '#b59172', roughness: 0.5 },
] as const;

export function getSystemVisual(id: SystemId): SystemVisual {
  return systems.find((item) => item.id === id) ?? systems[0]!;
}

export function getMaterialVisual(id: MaterialId): MaterialVisual {
  return materials.find((item) => item.id === id) ?? materials[0]!;
}

export const projectSystems: readonly SystemId[] = ['exterior', 'interior', 'kitchen'] as const;

export const pageSlugs = ['collections', 'systems', 'technical', 'sustainability', 'about', 'privacy', 'thanks'] as const;
export type PageSlug = (typeof pageSlugs)[number];
