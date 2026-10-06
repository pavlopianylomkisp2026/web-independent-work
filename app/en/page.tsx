import Home from '../page';
export const metadata = { title: 'StudyHub — learn together', description: 'Learn web development through clear explanations and practical examples.' };
export default function EnglishHome(props: Parameters<typeof Home>[0]) { return <Home {...props} language="en"/>; }
