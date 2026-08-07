/* ===========================================================================
   الحسابات
   ===========================================================================
   التسجيل والدخول والخروج، وملف المستخدم في Firestore.

   ملاحظة مهمة على الصلاحيات: الدالة isOwner() تحت بتستخدم عشان الواجهة
   تعرف تظهر إيه وتخفي إيه — **مش** عشان تحمي حاجة. الحماية الحقيقية في
   firestore.rules، واللي بترفض العملية نفسها حتى لو حد عدّل الكود ده.
=========================================================================== */

import {
  configured, auth, db, OWNER_UID,
  onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, GoogleAuthProvider, signInWithPopup, updateProfile, sendPasswordResetEmail,
  doc, getDoc, setDoc, updateDoc, serverTimestamp, friendlyError
} from './firebase.js';

export { friendlyError };

let currentUser    = null;
let currentProfile = null;
const listeners    = new Set();

/* ---------------------------------------------------------------------------
   ملف المستخدم
   بيتعمل مرة واحدة عند أول دخول. الدور دايمًا 'user' — والقواعد بترفض
   أي محاولة إنشاء بدور تاني، فمفيش طريقة حد يعمل لنفسه أدمن.
--------------------------------------------------------------------------- */
async function ensureProfile(user) {
  const refDoc = doc(db, 'users', user.uid);
  const snap   = await getDoc(refDoc);

  if (!snap.exists()) {
    const profile = {
      uid:         user.uid,
      email:       user.email || '',
      displayName: user.displayName || (user.email || '').split('@')[0] || 'مستخدم',
      photoURL:    user.photoURL || '',
      bio:         '',
      role:        'user',
      status:      'active',
      createdAt:   serverTimestamp(),
      updatedAt:   serverTimestamp()
    };
    await setDoc(refDoc, profile);
    return profile;
  }

  /* آخر ظهور — بيتحدّث بهدوء ومش بيوقف الدخول لو فشل */
  updateDoc(refDoc, { updatedAt: serverTimestamp() }).catch(() => {});
  return snap.data();
}

function broadcast() {
  listeners.forEach(fn => {
    try { fn(currentUser, currentProfile); } catch (e) { console.error(e); }
  });
}

/* بيرجّع دالة إلغاء الاشتراك، عشان الصفحات تنضف ورا نفسها */
export function onUser(fn) {
  listeners.add(fn);
  if (ready) fn(currentUser, currentProfile);
  return () => listeners.delete(fn);
}

let ready = false;
let readyResolve;
/* الصفحات بتستنى ده قبل ما تقرر تعرض إيه — عشان متومضش بحالة «مش مسجل»
   وبعدين تتغير فجأة لما Firebase يرد. */
export const authReady = new Promise(res => { readyResolve = res; });

if (configured) {
  onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    currentProfile = null;
    if (user) {
      try { currentProfile = await ensureProfile(user); }
      catch (e) { console.warn('تعذّر تحميل ملف المستخدم:', friendlyError(e)); }
    }
    ready = true;
    readyResolve({ user: currentUser, profile: currentProfile });
    broadcast();
  });
} else {
  ready = true;
  Promise.resolve().then(() => { readyResolve({ user: null, profile: null }); broadcast(); });
}

/* ---------------------------------------------------------------------------
   العمليات
--------------------------------------------------------------------------- */
export const getUser    = () => currentUser;
export const getProfile = () => currentProfile;

/* للواجهة فقط. الحماية في القواعد. */
export const isOwner = () => Boolean(currentUser && OWNER_UID && currentUser.uid === OWNER_UID);

export async function register(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
    /* onAuthStateChanged ممكن يكون سبق التحديث، فبنتأكد إن الاسم اتسجل */
    await setDoc(doc(db, 'users', cred.user.uid), { displayName }, { merge: true }).catch(() => {});
  }
  return cred.user;
}

export const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

export function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return signInWithPopup(auth, provider);
}

export const logout = () => signOut(auth);

export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

export async function updateMyProfile(fields) {
  if (!currentUser) throw new Error('مش مسجّل دخول.');
  const allowed = {};
  /* بنبعت الحقول المسموحة بس — نفس اللي القواعد بتقبله، عشان مفيش طلب
     يترفض بسبب حقل اتبعت بالغلط. */
  for (const key of ['displayName', 'photoURL', 'bio']) {
    if (key in fields) allowed[key] = fields[key];
  }
  allowed.updatedAt = serverTimestamp();

  await updateDoc(doc(db, 'users', currentUser.uid), allowed);
  if (allowed.displayName || allowed.photoURL) {
    await updateProfile(currentUser, {
      displayName: allowed.displayName ?? currentUser.displayName,
      photoURL:    allowed.photoURL    ?? currentUser.photoURL
    }).catch(() => {});
  }
  currentProfile = { ...currentProfile, ...allowed };
  broadcast();
}
