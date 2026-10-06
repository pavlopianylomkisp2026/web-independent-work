import type { MetadataRoute } from 'next';
import { absoluteUrl, isLocalSite } from './lib/seo';
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', ...(isLocalSite() ? { disallow: '/' } : { allow: '/' }) }, sitemap: absoluteUrl('/sitemap.xml') };
}
