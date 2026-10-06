import Link from 'next/link';
import { homeMetadata } from './lib/seo';
import { translator, languagePath, type Language } from './lib/i18n';
import CoverImage from './components/cover-image';
import { getCatalog, postCover, PAGE_SIZE, getCategories, postCategories, plainText, type Post, type Category } from './lib/wordpress';
export default async function Home({ searchParams, language = 'uk' }: { language?: Language; searchParams: Promise<{ category?: string | string[]; q?: string | string[]; page?: string | string[] }> }) {
  const t = translator(language);
  const prefix = languagePath(language);
  const query = await searchParams;
  const selectedSlug = typeof query.category === 'string' ? query.category : undefined;
  const search = typeof query.q === 'string' ? query.q.trim().slice(0, 200) : '';
  const rawPage = typeof query.page === 'string' ? query.page : '1';
  const page = /^\d+$/.test(rawPage) && Number.isSafeInteger(Number(rawPage)) && Number(rawPage) > 0 ? Number(rawPage) : 1;
  let totalPages = 0; let total = 0;
  const filterHref = (category?: string, targetPage = 1) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('q', search);
    if (targetPage > 1) params.set('page', String(targetPage));
    return `${prefix}/${params.size ? `?${params}` : ''}#materials`;
  };
  let posts: Post[] = []; let categories: Category[] = []; let unavailable = false;
  let selected: Category | undefined;
  let unknownCategory = false;
  try {
    categories = await getCategories(language);
    selected = categories.find(category => category.slug === selectedSlug);
    unknownCategory = Boolean(selectedSlug && !selected);
    if (!unknownCategory) {
      const catalog = await getCatalog(selected?.id, search, page, undefined, language);
      posts = catalog.posts; totalPages = catalog.totalPages; total = catalog.total;
    }
  } catch { unavailable = true; }
  return <><section className="hero"><div><p className="eyebrow">{t('ЗНАННЯ, ЯКІ СТАЮТЬ ПРАКТИКОЮ')}</p><h1>{t('Від першого питання')}<br/>{t('до власного ')}<em>{t('проєкту.')}</em></h1><p className="lead">{t('Вивчай веброзробку крок за кроком. Зрозумілі пояснення, практичні приклади та матеріали, до яких хочеться повернутися.')}</p><a className="button" href="#materials">{t('Почати навчання ')}<span>↗</span></a><p className="hero-note">{t('Власний темп. Реальні знання.')}</p></div><div className="illustration" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><span className="floating tag-api">API ↗</span><span className="floating tag-code">&lt;/&gt;</span><div className="book"><span>{t('ТВОЯ НАСТУПНА')}<br/>{t('ВЕЛИКА ІДЕЯ')}</span><strong>{t('Починається')}<br/>{t('з цікавості.')}</strong><div className="book-line"/><small>STUDYHUB / 01</small></div><span className="spark">✳</span></div></section><section className="materials" id="materials"><div className="section-heading"><div><p className="eyebrow">{t('БІБЛІОТЕКА ЗНАНЬ')}</p><h2>{t('Почни з цікавого')}</h2></div><span className="pill">{selected ? plainText(selected.name) : t('Усі теми')}</span></div><form action={`${prefix}/#materials`} method="get" className="search-form"><label htmlFor="material-search">{t('Пошук матеріалів')}</label><div className="search-row"><input key={search} id="material-search" name="q" type="search" maxLength={200} defaultValue={search} placeholder={t('Наприклад: HTML або CSS')}/>{selectedSlug && <input type="hidden" name="category" value={selectedSlug}/>}<button type="submit" className="search-button">{t('Знайти')}</button></div>{search && <p className="search-summary">{t('Пошук: «')}{search}{t('» · ')}<Link href={selectedSlug ? `${prefix}/?category=${encodeURIComponent(selectedSlug)}#materials` : `${prefix}/#materials`}>{t('Очистити пошук')}</Link></p>}</form><nav className="category-filters" aria-label={language === 'en' ? 'Article categories' : 'Категорії матеріалів'}><Link href={filterHref()} className={`filter${!selectedSlug ? ' active' : ''}`} aria-current={!selectedSlug ? 'page' : undefined}>{t('Усі')}</Link>{categories.map(category => <Link key={category.id} href={filterHref(category.slug)} className={`filter${selected?.id === category.id ? ' active' : ''}`} aria-current={selected?.id === category.id ? 'page' : undefined}>{plainText(category.name)}</Link>)}</nav>{unavailable ? <div role="status" className="notice">{t('Матеріали тимчасово недоступні. Спробуй оновити сторінку трохи пізніше.')}</div> : posts.length === 0 ? <p className="notice">{unknownCategory ? t('Такої категорії немає або вона ще не має опублікованих матеріалів. Обери іншу категорію.') : page > 1 ? t('Такої сторінки каталогу немає. Повернись до першої сторінки.') : search ? t('За цим запитом матеріалів не знайдено. Зміни запит або категорію.') : t('У цій категорії поки немає матеріалів.')}</p> : <div className="cards">{posts.map((post, i) => <Link className="card" href={`${prefix}/materialy/${post.slug}`} key={post.id}><div className="card-art"><CoverImage cover={postCover(post)} className="card-cover"/><span className="card-number">{String((page - 1) * PAGE_SIZE + i + 1).padStart(2, '0')}</span><span className="code-mark">{'{ }'}</span><span className="art-label">{t('ЗРОЗУМІЙ · СПРОБУЙ · СТВОРИ')}</span></div><div className="card-body"><p className="card-meta">{postCategories(post).map(category => plainText(category.name)).join(' · ') || t('МАТЕРІАЛ')} · {new Date(post.date).toLocaleDateString(language === 'en' ? 'en-GB' : 'uk-UA')}</p><h3>{plainText(post.title.rendered)}</h3><p>{plainText(post.excerpt.rendered)}</p><span className="read-link">{t('Читати матеріал ')}<span>↗</span></span></div></Link>)}</div>}{!unavailable && !unknownCategory && (totalPages > 1 || page > 1) && <nav className="pagination" aria-label={language === 'en' ? 'Catalogue pages' : 'Сторінки каталогу'}>{page > 1 && <Link className="filter" href={filterHref(selectedSlug, 1)}>{t('На першу')}</Link>}{page > 1 && totalPages > 0 && <Link className="filter" href={filterHref(selectedSlug, page - 1)}>{t('← Назад')}</Link>}{totalPages > 0 && <span>{t('Сторінка ')}{page}{t(' із ')}{totalPages}{t(' · Матеріалів: ')}{total}</span>}{page < totalPages && <Link className="filter" href={filterHref(selectedSlug, page + 1)}>{t('Далі →')}</Link>}</nav>}</section><section className="about" id="about"><span className="about-icon">✳</span><div><p className="eyebrow">{t('ПРО STUDYHUB')}</p><h2>{t('Не просто читати.')}<br/>{t('Розуміти й застосовувати.')}</h2></div><p>{t('Цей портал створений для студентів, які хочуть розібратися у вебтехнологіях. Починаємо з основ і пов’язуємо кожну нову ідею з практикою.')}</p></section></>;
}

export async function generateMetadata({ searchParams, language = 'uk' }: Parameters<typeof Home>[0]) {
  const query = await searchParams;
  return homeMetadata(language, Boolean(query.q || query.category || query.page));
}
