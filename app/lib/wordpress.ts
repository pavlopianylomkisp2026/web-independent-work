import sanitizeHtml from 'sanitize-html';

export type Category = { id: number; name: string; slug: string };

export type Post = {
  id: number; slug: string; date: string; categories: number[];
  title: { rendered: string }; excerpt: { rendered: string }; content: { rendered: string };
  _embedded?: { author?: { name: string }[]; "wp:term"?: Category[][] };
};

// Only the server contacts the CMS. No administrator credentials are needed.
export async function getPosts(slug?: string, categoryId?: number): Promise<Post[]> {
  const base = process.env.WORDPRESS_API_URL;
  if (!base) throw new Error('WORDPRESS_API_URL is missing');
  const url = new URL(`${base.replace(/\/$/, '')}/posts`);
  url.searchParams.set('_embed', 'author,wp:term');
  url.searchParams.set('per_page', '12');
  if (categoryId) url.searchParams.set('categories', String(categoryId));
  if (slug) url.searchParams.set('slug', slug);
  const response = await fetch(url, { next: { revalidate: 60 }, signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`CMS returned ${response.status}`);
  return response.json();
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

export async function getCategories(): Promise<Category[]> {
  const base = process.env.WORDPRESS_API_URL;
  if (!base) throw new Error('WORDPRESS_API_URL is missing');
  const categories: Category[] = [];
  let page = 1;
  let totalPages = 1;
  do {
    const url = new URL(`${base.replace(/\/$/, '')}/categories`);
    url.searchParams.set('per_page', '100');
    url.searchParams.set('hide_empty', 'true');
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
