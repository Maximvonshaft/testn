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
  desktopImage: string;
  mobileImage: string;
  cardImage: string;
  materialMask: 'wall' | 'surface' | 'feature' | 'exterior';
  focalPoint: string;
}

export interface MaterialVisual {
  id: MaterialId;
  name: string;
  image: string;
  base: string;
  secondary: string;
  vein: string;
  roughness: number;
}

export const systems: readonly SystemVisual[] = [
  {
    id: 'bathroom',
    desktopImage: '/assets/scenes/bathroom.svg',
    mobileImage: '/assets/scenes/bathroom.svg',
    cardImage: '/assets/scenes/bathroom.svg',
    materialMask: 'wall',
    focalPoint: '50% 48%',
  },
  {
    id: 'interior',
    desktopImage: '/assets/scenes/interior.svg',
    mobileImage: '/assets/scenes/interior.svg',
    cardImage: '/assets/scenes/interior.svg',
    materialMask: 'feature',
    focalPoint: '50% 45%',
  },
  {
    id: 'kitchen',
    desktopImage: '/assets/scenes/kitchen.svg',
    mobileImage: '/assets/scenes/kitchen.svg',
    cardImage: '/assets/scenes/kitchen.svg',
    materialMask: 'surface',
    focalPoint: '50% 45%',
  },
  {
    id: 'hospitality',
    desktopImage: '/assets/scenes/hospitality.svg',
    mobileImage: '/assets/scenes/hospitality.svg',
    cardImage: '/assets/scenes/hospitality.svg',
    materialMask: 'feature',
    focalPoint: '50% 48%',
  },
  {
    id: 'furniture',
    desktopImage: '/assets/scenes/furniture.svg',
    mobileImage: '/assets/scenes/furniture.svg',
    cardImage: '/assets/scenes/furniture.svg',
    materialMask: 'surface',
    focalPoint: '50% 50%',
  },
  {
    id: 'exterior',
    desktopImage: '/assets/scenes/exterior.svg',
    mobileImage: '/assets/scenes/exterior.svg',
    cardImage: '/assets/scenes/exterior.svg',
    materialMask: 'exterior',
    focalPoint: '50% 48%',
  },
] as const;

export const materials: readonly MaterialVisual[] = [
  { id: 'bianco-lumen', name: 'Bianco Lumen', image: '/assets/materials/bianco-lumen.svg', base: '#e7ddd0', secondary: '#f4eee7', vein: '#b7a18e', roughness: 0.55 },
  { id: 'crema-savona', name: 'Crema Savona', image: '/assets/materials/crema-savona.svg', base: '#d8b99a', secondary: '#f0d8bd', vein: '#a77d61', roughness: 0.52 },
  { id: 'taupe-mist', name: 'Taupe Mist', image: '/assets/materials/taupe-mist.svg', base: '#b6a79a', secondary: '#d4c8bc', vein: '#75685f', roughness: 0.62 },
  { id: 'silver-cloud', name: 'Silver Cloud', image: '/assets/materials/silver-cloud.svg', base: '#d7d6d1', secondary: '#efeeea', vein: '#8f918e', roughness: 0.58 },
  { id: 'greige-honed', name: 'Greige Honed', image: '/assets/materials/greige-honed.svg', base: '#b5aa9c', secondary: '#d0c4b6', vein: '#756b61', roughness: 0.72 },
  { id: 'dune-rift', name: 'Dune Rift', image: '/assets/materials/dune-rift.svg', base: '#c79f77', secondary: '#dfbd99', vein: '#8d6549', roughness: 0.66 },
  { id: 'noce-velvet', name: 'Noce Velvet', image: '/assets/materials/noce-velvet.svg', base: '#76533a', secondary: '#9f7657', vein: '#d1ae88', roughness: 0.64 },
  { id: 'pietra-grey', name: 'Pietra Grey', image: '/assets/materials/pietra-grey.svg', base: '#4c4a49', secondary: '#77736f', vein: '#c5bbb1', roughness: 0.48 },
  { id: 'calacatta-oro', name: 'Calacatta Oro', image: '/assets/materials/calacatta-oro.svg', base: '#e8e1d8', secondary: '#f6f2ec', vein: '#b59172', roughness: 0.5 },
] as const;

export const projectImages = [
  '/assets/scenes/exterior.svg',
  '/assets/scenes/interior.svg',
  '/assets/scenes/kitchen.svg',
] as const;

export const pageSlugs = ['collections', 'systems', 'technical', 'sustainability', 'about', 'privacy', 'thanks'] as const;
export type PageSlug = (typeof pageSlugs)[number];
