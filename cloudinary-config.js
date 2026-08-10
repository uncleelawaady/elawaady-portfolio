/* ===========================================================================
   إعداد Cloudinary — رفع صور الإثبات
   ===========================================================================
   ليه Cloudinary مش Firebase Storage؟
   Firebase Storage محتاج خطة Blaze (بطاقة بنكية). صور الإثبات هي الحاجة
   الوحيدة اللي محتاجة تخزين ملفات، فبترفع هنا بدل ما نضطر نفعّل Blaze.
   Auth وFirestore زي ما هما على الخطة المجانية.

   الحقلين دول مش أسرار:
     cloudName     اسم الحساب، ظاهر في كل رابط صورة بيترجع.
     uploadPreset  Unsigned Preset — مصمّم أصلاً عشان المتصفح يناديه.

   ⛔ ممنوع نهائيًا يتحط هنا (ولا في أي ملف بيوصل للمتصفح ولا في Git):
      API Key بتاع Cloudinary، أو API Secret، أو أي Signed Preset.

   إعداد الـPreset في لوحة Cloudinary (Settings → Upload → Upload presets):
     Signing Mode        Unsigned
     Folder              reviews
     Allowed formats     jpg, png, webp
     Max file size       5 MB
     Unique filename     On
     Access mode         Public

   ملاحظة مهمة: رفع الصورة على Cloudinary ما يعنيش إنها اتنشرت. التقييم
   والصور بيفضلوا pending في Firestore، وما يظهروش في الصفحة العامة غير
   بعد اعتماد المالك — Cloudinary بيخزّن الملف بس.

   لو الحقلين فاضيين، التقييم النصي بيشتغل عادي، والصور بس هي اللي بتتقفل.
=========================================================================== */
window.CLOUDINARY_CONFIG = {
  cloudName:    '',
  uploadPreset: ''
};
