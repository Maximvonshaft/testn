import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const packedRoot = join(root, 'src', 'assets-packed');
const outputRoot = join(root, 'public', 'assets', 'visual', 'systems');
const expectedBundle = { bytes: 280995, sha256: '50e5d585d1c6fad0137d81e2ecbeb4c096c4eacd17ef3082c1ab0d30d58dcfc5' };
const expectedAssets = {
  'bathroom-desktop.avif': [28314, '152014c4ffd7400282a73a1cdea1d2fcfeff3bfdb6391c42792cb3aade6c7c1b'],
  'bathroom-mobile.avif': [7645, 'b88b5b91f8f5134afb8e68a6886a0a3bc674a195272180d0f3113382b2e1e3d4'],
  'interior-desktop.avif': [25702, 'a81d3a92d0bf4e4e648bea5b1db9747397619d3b114a047a6b55eea651aa47dd'],
  'interior-mobile.avif': [13816, 'b4cb52428af2efe53c7dde6f28377d547fa3664c6ccb8483e6a982a4d24035a4'],
  'kitchen-desktop.avif': [35799, '025d6c79b8f973eb6c1c49664e6046a4230097e0c82c48f1eee2fe29768b9227'],
  'kitchen-mobile.avif': [15078, 'b2e4eb4b4339f41a7324f8887d3f9390226619a122f1860c1c248109b180e3fc'],
  'hospitality-desktop.avif': [28913, '3e3d0f11853aab6196d589aa647121049d7b7f8188c556cbcc0139e420a75672'],
  'hospitality-mobile.avif': [10574, '94840b961180fe4721c83b8c0f19a860436247afcf642de5b84737b028a71f28'],
  'furniture-desktop.avif': [27794, '9639388ff3658b5b4fe292d5581831745bcc31a4a3d9be3aa5b3c9aa8eb9ad6f'],
  'furniture-mobile.avif': [13530, '40f63c79ccdd7d5691646517df7c3b479dc787a4fa05240f35b99ddea53776ef'],
  'exterior-desktop.avif': [54286, 'f6725e4996daba9cfd02dc178b7adc43176e0138db11d60370a1c8197b99c755'],
  'exterior-mobile.avif': [19214, '08c31d81a6000f6d8037a8f6e99499ab6d9450fbb50876c8b75e763336d34c40'],
};
let activeMaterialization;
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
const u16 = (bytes, offset) => bytes.readUInt16BE(offset);
const u32 = (bytes, offset) => bytes.readUInt32BE(offset);

async function materialize() {
  const parts = (await readdir(packedRoot)).filter((name) => name.startsWith('visual-bundle.aqv.b64.')).sort();
  if (!parts.length) throw new Error('AQUASTONE visual bundle parts are missing.');
  const encoded = (await Promise.all(parts.map((part) => readFile(join(packedRoot, part), 'utf8')))).join('').replace(/\s+/g, '');
  const bundle = Buffer.from(encoded, 'base64');
  if (bundle.length !== expectedBundle.bytes || digest(bundle) !== expectedBundle.sha256) throw new Error('AQUASTONE visual bundle integrity mismatch.');
  if (bundle.subarray(0, 4).toString('ascii') !== 'AQV1') throw new Error('Unsupported AQUASTONE visual bundle format.');
  const count = u16(bundle, 4);
  if (count !== Object.keys(expectedAssets).length) throw new Error(`Visual bundle entry count mismatch: ${count}`);
  let offset = 6;
  const seen = new Set();
  for (let index = 0; index < count; index += 1) {
    const nameLength = u16(bundle, offset); offset += 2;
    const dataLength = u32(bundle, offset); offset += 4;
    const name = bundle.subarray(offset, offset + nameLength).toString('utf8'); offset += nameLength;
    const bytes = bundle.subarray(offset, offset + dataLength); offset += dataLength;
    const expected = expectedAssets[name];
    if (!expected || expected[0] !== bytes.length || expected[1] !== digest(bytes)) throw new Error(`Visual asset integrity mismatch: ${name}`);
    if (bytes.subarray(4, 12).toString('ascii') !== 'ftypavif') throw new Error(`Visual asset is not AVIF: ${name}`);
    const target = join(outputRoot, name);
    let unchanged = false;
    try { const info = await stat(target); unchanged = info.size === bytes.length && digest(await readFile(target)) === expected[1]; } catch { /* write below */ }
    if (!unchanged) { await mkdir(dirname(target), { recursive: true }); await writeFile(target, bytes); }
    seen.add(name);
  }
  if (offset !== bundle.length || seen.size !== count) throw new Error('Visual bundle trailing or duplicate data detected.');
}
export function materializeVisualAssets() { activeMaterialization ??= materialize().finally(() => { activeMaterialization = undefined; }); return activeMaterialization; }
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) { await materializeVisualAssets(); console.log('AQUASTONE visual assets materialized.'); }
