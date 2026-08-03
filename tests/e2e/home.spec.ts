import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const localHost = /127\.0\.0\.1|localhost/;
const runtimeErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on('console', (message) => {
    if (message.type() !== 'error' || /WebGL|favicon|turnstile/i.test(message.text())) return;
    const location = message.location();
    const position = location.url ? ` (${location.url}${location.lineNumber ? `:${location.lineNumber}` : ''})` : '';
    errors.push(`${message.text()}${position}`);
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/en/', { waitUntil: 'domcontentloaded' });
});

test.afterEach(async ({ page }) => {
  const errors = runtimeErrors.get(page) ?? [];
  expect(errors, `Runtime console/page errors: ${errors.join('\n')}`).toEqual([]);
});

test('renders the approved desktop/mobile information architecture', async ({ page }, testInfo) => {
  await expect(page).toHaveTitle(/AQUASTONE/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('[data-scene-experience]')).toBeVisible();
  await expect(page.locator('[role="tab"][aria-selected="true"]')).toHaveCount(2);
  await expect(page.locator('[role="option"]')).toHaveCount(9);
  await expect(page.locator('#technology')).toBeVisible();
  await expect(page.locator('#systems article')).toHaveCount(6);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({
    path: testInfo.outputPath('clean-runtime.png'),
    fullPage: true,
    animations: 'allow',
    caret: 'initial',
  });
});

test('switches product system and applies the selected material to the scene', async ({ page }) => {
  const title = page.locator('h1');
  const overlay = page.locator('[data-scene-experience] [data-mask]');
  const beforeImage = await overlay.getAttribute('style');
  await page.locator('[role="tab"]:visible').filter({ hasText: /Kitchen surfaces/i }).first().click();
  await expect(title).toContainText(/Performance/i);
  await page.locator('[role="option"]:visible').filter({ hasText: 'Pietra Grey' }).click();
  await expect(page.getByText(/Selected finish: Pietra Grey/i)).toBeVisible();
  const afterImage = await overlay.getAttribute('style');
  expect(afterImage).not.toBe(beforeImage);
  expect(afterImage).toContain('pietra-grey.svg');
});

test('exposes the five-layer material architecture', async ({ page }) => {
  await page.locator('#technology').scrollIntoViewIfNeeded();
  const buttons = page.locator('#technology button[aria-pressed]');
  await expect(buttons).toHaveCount(5);
  await buttons.filter({ hasText: /Protective surface/i }).click();
  await expect(buttons.filter({ hasText: /Protective surface/i })).toHaveAttribute('aria-pressed', 'true');
});

test('opens an accessible production lead flow and fails closed when secrets are absent', async ({ page }) => {
  await page.locator('[data-open-lead]:visible').first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { name: /Request samples/i })).toBeVisible();
  await expect(dialog.getByRole('button', { name: /Submit request/i })).toBeDisabled();
  await expect(dialog.getByRole('status')).toContainText(/not configured yet/i);
  await dialog.getByRole('button', { name: 'Close' }).click();
  await expect(dialog).toBeHidden();
});

test('serves complete localized routes', async ({ page }) => {
  for (const [locale, expected] of [['de','Oberfläche'], ['fr','Surface'], ['cnr','Površine']] as const) {
    await page.goto(`/${locale}/`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('body')).toContainText(expected);
    const response = await page.request.get(`/${locale}/privacy/`);
    expect(response.ok()).toBe(true);
  }
});

test('meets accessibility baseline', async ({ page }) => {
  const results = await new AxeBuilder({ page }).exclude('canvas').analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});

test('publishes sitemap, robots and protected API semantics', async ({ page }) => {
  const robots = await page.request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain('Disallow: /api/');
  const sitemap = await page.request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain('/cnr/privacy/');
  const apiGet = await page.request.get('/api/lead');
  expect(apiGet.status()).toBe(405);
  const invalid = await page.request.post('/api/lead', { data: { email: 'bad' }, headers: { origin: localHost.test(page.url()) ? new URL(page.url()).origin : '' } });
  expect(invalid.status()).toBe(422);
});
