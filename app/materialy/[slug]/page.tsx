import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPosts, plainText, safeContent } from '../../lib/wordpress';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try { const [post] = await getPosts(slug); return post ? { title: plainText(post.title.rendered), description: plainText(post.excerpt.rendered).trim() } : { title: 'Матеріал не знайдено' }; }
  catch { return { title: 'Матеріал тимчасово недоступний' }; }
}
export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post] = await getPosts(slug);
  if (!post) notFound();
  return <article className="article"><Link className="back" href="/#materials">← Усі матеріали</Link><p className="eyebrow">ВЕБРОЗРОБКА · НАВЧАЛЬНИЙ МАТЕРІАЛ</p><h1>{plainText(post.title.rendered)}</h1><div className="article-meta"><span>{post._embedded?.author?.[0]?.name ?? 'Редакція StudyHub'}</span><time dateTime={post.date}>{new Date(post.date).toLocaleDateString('uk-UA')}</time></div><p className="article-intro">{plainText(post.excerpt.rendered)}</p><div className="prose" dangerouslySetInnerHTML={{ __html: safeContent(post.content.rendered) }}/><aside className="study-tip"><strong>Перевір себе</strong><p>Поясни своїми словами, яку роль у цьому проєкті виконують CMS, API та фронтенд.</p></aside></article>;
}
