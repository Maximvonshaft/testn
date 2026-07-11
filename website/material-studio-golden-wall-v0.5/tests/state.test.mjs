import test from 'node:test';
import assert from 'node:assert/strict';
import {
  variantPath,
  buildConfigurationCode,
  normalizeState,
} from '../assets/state.mjs';

const catalog = {
  materials: [
    { id: 'smoked-walnut', demoCode: 'ZX-DWC-SW51' },
    { id: 'soft-oak', demoCode: 'ZX-WPC-SO02' },
  ],
  profiles: [
    { id: 'flat', demoCode: 'P-FLAT' },
    { id: 'slat', demoCode: 'P-SLAT18' },
  ],
  finishes: [
    { id: 'matte' },
    { id: 'satin' },
  ],
  dimensions: [2400, 2800],
  defaults: {
    material: 'smoked-walnut', profile: 'flat', finish: 'satin', dimension: 2800,
  },
};

test('variantPath returns deterministic scene-aligned overlay path', () => {
  assert.equal(
    variantPath('soft-oak', 'slat'),
    'assets/wall/overlays/soft-oak-slat.webp',
  );
});

test('buildConfigurationCode uses authoritative demo codes', () => {
  const state = { material: 'soft-oak', profile: 'slat', finish: 'matte', dimension: 2400 };
  assert.equal(
    buildConfigurationCode(state, catalog),
    'MS-ZX-WPC-SO02-P-SLAT18-MATTE-2400',
  );
});

test('normalizeState rejects unsupported saved values independently', () => {
  const normalized = normalizeState({
    material: 'missing', profile: 'slat', finish: 'gloss', dimension: 9999,
  }, catalog);
  assert.deepEqual(normalized, {
    material: 'smoked-walnut', profile: 'slat', finish: 'satin', dimension: 2800,
  });
});
