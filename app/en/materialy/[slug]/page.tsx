import Article, { generateMetadata as articleMetadata } from '../../../materialy/[slug]/page';
export function generateMetadata(props: Parameters<typeof articleMetadata>[0]) { return articleMetadata({ ...props, language: 'en' }); }
export default function EnglishArticle(props: Parameters<typeof Article>[0]) { return <Article {...props} language="en"/>; }
