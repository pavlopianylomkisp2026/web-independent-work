import assert from 'node:assert/strict';
const site = process.env.SITE_URL_FOR_TEST || 'http://127.0.0.1:3000';
const origin = process.env.SEO_EXPECTED_ORIGIN || 'http://localhost:3000';
const api = process.env.WORDPRESS_API_URL || 'http://127.0.0.1:8080/wp-json/wp/v2';
async function request(path) { const response = await fetch(`${site}${path}`); assert.equal(response.status,200,path); return response; }
const xml = await (await request('/sitemap.xml')).text();
assert.ok(xml.includes(`${origin}/en`));
assert.ok(xml.includes('hreflang="uk"'));
for (const language of ['uk','en']) {
  let page=1; let pages=1;
  do {
    const response=await fetch(`${api}/posts?lang=${language}&per_page=100&page=${page}`);
    assert.equal(response.status,200);
    const posts=await response.json();
    pages=Number(response.headers.get('X-WP-TotalPages') || 1);
    for (const post of posts) assert.ok(xml.includes(`${origin}${language==='en'?'/en':''}/materialy/${encodeURIComponent(decodeURIComponent(post.slug))}`),'Every published article must appear in sitemap');
    page++;
  } while(page<=pages);
}
assert.ok(!xml.includes('category=') && !xml.includes('?q='));
const robots = await (await request('/robots.txt')).text();
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
assert.ok(robots.includes(origin.includes('localhost') ? 'Disallow: /' : 'Allow: /'));
const home=await(await request('/')).text();
assert.ok(home.includes(`rel="canonical" href="${origin}/"`) || home.includes(`rel="canonical" href="${origin}"`));
assert.ok(home.includes('property="og:title"'));
assert.ok(home.includes('name="twitter:card" content="summary_large_image"'));
const filtered=await(await request('/?q=HTML')).text();
assert.ok(/name="robots" content="[^"]*noindex/.test(filtered));
const en=await(await request('/en')).text();
assert.ok(en.includes(`rel="canonical" href="${origin}/en"`));
assert.ok(en.includes('property="og:locale" content="en_US"'));
const article=await(await request('/materialy/yak-pratsiuie-cms')).text();
assert.ok(article.includes(`rel="canonical" href="${origin}/materialy/yak-pratsiuie-cms"`));
assert.ok(article.includes('property="og:type" content="article"'));
const image = await request('/opengraph-image');
assert.ok(image.headers.get('content-type').includes('image/png'));
assert.deepEqual([...new Uint8Array(await image.arrayBuffer()).slice(0,8)],[137,80,78,71,13,10,26,10]);
console.log('PASS: sitemap coverage, language links, robots, canonical URLs, Open Graph, Twitter, filtered noindex, PNG sharing image.');
