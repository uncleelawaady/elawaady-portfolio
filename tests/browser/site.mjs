/* الصفحة الرئيسية وadmin.html القديمة — على الملفات الحقيقية مش المعاينة.
   شبكة فايربيز مقفولة في البيئة دي، فأي نداء بره بيفشل بهدوء وده بالظبط
   اللي عايزين نتأكد إنه مش بيكسر حاجة. */

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const BASE = 'http://127.0.0.1:8099';
let pass = 0, fail = 0;
const ok = (c, name, extra = '') => {
  console.log(`  ${c ? '✅' : '❌'} ${name}${c || !extra ? '' : `  — ${extra}`}`);
  c ? pass++ : fail++;
};
const bare = (t) => String(t).replace(/ـ/g, '');

const browser = await chromium.launch();
const ctx  = await browser.newContext({ viewport:{width:1400,height:1000}, locale:'ar-EG' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));

console.log('\n١) admin.html القديمة');
await page.goto(`${BASE}/admin.html`);
await page.waitForTimeout(1200);
const landed = page.url();
ok(landed.includes('app.html') && landed.includes('#/admin'),
   'admin.html بتحوّل على لوحة التحكم الواحدة', landed);
/* بنقرا الملف نفسه، مش الصفحة اللي اتحوّلنا عليها */
const raw = await (await fetch(`${BASE}/admin.html`)).text();
ok(!/admin-(auth|gate|config)\.js|admin\.js/.test(raw), 'مفيش أي سكربت إدارة قديم متربط بيها');
ok(!/كلمة السر|password|sha256/i.test(raw), 'مفيش أي شاشة كلمة سر قديمة');
ok(/app\.html#\/admin/.test(raw), 'بتشاور على اللوحة الواحدة');
for (const f of ['admin.js','admin-auth.js','admin-gate.js','admin-config.js'])
  ok((await fetch(`${BASE}/${f}`)).status === 404, `${f} اتشال من الريبو`);

console.log('\n٢) الصفحة الرئيسية');
await page.goto(`${BASE}/index.html`);
await page.waitForTimeout(1600);

const hero = await page.evaluate(() => {
  const btns = [...document.querySelectorAll('.hero-cta a')];
  return {
    labels: btns.map(b => b.textContent.replace(/ـ/g,'').trim()),
    hrefs:  btns.map(b => b.getAttribute('href'))
  };
});
const iCta = hero.labels.findIndex(l => l.includes('استكشف خبراتي'));
const iRev = hero.labels.findIndex(l => l.includes('أضف تقييمك'));
ok(iCta !== -1, 'زرار «استكشف خبراتي» موجود', hero.labels.join(' | '));
ok(iRev !== -1, 'زرار «أضف تقييمك» موجود', hero.labels.join(' | '));
ok(iRev === iCta + 1, 'وهو جنبه بالظبط', `مواقع: ${iCta} / ${iRev}`);
ok(hero.hrefs[iRev] === 'app.html#/new', 'وبيفتح مسار إضافة التقييم', String(hero.hrefs[iRev]));

const nav = (await page.locator('#navLinks a').allTextContents()).map(t => bare(t).trim());
ok(nav.includes('أضف تقييمك'), '«أضف تقييمك» لسه في الشريط الرئيسي', nav.join(' | '));
ok(nav.indexOf('أضف تقييمك') === nav.indexOf('خبراتي') + 1, 'جنب «خبراتي»', nav.join(' | '));
ok(nav.includes('تعاملات سابقة'), 'قسم «تعاملات سابقة» في الشريط');

const imgs = await page.evaluate(() => {
  const list = [...document.images];
  return {
    total:  list.length,
    broken: list.filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src')),
    ghosts: list.filter(i => (i.getAttribute('src') || '').includes('assets/portraits/')).length
  };
});
ok(imgs.ghosts === 0, 'مفيش أي صورة بتشاور على مجلد اتشال');
ok(imgs.broken.length === 0, 'كل الصور محمّلة', imgs.broken.join(', '));

const proofs = bare(await page.textContent('#proofs'));
ok(proofs.includes('تعاملات سابقة'), 'قسم «تعاملات سابقة» في الصفحة');
ok(!proofs.includes('إثباتات تعاملات العوضي'), 'الاسم القديم اتشال من المصدر');

/* الإنجليزي كمان */
await page.click('#langBtn');
await page.waitForTimeout(900);
const navEn = (await page.locator('#navLinks a').allTextContents()).map(t => t.trim());
ok(navEn.includes('Add your review'), 'الترجمة الإنجليزية شغالة', navEn.join(' | '));
await page.click('#langBtn');
await page.waitForTimeout(600);

await page.screenshot({ path:'/tmp/claude-0/-home-user-30lazma/92299517-4acf-5005-8af7-ed533ca6bcc0/scratchpad/e2e/site-hero.png' });

console.log(`\nنجح ${pass} — فشل ${fail}`);
console.log('أخطاء الصفحة:', errors.length ? '\n' + errors.join('\n') : 'مفيش');
await browser.close();
process.exit(fail ? 1 : 0);
