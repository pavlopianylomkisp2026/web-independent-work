'use client';
export default function ErrorPage({ reset }: { reset: () => void }) { return <section className="article"><h1>Не вдалося завантажити матеріал</h1><p>Спробуй ще раз трохи пізніше.</p><button className="button" onClick={reset}>Спробувати знову</button></section>; }
