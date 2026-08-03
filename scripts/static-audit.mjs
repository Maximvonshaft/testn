import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { materializeVisualAssets } from './materialize-visual-assets.mjs';

await materializeVisualAssets();

const root = new URL('../', import.meta.url);
const failures = [];
const checks = [];
const pass = (name, detail = '') => checks.push({ name, pass: true, detail });
const fail = (name, detail) => { checks.push({ name, pass: false, detail }); failures.push(`${name}: ${detail}`); };

async function walk(path) {
  const entries = await readdir(path, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (['node_modules', '.git', 'dist', '.astro', '.wrangler', 'playwright-report', 'test-results', 'coverage', 'qa-artifacts', 'runtime-artifacts'].includes(entry.name)) continue;
    const full = join(path, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full)); else files.push(full);
  }
  return files;
}

const files = await walk(root.pathname);
const sourceFiles = files.filter((file) => ['.ts','.tsx','.astro','.css','.mjs','.json','.jsonc','.md'].includes(extname(file)) && !file.endsWith('scripts/static-audit.mjs'));
const source = (await Promise.all(sourceFiles.map((file) => readFile(file, 'utf8').then((content) => ({ file, content })))));
const joined = source.map(({ content }) => content).join('\n');

for (const required of ['package.json','astro.config.mjs','src/pages/[locale]/index.astro','src/pages/api/lead.ts','src/components/react/SceneExperience.tsx','src/components/react/MaterialLayerViewer.tsx','src/components/react/LeadDialog.tsx','scripts/record-runtime.mjs','docs/VISUAL_SYSTEM.md','docs/VISUAL_ASSET_PROVENANCE.md','scripts/materialize-visual-assets.mjs','wrangler.jsonc']) {
  const exists = files.some((file) => relative(root.pathname, file) === required);
  exists ? pass(`required:${required}`) : fail(`required:${required}`, 'missing');
}

const imageAssets = files.filter((file) => /public\/assets\/.+\.(webp|avif|png|svg)$/i.test(file));
imageAssets.length >= 21 ? pass('owned-asset-library', `${imageAssets.length} local assets`) : fail('owned-asset-library', `only ${imageAssets.length} assets`);

const atlasAssets = files.filter((file) => /public\/assets\/visual\/scene-grid-(desktop|mobile)\.avif$/i.test(file));
atlasAssets.length === 2 ? pass('complete-state-atlases', '2 responsive global state matrices') : fail('complete-state-atlases', `${atlasAssets.length} != 2`);

const externalImage = /https?:\/\/(?:images\.unsplash|images\.pexels|.*cloudinary|.*imgix)/i.test(joined);
externalImage ? fail('no-image-hotlinking', 'external image CDN reference detected') : pass('no-image-hotlinking');

for (const file of imageAssets) {
  const bytes = (await stat(file)).size;
  const name = relative(root.pathname, file);
  const limit = name.includes('/scene-grid-') ? 500_000 : 450_000;
  bytes <= limit ? pass(`asset-budget:${name}`, `${bytes} B`) : fail(`asset-budget:${name}`, `${bytes} B exceeds ${limit}`);
}

const suspicious = [
  ['private-key', /BEGIN (?:RSA|OPENSSH|EC) PRIVATE KEY/],
  ['api-secret', /sk-[A-Za-z0-9_-]{20,}/],
  ['unfinished-copy', /\b(?:TODO|FIXME|lorem ipsum)\b/i],
  ['fabricated-certification', /\b(?:CE Certified|EPD Verified|GREENGUARD Gold Certified|ISO Certified)\b/i],
];
for (const [name, pattern] of suspicious) pattern.test(joined) ? fail(name, 'forbidden pattern found') : pass(name);

const catalog = await readFile(new URL('../src/data/catalog.ts', import.meta.url), 'utf8');
for (const [token, expected] of [['atlasRow:',6],['atlasIndex:',9]]) {
  const count = catalog.split(token).length - 1;
  count >= expected ? pass(`catalog:${token}`, String(count)) : fail(`catalog:${token}`, `${count} < ${expected}`);
}

const sceneSource = await readFile(new URL('../src/components/react/SceneExperience.tsx', import.meta.url), 'utf8');
const sceneCss = await readFile(new URL('../src/components/react/SceneExperience.module.css', import.meta.url), 'utf8');
for (const forbidden of ['materialOverlay','data-mask']) (sceneSource.includes(forbidden) || sceneCss.includes(forbidden)) ? fail(`no-runtime-overlay:${forbidden}`, 'forbidden runtime replacement remains') : pass(`no-runtime-overlay:${forbidden}`);
sceneCss.includes('clip-path') ? fail('no-generic-clip-path', 'scene CSS still uses clip-path replacement') : pass('no-generic-clip-path');
sceneSource.includes('preloadAtlas') && sceneSource.includes('image.decode') && sceneSource.includes('sceneStateAtlases') ? pass('decode-before-commit') : fail('decode-before-commit', 'atlas decode gate missing');

const copy = await readFile(new URL('../src/data/copy.ts', import.meta.url), 'utf8');
for (const locale of ['commonPagesEn','commonPagesDe','commonPagesFr','commonPagesCnr']) copy.includes(`const ${locale}`) ? pass(`localized-pages:${locale}`) : fail(`localized-pages:${locale}`, 'missing');
copy.includes('Object.fromEntries(Object.entries(commonPagesEn)') ? fail('no-language-fallback-copy', 'localized pages clone English') : pass('no-language-fallback-copy');

for (const route of ['/api/lead','TURNSTILE_SECRET_KEY','LEAD_WEBHOOK_URL','idempotency-key','origin_rejected']) joined.includes(route) ? pass(`lead-security:${route}`) : fail(`lead-security:${route}`, 'missing');

const totalAssetBytes = (await Promise.all(imageAssets.map((file) => stat(file).then((info) => info.size)))).reduce((a,b)=>a+b,0);
totalAssetBytes <= 7_500_000 ? pass('total-image-budget', `${totalAssetBytes} B`) : fail('total-image-budget', `${totalAssetBytes} B`);

console.log(JSON.stringify({ status: failures.length ? 'failed' : 'passed', passed: checks.filter((item) => item.pass).length, total: checks.length, checks }, null, 2));
if (failures.length) {
  console.error('\n' + failures.join('\n'));
  process.exit(1);
}
