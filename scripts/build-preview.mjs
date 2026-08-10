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
  /* صور البورتريه اتشالت من الريبو، والموقع بيحطّ الرسمة بدالها وقت التشغيل.
     المعاينة بتعمل نفس الحاجة، بس من غير ما تستنى جافاسكريبت. */
  ['src="assets/portraits/ahmed-orange-sm.jpg"',
   `src="${dataURI('assets/ahmed-portrait.svg', 'image/svg+xml')}"`],
  ['href="assets/favicon.png"', `href="${dataURI('assets/favicon.png', 'image/png')}"`],
  /* المعاينة مالهاش صفحة رئيسية ترجع لها */
  ['<a href="index.html" class="brand">', '<a href="#/proofs" class="brand">'],
  /* firebase-config.js مش موجود جنب الملف، والمعاينة قصدها الوضع التجريبي */
  ['<script src="firebase-config.js"></script>',
   '<!-- الوضع التجريبي: مفيش إعداد Firebase، والبيانات بتتخزن في المتصفح -->'],
  /* والصور في المعاينة بتفضل جوّه المتصفح، مبتترفعش على Cloudinary */
  ['<script src="cloudinary-config.js"></script>',
   '<!-- الوضع التجريبي: الصور بتفضل في المتصفح -->']
];

for (const [from, to] of ASSETS) {
  if (!html.includes(from)) throw new Error(`مش لاقي في app.html: ${from.slice(0, 60)}`);
  html = html.replace(from, to);
}

/* سجل الروابط ملف منفصل، فبنحطّه جوّه المعاينة بدل الوسم اللي بيجيبه —
   من غير كده صفحة القنوات هتطلع فاضية في الملف الواحد. */
{
  const tag = '<script src="links.js"></script>';
  if (!html.includes(tag)) throw new Error('مش لاقي وسم links.js في app.html');
  html = html.replace(tag,
    '<script>\n' + readFileSync(resolve(root, 'links.js'), 'utf8') + '\n<\/script>');
}

/* ---------------------------------------------------------------------------
   المعاينة بتتنشر جوّه صفحة جاهزة ليها <head> و<body> بتوعها، فبنشيل هيكل
   المستند ونسيب المحتوى. المتصفح بيلمّ الباقي لوحده لو الملف اتفتح مباشرة،
   فنفس الملف بيشتغل في الحالتين.
--------------------------------------------------------------------------- */
const SKELETON = [
  /<!DOCTYPE html>\s*/i,
  /<html[^>]*>\s*/i,
  /<head>\s*/i,
  /<\/head>\s*/i,
  /<body>\s*/i,
  /\s*<\/body>/i,
  /\s*<\/html>\s*/i,
  /<meta charset="UTF-8">\s*/i,
  /<meta name="viewport"[^>]*>\s*/i,
  /<meta name="robots"[^>]*>\s*/i,
  /<link rel="icon"[^>]*>\s*/i
];
for (const re of SKELETON) html = html.replace(re, '');
html = html.trim();

/* اتجاه الصفحة كان على <html> اللي اتشال. بنرجّعه من أول سطر عشان الصفحة
   متتفتحش من الشمال للحظة قبل ما الستايل يشتغل. */
html = `<script>document.documentElement.setAttribute('dir','rtl');` +
       `document.documentElement.setAttribute('lang','ar');<\/script>\n` + html;

mkdirSync(resolve(root, 'preview'), { recursive: true });
const out = resolve(root, 'preview/reviews-preview.html');
writeFileSync(out, html);
console.log(`${out}  —  ${(html.length / 1024 / 1024).toFixed(2)} MB`);
