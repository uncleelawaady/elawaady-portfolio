/* لوحة تحكم واحدة: الأقسام الخمسة، بيانات المراجعة، الرفض، وحساب المستخدم.
   بيشتغل على نسخة المعاينة — نفس كود app.html بالحرف. */

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const BASE = 'http://127.0.0.1:8099/preview/reviews-preview.html';
let pass = 0, fail = 0;
const ok = (cond, name, extra = '') => {
  console.log(`  ${cond ? '✅' : '❌'} ${name}${cond || !extra ? '' : `  — ${extra}`}`);
  cond ? pass++ : fail++;
};

const browser = await chromium.launch();
const ctx  = await browser.newContext({ viewport:{width:1400,height:1100}, locale:'ar-EG' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
page.on('console',  m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

const bare = (t) => String(t).replace(/\u0640/g,'');
const go = async (h) => { await page.goto(BASE + h); await page.waitForTimeout(700); };
const stamp = Date.now().toString(36);
const email = `dash.${stamp}@example.com`;
const pw    = `Dash#${stamp}Aa1`;
const title = `صفقة مرفوضة ${stamp}`;

/* ---------- 1. مستخدم عادي بيبعت تقييم ---------- */
console.log('\n١) مستخدم عادي');
await go('#/login');
await page.click('#tabReg');
await page.fill('#fName','مستخدم اللوحة');
await page.fill('#fEmail', email);
await page.fill('#fPass',  pw);
await page.click('#authSubmit');
await page.waitForTimeout(1200);
ok(await page.evaluate(() => location.hash) === '#/account', 'دخل على حسابه بعد التسجيل');

await go('#/new');
await page.click('#stars button[data-n="4"]');
await page.fill('#nTitle', title);
await page.fill('#nBody','تعامل كويس بس عايز أتأكد إن الرفض بيوصل لصاحب التقييم صح.');
await page.selectOption('#nType','trade');
await page.click('#sendReview');
await page.waitForTimeout(2000);

/* ---------- 2. المستخدم العادي ما يشوفش اللوحة ---------- */
console.log('\n٢) حراسة اللوحة');
await go('#/admin');
const body = await page.textContent('#view');
ok(!body.includes('لوحة التحكم') || body.includes('مش ليك'), 'المستخدم العادي مش شايف اللوحة');
ok(await page.locator('[data-sec]').count() === 0, 'مفيش أزرار أقسام لغير المالك');

/* المستخدم العادي بيشوف حسابه وتقييماته وحالتها وبس */
await go('#/account');
const acct = await page.evaluate(() => ({
  pills:  [...document.querySelectorAll('#mine .pill')].map(p => p.textContent.replace(/ـ/g,'').trim()),
  addBtn: Boolean(document.querySelector('a[href="#/new"]')),
  admin:  [...document.querySelectorAll('a[href^="#/admin"]')].length,
  links:  [...document.querySelectorAll('a[href^="#/links"]')].length
}));
ok(acct.pills.some(p => p.startsWith('قيد المراجعة')), 'حالة التقييم ظاهرة عنده', acct.pills.join(' | '));
ok(acct.addBtn, 'زرار «اكتب تقييم جديد» موجود');
ok(!acct.admin && !acct.links, 'مفيش أي رابط إدارة في صفحة المستخدم',
   `admin=${acct.admin} links=${acct.links}`);

/* ---------- 3. المالك — لوحة واحدة بخمس أقسام ---------- */
console.log('\n٣) لوحة المالك');
await page.evaluate(() => document.querySelector('#logoutLink')?.click());
await page.waitForTimeout(600);
await go('#/login');
await page.fill('#fEmail','owner@elawaady-db.com');
await page.fill('#fPass','Owner#2026');
await page.click('#authSubmit');
await page.waitForTimeout(1200);

const navItems = await page.locator('#navLinks a').allTextContents();
const navClean = navItems.map(t => t.replace(/ـ/g,'').trim());
ok(navClean.filter(t => /لوحة|إدارة/.test(t)).length === 1,
   'مدخل إدارة واحد بس في الشريط', navClean.join(' | '));

await go('#/admin');
const secs = (await page.locator('[data-sec]').allTextContents()).map(t => t.replace(/ـ/g,'').trim());
ok(secs.length === 5, 'خمس أقسام في اللوحة', secs.join(' | '));
for (const want of ['مراجعة التقييمات','المستخدمين','الروابط','محتوى البورتفوليو','إعدادات الموقع'])
  ok(secs.includes(want), `قسم «${want}» موجود`);

/* ---------- 4. قسم مراجعة التقييمات بيعرض كل المطلوب ---------- */
console.log('\n٤) مراجعة التقييمات');
const card = await page.evaluate((t) => {
  const el = [...document.querySelectorAll('.review.mod')]
    .find(r => r.textContent.includes(t.slice(0, 12)));
  if (!el) return null;
  const keys = [...el.querySelectorAll('.mod-k')].map(k => k.textContent.replace(/ـ/g,'').trim());
  const acts = [...el.querySelectorAll('[data-act]')].map(b => b.dataset.act);
  return {
    keys, acts,
    text: el.textContent.replace(/ـ/g,''),
    stars: Boolean(el.querySelector('.stars-ro')),
    pill:  el.querySelector('.pill')?.textContent.replace(/ـ/g,'').trim()
  };
}, title);

ok(Boolean(card), 'التقييم ظاهر في اللوحة');
if (card){
  ok(card.text.includes(email), 'إيميل صاحب التقييم ظاهر');
  ok(card.text.includes('مستخدم اللوحة'), 'اسم صاحب التقييم ظاهر');
  ok(card.stars, 'النجوم ظاهرة');
  ok(card.text.includes(title.slice(0, 12)), 'عنوان التقييم ظاهر');
  ok(card.text.includes('بيع وشراء') || card.text.includes('نوع التعامل'), 'نوع التعامل ظاهر');
  ok(card.keys.includes('تاريخ الإرسال'), 'تاريخ الإرسال ظاهر', card.keys.join(' | '));
  ok(card.keys.some(k => k.startsWith('صور الإثبات')), 'خانة صور الإثبات ظاهرة');
  ok(card.pill === 'قيد المراجعة', 'الحالة ظاهرة', String(card.pill));
  for (const a of ['approve','reject','hide','feature'])
    ok(card.acts.includes(a), `زرار ${a} موجود`);
}

/* ---------- 5. الرفض بيوصل لصاحب التقييم ---------- */
console.log('\n٥) الرفض');
await page.click('[data-act="reject"]');
await page.waitForTimeout(1400);
await page.click('[data-tab="rejected"]');
await page.waitForTimeout(800);
ok((await page.textContent('#apanel')).includes(title.slice(0, 12)), 'التقييم اتنقل لتبويب «مرفوض»');

await page.evaluate(() => document.querySelector('#logoutLink')?.click());
await page.waitForTimeout(600);
await go('#/proofs');
ok(!(await page.textContent('#view')).includes(title.slice(0, 12)), 'المرفوض مش ظاهر للعامة');

await go('#/login');
await page.fill('#fEmail', email);
await page.fill('#fPass',  pw);
await page.click('#authSubmit');
await page.waitForTimeout(1200);
await go('#/account');
const mine = (await page.textContent('#mine')).replace(/ـ/g,'');
ok(mine.includes('مرفوض'), 'صاحب التقييم شايف إنه مرفوض');

/* ---------- 6. باقي الأقسام بتفتح فعلاً ---------- */
console.log('\n٦) باقي الأقسام');
await page.evaluate(() => document.querySelector('#logoutLink')?.click());
await page.waitForTimeout(600);
await go('#/login');
await page.fill('#fEmail','owner@elawaady-db.com');
await page.fill('#fPass','Owner#2026');
await page.click('#authSubmit');
await page.waitForTimeout(1200);

await go('#/admin?s=users');
const usersTxt = await page.textContent('#apanel');
ok(usersTxt.includes(email), 'قسم المستخدمين بيعرض الحسابات');
ok(await page.locator('[data-ublock]').count() > 0, 'فيه زرار إيقاف حساب');

await go('#/admin?s=links');
ok(await page.locator('#addLink').count() === 1, 'قسم الروابط بيفتح جوّه اللوحة');
ok(await page.locator('.lrow').count() > 0, 'الروابط ظاهرة');

/* المسار القديم بيحوّل على اللوحة */
await go('#/links');
const afterLinks = await page.evaluate(() => location.hash);
ok(afterLinks.startsWith('#/admin'), 'المسار القديم #/links بيحوّل على اللوحة', afterLinks);
ok(await page.locator('#addLink').count() === 1, 'وبيفتح على قسم الروابط');

await go('#/admin?s=content');
ok(await page.locator('#c_heroTitle_ar').count() === 1, 'قسم المحتوى بيفتح');
await page.fill('#c_heroTitle_ar','عنوان اتغيّر من اللوحة');
await page.click('#cSave');
await page.waitForTimeout(900);
ok(bare(await page.textContent('#cMsg')).includes('اتحفظ'), 'المحتوى اتحفظ');
await go('#/admin?s=content');
ok(await page.inputValue('#c_heroTitle_ar') === 'عنوان اتغيّر من اللوحة', 'المحتوى فضل محفوظ بعد إعادة الفتح');

await go('#/admin?s=settings');
ok(await page.locator('#s_whatsapp').count() === 1, 'قسم الإعدادات بيفتح');
await page.fill('#s_whatsapp','201055578777');
await page.uncheck('#s_open');
await page.click('#sSave');
await page.waitForTimeout(900);
ok(bare(await page.textContent('#sMsg')).includes('اتحفظ'), 'الإعدادات اتحفظت');

/* قفل الاستقبال بيبان في صفحة التقييم الجديد */
await go('#/new');
ok(bare(await page.textContent('#view')).includes('متوقف'), 'قفل الاستقبال بيشتغل');
await go('#/admin?s=settings');
await page.check('#s_open');
await page.click('#sSave');
await page.waitForTimeout(900);
await go('#/new');
ok(await page.locator('#sendReview').count() === 1, 'بعد فتحه تاني النموذج رجع');

await page.screenshot({ path:'/tmp/claude-0/-home-user-30lazma/92299517-4acf-5005-8af7-ed533ca6bcc0/scratchpad/e2e/dash.png', fullPage:true });

console.log(`\nنجح ${pass} — فشل ${fail}`);
console.log('أخطاء الكونسول:', errors.length ? '\n' + errors.join('\n') : 'مفيش');
await browser.close();
process.exit(fail || errors.length ? 1 : 0);
