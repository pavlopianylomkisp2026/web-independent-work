#!/bin/sh
set -eu
if ! wp core is-installed >/dev/null 2>&1; then
  wp core install --url=http://127.0.0.1:8080 --title=StudyHub --admin_user=studyadmin --admin_password="$WP_ADMIN_PASSWORD" --admin_email=admin@example.test --skip-email
fi
wp rewrite structure '/%postname%/' --hard
if [ -z "$(wp post list --name=yak-pratsiuie-cms --post_type=post --field=ID)" ]; then
  category=$(wp term list category --slug=web-development --field=term_id)
  if [ -z "$category" ]; then
    category=$(wp term create category 'Веброзробка' --slug=web-development --porcelain)
  fi
  wp post create --post_type=post --post_status=publish --post_title='Як працює CMS: від редактора до вебсторінки' --post_name=yak-pratsiuie-cms --post_category="$category" --post_excerpt='Простежуємо шлях навчального матеріалу: WordPress, REST API, Next.js і сторінка у браузері.' --post_content='<h2>Контент починається в CMS</h2><p>CMS — система управління контентом. Автор створює матеріал у WordPress, а система зберігає його в базі даних.</p><h2>REST API передає дані</h2><p>Окремий фронтенд виконує HTTP-запит до WordPress. Відповідь у форматі JSON містить назву, текст, дату й автора матеріалу.</p><h2>Next.js створює сторінку</h2><p>Сервер Next.js отримує матеріал, очищує HTML і відображає його через React-компоненти. Браузер отримує готовий інтерфейс.</p><h2>Спробуй сам</h2><p>Зміни цей абзац в адміністративній панелі WordPress. Опублікуй зміни й перевір сторінку через 60 секунд: це час кешування контенту.</p>'
fi
