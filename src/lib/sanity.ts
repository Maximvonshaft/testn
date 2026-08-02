import { createClient } from '@sanity/client';
import type { Locale } from '@/data/catalog';
import { copy, type SiteCopy } from '@/data/copy';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
const token = import.meta.env.SANITY_API_READ_TOKEN;

const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2026-07-01',
      useCdn: !token,
      perspective: token ? 'drafts' : 'published',
      ...(token ? { token } : {}),
    })
  : null;

export async function getSiteCopy(locale: Locale): Promise<SiteCopy> {
  if (!client) return copy[locale];

  try {
    const result = await client.fetch<Partial<SiteCopy> | null>(
      `*[_type == "siteCopy" && locale == $locale][0]{...}`,
      { locale },
    );
    if (!result) return copy[locale];
    return {
      ...copy[locale],
      ...result,
      meta: { ...copy[locale].meta, ...result.meta },
      nav: { ...copy[locale].nav, ...result.nav },
      actions: { ...copy[locale].actions, ...result.actions },
      hero: { ...copy[locale].hero, ...result.hero },
      systems: { ...copy[locale].systems, ...result.systems },
      technology: { ...copy[locale].technology, ...result.technology },
      portfolio: { ...copy[locale].portfolio, ...result.portfolio },
      project: { ...copy[locale].project, ...result.project },
      sample: { ...copy[locale].sample, ...result.sample },
      footer: { ...copy[locale].footer, ...result.footer },
      form: { ...copy[locale].form, ...result.form },
      pages: { ...copy[locale].pages, ...result.pages },
    };
  } catch (error) {
    console.error('Sanity content fallback activated', error instanceof Error ? error.message : 'unknown error');
    return copy[locale];
  }
}
