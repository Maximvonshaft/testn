import { describe, expect, it } from 'vitest';
import { locales, materials, pageSlugs, systems } from '@/data/catalog';
import { copy, getCopy } from '@/data/copy';
import { leadSchema, publicLead } from '@/lib/lead';

describe('production catalog', () => {
  it('contains the complete system and finish portfolio', () => {
    expect(systems).toHaveLength(6);
    expect(materials).toHaveLength(9);
    expect(new Set(systems.map((item) => item.id)).size).toBe(6);
    expect(new Set(materials.map((item) => item.id)).size).toBe(9);
  });

  it('provides complete localized content', () => {
    for (const locale of locales) {
      const value = copy[locale];
      expect(value.localeName).toBeTruthy();
      expect(Object.keys(value.systems)).toHaveLength(6);
      expect(value.benefits).toHaveLength(5);
      expect(value.technology.layers).toHaveLength(5);
      for (const slug of pageSlugs) {
        expect(value.pages[slug].title.length).toBeGreaterThan(2);
        expect(value.pages[slug].intro.length).toBeGreaterThan(20);
      }
    }
    expect(copy.de.pages.privacy.title).not.toBe(copy.en.pages.privacy.title);
    expect(copy.fr.pages.technical.title).not.toBe(copy.en.pages.technical.title);
    expect(copy.cnr.pages.about.title).not.toBe(copy.en.pages.about.title);
  });

  it('uses English only as an invalid-locale fallback', () => {
    expect(getCopy('unsupported')).toBe(copy.en);
    expect(getCopy('de')).toBe(copy.de);
  });
});

describe('lead boundary', () => {
  const valid = {
    name: 'Maxim Zhang', email: 'maxim@example.com', company: 'AQUASTONE', country: 'Switzerland', projectType: 'Commercial', application: 'Interior wall systems', finishes: 'Bianco Lumen', message: 'Project enquiry', consent: true as const, locale: 'en' as const, website: '', turnstileToken: 'token',
  };
  it('accepts a bounded valid lead', () => expect(leadSchema.safeParse(valid).success).toBe(true));
  it('rejects invalid email and missing consent', () => expect(leadSchema.safeParse({ ...valid, email: 'bad', consent: false }).success).toBe(false));
  it('removes anti-abuse fields from delivery payload', () => {
    const payload = publicLead(valid, 'request-id', '2026-08-03T00:00:00.000Z');
    expect(payload).not.toHaveProperty('website');
    expect(payload).not.toHaveProperty('turnstileToken');
    expect(payload.requestId).toBe('request-id');
  });
});
