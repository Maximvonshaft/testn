import { spawn } from 'node:child_process';
import { mkdir, rm, rename, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { chromium, devices } from '@playwright/test';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const outputRoot = resolve(process.env.QA_EVIDENCE_DIR || join(root, 'runtime-artifacts'));
const baseURL = process.env.RECORD_BASE_URL || 'http://127.0.0.1:4321';
const startedServer = !process.env.RECORD_BASE_URL;
const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));

async function run(command, args, options = {}) {
  return await new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: 'inherit',
      shell: process.platform === 'win32',
      ...options,
    });
    child.once('error', rejectRun);
    child.once('exit', (code, signal) => {
      if (code === 0) resolveRun();
      else rejectRun(new Error(`${command} ${args.join(' ')} failed (${signal || code})`));
    });
  });
}

async function waitForReady(url, timeoutMs = 120_000) {
  const started = Date.now();
  let lastError;
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(`${url}/en/`, { redirect: 'manual' });
      if (response.ok) return;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await sleep(500);
  }
  throw new Error(`Preview did not become ready: ${lastError?.message || 'unknown error'}`);
}

function attachRuntimeGuard(page, errors) {
  page.on('console', (message) => {
    if (message.type() !== 'error' || /WebGL|favicon|turnstile/i.test(message.text())) return;
    errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
}

async function shot(page, path, options = {}) {
  await mkdir(dirname(path), { recursive: true });
  await page.screenshot({ path, animations: 'allow', caret: 'initial', ...options });
}

async function recordProfile(browser, profile) {
  const profileDir = join(outputRoot, profile.name);
  const videoDir = join(profileDir, '.video');
  await mkdir(videoDir, { recursive: true });

  const context = await browser.newContext({
    ...profile.context,
    locale: 'en-GB',
    recordVideo: { dir: videoDir, size: profile.videoSize },
  });
  const page = await context.newPage();
  const runtimeErrors = [];
  attachRuntimeGuard(page, runtimeErrors);
  const video = page.video();
  const startedAt = new Date().toISOString();
  const timings = {};

  const timed = async (name, fn) => {
    const start = performance.now();
    await fn();
    timings[name] = Math.round(performance.now() - start);
  };

  try {
    await timed('initial_navigation_ms', async () => {
      await page.goto(`${baseURL}/en/`, { waitUntil: 'domcontentloaded' });
      await page.locator('[data-scene-experience]').waitFor({ state: 'visible' });
    });
    await sleep(900);
    await shot(page, join(profileDir, '01-hero-baseline.png'));

    await page.locator('[role="tab"]:visible').filter({ hasText: /Kitchen surfaces/i }).first().click();
    await page.locator('h1').filter({ hasText: /Performance/i }).waitFor();
    await sleep(800);
    await shot(page, join(profileDir, '02-kitchen-system.png'));

    await page.locator('[role="option"]:visible').filter({ hasText: 'Pietra Grey' }).click();
    await page.getByText(/Selected finish: Pietra Grey/i).waitFor();
    await sleep(900);
    await shot(page, join(profileDir, '03-pietra-grey-applied.png'));

    await page.locator('#technology').scrollIntoViewIfNeeded();
    await sleep(850);
    await shot(page, join(profileDir, '04-material-technology.png'));

    const protective = page.locator('#technology button[aria-pressed]').filter({ hasText: /Protective surface/i });
    await protective.click();
    await protective.waitFor({ state: 'visible' });
    await sleep(800);
    await shot(page, join(profileDir, '05-protective-layer.png'));

    await page.locator('#systems').scrollIntoViewIfNeeded();
    await sleep(850);
    await shot(page, join(profileDir, '06-product-systems.png'));

    await page.locator('[data-open-lead]:visible').first().click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible' });
    await sleep(700);
    await shot(page, join(profileDir, '07-sample-dialog.png'));
    await dialog.getByRole('button', { name: 'Close' }).click();
    await dialog.waitFor({ state: 'hidden' });

    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    await sleep(1200);
    await shot(page, join(profileDir, '08-footer.png'));
    await shot(page, join(profileDir, '09-full-page.png'), { fullPage: true });

    const pageMetrics = await page.evaluate(() => ({
      title: document.title,
      lang: document.documentElement.lang,
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      h1Count: document.querySelectorAll('h1').length,
      systemCards: document.querySelectorAll('#systems article').length,
      materialOptions: document.querySelectorAll('[role="option"]').length,
    }));

    return { name: profile.name, startedAt, timings, pageMetrics, runtimeErrors };
  } finally {
    await context.close();
    if (video) {
      const generatedPath = await video.path();
      await rename(generatedPath, join(profileDir, `${profile.name}-interaction.webm`));
    }
    await rm(videoDir, { recursive: true, force: true });
  }
}

let preview;
let exitCode = 0;
try {
  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });

  if (startedServer) {
    await run('pnpm', ['build']);
    preview = spawn('pnpm', ['preview'], {
      cwd: root,
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: process.platform !== 'win32',
      shell: process.platform === 'win32',
    });
    preview.stdout.pipe(process.stdout);
    preview.stderr.pipe(process.stderr);
  }
  await waitForReady(baseURL);

  const browser = await chromium.launch({ headless: true });
  const profiles = [
    {
      name: 'desktop-1440x900',
      context: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
      videoSize: { width: 1440, height: 900 },
    },
    {
      name: 'mobile-390x844',
      context: { ...devices['iPhone 15 Pro'], viewport: { width: 390, height: 844 } },
      videoSize: { width: 390, height: 844 },
    },
  ];

  const results = [];
  for (const profile of profiles) results.push(await recordProfile(browser, profile));
  await browser.close();

  const failures = results.flatMap((result) => result.runtimeErrors.map((error) => `${result.name}: ${error}`));
  const report = {
    status: failures.length ? 'failed' : 'passed',
    generatedAt: new Date().toISOString(),
    baseURL,
    sourceCommit: process.env.SOURCE_COMMIT || null,
    results,
    failures,
  };
  await writeFile(join(outputRoot, 'runtime-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  if (failures.length) throw new Error(failures.join('\n'));
  console.log(`Runtime evidence written to ${outputRoot}`);
} catch (error) {
  exitCode = 1;
  console.error(error instanceof Error ? error.stack : error);
} finally {
  if (preview && preview.exitCode === null) {
    if (process.platform === 'win32') preview.kill('SIGTERM');
    else {
      try { process.kill(-preview.pid, 'SIGTERM'); } catch { preview.kill('SIGTERM'); }
    }
  }
}
process.exitCode = exitCode;
