import { locales, type Locale } from '@/data/catalog';

export function isLocale(value: string | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale));
}

export function localePath(locale: Locale, path = ''): string {
  const normalized = path.replace(/^\/+|\/+$/g, '');
  return normalized ? `/${locale}/${normalized}/` : `/${locale}/`;
}

export function alternateLocales(currentPath: string): Array<{ locale: Locale; href: string }> {
  const parts = currentPath.split('/').filter(Boolean);
  const tail = parts.length && locales.includes(parts[0] as Locale) ? parts.slice(1) : parts;
  return locales.map((locale) => ({ locale, href: localePath(locale, tail.join('/')) }));
}
