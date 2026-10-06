'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { translator, languagePath } from './lib/i18n';
export default function NotFound() {
  const language = /^\/en(?:\/|$)/.test(usePathname()) ? 'en' : 'uk'; const t = translator(language);
  return <section className="article"><p className="eyebrow">404</p><h1>{t('Матеріал не знайдено')}</h1><p>{t('Перевір адресу або обери інший матеріал.')}</p><Link className="button" href={languagePath(language) || '/'}>{t('На головну ↗')}</Link></section>;
}
