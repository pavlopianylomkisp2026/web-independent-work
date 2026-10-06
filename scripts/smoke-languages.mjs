import assert from 'node:assert/strict';
const api = process.env.WORDPRESS_API_URL || 'http://127.0.0.1:8080/wp-json/wp/v2';
const site = process.env.SITE_URL || 'http://127.0.0.1:3000';
const get = async url => {
  const response = await fetch(url);
  assert.equal(response.status, 200, url);
  return response;
};
const ukPosts = await (await get(`${api}/posts?lang=uk&per_page=100`)).json();
const enPosts = await (await get(`${api}/posts?lang=en&per_page=100`)).json();
assert.ok(ukPosts.length && enPosts.length, 'Prepare published articles in both languages before running');
assert.ok(ukPosts.every(post => post.studyhub_language === 'uk'));
assert.ok(enPosts.every(post => post.studyhub_language === 'en'));
const uk = await (await get(site)).text();
const en = await (await get(`${site}/en`)).text();
assert.ok(uk.includes('<html lang="uk"'));
assert.ok(en.includes('<html lang="en"'));
assert.ok(en.includes('Search articles') && en.includes('Read article'));
for (const post of enPosts) assert.ok(!uk.includes(`href="/materialy/${post.slug}"`));
for (const post of ukPosts) assert.ok(!en.includes(`href="/en/materialy/${post.slug}"`));
const translated = enPosts.find(post => post.studyhub_translations?.uk);
assert.ok(translated, 'Prepare a linked published translation');
const article = await (await get(`${site}/en/materialy/${translated.slug}`)).text();
assert.ok(article.includes(`href="/materialy/${translated.studyhub_translations.uk}"`));
assert.ok(article.includes('Check your understanding'));
assert.equal((await fetch(`${site}/materialy/${translated.slug}`)).status, 404);
const empty = await (await get(`${site}/en?q=studyhub-no-match-987654321`)).text();
assert.ok(empty.includes('No articles match your search'));
const categories = await (await get(`${api}/categories?lang=en&hide_empty=true`)).json();
assert.ok(categories.every(category => category.studyhub_language === 'en'));
if (categories.length) {
  const filtered = await (await get(`${site}/en?category=${encodeURIComponent(categories[0].slug)}&q=HTML`)).text();
  assert.ok(filtered.replace(/<!--.*?-->/g, '').includes('Search: “HTML”'));
  assert.ok(/href="\/en\/?\?[^"]*q=HTML/.test(filtered), 'Category links must retain English route and search');
}
console.log('PASS: API language isolation, page language, English interface, translated article links, wrong-language 404, search, categories.');
