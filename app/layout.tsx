import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
export const metadata: Metadata = { title: { default: 'StudyHub — вчимося разом', template: '%s | StudyHub' }, description: 'Освітній портал про веброзробку: зрозумілі матеріали для студентів.' };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="uk"><body><header className="header"><Link className="brand" href="/">study<span>hub</span><span className="brand-dot">●</span></Link><nav aria-label="Головна навігація"><Link href="/#materials">Матеріали</Link><Link href="/#about">Про портал</Link></nav><span className="header-note">Місце для нових знань</span></header><main>{children}</main><footer><Link className="brand" href="/">study<span>hub</span></Link><p>Навчальний проєкт · Інструментальні засоби вебтехнологій · 2026</p></footer></body></html>;
}
