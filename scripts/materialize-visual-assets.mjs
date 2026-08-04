import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const packedRoot = join(root, 'src', 'assets-packed');
const bundleSha256 = '5f2de021e9e5ca39c1e89f65935066d0fe8b9837c93fafe714dd3804fbfaade9';
const allowedSystems = new Set(['bathroom', 'interior', 'kitchen', 'hospitality', 'furniture', 'exterior']);
let activeMaterialization;

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

async function sameBytes(path, bytes) {
  try {
    const info = await stat(path);
    if (info.size !== bytes.length) return false;
    return (await readFile(path)).equals(bytes);
  } catch {
    return false;
  }
}

function targetPath(name) {
  const match = /^(bathroom|interior|kitchen|hospitality|furniture|exterior)-(desktop|mobile|card)\.avif$/.exec(name);
  if (!match || !allowedSystems.has(match[1])) throw new Error(`Unexpected visual asset: ${name}`);
  const folder = match[2] === 'card' ? 'cards' : 'systems';
  return join(root, 'public', 'assets', 'visual', folder, name);
}

async function materialize() {
  const names = (await readdir(packedRoot)).filter((name) => name.startsWith('hybrid-visual-assets.aqv.b64.')).sort();
  if (!names.length) throw new Error('Hybrid visual asset bundle is missing.');
  const encoded = (await Promise.all(names.map((name) => readFile(join(packedRoot, name), 'utf8')))).join('').replace(/\s+/g, '');
  const bundle = Buffer.from(encoded, 'base64');
  if (sha256(bundle) !== bundleSha256) throw new Error('Hybrid visual asset bundle integrity mismatch.');
  if (bundle.subarray(0, 4).toString('ascii') !== 'AQV2') throw new Error('Unsupported visual asset bundle.');

  let offset = 4;
  const count = bundle.readUInt16BE(offset); offset += 2;
  if (count !== 18) throw new Error(`Hybrid visual asset count mismatch: ${count}`);
  const seen = new Set();

  for (let index = 0; index < count; index += 1) {
    const nameLength = bundle.readUInt16BE(offset); offset += 2;
    const name = bundle.subarray(offset, offset + nameLength).toString('utf8'); offset += nameLength;
    const byteLength = bundle.readUInt32BE(offset); offset += 4;
    const expectedDigest = bundle.subarray(offset, offset + 32).toString('hex'); offset += 32;
    const bytes = bundle.subarray(offset, offset + byteLength); offset += byteLength;
    if (bytes.length !== byteLength || sha256(bytes) !== expectedDigest) throw new Error(`Visual asset integrity mismatch: ${name}`);
    if (bytes.length < 12 || bytes.subarray(4, 12).toString('ascii') !== 'ftypavif') throw new Error(`Visual asset is not AVIF: ${name}`);
    if (seen.has(name)) throw new Error(`Duplicate visual asset: ${name}`);
    seen.add(name);
    const path = targetPath(name);
    if (await sameBytes(path, bytes)) continue;
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, bytes);
  }

  if (offset !== bundle.length) throw new Error('Hybrid visual asset bundle has trailing data.');
}

export function materializeVisualAssets() {
  activeMaterialization ??= materialize().finally(() => { activeMaterialization = undefined; });
  return activeMaterialization;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await materializeVisualAssets();
  console.log('AQUASTONE hybrid visual assets materialized.');
}
