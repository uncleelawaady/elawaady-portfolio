/* ===========================================================================
   محتوى البورتفوليو
   ===========================================================================
   content/portfolio   النسخة المنشورة — الموقع العام بيقراها
   content/draft       المسودة اللي بتشتغل عليها
   content_versions/   تاريخ النشر، للرجوع لأي نسخة قديمة

   المحتوى كله في وثيقة واحدة عشان الصفحة تتحمّل بقراءة واحدة. الأنواع
   (projects / experience / services / skills / education) متحطوطة كمصفوفات
   منفصلة جوّه الوثيقة — كل واحدة فيهم تقدر تتنقل لمجموعة مستقلة بعدين من
   غير ما شكل بقية النظام يتغير، لأن كل حاجة بتعدي من الدوال اللي هنا.
=========================================================================== */

import {
  db, doc, collection, getDoc, getDocs, setDoc, addDoc, deleteDoc,
  query, orderBy, limit, serverTimestamp, configured
} from './firebase.js';
import { getUser } from './auth.js';

const PUBLISHED = () => doc(db, 'content', 'portfolio');
const DRAFT     = () => doc(db, 'content', 'draft');

/* الأقسام اللي المحتوى بيتقسم عليها. الترتيب ده هو اللي بيظهر في اللوحة. */
export const CONTENT_SECTIONS = [
  'meta', 'hero', 'ticker', 'stats', 'about',
  'expertise', 'projects', 'experience', 'services', 'skills', 'education',
  'builds', 'caseStudy', 'journey', 'communities', 'network', 'approach', 'vision'
];

/* الشكل الأساسي — بيضمن إن أي قسم جديد بيتضاف مش هيكسر صفحة قديمة */
export function normalise(data) {
  const base = window.SITE_CONTENT || {};
  const out  = { ...base, ...(data || {}) };
  for (const key of ['projects', 'experience', 'services', 'skills', 'education']) {
    if (!Array.isArray(out[key])) out[key] = [];
  }
  return out;
}

/* ---------------------------------------------------------------------------
   القراءة
--------------------------------------------------------------------------- */

/* الموقع العام. بيرجّع null لو مفيش نسخة منشورة، والصفحة ساعتها بتشتغل
   بـcontent.js المحلي — عشان الموقع ميقفش لو Firebase وقع. */
export async function getPublished() {
  if (!configured) return null;
  try {
    const snap = await getDoc(PUBLISHED());
    if (!snap.exists()) return null;
    const data = snap.data();
    return (data && data.content && Object.keys(data.content).length) ? data.content : null;
  } catch (e) {
    console.warn('تعذّر تحميل المحتوى المنشور:', e.message);
    return null;
  }
}

/* المسودة — للمالك بس. لو مفيش مسودة بنبدأ من المنشور، ولو مفيش منشور
   بنبدأ من الملف المحلي. */
export async function getDraft() {
  const snap = await getDoc(DRAFT());
  if (snap.exists() && snap.data().content) return normalise(snap.data().content);

  const published = await getPublished();
  return normalise(published);
}

/* ---------------------------------------------------------------------------
   الكتابة
--------------------------------------------------------------------------- */
export async function saveDraft(content) {
  const user = getUser();
  await setDoc(DRAFT(), {
    content,
    updatedAt: serverTimestamp(),
    updatedBy: user ? user.uid : null
  });
}

/* النشر: بيكتب نسخة في التاريخ الأول، وبعدين بينشر.
   لو النشر فشل بعد ما النسخة اتكتبت، بتبقى عندك نسخة زيادة — وده أحسن
   من العكس. */
export async function publish(content, note = '') {
  const user = getUser();

  await addDoc(collection(db, 'content_versions'), {
    content,
    note,
    publishedAt: serverTimestamp(),
    publishedBy: user ? user.uid : null
  });

  await setDoc(PUBLISHED(), {
    content,
    updatedAt: serverTimestamp(),
    updatedBy: user ? user.uid : null
  });

  await saveDraft(content);
}

/* ---------------------------------------------------------------------------
   تاريخ النسخ
--------------------------------------------------------------------------- */
export async function listVersions(max = 30) {
  const q = query(collection(db, 'content_versions'), orderBy('publishedAt', 'desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({
    id: d.id,
    note: d.data().note || '',
    publishedAt: d.data().publishedAt,
    /* المحتوى نفسه مش بيترجع في القائمة — الوثيقة كبيرة والقائمة بتتحمّل
       كل مرة تفتح فيها التاريخ */
    size: JSON.stringify(d.data().content || {}).length
  }));
}

export async function getVersion(id) {
  const snap = await getDoc(doc(db, 'content_versions', id));
  return snap.exists() ? normalise(snap.data().content) : null;
}

/* الرجوع لنسخة قديمة بينشرها من جديد — فالتاريخ بيفضل خط واحد للأمام،
   ومفيش نسخة بتتمسح. */
export async function restoreVersion(id) {
  const content = await getVersion(id);
  if (!content) throw new Error('النسخة دي مش موجودة.');
  await publish(content, `رجوع لنسخة ${id}`);
  return content;
}

export const deleteVersion = (id) => deleteDoc(doc(db, 'content_versions', id));

/* ---------------------------------------------------------------------------
   التصدير
--------------------------------------------------------------------------- */
export function download(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
