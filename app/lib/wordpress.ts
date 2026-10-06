import sanitizeHtml from 'sanitize-html';

export type Post = {
  id: number; slug: string; date: string;
  title: { rendered: string }; excerpt: { rendered: string }; content: { rendered: string };
  _embedded?: { author?: { name: string }[] };
};

// Only the server contacts the CMS. No administrator credentials are needed.
export async function getPosts(slug?: string): Promise<Post[]> {
  const base = process.env.WORDPRESS_API_URL;
  if (!base) throw new Error('WORDPRESS_API_URL is missing');
  const url = new URL(`${base.replace(/\/$/, '')}/posts`);
  url.searchParams.set('_embed', 'author');
  url.searchParams.set('per_page', '12');
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
