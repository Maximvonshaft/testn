import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const headers = new Headers(response.headers);
  headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  headers.set('x-content-type-options', 'nosniff');
  headers.set('x-frame-options', 'DENY');
  headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()');
  headers.set('cross-origin-opener-policy', 'same-origin');
  headers.set('cross-origin-resource-policy', 'same-site');
  headers.set('x-request-id', context.request.headers.get('cf-ray') ?? crypto.randomUUID());
  if (import.meta.env.PROD) headers.set('strict-transport-security', 'max-age=63072000; includeSubDomains; preload');
  if (context.url.pathname.startsWith('/api/')) headers.set('cache-control', 'no-store');
  else if (/\.(?:js|css|webp|avif|woff2|svg)$/.test(context.url.pathname)) headers.set('cache-control', 'public, max-age=31536000, immutable');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
});
