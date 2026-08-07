/* ===========================================================================
   التقييمات
   ===========================================================================
   الحالات: pending → approved / rejected / hidden

   كل تقييم جديد بيدخل pending. الكود ده مش بيبعت status خالص عند الإنشاء —
   بيبعتها 'pending' صراحةً عشان القاعدة تتأكد منها، والقاعدة بترفض أي قيمة
   تانية. يعني حتى لو حد بعت الطلب بإيده، مش هيقدر ينشر لنفسه.
=========================================================================== */

import {
  db, collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp
} from './firebase.js';
import { getUser, getProfile } from './auth.js';
import { uploadReviewImage, compress, thumbnail } from './media.js';

export const DEAL_TYPES = [
  { id: 'escrow',     ar: 'وساطة',              en: 'Escrow' },
  { id: 'trade',      ar: 'بيع أو شراء',        en: 'Buying / selling' },
  { id: 'digital',    ar: 'خدمات رقمية',        en: 'Digital services' },
  { id: 'project',    ar: 'تعاون أو مشروع',     en: 'Collaboration / project' },
  { id: 'consulting', ar: 'استشارة',            en: 'Consulting' },
  { id: 'other',      ar: 'أخرى',               en: 'Other' }
];

export const dealLabel = (id, lang = 'ar') =>
  (DEAL_TYPES.find(d => d.id === id) || DEAL_TYPES[5])[lang];

const reviewsCol = () => collection(db, 'reviews');
const rows = (snap) => snap.docs.map(d => ({ id: d.id, ...d.data() }));

/* ---------------------------------------------------------------------------
   القراءة
--------------------------------------------------------------------------- */

/* الصفحة العامة. القاعدة كمان بتمنع أي حاجة غير approved، فده فلتر
   للأداء مش للأمان. */
export async function listApproved(max = 60) {
  const q = query(reviewsCol(), where('status', '==', 'approved'),
                  orderBy('createdAt', 'desc'), limit(max));
  return rows(await getDocs(q));
}

export async function listMine() {
  const user = getUser();
  if (!user) return [];
  const q = query(reviewsCol(), where('uid', '==', user.uid), orderBy('createdAt', 'desc'));
  return rows(await getDocs(q));
}

/* للوحة الإدارة. القواعد بتسمح بده للمالك بس. */
export async function listAll() {
  return rows(await getDocs(query(reviewsCol(), orderBy('createdAt', 'desc'))));
}

export async function getReview(id) {
  const snap = await getDoc(doc(db, 'reviews', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/* ---------------------------------------------------------------------------
   الإرسال
   ---------------------------------------------------------------------------
   الترتيب: التقييم بيتعمل الأول، وبعدين الصور بترفع تحت مساره.
   لو الرفع فشل في النص، التقييم بيفضل موجود بالصور اللي نجحت — أحسن من
   إننا نفقد اللي المستخدم كتبه.
--------------------------------------------------------------------------- */
export async function submitReview({ rating, title, body, dealType, images = [] }, onProgress) {
  const user = getUser();
  if (!user) throw new Error('لازم تسجّل دخول الأول.');

  const profile = getProfile() || {};

  const created = await addDoc(reviewsCol(), {
    uid:         user.uid,
    authorName:  profile.displayName || user.displayName || 'مستخدم',
    authorPhoto: profile.photoURL || user.photoURL || '',
    rating:      Number(rating),
    title:       String(title || '').trim(),
    body:        String(body || '').trim(),
    dealType:    dealType || 'other',
    status:      'pending',        // القاعدة بتتأكد من دي
    featured:    false,
    imageCount:  images.length,
    images:      [],
    createdAt:   serverTimestamp(),
    updatedAt:   serverTimestamp()
  });

  if (!images.length) return created.id;

  const uploaded = [];
  for (let i = 0; i < images.length; i++) {
    onProgress && onProgress(i + 1, images.length);
    const blob  = images[i].blob;
    const thumb = await thumbnail(URL.createObjectURL(blob));
    const meta  = await uploadReviewImage(user.uid, created.id, blob, { thumb });
    uploaded.push(meta);

    await addDoc(collection(db, 'review_media'), {
      reviewId:  created.id,
      uid:       user.uid,
      url:       meta.url,
      thumbUrl:  meta.thumbUrl,
      path:      meta.path,
      thumbPath: meta.thumbPath,
      bytes:     meta.bytes,
      mime:      'image/jpeg',
      createdAt: serverTimestamp()
    });
  }

  /* الروابط متسجلة على التقييم نفسه كمان، عشان عرض التقييم يبقى قراءة
     واحدة من غير ما ندور في مجموعة تانية. */
  await updateDoc(doc(db, 'reviews', created.id), {
    images: uploaded.map(u => ({ url: u.url, thumbUrl: u.thumbUrl })),
    updatedAt: serverTimestamp()
  });

  return created.id;
}

/* صاحب التقييم يقدر يسحبه طالما لسه مستني مراجعة */
export const withdrawMine = (id) => deleteDoc(doc(db, 'reviews', id));

/* ---------------------------------------------------------------------------
   المراجعة — للمالك بس (القواعد بتفرض ده)
--------------------------------------------------------------------------- */
async function moderate(id, status) {
  const user = getUser();
  await updateDoc(doc(db, 'reviews', id), {
    status,
    moderatedBy: user ? user.uid : null,
    moderatedAt: serverTimestamp(),
    updatedAt:   serverTimestamp()
  });
}

export const approve = (id) => moderate(id, 'approved');
export const reject  = (id) => moderate(id, 'rejected');
export const hide    = (id) => moderate(id, 'hidden');

export const setFeatured = (id, featured) =>
  updateDoc(doc(db, 'reviews', id), { featured: Boolean(featured), updatedAt: serverTimestamp() });

export const removeReview = (id) => deleteDoc(doc(db, 'reviews', id));

/* ---------------------------------------------------------------------------
   ملخص
--------------------------------------------------------------------------- */
export function summarise(list) {
  const approved = list.filter(r => r.status === 'approved');
  if (!approved.length) return { count: 0, average: 0, breakdown: [0, 0, 0, 0, 0] };

  const breakdown = [0, 0, 0, 0, 0];
  let total = 0;
  for (const r of approved) {
    total += r.rating;
    breakdown[r.rating - 1]++;
  }
  return {
    count: approved.length,
    average: Math.round((total / approved.length) * 10) / 10,
    breakdown
  };
}
