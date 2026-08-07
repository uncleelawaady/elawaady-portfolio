/* ===========================================================================
   إعداد Firebase — elawaady-db.com
   ===========================================================================
   حط هنا الـconfig بتاع مشروع «elawaady-portfolio» من:

     Firebase Console → Project settings → General → Your apps → Web app

   ---------------------------------------------------------------------------
   القيم دي معمولة عشان تكون مكشوفة في المتصفح — ده تصميم Firebase مش تسريب.
   المفتاح ده مش بيدي أي صلاحية لوحده؛ اللي بيحكم مين يقرا ومين يكتب هو
   ملفات firestore.rules و storage.rules.

   اللي **ممنوع** يتحط هنا أو في أي ملف بيوصل للمتصفح:
   Service Account، أو Admin SDK credentials، أو أي مفتاح خاص.
=========================================================================== */

window.FIREBASE_CONFIG = {
  apiKey:            '',
  authDomain:        '',
  projectId:         '',
  storageBucket:     '',
  messagingSenderId: '',
  appId:             ''
};

/* الـUID بتاعك — نفس اللي في firestore.rules و storage.rules.
   بيتستخدم في الواجهة عشان تظهر أو تخفي أزرار الإدارة وبس؛ الحماية
   الحقيقية في القواعد نفسها، مش هنا. */
window.OWNER_UID = '';
