/* ===========================================================================
   اختبار قواعد الأمان نفسها — مش الواجهة.
   ===========================================================================
   كل حالة هنا بتضرب على محاكي Firestore/Storage مباشرة، من غير ما تعدي على
   أي كود في app.html. يعني حتى لو حد بدّل الجافاسكريبت أو نادى الـAPI بإيده،
   النتيجة هي اللي مكتوبة تحت.
=========================================================================== */
import {
  initializeTestEnvironment, assertFails, assertSucceeds
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import {
  doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, collection,
  getDocs, query, where, serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getBytes } from 'firebase/storage';

const OWNER = 'jJPB9z2WISN7yhW1iq99H4ncfi72';
const USER  = 'user-normal-uid-0001';
const OTHER = 'user-other-uid-0002';

const results = [];
let passed = 0, failed = 0;

async function check(name, fn){
  try { await fn(); results.push(['✅', name]); passed++; }
  catch (e){ results.push(['❌', name, e.message]); failed++; }
}

const env = await initializeTestEnvironment({
  projectId: 'elawaady-rules-test',
  firestore: { host:'127.0.0.1', port:8181, rules: readFileSync('firestore.rules','utf8') },
  storage:   { host:'127.0.0.1', port:9199, rules: readFileSync('storage.rules','utf8') }
});

const ownerDb  = env.authenticatedContext(OWNER).firestore();
const userDb   = env.authenticatedContext(USER).firestore();
const otherDb  = env.authenticatedContext(OTHER).firestore();
const guestDb  = env.unauthenticatedContext().firestore();

const userSt   = env.authenticatedContext(USER).storage();
const otherSt  = env.authenticatedContext(OTHER).storage();
const guestSt  = env.unauthenticatedContext().storage();

const newReview = (uid, over = {}) => ({
  uid, authorName:'مستخدم', authorPhoto:'',
  rating:5, title:'تعامل ممتاز', body:'اتعاملت معاه وكل حاجة تمام ووصلت في وقتها.',
  dealType:'guarantee', status:'pending', featured:false,
  imageCount:0, images:[],
  createdAt: serverTimestamp(), updatedAt: serverTimestamp(), ...over
});

/* مستند صورة إثبات: الحقول السبعة اللي القواعد بتسمح بيها بالظبط */
const newMedia = (uid, reviewId, over = {}) => ({
  url:'https://res.cloudinary.com/demo/image/upload/v1/reviews/a.jpg',
  publicId:'reviews/a', mime:'image/jpeg', bytes:120000,
  uid, reviewId, createdAt: serverTimestamp(), ...over
});

const newProfile = (uid, over = {}) => ({
  uid, email:'a@b.com', displayName:'مستخدم', photoURL:'', bio:'',
  role:'user', status:'active',
  createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  lastSeenAt: serverTimestamp(), ...over
});

const bytes = (n) => new Uint8Array(n).fill(7);

/* ======================  ١ — ملفات المستخدمين  ====================== */

await check('المستخدم يعمل ملفه بدور user', () =>
  assertSucceeds(setDoc(doc(userDb,'users',USER), newProfile(USER))));

await check('المستخدم ما يقدرش يعمل ملفه بدور admin', () =>
  assertFails(setDoc(doc(otherDb,'users',OTHER), newProfile(OTHER,{ role:'admin' }))));

await check('المستخدم ما يقدرش يعمل ملفه بدور owner', () =>
  assertFails(setDoc(doc(otherDb,'users',OTHER), newProfile(OTHER,{ role:'owner' }))));

await check('المستخدم ما يقدرش يعمل ملف لحد تاني', () =>
  assertFails(setDoc(doc(userDb,'users',OTHER), newProfile(OTHER))));

await check('حقل زيادة في الملف بيترفض (رفض افتراضي على مستوى الحقل)', () =>
  assertFails(setDoc(doc(otherDb,'users',OTHER),
    newProfile(OTHER,{ isAdmin:true }))));

await check('المستخدم يعدّل اسمه وصورته ونبذته', () =>
  assertSucceeds(updateDoc(doc(userDb,'users',USER),
    { displayName:'أحمد', photoURL:'x', bio:'نبذة', updatedAt: serverTimestamp() })));

await check('المستخدم يحدّث lastSeenAt (الكود بيعملها كل دخول)', () =>
  assertSucceeds(updateDoc(doc(userDb,'users',USER),
    { lastSeenAt: serverTimestamp(), updatedAt: serverTimestamp() })));

await check('المستخدم ما يقدرش يرقّي نفسه لـ admin', () =>
  assertFails(updateDoc(doc(userDb,'users',USER), { role:'admin' })));

await check('المستخدم ما يقدرش يرقّي نفسه لـ owner', () =>
  assertFails(updateDoc(doc(userDb,'users',USER), { role:'owner' })));

await check('المستخدم ما يقدرش يغيّر status بتاعه', () =>
  assertFails(updateDoc(doc(userDb,'users',USER), { status:'banned' })));

await check('المستخدم ما يقدرش يقرا ملف مستخدم تاني', async () => {
  await env.withSecurityRulesDisabled(c =>
    setDoc(doc(c.firestore(),'users',OTHER), newProfile(OTHER)));
  await assertFails(getDoc(doc(userDb,'users',OTHER)));
});

await check('المستخدم ما يقدرش يرقّي مستخدم تاني', () =>
  assertFails(updateDoc(doc(userDb,'users',OTHER), { role:'admin' })));

await check('المستخدم ما يقدرش يمسح ملفه (التقييمات متفضلش يتيمة)', () =>
  assertFails(deleteDoc(doc(userDb,'users',USER))));

await check('المالك يقرا أي ملف مستخدم', () =>
  assertSucceeds(getDoc(doc(ownerDb,'users',USER))));

/* ======================  ٢ — إنشاء التقييمات  ====================== */

let myReviewId, otherReviewId;

await check('المستخدم يبعت تقييم pending', async () => {
  const r = await assertSucceeds(addDoc(collection(userDb,'reviews'), newReview(USER)));
  myReviewId = r.id;
});

await check('زائر غير مسجّل ما يقدرش يبعت تقييم', () =>
  assertFails(addDoc(collection(guestDb,'reviews'), newReview(USER))));

await check('ما يقدرش يبعت تقييم status=approved', () =>
  assertFails(addDoc(collection(userDb,'reviews'), newReview(USER,{ status:'approved' }))));

await check('ما يقدرش يبعت تقييم featured=true', () =>
  assertFails(addDoc(collection(userDb,'reviews'), newReview(USER,{ featured:true }))));

await check('ما يقدرش يبعت تقييم باسم حد تاني (uid مزوّر)', () =>
  assertFails(addDoc(collection(userDb,'reviews'), newReview(OTHER))));

await check('ما يقدرش يبعت تقييم ومعاه moderatedBy', () =>
  assertFails(addDoc(collection(userDb,'reviews'), newReview(USER,{ moderatedBy:OWNER }))));

await check('ما يقدرش يبعت تقييم ومعاه moderatedAt', () =>
  assertFails(addDoc(collection(userDb,'reviews'), newReview(USER,{ moderatedAt: serverTimestamp() }))));

await check('حقل زيادة في التقييم بيترفض', () =>
  assertFails(addDoc(collection(userDb,'reviews'), newReview(USER,{ adminNote:'x' }))));

await check('تقييم فيه حقل video بيترفض من الأساس', () =>
  assertFails(addDoc(collection(userDb,'reviews'), newReview(USER,{ video:{ url:'v' } }))));

await check('تقييم فيه حقل hasVideo بيترفض من الأساس', () =>
  assertFails(addDoc(collection(userDb,'reviews'), newReview(USER,{ hasVideo:true }))));

await check('تقييم بـ rating=6 بيترفض', () =>
  assertFails(addDoc(collection(userDb,'reviews'), newReview(USER,{ rating:6 }))));

await check('تقييم بـ rating=0 بيترفض', () =>
  assertFails(addDoc(collection(userDb,'reviews'), newReview(USER,{ rating:0 }))));

await check('تقييم بنص قصير جدًا بيترفض', () =>
  assertFails(addDoc(collection(userDb,'reviews'), newReview(USER,{ body:'تمام' }))));

await check('تقييم بنوع تعامل مش في القائمة بيترفض', () =>
  assertFails(addDoc(collection(userDb,'reviews'), newReview(USER,{ dealType:'hacking' }))));

await check('كل أنواع التعامل الثمانية مقبولة', async () => {
  for (const t of ['escrow','guarantee','trade','digital','transfer','project','consulting','other'])
    await assertSucceeds(addDoc(collection(userDb,'reviews'), newReview(USER,{ dealType:t })));
});

/* ======================  ٣ — قراءة التقييمات  ====================== */

await check('التقييم pending ما يظهرش لزائر', async () => {
  await assertFails(getDoc(doc(guestDb,'reviews',myReviewId)));
});

await check('التقييم pending ما يظهرش لمستخدم تاني', () =>
  assertFails(getDoc(doc(otherDb,'reviews',myReviewId))));

await check('صاحب التقييم يشوف تقييمه وهو pending', () =>
  assertSucceeds(getDoc(doc(userDb,'reviews',myReviewId))));

await check('المالك يشوف التقييم pending', () =>
  assertSucceeds(getDoc(doc(ownerDb,'reviews',myReviewId))));

await check('استعلام الزائر على المعتمد بس بيعدي', () =>
  assertSucceeds(getDocs(query(collection(guestDb,'reviews'), where('status','==','approved')))));

await check('استعلام الزائر على كل التقييمات بيترفض', () =>
  assertFails(getDocs(collection(guestDb,'reviews'))));

await check('استعلام مستخدم على تقييمات غيره المعلّقة بيترفض', () =>
  assertFails(getDocs(query(collection(otherDb,'reviews'), where('status','==','pending')))));

/* ======================  ٤ — تعديل التقييمات  ====================== */

await check('صاحب التقييم يعدّل نصه وهو pending', () =>
  assertSucceeds(updateDoc(doc(userDb,'reviews',myReviewId),
    { title:'عنوان جديد', body:'نص جديد طويل كفاية عشان يعدي الحد الأدنى.',
      updatedAt: serverTimestamp() })));

await check('صاحب التقييم يكتب روابط الصور بعد الرفع', () =>
  assertSucceeds(updateDoc(doc(userDb,'reviews',myReviewId),
    { images:[{ url:'https://res.cloudinary.com/demo/image/upload/v1/a.jpg',
                publicId:'a', mime:'image/jpeg', bytes:1000 }],
      imageCount:1, updatedAt: serverTimestamp() })));

await check('حقل فيديو على تقييم بيترفض (الفيديو اتشال خالص)', () =>
  assertFails(updateDoc(doc(userDb,'reviews',myReviewId),
    { video:{ url:'v' }, updatedAt: serverTimestamp() })));

await check('حقل hasVideo على تقييم بيترفض', () =>
  assertFails(updateDoc(doc(userDb,'reviews',myReviewId),
    { hasVideo:true, updatedAt: serverTimestamp() })));

await check('صاحب التقييم ما يقدرش يعتمد تقييمه بنفسه', () =>
  assertFails(updateDoc(doc(userDb,'reviews',myReviewId), { status:'approved' })));

await check('صاحب التقييم ما يقدرش يخلي تقييمه featured', () =>
  assertFails(updateDoc(doc(userDb,'reviews',myReviewId), { featured:true })));

await check('صاحب التقييم ما يقدرش يكتب moderatedBy', () =>
  assertFails(updateDoc(doc(userDb,'reviews',myReviewId), { moderatedBy:USER })));

await check('صاحب التقييم ما يقدرش يكتب moderatedAt', () =>
  assertFails(updateDoc(doc(userDb,'reviews',myReviewId), { moderatedAt: serverTimestamp() })));

await check('صاحب التقييم ما يقدرش يغيّر uid بتاعه', () =>
  assertFails(updateDoc(doc(userDb,'reviews',myReviewId), { uid:OTHER })));

await check('مستخدم تاني ما يقدرش يعدّل تقييم مش بتاعه', () =>
  assertFails(updateDoc(doc(otherDb,'reviews',myReviewId), { title:'اختراق' })));

await check('مستخدم تاني ما يقدرش يمسح تقييم مش بتاعه', () =>
  assertFails(deleteDoc(doc(otherDb,'reviews',myReviewId))));

await check('المالك يعتمد التقييم', () =>
  assertSucceeds(updateDoc(doc(ownerDb,'reviews',myReviewId),
    { status:'approved', moderatedBy:OWNER, moderatedAt: serverTimestamp(),
      updatedAt: serverTimestamp() })));

await check('بعد الاعتماد الزائر يشوف التقييم', () =>
  assertSucceeds(getDoc(doc(guestDb,'reviews',myReviewId))));

await check('بعد الاعتماد صاحبه ما يقدرش يعدّله', () =>
  assertFails(updateDoc(doc(userDb,'reviews',myReviewId), { title:'تعديل بعد النشر' })));

await check('بعد الاعتماد صاحبه ما يقدرش يمسحه', () =>
  assertFails(deleteDoc(doc(userDb,'reviews',myReviewId))));

await check('المالك يميّز التقييم', () =>
  assertSucceeds(updateDoc(doc(ownerDb,'reviews',myReviewId), { featured:true })));

await check('صاحب التقييم يسحب تقييمه وهو لسه pending', async () => {
  const r = await addDoc(collection(userDb,'reviews'), newReview(USER));
  await assertSucceeds(deleteDoc(doc(userDb,'reviews',r.id)));
});

/* ==============  ٥ — صور الإثبات (review_media)  ============== */
/* الصورة نفسها بتترفع على Cloudinary، لكن اللي بيتخزن هنا في Firestore هو
   بياناتها — والقواعد بتحصر الحقول وبتربط الصورة بصاحب التقييم. */

let pendingId, mediaId;

await check('تقييم جديد pending عشان نعلّق عليه الصور', async () => {
  const r = await assertSucceeds(addDoc(collection(userDb,'reviews'), newReview(USER)));
  pendingId = r.id;
});

await check('صاحب التقييم يسجّل صورة إثبات', async () => {
  const m = await assertSucceeds(
    addDoc(collection(userDb,'review_media'), newMedia(USER, pendingId)));
  mediaId = m.id;
});

await check('حقل زيادة في مستند الصورة بيترفض', () =>
  assertFails(addDoc(collection(userDb,'review_media'),
    newMedia(USER, pendingId, { adminNote:'x' }))));

await check('مستند صورة من غير publicId بيترفض', async () => {
  const m = newMedia(USER, pendingId); delete m.publicId;
  await assertFails(addDoc(collection(userDb,'review_media'), m));
});

await check('رابط صورة مش https بيترفض', () =>
  assertFails(addDoc(collection(userDb,'review_media'),
    newMedia(USER, pendingId, { url:'http://res.cloudinary.com/x.jpg' }))));

await check('نوع فيديو في مستند الصورة بيترفض', () =>
  assertFails(addDoc(collection(userDb,'review_media'),
    newMedia(USER, pendingId, { mime:'video/mp4' }))));

await check('نوع SVG بيترفض', () =>
  assertFails(addDoc(collection(userDb,'review_media'),
    newMedia(USER, pendingId, { mime:'image/svg+xml' }))));

await check('صورة أكبر من ٥ ميجا بترفض', () =>
  assertFails(addDoc(collection(userDb,'review_media'),
    newMedia(USER, pendingId, { bytes: 6 * 1024 * 1024 }))));

await check('مستخدم تاني ما يقدرش يعلّق صورة على تقييم مش بتاعه', () =>
  assertFails(addDoc(collection(otherDb,'review_media'), newMedia(OTHER, pendingId))));

await check('زائر ما يقدرش يسجّل صورة', () =>
  assertFails(addDoc(collection(guestDb,'review_media'), newMedia(USER, pendingId))));

await check('صورة تقييم pending ما تظهرش لزائر', () =>
  assertFails(getDoc(doc(guestDb,'review_media',mediaId))));

await check('صورة تقييم pending ما تظهرش لمستخدم تاني', () =>
  assertFails(getDoc(doc(otherDb,'review_media',mediaId))));

await check('صاحبها يشوف صورته وهي pending', () =>
  assertSucceeds(getDoc(doc(userDb,'review_media',mediaId))));

await check('المالك يشوف الصورة وهي pending', () =>
  assertSucceeds(getDoc(doc(ownerDb,'review_media',mediaId))));

await check('صاحب الصورة ما يقدرش يعدّل رابطها بعد التسجيل', () =>
  assertFails(updateDoc(doc(userDb,'review_media',mediaId), { url:'https://evil.example/x.jpg' })));

await check('بعد اعتماد التقييم الزائر يشوف الصورة', async () => {
  await assertSucceeds(updateDoc(doc(ownerDb,'reviews',pendingId),
    { status:'approved', moderatedBy:OWNER, moderatedAt: serverTimestamp() }));
  await assertSucceeds(getDoc(doc(guestDb,'review_media',mediaId)));
});

/* ======================  ٦ — الروابط  ====================== */

const link = (over = {}) => ({
  title:'قناة رسمية', platform:'telegram', url:'https://t.me/elawaadyofficial',
  type:'official', order:1, visible:true, ...over
});

await check('المالك يضيف رابط', () =>
  assertSucceeds(setDoc(doc(ownerDb,'links','lnk-1'), link())));

await check('الزائر يقرا الروابط', () =>
  assertSucceeds(getDocs(collection(guestDb,'links'))));

await check('المستخدم العادي ما يقدرش يضيف رابط', () =>
  assertFails(setDoc(doc(userDb,'links','lnk-2'), link())));

await check('المستخدم العادي ما يقدرش يعدّل رابط', () =>
  assertFails(updateDoc(doc(userDb,'links','lnk-1'), { url:'https://evil.example' })));

await check('المستخدم العادي ما يقدرش يخفي رابط', () =>
  assertFails(updateDoc(doc(userDb,'links','lnk-1'), { visible:false })));

await check('المستخدم العادي ما يقدرش يمسح رابط', () =>
  assertFails(deleteDoc(doc(userDb,'links','lnk-1'))));

await check('رابط javascript: بيترفض حتى من المالك', () =>
  assertFails(setDoc(doc(ownerDb,'links','lnk-bad'),
    link({ url:'javascript:alert(1)' }))));

await check('رابط بنوع مش في القائمة بيترفض', () =>
  assertFails(setDoc(doc(ownerDb,'links','lnk-bad2'), link({ type:'discord' }))));

await check('رابط من غير عنوان بيترفض', () =>
  assertFails(setDoc(doc(ownerDb,'links','lnk-bad3'), link({ title:'' }))));

await check('المالك يعيد ترتيب الروابط', () =>
  assertSucceeds(updateDoc(doc(ownerDb,'links','lnk-1'), { order:5 })));

/* ======================  ٧ — محتوى الموقع والإعدادات  ====================== */

await check('الزائر يقرا المحتوى المنشور', () =>
  assertSucceeds(getDoc(doc(guestDb,'content','portfolio'))));

await check('المستخدم ما يقدرش يكتب محتوى الموقع', () =>
  assertFails(setDoc(doc(userDb,'content','portfolio'), { x:1 })));

await check('المستخدم ما يقدرش يقرا المسودة', () =>
  assertFails(getDoc(doc(userDb,'content','draft'))));

await check('المستخدم ما يقدرش يكتب في settings', () =>
  assertFails(setDoc(doc(userDb,'settings','site'), { x:1 })));

await check('المستخدم ما يقدرش يكتب في sections', () =>
  assertFails(setDoc(doc(userDb,'sections','about'), { x:1 })));

/* ======================  ٨ — الرفض الافتراضي  ====================== */

await check('مجموعة مش مذكورة في القواعد: القراءة مرفوضة', () =>
  assertFails(getDoc(doc(guestDb,'anything','x'))));

await check('مجموعة مش مذكورة في القواعد: الكتابة مرفوضة حتى من المالك', () =>
  assertFails(setDoc(doc(ownerDb,'anything','x'), { a:1 })));

await check('مجموعة admins مش موجودة أصلًا — الكتابة مرفوضة', () =>
  assertFails(setDoc(doc(userDb,'admins',USER), { role:'admin' })));

/* ======================  ٩ — Storage مقفول  ======================
   مفيش حاجة في التطبيق بترفع على Firebase Storage خلاص — الصور بتروح
   Cloudinary. القواعد لازم ترفض كل مسار ما عدا مجلد المالك. */

const p = (uid, name) => `reviews/${uid}/rev1/${name}`;

await check('رفع صورة إثبات على Storage بيترفض', () =>
  assertFails(uploadBytes(ref(userSt, p(USER,'a.jpg')), bytes(1024),
    { contentType:'image/jpeg' })));

await check('رفع فيديو MP4 بيترفض', () =>
  assertFails(uploadBytes(ref(userSt, p(USER,'v.mp4')), bytes(2048),
    { contentType:'video/mp4' })));

await check('رفع فيديو WebM بيترفض', () =>
  assertFails(uploadBytes(ref(userSt, p(USER,'v.webm')), bytes(2048),
    { contentType:'video/webm' })));

await check('رفع ملف PDF بيترفض', () =>
  assertFails(uploadBytes(ref(userSt, p(USER,'x.pdf')), bytes(1024),
    { contentType:'application/pdf' })));

await check('رفع ملف تنفيذي بيترفض', () =>
  assertFails(uploadBytes(ref(userSt, p(USER,'x.exe')), bytes(1024),
    { contentType:'application/x-msdownload' })));

await check('رفع SVG بيترفض', () =>
  assertFails(uploadBytes(ref(userSt, p(USER,'x.svg')), bytes(512),
    { contentType:'image/svg+xml' })));

await check('رفع صورة بروفايل على Storage بيترفض', () =>
  assertFails(uploadBytes(ref(userSt,`avatars/${USER}/me.jpg`), bytes(1024),
    { contentType:'image/jpeg' })));

await check('زائر غير مسجّل ما يقدرش يرفع', () =>
  assertFails(uploadBytes(ref(guestSt, p(USER,'guest.jpg')), bytes(1024),
    { contentType:'image/jpeg' })));

await check('مستخدم تاني ما يقدرش يرفع تحت مجلد غيره', () =>
  assertFails(uploadBytes(ref(otherSt, p(USER,'sneak.jpg')), bytes(1024),
    { contentType:'image/jpeg' })));

await check('المستخدم ما يقدرش يرفع في مسار مش معرّف', () =>
  assertFails(uploadBytes(ref(userSt,'backups/dump.jpg'), bytes(1024),
    { contentType:'image/jpeg' })));

await check('المستخدم ما يقدرش يرفع في مجلد الموقع site/', () =>
  assertFails(uploadBytes(ref(userSt,'site/hero.jpg'), bytes(1024),
    { contentType:'image/jpeg' })));


/* ==============  حدود صلاحية المالك نفسه  ==============
   المالك بيراجع، مش بيعيد كتابة كلام الناس. الحالات دي بتثبت إن حتى هو
   محدود بالقواعد، وإن حالات التقييم الأربعة كلها معروفة. */

let modId;
await env.withSecurityRulesDisabled(async (ctx) => {
  const d = doc(ctx.firestore(), 'reviews', 'mod-limits-review');
  await setDoc(d, newReview(USER));
  modId = 'mod-limits-review';
});

await check('المالك يرفض تقييم', () =>
  assertSucceeds(updateDoc(doc(ownerDb,'reviews',modId),
    { status:'rejected', moderatedBy:OWNER, moderatedAt: serverTimestamp(), updatedAt: serverTimestamp() })));

await check('التقييم المرفوض ما يظهرش لزائر', () =>
  assertFails(getDoc(doc(guestDb,'reviews',modId))));

await check('صاحب التقييم بيشوف تقييمه المرفوض', () =>
  assertSucceeds(getDoc(doc(userDb,'reviews',modId))));

await check('المالك يخفي تقييم', () =>
  assertSucceeds(updateDoc(doc(ownerDb,'reviews',modId),
    { status:'hidden', moderatedBy:OWNER, moderatedAt: serverTimestamp(), updatedAt: serverTimestamp() })));

await check('التقييم المخفي ما يظهرش لزائر', () =>
  assertFails(getDoc(doc(guestDb,'reviews',modId))));

await check('المالك يثبّت تقييم', () =>
  assertSucceeds(updateDoc(doc(ownerDb,'reviews',modId), { featured:true, updatedAt: serverTimestamp() })));

await check('المالك يلغي التثبيت', () =>
  assertSucceeds(updateDoc(doc(ownerDb,'reviews',modId), { featured:false, updatedAt: serverTimestamp() })));

await check('المالك ما يقدرش يحط حالة مش من الأربعة', () =>
  assertFails(updateDoc(doc(ownerDb,'reviews',modId), { status:'published', updatedAt: serverTimestamp() })));

await check('المالك ما يقدرش يعيد كتابة نص التقييم', () =>
  assertFails(updateDoc(doc(ownerDb,'reviews',modId), { body:'كلام أنا كتبته بدل صاحبه.' })));

await check('المالك ما يقدرش يغيّر نجوم التقييم', () =>
  assertFails(updateDoc(doc(ownerDb,'reviews',modId), { rating:1 })));

await check('المالك ما يقدرش يغيّر عنوان التقييم', () =>
  assertFails(updateDoc(doc(ownerDb,'reviews',modId), { title:'عنوان من عندي' })));

await check('المالك ما يقدرش ينسب التقييم لحد تاني', () =>
  assertFails(updateDoc(doc(ownerDb,'reviews',modId), { uid:OTHER, updatedAt: serverTimestamp() })));

await check('المالك ما يقدرش يزوّد صور على تقييم غيره', () =>
  assertFails(updateDoc(doc(ownerDb,'reviews',modId),
    { images:[{ url:'https://x/y.jpg', publicId:'p', mime:'image/jpeg', bytes:10 }], updatedAt: serverTimestamp() })));

await check('المالك ما يقدرش يكتب moderatedBy باسم حد تاني', () =>
  assertFails(updateDoc(doc(ownerDb,'reviews',modId),
    { status:'approved', moderatedBy:OTHER, moderatedAt: serverTimestamp(), updatedAt: serverTimestamp() })));

/* ==============  المالك وإدارة المستخدمين  ============== */

await check('المالك يوقف حساب', () =>
  assertSucceeds(updateDoc(doc(ownerDb,'users',USER), { status:'blocked', updatedAt: serverTimestamp() })));

await check('المالك يرجّع الحساب نشط', () =>
  assertSucceeds(updateDoc(doc(ownerDb,'users',USER), { status:'active', updatedAt: serverTimestamp() })));

await check('المالك ما يقدرش يحط حالة حساب مخترعة', () =>
  assertFails(updateDoc(doc(ownerDb,'users',USER), { status:'vip', updatedAt: serverTimestamp() })));

await check('المالك ما يقدرش يغيّر اسم المستخدم', () =>
  assertFails(updateDoc(doc(ownerDb,'users',USER), { displayName:'اسم من عندي' })));

await check('المالك ما يقدرش يرقّي حساب لدور تاني', () =>
  assertFails(updateDoc(doc(ownerDb,'users',USER), { role:'owner', updatedAt: serverTimestamp() })));

await check('المالك ما يقدرش يغيّر إيميل المستخدم', () =>
  assertFails(updateDoc(doc(ownerDb,'users',USER), { email:'me@example.com', updatedAt: serverTimestamp() })));

await check('المالك بيقرا لستة المستخدمين', () =>
  assertSucceeds(getDocs(collection(ownerDb,'users'))));

await check('المستخدم ما يقدرش يقرا لستة المستخدمين', () =>
  assertFails(getDocs(collection(userDb,'users'))));

await check('الزائر ما يقدرش يقرا لستة المستخدمين', () =>
  assertFails(getDocs(collection(guestDb,'users'))));

/* ==============  إعدادات الموقع ومحتواه  ============== */

await check('المالك يحفظ إعدادات الموقع', () =>
  assertSucceeds(setDoc(doc(ownerDb,'settings','site'),
    { whatsapp:'201055578777', reviewsOpen:true, updatedAt: serverTimestamp() }, { merge:true })));

await check('الزائر يقرا إعدادات الموقع', () =>
  assertSucceeds(getDoc(doc(guestDb,'settings','site'))));

await check('المستخدم ما يقدرش يقفل استقبال التقييمات', () =>
  assertFails(setDoc(doc(userDb,'settings','site'), { reviewsOpen:false }, { merge:true })));

await check('المالك يحفظ محتوى البورتفوليو', () =>
  assertSucceeds(setDoc(doc(ownerDb,'content','portfolio'),
    { heroTitle_ar:'أحوّل الأفكار', heroTitle_en:'I turn ideas', updatedAt: serverTimestamp() }, { merge:true })));

await check('الزائر يقرا محتوى البورتفوليو', () =>
  assertSucceeds(getDoc(doc(guestDb,'content','portfolio'))));


/* ======================  التقرير  ====================== */

await env.cleanup();

console.log('\n================  نتيجة اختبار قواعد الأمان  ================\n');
for (const [mark, name, err] of results){
  console.log(`${mark}  ${name}${err ? `\n      ${err.split('\n')[0]}` : ''}`);
}
console.log(`\n----------------------------------------------------------`);
console.log(`نجح ${passed} من ${passed + failed}${failed ? `  —  فشل ${failed}` : '  —  كله عدّى'}`);
process.exit(failed ? 1 : 0);
