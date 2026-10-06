import type { MetadataRoute } from 'next';
import { getSitemapPosts } from './lib/wordpress';
import { absoluteUrl, articlePath } from './lib/seo';
export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), alternates: { languages: { uk: absoluteUrl('/'), en: absoluteUrl('/en') } } },
    { url: absoluteUrl('/en'), alternates: { languages: { uk: absoluteUrl('/'), en: absoluteUrl('/en') } } },
  ];
  for (const language of ['uk', 'en'] as const) {
    const posts = await getSitemapPosts(language);
    for (const post of posts) {
      const languages: Record<string, string> = {};
      for (const target of ['uk', 'en'] as const) {
        const slug = post.studyhub_translations?.[target];
        if (slug) languages[target] = absoluteUrl(articlePath(target, slug));
      }
      const modified = post.modified_gmt ? new Date(`${post.modified_gmt}Z`) : undefined;
      entries.push({ url: absoluteUrl(articlePath(language, post.slug)), ...(modified && !Number.isNaN(modified.getTime()) ? { lastModified: modified } : {}), alternates: { languages } });
    }
  }
  return entries;
}
