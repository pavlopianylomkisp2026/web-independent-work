import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { SiteHeader, SiteFooter } from './components/site-chrome';
import './globals.css';
export const metadata: Metadata = { title: { default: 'StudyHub — вчимося разом', template: '%s | StudyHub' }, description: 'Освітній портал про веброзробку: зрозумілі матеріали для студентів.' };
export default async function Layout({ children }: { children: React.ReactNode }) {
  const language = (await headers()).get('x-studyhub-language') === 'en' ? 'en' : 'uk';
  return <html lang={language}><body><SiteHeader/><main>{children}</main><SiteFooter/></body></html>;
}
