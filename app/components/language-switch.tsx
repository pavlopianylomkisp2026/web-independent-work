'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function LanguageSwitch() {
  const pathname = usePathname();
  const english = /^\/en(?:\/|$)/.test(pathname);
  // Article-specific links are supplied next to the article title.
  return <nav className="language-switch" aria-label="Language"><Link href="/" aria-current={!english ? 'page' : undefined}>UA</Link><Link href="/en" aria-current={english ? 'page' : undefined}>EN</Link></nav>;
}
