/* المسار كامل بعد إلغاء الفيديو:
   مستخدم → تقييم + صور (تمويه إجباري) → pending → المالك يعتمد → يظهر للعامة.
   بيشتغل على نسخة المعاينة (الواجهة الخلفية التجريبية) عشان يتنفذ من غير
   إنترنت — نفس كود app.html بالحرف. */

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const BASE = 'http://127.0.0.1:8099/preview/reviews-preview.html';
const log = (...a) => console.log(a.join(' '));

const browser = await chromium.launch();
const ctx  = await browser.newContext({ viewport:{width:1280,height:1000}, locale:'ar-EG' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
page.on('console',  m => { if (m.type()==='error') errors.push('CONSOLE: ' + m.text()); });

const go = async (h) => { await page.goto(BASE + h); await page.waitForTimeout(800); };

/* ---------- 0. مفيش أي أثر للفيديو في الواجهة ---------- */
await go('#/proofs');
const ghosts = await page.evaluate(() => ({
  vfile:   document.querySelectorAll('#vfile,#vdrop,#vpick,#vack,#vrm').length,
  warnBox: document.querySelectorAll('.warn-box,.ack,.clip,.vpick').length,
  videoEl: document.querySelectorAll('video').length,
  html:    /MP4|WebM|فيديو/i.test(document.body.innerHTML)
}));
log('0. عناصر فيديو باقية :', JSON.stringify(ghosts));

/* ---------- 1. تسجيل مستخدم ---------- */
const stamp = Date.now().toString(36);
const email = `flow.${stamp}@example.com`;
const pass  = `Flow#${stamp}Aa1`;
const title = `تعامل مضمون ${stamp}`;

await go('#/login');
await page.click('#tabReg');
await page.fill('#fName','مستخدم المسار');
await page.fill('#fEmail', email);
await page.fill('#fPass',  pass);
await page.click('#authSubmit');
await page.waitForTimeout(1200);
log('1. بعد التسجيل      :', await page.evaluate(()=>location.hash));

/* ---------- 2. النموذج فيه الحقول الخمسة بس ---------- */
await go('#/new');
const fields = await page.evaluate(() => ({
  stars:  document.querySelectorAll('#stars button').length,
  title:  Boolean(document.querySelector('#nTitle')),
  body:   Boolean(document.querySelector('#nBody')),
  type:   document.querySelectorAll('#nType option').length,
  images: Boolean(document.querySelector('#files')),
  accept: document.querySelector('#files')?.getAttribute('accept'),
  video:  document.querySelectorAll('#vfile,#vdrop,#vack').length
}));
log('2. حقول النموذج     :', JSON.stringify(fields));

/* ---------- 3. صورتين، كل واحدة بتعدي على التمويه إجباري ---------- */
await page.click('#stars button[data-n="5"]');
await page.fill('#nTitle', title);
await page.fill('#nBody','اتعاملت معاه في صفقة ضمان وكل خطوة كانت موثقة، والفلوس وصلت في وقتها من غير أي تأخير.');
await page.selectOption('#nType','guarantee');

const shot = (n) => page.evaluate(async (label) => {
  const c=document.createElement('canvas'); c.width=824; c.height=1100;
  const x=c.getContext('2d'); x.fillStyle='#0b141a'; x.fillRect(0,0,824,1100);
  x.fillStyle='#fff'; x.font='34px sans-serif';
  x.fillText('01012345678',120,300); x.fillText('2500 EGP',120,400); x.fillText(label,120,500);
  const b=await new Promise(r=>c.toBlob(r,'image/png'));
  return Array.from(new Uint8Array(await b.arrayBuffer()));
}, n);

async function addProof(name, n){
  await page.setInputFiles('#files',{name, mimeType:'image/png', buffer:Buffer.from(await shot(n))});
  await page.waitForTimeout(900);
  const open = await page.locator('#rc').count();
  if (!open) throw new Error('أداة التمويه مفتحتش — التمويه مش إجباري!');
  const bx = await page.locator('#rc').boundingBox();
  await page.mouse.move(bx.x+bx.width*0.15, bx.y+bx.height*0.27);
  await page.mouse.down();
  await page.mouse.move(bx.x+bx.width*0.60, bx.y+bx.height*0.27,{steps:16});
  await page.mouse.up();
  await page.click('#rDone');
  await page.waitForTimeout(700);
}

await addProof('proof-1.png','لقطة ١');
await addProof('proof-2.png','لقطة ٢');
log('3. صور بعد التمويه  :', await page.locator('.pick').count());

/* التمويه إجباري: قفل النافذة = الصورة مبتتقبلش */
await page.setInputFiles('#files',{name:'skip.png',mimeType:'image/png',buffer:Buffer.from(await shot('يتقفل'))});
await page.waitForTimeout(900);
await page.click('.modal [data-close]').catch(()=>page.click('[data-close]'));
await page.waitForTimeout(500);
log('3. بعد قفل التمويه  :', await page.locator('.pick').count(), '(المفروض 2)');

/* ملف مش صورة بيترفض */
await page.setInputFiles('#files',{name:'x.mp4',mimeType:'video/mp4',buffer:Buffer.from([0,1,2,3])});
await page.waitForTimeout(700);
log('3. ملف فيديو مرفوض :', (await page.textContent('#newMsg')).trim() || '(مفيش رسالة)');

/* ---------- 4. الإرسال — من غير أي إقرار فيديو ---------- */
await page.click('#sendReview');
await page.waitForTimeout(2500);
log('4. بعد الإرسال      :', await page.evaluate(()=>location.hash));

/* ---------- 5. pending في «حسابي» ---------- */
await go('#/account');
const pills = (await page.locator('#mine .pill').allTextContents()).map(t=>t.trim());
log('5. حالة التقييم     :', pills.join(' | ') || '(مفيش)');
log('5. صور في البطاقة   :', await page.locator('#mine .shots img').count());

/* ---------- 6. مش ظاهر للعامة وهو pending ---------- */
await page.evaluate(()=>document.querySelector('#logoutLink')?.click());
await page.waitForTimeout(700);
await go('#/proofs');
const leaked = await page.evaluate(t =>
  [...document.querySelectorAll('.review')].some(r => r.textContent.includes(t)), title);
log('6. ظاهر وهو pending :', leaked ? 'أيوه ❌' : 'لأ ✅');

/* ---------- 7. المالك يعتمد ---------- */
await go('#/login');
await page.fill('#fEmail','owner@elawaady-db.com');
await page.fill('#fPass','Owner#2026');
await page.click('#authSubmit');
await page.waitForTimeout(1200);
await go('#/admin');
const adminCards = await page.locator('.review').count();
log('7. تقييمات في الإدارة:', adminCards);
log('7. صور ظاهرة للمالك :', await page.locator('.review .shots img').count());
await page.click('[data-act="approve"]');
await page.waitForTimeout(1400);

/* ---------- 8. ظهر للعامة ---------- */
await page.evaluate(()=>document.querySelector('#logoutLink')?.click());
await page.waitForTimeout(700);
await go('#/proofs');
const live = await page.evaluate(t =>
  [...document.querySelectorAll('.review')].some(r => r.textContent.includes(t)), title);
log('8. ظاهر بعد الاعتماد:', live ? 'أيوه ✅' : 'لأ ❌');
log('8. صور محمّلة فعلاً :', await page.evaluate(() =>
  [...document.querySelectorAll('.review .shots img')].filter(i=>i.naturalWidth>0).length));
log('8. مشغّلات فيديو    :', await page.locator('video').count(), '(المفروض 0)');
await page.screenshot({ path:'/tmp/claude-0/-home-user-30lazma/92299517-4acf-5005-8af7-ed533ca6bcc0/scratchpad/e2e/flow-public.png', fullPage:true });

log('--- ERRORS ---');
log(errors.length ? errors.join('\n') : 'none');
await browser.close();
