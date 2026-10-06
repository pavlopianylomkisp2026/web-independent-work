'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import LanguageSwitch from './language-switch';
import { translator, languagePath } from '../lib/i18n';

function useLanguage() {
  return /^\/en(?:\/|$)/.test(usePathname()) ? 'en' : 'uk';
}

export function SiteHeader() {
  const language = useLanguage();
  const t = translator(language);
  const prefix = languagePath(language);
  // Root layouts persist during client navigation, so update the document language too.
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  return <header className="header"><Link className="brand" href={prefix || '/'}>study<span>hub</span><span className="brand-dot">●</span></Link><nav aria-label={language === 'en' ? 'Main navigation' : 'Головна навігація'}><Link href={`${prefix}/#materials`}>{t('Матеріали')}</Link><Link href={`${prefix}/#about`}>{t('Про портал')}</Link></nav><span className="header-note">{t('Місце для нових знань')}</span><LanguageSwitch/></header>;
}

export function SiteFooter() {
  const language = useLanguage();
  const t = translator(language);
  return <footer><Link className="brand" href={languagePath(language) || '/'}>study<span>hub</span></Link><p>{t('Навчальний проєкт · Інструментальні засоби вебтехнологій · 2026')}</p></footer>;
}
