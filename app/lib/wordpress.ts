import type { Language } from './i18n';
import sanitizeHtml from 'sanitize-html';

export type Category = { id: number; name: string; slug: string };

export type FeaturedMedia = { source_url: string; alt_text?: string; media_details?: { width?: number; height?: number; sizes?: Record<string, { source_url: string }> } };

export type Post = {
  studyhub_language?: Language; studyhub_translations?: Partial<Record<Language, string>>;
  id: number; slug: string; date: string; modified_gmt?: string; categories: number[];
  title: { rendered: string }; excerpt: { rendered: string }; content: { rendered: string };
  _embedded?: { author?: { name: string }[]; "wp:term"?: Category[][]; "wp:featuredmedia"?: FeaturedMedia[] };
};

export const PAGE_SIZE = 3;
export type Catalog = { posts: Post[]; total: number; totalPages: number };
// Only the server contacts the CMS. No administrator credentials are needed.
export async function getCatalog(categoryId?: number, search?: string, page = 1, slug?: string, language: Language = 'uk'): Promise<Catalog> {
  const base = process.env.WORDPRESS_API_URL;
  if (!base) throw new Error('WORDPRESS_API_URL is missing');
  const url = new URL(`${base.replace(/\/$/, '')}/posts`);
  url.searchParams.set('lang', language);
  url.searchParams.set('_embed', 'author,wp:term,wp:featuredmedia');
  url.searchParams.set('per_page', String(slug ? 1 : PAGE_SIZE));
  url.searchParams.set('page', String(page));
  if (categoryId) url.searchParams.set('categories', String(categoryId));
  if (search) url.searchParams.set('search', search);
  if (slug) url.searchParams.set('slug', slug);
  const response = await fetch(url, { next: { revalidate: 60 }, signal: AbortSignal.timeout(8000) });
  if (!response.ok) {
    const error = await response.json();
    if (response.status === 400 && error.code === 'rest_post_invalid_page_number') {
      return { posts: [], total: 0, totalPages: 0 };
    }
    throw new Error(`CMS returned ${response.status}`);
  }
  return { posts: await response.json(), total: Number(response.headers.get('X-WP-Total') || 0), totalPages: Number(response.headers.get('X-WP-TotalPages') || 0) };
}
export async function getPosts(slug?: string, categoryId?: number, search?: string, language: Language = 'uk'): Promise<Post[]> {
  return (await getCatalog(categoryId, search, 1, slug, language)).posts;
}
export function plainText(html: string) {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} });
}
export function safeContent(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ['p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'blockquote', 'pre', 'code', 'br'],
    allowedAttributes: { a: ['href', 'title'] },
    allowedSchemes: ['https', 'http', 'mailto'],
    allowProtocolRelative: false,
  });
}

export async function getCategories(language: Language = 'uk'): Promise<Category[]> {
  const base = process.env.WORDPRESS_API_URL;
  if (!base) throw new Error('WORDPRESS_API_URL is missing');
  const categories: Category[] = [];
  let page = 1;
  let totalPages = 1;
  do {
    const url = new URL(`${base.replace(/\/$/, '')}/categories`);
    url.searchParams.set('per_page', '100');
    url.searchParams.set('hide_empty', 'true');
    url.searchParams.set('lang', language);
    url.searchParams.set('page', String(page));
    const response = await fetch(url, { next: { revalidate: 60 }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`CMS returned ${response.status}`);
    categories.push(...await response.json());
    totalPages = Number(response.headers.get('X-WP-TotalPages') || 1);
    page++;
  } while (page <= totalPages);
  return categories;
}
export function postCategories(post: Post): Category[] {
  return post._embedded?.['wp:term']?.flat().filter(term => post.categories.includes(term.id)) ?? [];
}

export function postCover(post: Post) {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media?.source_url) return undefined;
  try {
    const source = new URL(media.source_url);
    if (!['http:', 'https:'].includes(source.protocol)) return undefined;
    return { src: source.href, alt: media.alt_text?.trim() || plainText(post.title.rendered), width: media.media_details?.width || 1200, height: media.media_details?.height || 675 };
  } catch { return undefined; }
}

export async function getSitemapPosts(language: Language): Promise<Post[]> {
  const base = process.env.WORDPRESS_API_URL;
  if (!base) throw new Error('WORDPRESS_API_URL is missing');
  const posts: Post[] = [];
  let page = 1; let totalPages = 1;
  do {
    const url = new URL(`${base.replace(/\/$/, '')}/posts`);
    url.searchParams.set('lang', language);
    url.searchParams.set('status', 'publish');
    url.searchParams.set('per_page', '100');
    url.searchParams.set('page', String(page));
    url.searchParams.set('_fields', 'id,slug,modified_gmt,studyhub_translations');
    const response = await fetch(url, { next: { revalidate: 60 }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`Sitemap CMS request failed: ${response.status}`);
    posts.push(...await response.json());
    totalPages = Number(response.headers.get('X-WP-TotalPages') || 1);
    page++;
  } while (page <= totalPages);
  return posts;
}
