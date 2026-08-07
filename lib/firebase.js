/* ===========================================================================
   تهيئة Firebase
   ===========================================================================
   نقطة واحدة بيتعمل منها الاتصال، وكل الملفات التانية بتستورد منها. كده لو
   احتجنا نغيّر إصدار الـSDK أو نضيف خدمة، بنعدّل هنا وبس.

   الاستيراد من CDN جوجل مباشرة — مفيش build ولا npm، عشان الموقع يفضل
   ملفات ثابتة تترفع على أي استضافة زي ما هي.
=========================================================================== */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  GoogleAuthProvider, signInWithPopup, updateProfile, sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  getFirestore, doc, collection, getDoc, getDocs, setDoc, addDoc,
  updateDoc, deleteDoc, query, where, orderBy, limit, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import {
  getStorage, ref, uploadBytes, getDownloadURL, deleteObject
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js';

const cfg = window.FIREBASE_CONFIG || {};

/* الموقع لازم يفضل شغال حتى لو الإعداد ناقص — الصفحة العامة بتعرض
   المحتوى المحلي، والصفحات اللي محتاجة حساب بتقول السبب بوضوح. */
export const configured = Boolean(cfg.apiKey && cfg.projectId);

let app = null, auth = null, db = null, storage = null;

if (configured) {
  app     = initializeApp(cfg);
  auth    = getAuth(app);
  db      = getFirestore(app);
  storage = getStorage(app);
  /* الجلسة تفضل بعد قفل المتصفح — الحساب دائم زي ما اتفقنا */
  setPersistence(auth, browserLocalPersistence).catch(() => {});
}

export const OWNER_UID = window.OWNER_UID || '';

export {
  app, auth, db, storage,
  onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, GoogleAuthProvider, signInWithPopup, updateProfile, sendPasswordResetEmail,
  doc, collection, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp,
  ref, uploadBytes, getDownloadURL, deleteObject
};

/* ---------------------------------------------------------------------------
   رسائل الأخطاء بالعربي.
   Firebase بيرجّع أكواد زي auth/wrong-password — دي مش حاجة تتعرض لحد.
--------------------------------------------------------------------------- */
const MESSAGES = {
  'auth/invalid-credential':      'الإيميل أو كلمة السر غلط.',
  'auth/wrong-password':          'كلمة السر غلط.',
  'auth/user-not-found':          'مفيش حساب بالإيميل ده.',
  'auth/email-already-in-use':    'الإيميل ده مستخدم في حساب تاني.',
  'auth/weak-password':           'كلمة السر ضعيفة — خليها 6 حروف على الأقل.',
  'auth/invalid-email':           'الإيميل مش مكتوب صح.',
  'auth/too-many-requests':       'محاولات كتير. استنى شوية وحاول تاني.',
  'auth/popup-closed-by-user':    'قفلت نافذة جوجل قبل ما تخلص.',
  'auth/network-request-failed':  'مفيش اتصال بالإنترنت.',
  'permission-denied':            'الصلاحية مرفوضة.',
  'unavailable':                  'الخدمة مش متاحة دلوقتي. حاول تاني بعد شوية.'
};

export function friendlyError(err) {
  const code = (err && (err.code || '')).replace(/^firestore\//, '');
  return MESSAGES[code] || (err && err.message) || 'حصل خطأ مش متوقع.';
}
