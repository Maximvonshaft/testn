import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { materializeVisualAssets } from './scripts/materialize-visual-assets.mjs';

await materializeVisualAssets();
const site = process.env.PUBLIC_SITE_URL || 'https://www.aquastone.example';

export default defineConfig({
  site,
  output: 'server',
  adapter: cloudflare({ prerenderEnvironment: 'workerd', imageService: 'passthrough' }),
  integrations: [react()],
  vite: { plugins: [tailwindcss()], build: { cssMinify: 'lightningcss' } },
  trailingSlash: 'always',
  compressHTML: true,
  i18n: {
    defaultLocale: 'en', locales: ['en', 'de', 'fr', 'cnr'],
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: true, fallbackType: 'redirect' },
    fallback: { de: 'en', fr: 'en', cnr: 'en' },
  },
  security: {
    checkOrigin: true,
    csp: {
      algorithm: 'SHA-384',
      directives: ["default-src 'self'", "img-src 'self' data: blob:", "font-src 'self' data:", "connect-src 'self' https://challenges.cloudflare.com https://plausible.io", "frame-src https://challenges.cloudflare.com", "worker-src 'self' blob:", "object-src 'none'", "base-uri 'self'", "form-action 'self'"],
      scriptDirective: { resources: ["'self'", 'https://challenges.cloudflare.com', 'https://plausible.io'] },
      styleDirective: { resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }] },
    },
  },
});
