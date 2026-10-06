import Link from 'next/link';
export default function NotFound() { return <section className="article"><p className="eyebrow">404</p><h1>Матеріал не знайдено</h1><p>Перевір адресу або обери інший матеріал.</p><Link className="button" href="/">На головну ↗</Link></section>; }
