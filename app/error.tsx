'use client';
import { usePathname } from 'next/navigation';
import { translator } from './lib/i18n';
export default function ErrorPage({ reset }: { reset: () => void }) {
  const t = translator(/^\/en(?:\/|$)/.test(usePathname()) ? 'en' : 'uk');
  return <section className="article"><h1>{t('Не вдалося завантажити матеріал')}</h1><p>{t('Спробуй ще раз трохи пізніше.')}</p><button className="button" onClick={reset}>{t('Спробувати знову')}</button></section>;
}
