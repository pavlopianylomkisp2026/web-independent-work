import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import LanguageSwitch from './components/language-switch';
import { translator, languagePath } from './lib/i18n';
import './globals.css';
export const metadata: Metadata = { title: { default: 'StudyHub — вчимося разом', template: '%s | StudyHub' }, description: 'Освітній портал про веброзробку: зрозумілі матеріали для студентів.' };
export default async function Layout({ children }: { children: React.ReactNode }) {
  const language = (await headers()).get('x-studyhub-language') === 'en' ? 'en' : 'uk';
  const t = translator(language); const prefix = languagePath(language);
  return <html lang={language}><body><header className="header"><Link className="brand" href={prefix || '/'}>study<span>hub</span><span className="brand-dot">●</span></Link><nav aria-label={language === 'en' ? 'Main navigation' : 'Головна навігація'}><Link href={`${prefix}/#materials`}>{t('Матеріали')}</Link><Link href={`${prefix}/#about`}>{t('Про портал')}</Link></nav><span className="header-note">{t('Місце для нових знань')}</span><LanguageSwitch/></header><main>{children}</main><footer><Link className="brand" href={prefix || '/'}>study<span>hub</span></Link><p>{t('Навчальний проєкт · Інструментальні засоби вебтехнологій · 2026')}</p></footer></body></html>;
}
