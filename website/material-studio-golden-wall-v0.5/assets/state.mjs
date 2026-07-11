export function variantPath(materialId, profileId) {
  return `assets/wall/overlays/${materialId}-${profileId}.webp`;
}

function findById(items, id) {
  return items.find((item) => item.id === id);
}

export function buildConfigurationCode(state, catalog) {
  const material = findById(catalog.materials, state.material);
  const profile = findById(catalog.profiles, state.profile);
  if (!material || !profile) {
    throw new Error('Cannot build a configuration code from unsupported state.');
  }
  return [
    'MS',
    material.demoCode,
    profile.demoCode,
    String(state.finish).toUpperCase(),
    String(state.dimension),
  ].join('-');
}

export function normalizeState(input = {}, catalog) {
  const defaults = catalog.defaults;
  const material = findById(catalog.materials, input.material) ? input.material : defaults.material;
  const profile = findById(catalog.profiles, input.profile) ? input.profile : defaults.profile;
  const finish = findById(catalog.finishes, input.finish) ? input.finish : defaults.finish;
  const dimension = catalog.dimensions.includes(Number(input.dimension))
    ? Number(input.dimension)
    : defaults.dimension;
  return { material, profile, finish, dimension };
}
