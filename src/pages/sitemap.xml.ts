import type { APIRoute } from 'astro';
import { locales, pageSlugs } from '@/data/catalog';
import { localePath } from '@/lib/i18n';
export const prerender = true;
export const GET: APIRoute = ({ site, url }) => {
  const origin = site ?? new URL(url.origin);
  const paths = locales.flatMap((locale) => [localePath(locale), ...pageSlugs.filter((slug) => slug !== 'thanks').map((slug) => localePath(locale, slug))]);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${new URL(path, origin)}</loc></url>`).join('')}</urlset>`;
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
};
