import Link from 'next/link';
import { translator, languagePath, type Language } from '../../lib/i18n';
import CoverImage from '../../components/cover-image';
import { notFound } from 'next/navigation';
import { getPosts, postCover, postCategories, plainText, safeContent } from '../../lib/wordpress';
export async function generateMetadata({ params, language = 'uk' }: { language?: Language; params: Promise<{ slug: string }> }) {
  const t = translator(language); const prefix = languagePath(language);
  const { slug } = await params;
  try { const [post] = await getPosts(slug, undefined, undefined, language); return post ? { title: plainText(post.title.rendered), description: plainText(post.excerpt.rendered).trim() } : { title: t('Матеріал не знайдено') }; }
  catch { return { title: language === 'en' ? 'Article temporarily unavailable' : 'Матеріал тимчасово недоступний' }; }
}
export default async function Article({ params, language = 'uk' }: { language?: Language; params: Promise<{ slug: string }> }) {
  const t = translator(language); const prefix = languagePath(language);
  const { slug } = await params;
  const [post] = await getPosts(slug, undefined, undefined, language);
  if (!post) notFound();
  return <article className="article"><Link className="back" href={`${prefix}/#materials`}>{t('← Усі матеріали')}</Link><p className="eyebrow">{postCategories(post).map(category => plainText(category.name)).join(' · ') || t('НАВЧАЛЬНИЙ МАТЕРІАЛ')}</p><h1>{plainText(post.title.rendered)}</h1><div className="translation-links"><span>{language === 'en' ? 'Article language:' : 'Мова матеріалу:'}</span>{(['uk', 'en'] as const).map(target => post.studyhub_translations?.[target] ? <Link key={target} href={`${languagePath(target)}/materialy/${post.studyhub_translations[target]}`} aria-current={target === language ? 'page' : undefined}>{target === 'uk' ? 'Українська' : 'English'}</Link> : <span key={target} className="translation-missing">{target === 'en' ? 'English — переклад ще не опубліковано' : 'Ukrainian — translation not published yet'}</span>)}</div><div className="article-meta"><span>{post._embedded?.author?.[0]?.name ?? t('Редакція StudyHub')}</span><time dateTime={post.date}>{new Date(post.date).toLocaleDateString(language === 'en' ? 'en-GB' : 'uk-UA')}</time></div><CoverImage cover={postCover(post)} className="article-cover" priority/><p className="article-intro">{plainText(post.excerpt.rendered)}</p><div className="prose" dangerouslySetInnerHTML={{ __html: safeContent(post.content.rendered) }}/><aside className="study-tip"><strong>{t('Перевір себе')}</strong><p>{t('Поясни своїми словами, яку роль у цьому проєкті виконують CMS, API та фронтенд.')}</p></aside></article>;
}
