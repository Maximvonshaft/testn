import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const packedRoot = join(root, 'src', 'assets-packed');
const outputs = [
  ['scene-grid-desktop.webp', join(root, 'public', 'assets', 'visual', 'scene-grid-desktop.webp')],
  ['scene-grid-mobile.webp', join(root, 'public', 'assets', 'visual', 'scene-grid-mobile.webp')],
  ['cards-atlas.webp', join(root, 'public', 'assets', 'visual', 'cards-atlas.webp')],
  ['slab-atlas.webp', join(root, 'public', 'assets', 'visual', 'materials', 'slab-atlas.webp')],
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

async function materialize() {
  const names = await readdir(packedRoot);
  for (const [assetName, outputPath] of outputs) {
    const prefix = `${assetName}.b64.`;
    const parts = names.filter((name) => name.startsWith(prefix)).sort();
    if (!parts.length) throw new Error(`Packed visual asset is missing: ${assetName}`);
    const encoded = (await Promise.all(parts.map((part) => readFile(join(packedRoot, part), 'utf8')))).join('').replace(/\s+/g, '');
    const bytes = Buffer.from(encoded, 'base64');
    if (bytes.length < 12 || bytes.subarray(0, 4).toString('ascii') !== 'RIFF' || bytes.subarray(8, 12).toString('ascii') !== 'WEBP') {
      throw new Error(`Packed visual asset is not a valid WebP: ${assetName}`);
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
