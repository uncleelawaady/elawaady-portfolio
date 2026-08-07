/* ===========================================================================
   حراسة الصفحات
   ===========================================================================
   بتمنع الصفحة تترسم قبل ما نعرف مين اللي فاتحها.

   ده **راحة استخدام، مش أمان**. حد يقدر يشيل السكربت ده ويشوف شكل اللوحة
   فاضية — ومش هيقدر يقرا ولا يكتب أي حاجة، لأن قواعد Firestore هي اللي
   بترفض العمليات نفسها. الحماية هناك، مش هنا.
=========================================================================== */

import { configured } from './firebase.js';
import { authReady, isOwner } from './auth.js';

const HIDE = 'visibility:hidden';

function block(title, message, action) {
  document.body.removeAttribute('style');
  document.body.innerHTML = `
    <div style="min-height:100vh;display:grid;place-items:center;padding:24px;
                font-family:'Handicrafts','Tajawal',system-ui,sans-serif;
                background:#071F29;color:#EAF4F7;text-align:center;line-height:1.9">
      <div style="max-width:430px">
        <img src="/assets/e-logo.png" alt="" width="64" height="64"
             style="display:block;margin:0 auto 18px;border-radius:16px">
        <h1 style="font-size:1.25rem;font-weight:900;margin-bottom:8px">${title}</h1>
        <p style="color:#9FBAC4;font-size:.92rem">${message}</p>
        ${action}
      </div>
    </div>`;
}

const linkBtn = (href, label) => `
  <a href="${href}" style="display:inline-block;margin-top:20px;padding:12px 26px;
     border-radius:999px;background:linear-gradient(135deg,#10B5BF,#20D6E3);
     color:#04222B;font-weight:700;text-decoration:none">${label}</a>`;

/* الصفحة بتفضل مخفية لحد ما الفحص يخلص، عشان محتوى الإدارة ميومضش لحظة
   قبل ما نتأكد. */
export function hideUntilChecked() {
  document.body.setAttribute('style', HIDE);
}
const reveal = () => document.body.removeAttribute('style');

/* ---------------------------------------------------------------------------
   صفحات الإدارة
--------------------------------------------------------------------------- */
export async function requireOwner() {
  if (!configured) {
    block('الاتصال مش متظبط',
          'ملف firebase-config.js لسه فاضي. راجع docs/SETUP.md.', '');
    return null;
  }

  const { user, profile } = await authReady;

  if (!user) {
    location.replace('/login.html?next=' + encodeURIComponent(location.pathname));
    return null;
  }

  if (!isOwner()) {
    block('الصفحة دي مش ليك',
          'حسابك مسجّل، بس لوحة الإدارة لصاحب الموقع بس.',
          linkBtn('/', 'رجوع للموقع'));
    return null;
  }

  reveal();
  return { user, profile };
}

/* ---------------------------------------------------------------------------
   صفحات محتاجة تسجيل دخول عادي
--------------------------------------------------------------------------- */
export async function requireUser() {
  if (!configured) {
    block('الاتصال مش متظبط',
          'ملف firebase-config.js لسه فاضي. راجع docs/SETUP.md.', '');
    return null;
  }

  const { user, profile } = await authReady;
  if (!user) {
    location.replace('/login.html?next=' + encodeURIComponent(location.pathname));
    return null;
  }

  reveal();
  return { user, profile };
}
