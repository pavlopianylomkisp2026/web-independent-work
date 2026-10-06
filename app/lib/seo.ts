import type { Metadata } from 'next';
import { languagePath, type Language } from './i18n';
import { plainText, postCover, type Post } from './wordpress';

export function siteUrl() {
  const url = new URL(process.env.SITE_URL || 'http://localhost:3000');
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('SITE_URL must be the website origin, e.g. https://studyhub.example');
  }
  return url;
}
export function absoluteUrl(path: string) { return new URL(path, siteUrl()).href; }
export function isLocalSite() { return ['localhost', '127.0.0.1', '[::1]'].includes(siteUrl().hostname) || siteUrl().hostname.endsWith('.localhost'); }
export function articlePath(language: Language, slug: string) { return `${languagePath(language)}/materialy/${encodeURIComponent(slug)}`; }
export function homeMetadata(language: Language, filtered = false): Metadata {
  const title = language === 'en' ? 'StudyHub — learn together' : 'StudyHub — вчимося разом';
  const description = language === 'en' ? 'Learn web development through clear explanations and practical examples.' : 'Освітній портал про веброзробку: зрозумілі матеріали для студентів.';
  const url = absoluteUrl(languagePath(language) || '/');
  return { title: { absolute: title }, description, alternates: { canonical: url, languages: { uk: absoluteUrl('/'), en: absoluteUrl('/en'), 'x-default': absoluteUrl('/') } }, robots: filtered || isLocalSite() ? { index: false, follow: true } : { index: true, follow: true }, openGraph: { title, description, url, siteName: 'StudyHub', type: 'website', locale: language === 'en' ? 'en_US' : 'uk_UA', images: [{ url: absoluteUrl('/opengraph-image'), width: 1200, height: 630 }] }, twitter: { card: 'summary_large_image', title, description, images: [absoluteUrl('/opengraph-image')] } };
}
export function articleMetadata(post: Post, language: Language): Metadata {
  const title = plainText(post.title.rendered).trim();
  const description = plainText(post.excerpt.rendered).replace(/\s+/g, ' ').trim().slice(0, 180);
  const url = absoluteUrl(articlePath(language, post.slug));
  const languages: Record<string, string> = {};
  for (const target of ['uk', 'en'] as const) {
    const slug = post.studyhub_translations?.[target];
    if (slug) languages[target] = absoluteUrl(articlePath(target, slug));
  }
  const cover = postCover(post);
  const image = cover?.src || absoluteUrl('/opengraph-image');
  return { title, description, alternates: { canonical: url, languages }, robots: { index: !isLocalSite(), follow: true }, openGraph: { title, description, url, siteName: 'StudyHub', type: 'article', locale: language === 'en' ? 'en_US' : 'uk_UA', images: [{ url: image, alt: cover?.alt || title }] }, twitter: { card: 'summary_large_image', title, description, images: [image] } };
}
