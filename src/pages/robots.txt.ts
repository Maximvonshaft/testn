import type { APIRoute } from 'astro';
export const prerender = true;
export const GET: APIRoute = ({ site, url }) => {
  const origin = site ?? new URL(url.origin);
  return new Response(`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${new URL('/sitemap.xml', origin)}\n`, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
