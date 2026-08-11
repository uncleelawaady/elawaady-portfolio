/* ===========================================================================
   اختبار المسار كامل على Firebase الحقيقي — بعد إلغاء الفيديو.

   مستخدم يسجّل → يعمل تقييم pending → يضيف صور إثبات (مستندات review_media)
   → الزائر مايشوفش حاجة → المالك يعتمد → الزائر يشوف التقييم والصور.

   ملاحظة مهمة: الصور نفسها بتتخزن على Cloudinary، والساندبوكس بتاعي حاجب
   api.cloudinary.com — فالسكربت ده بيختبر طبقة Firestore والصلاحيات بروابط
   على شكل روابط Cloudinary. الرفع الحقيقي بيتجرب من المتصفح.
=========================================================================== */
import { writeFileSync } from 'node:fs';

const KEY     = 'AIzaSyArFgfE-qaRRY4NtmuGXxCj_eOGekEAZlY';
const PROJECT = 'elawaady-portfolio';
const OWNER   = 'jJPB9z2WISN7yhW1iq99H4ncfi72';

const IDT = 'https://identitytoolkit.googleapis.com/v1/accounts';
const FS  = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

let pass = 0, fail = 0;
const ok = (cond, label, extra = '') => {
  if (cond) { pass++; console.log(`  ✅ ${label}`); }
  else      { fail++; console.log(`  ❌ ${label}${extra ? '  —  ' + extra : ''}`); }
};
const head = (t) => console.log(`\n${t}\n${'─'.repeat(t.length)}`);

/* --------------------------------- أدوات --------------------------------- */
const S  = (v) => ({ stringValue: v });
const I  = (v) => ({ integerValue: String(v) });
const B  = (v) => ({ booleanValue: v });
const TS = ()  => ({ timestampValue: new Date().toISOString() });
const ARR = (v) => ({ arrayValue: { values: v } });
const MAP = (o) => ({ mapValue: { fields: o } });

async function fsReq(method, path, token, body) {
  const res = await fetch(`${FS}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

const denied = (r) => r.status === 403 || r.json?.error?.status === 'PERMISSION_DENIED';

async function signUp(email, password, displayName) {
  const res = await fetch(`${IDT}:signUp?key=${KEY}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, displayName, returnSecureToken: true })
  });
  const j = await res.json();
  if (!j.idToken) throw new Error('التسجيل فشل: ' + JSON.stringify(j.error || j));
  return { token: j.idToken, uid: j.localId };
}

/* --------------------------------------------------------------------------
   وضع التحقق: بعد ما المالك يعتمد التقييم من صفحة الإدارة.
   node rest.mjs --verify <reviewId>
-------------------------------------------------------------------------- */
if (process.argv[2] === '--verify') {
  const id = process.argv[3];
  if (!id) { console.log('استخدم: node rest.mjs --verify <reviewId>'); process.exit(2); }
  head(`تحقق بعد الاعتماد — ${id}`);

  const r = await fsReq('GET', `/reviews/${id}`, null);
  const st = r.json?.fields?.status?.stringValue;
  if (denied(r)) {
    console.log('  ⏳ الزائر لسه مش شايفه — يبقى التقييم لسه pending. اعتمده الأول.');
    process.exit(3);
  }
  ok(r.status === 200, 'الزائر بيشوف التقييم من غير تسجيل دخول');
  ok(st === 'approved', `الحالة approved`, `الحالة الحالية: ${st}`);
  ok(r.json?.fields?.featured?.booleanValue === false, 'featured لسه false');

  const imgs = r.json?.fields?.images?.arrayValue?.values || [];
  ok(imgs.length === 2, `الصور مربوطة بالتقييم (${imgs.length})`);
  for (const [i, im] of imgs.entries()) {
    const f = im.mapValue?.fields || {};
    const keys = Object.keys(f).sort().join(',');
    ok(keys === 'bytes,mime,publicId,url', `صورة ${i + 1} فيها الحقول المتفق عليها`, keys);
    ok(String(f.url?.stringValue).startsWith('https://'), `صورة ${i + 1} رابطها https`);
  }

  /* مستندات review_media بقت مقروءة للزائر لأن التقييم اتعتمد */
  for (const n of [0, 1]) {
    const m = await fsReq('GET', `/review_media/${id}_m${n}`, null);
    ok(m.status === 200, `الزائر بيشوف مستند صورة ${n + 1}`,
       JSON.stringify(m.json).slice(0, 120));
  }

  /* الاستعلام اللي التطبيق نفسه بيعمله للعامة */
  const q = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents:runQuery`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ structuredQuery: {
      from: [{ collectionId: 'reviews' }],
      where: { fieldFilter: { field: { fieldPath: 'status' }, op: 'EQUAL', value: { stringValue: 'approved' } } },
      limit: 50
    } })
  });
  const rows = await q.json().catch(() => []);
  const found = Array.isArray(rows) && rows.some(x => x.document?.name?.endsWith(`/${id}`));
  ok(q.status === 200, 'استعلام العامة (status == approved) شغال', `HTTP ${q.status}`);
  ok(found, 'التقييم ظاهر في نتايج العامة');

  console.log(`\nنجح ${pass} — فشل ${fail}`);
  process.exit(fail ? 1 : 0);
}

/* --------------------------------------------------------------------------
   ٠) القاعدة موجودة والقواعد منشورة؟
-------------------------------------------------------------------------- */
head('٠) حالة Firestore');
{
  const r = await fsReq('GET', '/reviews?pageSize=1', null);
  if (r.json?.error?.status === 'NOT_FOUND') {
    console.log('  ⛔ قاعدة البيانات نفسها مش موجودة. اعملها من الكونسول الأول.');
    process.exit(2);
  }
  ok(true, 'قاعدة البيانات موجودة');

  /* مش بنستخدم List على reviews عشان نعرف القواعد منشورة ولا لأ:
     Firestore بيرفض أي List مش مضمون إن كل نتايجه مسموحة، فبيترفض حتى
     مع القواعد الصح. بنقرأ بدالها مستند قراءته عامة صراحةً — تحت
     deny-all بيرجع 403، وتحت قواعدنا بيرجع 404 (مسموح بس مش موجود). */
  const probe = await fsReq('GET', '/content/portfolio', null);
  if (denied(probe)) {
    console.log('\n  ⛔ القواعد الافتراضية (deny-all) لسه منشورة.');
    console.log('     انشر firestore.rules من الكونسول وشغّل السكربت تاني.');
    process.exit(3);
  }
  ok(true, `قواعدنا منشورة (قراءة عامة مسموحة — رد ${probe.status})`);
}

/* --------------------------------------------------------------------------
   ١) مستخدم جديد
-------------------------------------------------------------------------- */
head('١) تسجيل مستخدم');
const stamp    = Date.now().toString(36);
const email    = `e2e.${stamp}@elawaady-test.com`;
const password = `E2e#${stamp}Aa1`;
const title    = `اختبار المسار ${stamp}`;

const me = await signUp(email, password, 'مستخدم الاختبار');
ok(Boolean(me.uid), 'اتعمل حساب', me.uid);
ok(me.uid !== OWNER, 'الحساب مش حساب المالك');

{
  const r = await fsReq('PATCH', `/users/${me.uid}`, me.token, {
    fields: {
      uid: S(me.uid), email: S(email), displayName: S('مستخدم الاختبار'),
      photoURL: S(''), bio: S(''), role: S('user'), status: S('active'),
      createdAt: TS(), updatedAt: TS(), lastSeenAt: TS()
    }
  });
  ok(r.status === 200, 'اتعمل مستند المستخدم', JSON.stringify(r.json).slice(0, 200));
}

/* المستخدم ما يقدرش يرقّي نفسه */
{
  const r = await fsReq('PATCH', `/users/${me.uid}?updateMask.fieldPaths=role`, me.token,
    { fields: { role: S('owner') } });
  ok(denied(r), 'المستخدم مش قادر يرقّي نفسه لـowner');
}

/* --------------------------------------------------------------------------
   ٢) تقييم pending
-------------------------------------------------------------------------- */
head('٢) إضافة تقييم');
const reviewId = `e2e_${stamp}`;
const reviewBody = {
  fields: {
    uid: S(me.uid), authorName: S('مستخدم الاختبار'), authorPhoto: S(''),
    rating: I(5), title: S(title),
    body: S('اتعاملت معاه في صفقة ضمان وكل خطوة كانت موثقة، والفلوس وصلت في وقتها من غير أي تأخير.'),
    dealType: S('guarantee'), status: S('pending'), featured: B(false),
    imageCount: I(0), images: ARR([]), createdAt: TS(), updatedAt: TS()
  }
};
{
  const r = await fsReq('PATCH', `/reviews/${reviewId}`, me.token, reviewBody);
  ok(r.status === 200, 'اتعمل التقييم بحالة pending', JSON.stringify(r.json).slice(0, 200));
}

/* محاولات ممنوعة */
{
  const r = await fsReq('PATCH', `/reviews/${reviewId}?updateMask.fieldPaths=status`, me.token,
    { fields: { status: S('approved') } });
  ok(denied(r), 'المستخدم مش قادر يعتمد تقييمه بنفسه');
}
{
  const r = await fsReq('PATCH', `/reviews/${reviewId}?updateMask.fieldPaths=featured`, me.token,
    { fields: { featured: B(true) } });
  ok(denied(r), 'المستخدم مش قادر يعمل featured');
}
{
  const r = await fsReq('PATCH', `/reviews/${reviewId}?updateMask.fieldPaths=moderatedBy`, me.token,
    { fields: { moderatedBy: S(me.uid) } });
  ok(denied(r), 'المستخدم مش قادر يكتب moderatedBy');
}
{
  const r = await fsReq('PATCH', `/reviews/${stamp}_video`, me.token, {
    fields: { ...reviewBody.fields, hasVideo: B(true), video: S('https://x/y.mp4') }
  });
  ok(denied(r), 'حقول الفيديو مرفوضة من السيرفر');
}
{
  const r = await fsReq('PATCH', `/reviews/${stamp}_spoof`, me.token, {
    fields: { ...reviewBody.fields, uid: S(OWNER) }
  });
  ok(denied(r), 'مش قادر ينسب تقييم للمالك');
}

/* --------------------------------------------------------------------------
   ٣) صور الإثبات — مستندات review_media بمخطط Cloudinary
-------------------------------------------------------------------------- */
head('٣) صور الإثبات');
const shots = [1, 2].map(n => ({
  url: `https://res.cloudinary.com/demo/image/upload/v1/reviews/${me.uid}/${reviewId}/proof-${n}.jpg`,
  publicId: `reviews/${me.uid}/${reviewId}/proof-${n}`,
  mime: 'image/jpeg', bytes: 180000 + n
}));

const mediaIds = [];
for (const [i, s] of shots.entries()) {
  const r = await fsReq('POST', `/review_media?documentId=${reviewId}_m${i}`, me.token, {
    fields: {
      url: S(s.url), publicId: S(s.publicId), mime: S(s.mime), bytes: I(s.bytes),
      uid: S(me.uid), reviewId: S(reviewId), createdAt: TS()
    }
  });
  ok(r.status === 200, `اتسجلت صورة ${i + 1}`, JSON.stringify(r.json).slice(0, 200));
  if (r.status === 200) mediaIds.push(`${reviewId}_m${i}`);
}

/* حقل زيادة مرفوض */
{
  const r = await fsReq('POST', `/review_media?documentId=${reviewId}_extra`, me.token, {
    fields: {
      url: S(shots[0].url), publicId: S(shots[0].publicId), mime: S('image/jpeg'),
      bytes: I(1000), uid: S(me.uid), reviewId: S(reviewId), createdAt: TS(),
      status: S('approved')
    }
  });
  ok(denied(r), 'أي حقل زيادة في مستند الصورة مرفوض');
}
/* نوع فيديو مرفوض */
{
  const r = await fsReq('POST', `/review_media?documentId=${reviewId}_mp4`, me.token, {
    fields: {
      url: S('https://res.cloudinary.com/demo/video/upload/v1/a.mp4'),
      publicId: S('a'), mime: S('video/mp4'), bytes: I(1000),
      uid: S(me.uid), reviewId: S(reviewId), createdAt: TS()
    }
  });
  ok(denied(r), 'mime فيديو مرفوض');
}
/* أكبر من ٥ ميجا مرفوض */
{
  const r = await fsReq('POST', `/review_media?documentId=${reviewId}_big`, me.token, {
    fields: {
      url: S(shots[0].url), publicId: S('big'), mime: S('image/jpeg'),
      bytes: I(6 * 1024 * 1024), uid: S(me.uid), reviewId: S(reviewId), createdAt: TS()
    }
  });
  ok(denied(r), 'صورة أكبر من ٥ ميجا مرفوضة');
}

/* ربط الصور بالتقييم */
{
  const r = await fsReq('PATCH',
    `/reviews/${reviewId}?updateMask.fieldPaths=images&updateMask.fieldPaths=imageCount&updateMask.fieldPaths=updatedAt`,
    me.token, {
      fields: {
        imageCount: I(shots.length),
        images: ARR(shots.map(s => MAP({
          url: S(s.url), publicId: S(s.publicId), mime: S(s.mime), bytes: I(s.bytes)
        }))),
        updatedAt: TS()
      }
    });
  ok(r.status === 200, 'الصور اتربطت بالتقييم', JSON.stringify(r.json).slice(0, 200));
}

/* --------------------------------------------------------------------------
   ٤) الزائر مايشوفش حاجة وهو pending
-------------------------------------------------------------------------- */
head('٤) الزائر والتقييم المعلّق');
{
  const r = await fsReq('GET', `/reviews/${reviewId}`, null);
  ok(denied(r), 'الزائر مش قادر يقرأ تقييم pending');
}
{
  const r = await fsReq('GET', `/review_media/${mediaIds[0]}`, null);
  ok(denied(r), 'الزائر مش قادر يقرأ صور تقييم pending');
}
{
  const r = await fsReq('GET', `/reviews/${reviewId}`, me.token);
  ok(r.status === 200, 'صاحب التقييم بيشوف تقييمه المعلّق');
}

/* مستخدم تاني مايشوفش */
const other = await signUp(`e2e.o.${stamp}@elawaady-test.com`, `E2e#o${stamp}Aa1`, 'مستخدم تاني');
{
  const r = await fsReq('GET', `/reviews/${reviewId}`, other.token);
  ok(denied(r), 'مستخدم تاني مش قادر يقرأ التقييم المعلّق');
}
{
  const r = await fsReq('PATCH', `/reviews/${reviewId}?updateMask.fieldPaths=body`, other.token,
    { fields: { body: S('تعديل من حد تاني على تقييم مش بتاعه، المفروض يترفض تمامًا.') } });
  ok(denied(r), 'مستخدم تاني مش قادر يعدّل التقييم');
}
{
  const r = await fsReq('DELETE', `/reviews/${reviewId}`, other.token);
  ok(denied(r), 'مستخدم تاني مش قادر يمسح التقييم');
}

/* --------------------------------------------------------------------------
   ٤ب) الاستعلامات اللي اللوحة وحساب المستخدم بيعتمدوا عليها
   ------------------------------------------------------------------------
   دي الحتة اللي بتكشف الفهارس الناقصة. الاستعلام المركّب (فلتر على حقل +
   ترتيب على حقل تاني) بيحتاج فهرس، وFirestore بيرد FAILED_PRECONDITION
   ومعاه رابط إنشاء الفهرس لو مش موجود.
-------------------------------------------------------------------------- */
head('٤ب) استعلامات اللوحة وحساب المستخدم');

async function runQuery(token, structuredQuery) {
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents:runQuery`,
    { method:'POST',
      headers: { 'Content-Type':'application/json',
                 ...(token ? { Authorization:`Bearer ${token}` } : {}) },
      body: JSON.stringify({ structuredQuery }) });
  const json = await res.json().catch(() => null);
  /* runQuery بيرجّع مصفوفة. لما يفشل، الخطأ بيبقى جوّه أول عنصر فيها —
     مش على المستوى الأعلى — فلازم ندوّر في الاتنين. */
  const err  = Array.isArray(json) ? (json[0]?.error || null) : (json?.error || null);
  return { status: res.status, json, err,
           rows: Array.isArray(json) ? json.filter(r => r.document) : [] };
}

const eq = (field, value) => ({ fieldFilter: { field:{ fieldPath:field }, op:'EQUAL', value } });
const desc = (field) => [{ field:{ fieldPath:field }, direction:'DESCENDING' }];

/* حساب المستخدم: uid تصاعدي + createdAt تنازلي — ده الفهرس المطلوب */
{
  const q = await runQuery(me.token, {
    from:[{ collectionId:'reviews' }],
    where: eq('uid', S(me.uid)),
    orderBy: desc('createdAt'),
    limit: 50
  });
  const missingIndex = q.err?.status === 'FAILED_PRECONDITION';
  ok(!missingIndex && q.status === 200,
     'استعلام «تقييماتي» (uid + createdAt تنازلي) شغال',
     missingIndex ? 'الفهرس المركّب لسه مش موجود: ' + (q.err.message || '') : `HTTP ${q.status}`);
  if (!missingIndex)
    ok(q.rows.some(r => r.document.name.endsWith(`/${reviewId}`)),
       'وبيرجّع تقييم المستخدم');
}

/* الصفحة العامة: status == approved + createdAt تنازلي */
{
  const q = await runQuery(null, {
    from:[{ collectionId:'reviews' }],
    where: eq('status', S('approved')),
    orderBy: desc('createdAt'),
    limit: 50
  });
  const missingIndex = q.err?.status === 'FAILED_PRECONDITION';
  if (missingIndex){
    /* مش فشل: الواجهة بترجع للاستعلام من غير ترتيب وبترتّب في المتصفح.
       الفهرس بيخلّي الترتيب على السيرفر، وده الأحسن، بس مش شرط للتشغيل. */
    console.log('  ⚠️  فهرس (status + createdAt) لسه مش موجود — الواجهة بترتّب في المتصفح');
    const plain = await runQuery(null, {
      from:[{ collectionId:'reviews' }], where: eq('status', S('approved')), limit: 50 });
    ok(plain.status === 200 && !plain.err,
       'استعلام «تعاملات سابقة» شغال (المسار البديل)', `HTTP ${plain.status}`);
  } else {
    ok(q.status === 200, 'استعلام «تعاملات سابقة» (status + createdAt تنازلي) شغال', `HTTP ${q.status}`);
  }
}

/* اللوحة: كل التقييمات مرتبة — ترتيب على حقل واحد، مش محتاج فهرس مركّب.
   وبيترفض لغير المالك لأن الفرع الوحيد اللي ممكن يعدّي هو isOwner(). */
{
  const q = await runQuery(me.token, {
    from:[{ collectionId:'reviews' }], orderBy: desc('createdAt'), limit: 50
  });
  ok(q.status === 403 || q.err?.status === 'PERMISSION_DENIED',
     'مستخدم عادي مش قادر يجيب كل التقييمات (استعلام اللوحة)', `HTTP ${q.status}`);
}

/* لستة المستخدمين — للمالك بس */
{
  const q = await runQuery(me.token, { from:[{ collectionId:'users' }], limit: 50 });
  ok(q.status === 403 || q.err?.status === 'PERMISSION_DENIED',
     'مستخدم عادي مش قادر يجيب لستة المستخدمين', `HTTP ${q.status}`);
}

/* إعدادات الموقع ومحتواه — قراءة عامة، كتابة مرفوضة على المستخدم */
{
  const r = await fsReq('GET', '/settings/site', null);
  ok(r.status === 200 || r.status === 404, 'إعدادات الموقع قراءتها عامة', `HTTP ${r.status}`);
}
{
  const r = await fsReq('PATCH', '/settings/site?updateMask.fieldPaths=reviewsOpen',
    me.token, { fields: { reviewsOpen: B(false) } });
  ok(denied(r), 'مستخدم عادي مش قادر يقفل استقبال التقييمات');
}
{
  const r = await fsReq('PATCH', '/content/portfolio?updateMask.fieldPaths=heroTitle_ar',
    me.token, { fields: { heroTitle_ar: S('اختراق') } });
  ok(denied(r), 'مستخدم عادي مش قادر يغيّر محتوى الصفحة الرئيسية');
}
{
  const r = await fsReq('PATCH', `/users/${me.uid}?updateMask.fieldPaths=status`,
    me.token, { fields: { status: S('blocked') } });
  ok(denied(r), 'المستخدم مش قادر يغيّر حالة حسابه بنفسه');
}

/* --------------------------------------------------------------------------
   ٥) الاعتماد — محتاج المالك
-------------------------------------------------------------------------- */
head('٥) الاعتماد');
const OWNER_TOKEN = process.env.OWNER_ID_TOKEN || '';
if (!OWNER_TOKEN) {
  console.log('  ⏸  مفيش توكن للمالك. اعتمد التقييم من صفحة الإدارة، وبعدين شغّل:');
  console.log(`     node rest.mjs --verify ${reviewId}`);
} else {
  const r = await fsReq('PATCH',
    `/reviews/${reviewId}?updateMask.fieldPaths=status&updateMask.fieldPaths=updatedAt`,
    OWNER_TOKEN, { fields: { status: S('approved'), updatedAt: TS() } });
  ok(r.status === 200, 'المالك اعتمد التقييم', JSON.stringify(r.json).slice(0, 200));

  const pub = await fsReq('GET', `/reviews/${reviewId}`, null);
  ok(pub.status === 200, 'الزائر شاف التقييم بعد الاعتماد');
  const pm = await fsReq('GET', `/review_media/${mediaIds[0]}`, null);
  ok(pm.status === 200, 'الزائر شاف صور الإثبات بعد الاعتماد');
}

writeFileSync(new URL('./rest-state.json', import.meta.url), JSON.stringify({
  email, password, uid: me.uid, reviewId, title, mediaIds,
  otherEmail: `e2e.o.${stamp}@elawaady-test.com`
}, null, 2));

console.log(`\nنجح ${pass} — فشل ${fail}`);
console.log(`التقييم: ${reviewId}   العنوان: ${title}`);
console.log(`حساب الاختبار: ${email} / ${password}`);
process.exit(fail ? 1 : 0);
