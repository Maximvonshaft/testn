import type { APIRoute } from 'astro';
import { z } from 'astro/zod';
import { leadSchema, publicLead } from '@/lib/lead';

export const prerender = false;

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
};

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

async function verifyTurnstile(token: string, remoteIp: string | null, requestId: string): Promise<boolean> {
  const secret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;

  const body = new URLSearchParams({
    secret,
    response: token,
    idempotency_key: requestId,
  });
  if (remoteIp) body.set('remoteip', remoteIp);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
    signal: AbortSignal.timeout(6_000),
  });

  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

async function deliverLead(payload: ReturnType<typeof publicLead>): Promise<boolean> {
  const endpoint = import.meta.env.LEAD_WEBHOOK_URL;
  if (!endpoint) return false;

  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'idempotency-key': payload.requestId,
    'user-agent': 'aquastone-website/1.0',
  };
  const bearer = import.meta.env.LEAD_WEBHOOK_BEARER_TOKEN;
  if (bearer) headers.authorization = `Bearer ${bearer}`;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8_000),
      });
      if (response.ok) return true;
      if (response.status >= 400 && response.status < 500) return false;
    } catch {
      // One bounded retry is intentional. The idempotency key prevents duplicate processing.
    }
  }
  return false;
}

export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin');
  const expectedOrigin = new URL(request.url).origin;
  if (origin && origin !== expectedOrigin) return json(403, { ok: false, code: 'origin_rejected' });

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return json(415, { ok: false, code: 'unsupported_media_type' });

  let candidate: unknown;
  try {
    candidate = await request.json();
  } catch {
    return json(400, { ok: false, code: 'invalid_json' });
  }

  const parsed = leadSchema.safeParse(candidate);
  if (!parsed.success) {
    return json(422, { ok: false, code: 'validation_failed', fields: z.flattenError(parsed.error).fieldErrors });
  }

  if (parsed.data.website) return json(202, { ok: true });

  const requestId = crypto.randomUUID();
  const remoteIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
  const turnstileReady = Boolean(import.meta.env.PUBLIC_TURNSTILE_SITE_KEY && import.meta.env.TURNSTILE_SECRET_KEY);
  if (!turnstileReady) return json(503, { ok: false, code: 'lead_service_not_configured' });

  const challengeValid = await verifyTurnstile(parsed.data.turnstileToken, remoteIp, requestId).catch(() => false);
  if (!challengeValid) return json(403, { ok: false, code: 'challenge_failed' });

  const payload = publicLead(parsed.data, requestId, new Date().toISOString());
  const delivered = await deliverLead(payload);
  if (!delivered) return json(503, { ok: false, code: 'delivery_unavailable', requestId });

  return json(202, { ok: true, requestId });
};

export const ALL: APIRoute = async () => json(405, { ok: false, code: 'method_not_allowed' });
