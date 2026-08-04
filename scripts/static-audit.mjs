import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

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
const sourceFiles = files.filter((file) => ['.ts','.tsx','.astro','.css','.mjs','.json','.jsonc'].includes(extname(file)) && !file.endsWith('scripts/static-audit.mjs'));
const productSourceFiles = sourceFiles.filter((file) => !relative(root.pathname, file).startsWith('tests/'));
const source = await Promise.all(sourceFiles.map((file) => readFile(file, 'utf8').then((content) => ({ file, content }))));
const joined = source.map(({ content }) => content).join('\n');
const productJoined = (await Promise.all(productSourceFiles.map((file) => readFile(file, 'utf8')))).join('\n');

for (const required of ['package.json','astro.config.mjs','src/pages/[locale]/index.astro','src/pages/api/lead.ts','src/components/react/SceneExperience.tsx','src/components/react/MaterialLayerViewer.tsx','src/components/react/LeadDialog.tsx','scripts/record-runtime.mjs','wrangler.jsonc']) {
  const exists = files.some((file) => relative(root.pathname, file) === required);
  exists ? pass(`required:${required}`) : fail(`required:${required}`, 'missing');
}

const imageAssets = files.filter((file) => /public\/assets\/.+\.(webp|avif|png|svg)$/i.test(file));
imageAssets.length >= 28 ? pass('owned-asset-library', `${imageAssets.length} local assets`) : fail('owned-asset-library', `only ${imageAssets.length} assets`);

const stateAtlases = imageAssets.filter((file) => /public\/assets\/visual\/systems\/(bathroom|interior|kitchen|hospitality|furniture|exterior)-(desktop|mobile)\.avif$/i.test(relative(root.pathname, file)));
stateAtlases.length === 12 ? pass('complete-state-atlases', '12 responsive system atlases') : fail('complete-state-atlases', `${stateAtlases.length} != 12`);

const externalImage = /https?:\/\/(?:images\.unsplash|images\.pexels|.*cloudinary|.*imgix)/i.test(joined);
externalImage ? fail('no-image-hotlinking', 'external image CDN reference detected') : pass('no-image-hotlinking');

for (const file of imageAssets) {
  const bytes = (await stat(file)).size;
  const name = relative(root.pathname, file);
  const limit = name.includes('/visual/systems/') ? 150_000 : name.includes('/scenes/') ? 900_000 : 450_000;
  bytes <= limit ? pass(`asset-budget:${name}`, `${bytes} B`) : fail(`asset-budget:${name}`, `${bytes} B exceeds ${limit}`);
}

const suspicious = [
  ['private-key', /BEGIN (?:RSA|OPENSSH|EC) PRIVATE KEY/],
  ['api-secret', /sk-[A-Za-z0-9_-]{20,}/],
  ['unfinished-copy', /\b(?:TODO|FIXME|lorem ipsum)\b/i],
  ['fabricated-certification', /\b(?:CE Certified|EPD Verified|GREENGUARD Gold Certified|ISO Certified)\b/i],
];
for (const [name, pattern] of suspicious) pattern.test(joined) ? fail(name, 'forbidden pattern found') : pass(name);

for (const [name, pattern] of [
  ['no-runtime-material-overlay', /materialOverlay/],
  ['no-runtime-material-mask', /data-mask|clip-path:\s*polygon/],
]) pattern.test(productJoined) ? fail(name, 'legacy runtime replacement implementation found') : pass(name);

const catalog = await readFile(new URL('../src/data/catalog.ts', import.meta.url), 'utf8');
const systemCount = [...catalog.matchAll(/systemVisual\('(bathroom|interior|kitchen|hospitality|furniture|exterior)'/g)].length;
systemCount === 6 ? pass('catalog:system-atlases', String(systemCount)) : fail('catalog:system-atlases', `${systemCount} != 6`);
const materialCount = [...catalog.matchAll(/\{ id: '(?:bianco-lumen|crema-savona|taupe-mist|silver-cloud|greige-honed|dune-rift|noce-velvet|pietra-grey|calacatta-oro)'/g)].length;
materialCount === 9 ? pass('catalog:materials', String(materialCount)) : fail('catalog:materials', `${materialCount} != 9`);

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
