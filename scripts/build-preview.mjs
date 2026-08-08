/* ===========================================================================
   بيبني نسخة معاينة من app.html في ملف واحد.

   المعاينة بتتفتح من غير سيرفر ومن غير مجلد assets، فالخط واللوجو بيتحطوا
   جوّه الملف كـdata URI. غير كده الملف هو هو — نفس الكود اللي بيترفع.
=========================================================================== */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dataURI = (file, mime) =>
  `data:${mime};base64,${readFileSync(resolve(root, file)).toString('base64')}`;

let html = readFileSync(resolve(root, 'app.html'), 'utf8');

const ASSETS = [
  ["url('assets/fonts/handicrafts-semibold.woff2') format('woff2')",
   `url('${dataURI('assets/fonts/handicrafts-semibold.woff2', 'font/woff2')}') format('woff2')`],
  ["url('assets/fonts/handicrafts-bold.woff2') format('woff2')",
   `url('${dataURI('assets/fonts/handicrafts-bold.woff2', 'font/woff2')}') format('woff2')`],
  ['src="assets/e-logo.png"',  `src="${dataURI('assets/e-logo.png', 'image/png')}"`],
  ['href="assets/favicon.png"', `href="${dataURI('assets/favicon.png', 'image/png')}"`],
  /* المعاينة مالهاش صفحة رئيسية ترجع لها */
  ['<a href="index.html" class="brand">', '<a href="#/reviews" class="brand">'],
  /* firebase-config.js مش موجود جنب الملف، والمعاينة قصدها الوضع التجريبي */
  ['<script src="firebase-config.js"></script>',
   '<!-- الوضع التجريبي: مفيش إعداد Firebase، والبيانات بتتخزن في المتصفح -->']
];

for (const [from, to] of ASSETS) {
  if (!html.includes(from)) throw new Error(`مش لاقي في app.html: ${from.slice(0, 60)}`);
  html = html.replace(from, to);
}

mkdirSync(resolve(root, 'preview'), { recursive: true });
const out = resolve(root, 'preview/reviews-preview.html');
writeFileSync(out, html);
console.log(`${out}  —  ${(html.length / 1024 / 1024).toFixed(2)} MB`);
