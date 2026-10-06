import Home, { generateMetadata as homeMetadata } from '../page';
export function generateMetadata(props: Parameters<typeof Home>[0]) { return homeMetadata({ ...props, language: 'en' }); }
export default function EnglishHome(props: Parameters<typeof Home>[0]) { return <Home {...props} language="en"/>; }
