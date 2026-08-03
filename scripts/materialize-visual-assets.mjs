import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const packedRoot = join(root, 'src', 'assets-packed');
const manifest = JSON.parse(await readFile(join(packedRoot, 'manifest.json'), 'utf8'));
const outputs = [
  ['scene-grid-desktop.avif', join(root, 'public', 'assets', 'visual', 'scene-grid-desktop.avif')],
  ['scene-grid-mobile.avif', join(root, 'public', 'assets', 'visual', 'scene-grid-mobile.avif')],
  ['cards-atlas.avif', join(root, 'public', 'assets', 'visual', 'cards-atlas.avif')],
  ['slab-atlas.avif', join(root, 'public', 'assets', 'visual', 'materials', 'slab-atlas.avif')],
  ['og-default.webp', join(root, 'public', 'assets', 'visual', 'social', 'og-default.webp')],
];

let activeMaterialization;

async function sameBytes(path, bytes) {
  try {
    const info = await stat(path);
    if (info.size !== bytes.length) return false;
    const current = await readFile(path);
    return current.equals(bytes);
  } catch {
    return false;
  }
}

function assertImageContainer(assetName, bytes) {
  if (bytes.length < 12) throw new Error(`Packed visual asset is truncated: ${assetName}`);
  if (assetName.endsWith('.webp')) {
    if (bytes.subarray(0, 4).toString('ascii') !== 'RIFF' || bytes.subarray(8, 12).toString('ascii') !== 'WEBP') {
      throw new Error(`Packed visual asset is not a valid WebP: ${assetName}`);
    }
    return;
  }
  if (assetName.endsWith('.avif') && bytes.subarray(4, 12).toString('ascii') !== 'ftypavif') {
    throw new Error(`Packed visual asset is not a valid AVIF: ${assetName}`);
  }
}

async function materialize() {
  const names = await readdir(packedRoot);
  for (const [assetName, outputPath] of outputs) {
    const prefix = `${assetName}.b64.`;
    const parts = names.filter((name) => name.startsWith(prefix)).sort();
    if (!parts.length) throw new Error(`Packed visual asset is missing: ${assetName}`);
    const encoded = (await Promise.all(parts.map((part) => readFile(join(packedRoot, part), 'utf8')))).join('').replace(/\s+/g, '');
    const bytes = Buffer.from(encoded, 'base64');
    assertImageContainer(assetName, bytes);
    const expected = manifest[assetName];
    const digest = createHash('sha256').update(bytes).digest('hex');
    if (!expected || expected.bytes !== bytes.length || expected.sha256 !== digest) {
      throw new Error(`Packed visual asset integrity mismatch: ${assetName}`);
    }
    if (await sameBytes(outputPath, bytes)) continue;
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, bytes);
  }
}

export function materializeVisualAssets() {
  activeMaterialization ??= materialize().finally(() => { activeMaterialization = undefined; });
  return activeMaterialization;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await materializeVisualAssets();
  console.log('AQUASTONE visual assets materialized.');
}
