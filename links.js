/* ===========================================================================
   سجل روابط التواصل والمجتمعات — Source of Truth
   ===========================================================================
   الملف ده هو المرجع الوحيد لكل رابط تواصل في الموقع. أي رابط قديم في أي
   ملف تاني اتشال، والروابط دي بس هي اللي بتتعرض.

   ترتيب العرض ثابت:
     1) official          — القنوات الرسمية
     2) facebook_group    — جروبات فيسبوك
     3) whatsapp_group    — جروبات واتساب
     4) whatsapp_channel  — قناة واتساب

   كل رابط بيتخزن بالحقول دي:
     id        معرّف ثابت مايتغيرش (عشان التعديل من الداشبورد يفضل مربوط)
     title     الاسم اللي بيظهر
     platform  المنصة (store / whatsapp / messenger / instagram / facebook /
               telegram / x / linkedin)
     url       الرابط كما هو — ممنوع تعديله من غير طلب صريح
     type      واحد من الأربعة فوق
     order     ترتيب الظهور جوه نوعه
     visible   يظهر ولا لأ

   ⚠️ الروابط دي مكتوبة حرفيًا زي ما وصلت. أي حرف فيها مقصود — فيه لينكات
   بتستخدم حرف I كبير بدل l صغير. ما تصلّحش حاجة من نفسك.

   التعديل بيتم من الداشبورد (app.html#/links) وبيتخزن في Firestore تحت
   مجموعة `links`. الملف ده هو النسخة الأساسية اللي بتتزرع أول مرة، وكمان
   نسخة الطوارئ لو Firestore مش متاح.
=========================================================================== */

window.SITE_LINKS = [

  /* ======================  القنوات الرسمية  ============================ */
  { id:'off-store',      type:'official', order: 1, visible:true, platform:'store',
    title:'المتجر الرسمي | Elawaady XDigital',
    url:'https://elawaady.com' },

  { id:'off-wa-main',    type:'official', order: 2, visible:true, platform:'whatsapp',
    title:'واتساب | الرسمي',
    url:'https://wa.me/201055578777' },

  { id:'off-wa-extra',   type:'official', order: 3, visible:true, platform:'whatsapp',
    title:'واتساب | إضافي',
    url:'https://wa.me/201008002333' },

  { id:'off-messenger',  type:'official', order: 4, visible:true, platform:'messenger',
    title:'ماسنجر | الصفحة الرسمية',
    url:'https://m.me/eIawaady.official' },

  { id:'off-instagram',  type:'official', order: 5, visible:true, platform:'instagram',
    title:'إنستجرام | Elawaady Official',
    url:'https://www.instagram.com/elawaady.official' },

  { id:'off-fb-1',       type:'official', order: 6, visible:true, platform:'facebook',
    title:'فيسبوك | Elawaady Official',
    url:'https://www.facebook.com/eIawaady.official' },

  { id:'off-fb-2',       type:'official', order: 7, visible:true, platform:'facebook',
    title:'فيسبوك | Official Elawaady',
    url:'https://www.facebook.com/official.elawaady' },

  { id:'off-tg-1',       type:'official', order: 8, visible:true, platform:'telegram',
    title:'تليجرام | Elawaady Official',
    url:'https://t.me/elawaadyofficial' },

  { id:'off-tg-2',       type:'official', order: 9, visible:true, platform:'telegram',
    title:'تليجرام | Elawaady XDigital',
    url:'https://t.me/Elawaady_XDigital' },

  { id:'off-x',          type:'official', order:10, visible:true, platform:'x',
    title:'X | Elawaady Official',
    url:'https://x.com/eIawaadyoffici' },

  { id:'off-linkedin',   type:'official', order:11, visible:true, platform:'linkedin',
    title:'لينكدإن | Ahmed Elawaady',
    url:'https://www.linkedin.com/in/elawaadyofficial' },

  /* ======================  جروبات فيسبوك  ============================== */
  { id:'fbg-01', type:'facebook_group', order: 1, visible:true, platform:'facebook',
    title:'جروب فيسبوك 1',  url:'https://www.facebook.com/share/g/19AfKTyFiV/' },
  { id:'fbg-02', type:'facebook_group', order: 2, visible:true, platform:'facebook',
    title:'جروب فيسبوك 2',  url:'https://www.facebook.com/groups/556386908691748/' },
  { id:'fbg-03', type:'facebook_group', order: 3, visible:true, platform:'facebook',
    title:'جروب فيسبوك 3',  url:'https://www.facebook.com/groups/190630403951581/' },
  { id:'fbg-04', type:'facebook_group', order: 4, visible:true, platform:'facebook',
    title:'Sonata',          url:'https://www.facebook.com/groups/sonata0ff/' },
  { id:'fbg-05', type:'facebook_group', order: 5, visible:true, platform:'facebook',
    title:'Vodafone Cash',   url:'https://www.facebook.com/groups/vodafoon.cash/' },
  { id:'fbg-06', type:'facebook_group', order: 6, visible:true, platform:'facebook',
    title:'الإعلانات الممولة', url:'https://www.facebook.com/groups/ealanaat.momawala/' },
  { id:'fbg-07', type:'facebook_group', order: 7, visible:true, platform:'facebook',
    title:'جروب فيسبوك 7',  url:'https://www.facebook.com/groups/1441686789880312/' },
  { id:'fbg-08', type:'facebook_group', order: 8, visible:true, platform:'facebook',
    title:'جروب فيسبوك 8',  url:'https://www.facebook.com/groups/954788482995188/' },
  { id:'fbg-09', type:'facebook_group', order: 9, visible:true, platform:'facebook',
    title:'دعم صفحات',       url:'https://www.facebook.com/groups/daamsafahaat' },
  { id:'fbg-10', type:'facebook_group', order:10, visible:true, platform:'facebook',
    title:'ملتقى الحيتان',    url:'https://www.facebook.com/groups/moltaka.alhytan/' },
  { id:'fbg-11', type:'facebook_group', order:11, visible:true, platform:'facebook',
    title:'جروب فيسبوك 11', url:'https://www.facebook.com/groups/916433822744503' },
  { id:'fbg-12', type:'facebook_group', order:12, visible:true, platform:'facebook',
    title:'شحن ألعاب',       url:'https://www.facebook.com/groups/sa7n.alaab' },
  { id:'fbg-13', type:'facebook_group', order:13, visible:true, platform:'facebook',
    title:'جروب فيسبوك 13', url:'https://www.facebook.com/groups/26364546349860366/' },
  { id:'fbg-14', type:'facebook_group', order:14, visible:true, platform:'facebook',
    title:'جروب فيسبوك 14', url:'https://www.facebook.com/share/g/193wXQ21ET/' },
  { id:'fbg-15', type:'facebook_group', order:15, visible:true, platform:'facebook',
    title:'YouTube Channels', url:'https://www.facebook.com/groups/youtube.chaannels/' },
  { id:'fbg-16', type:'facebook_group', order:16, visible:true, platform:'facebook',
    title:'جروب فيسبوك 16', url:'https://www.facebook.com/groups/1803596119816899/' },
  { id:'fbg-17', type:'facebook_group', order:17, visible:true, platform:'facebook',
    title:'جروب فيسبوك 17', url:'https://www.facebook.com/share/g/1KZmvGXjjJ/' },
  { id:'fbg-18', type:'facebook_group', order:18, visible:true, platform:'facebook',
    title:'جروب فيسبوك 18', url:'https://www.facebook.com/share/g/1JH6Hfk5oQ/' },
  { id:'fbg-19', type:'facebook_group', order:19, visible:true, platform:'facebook',
    title:'جروب فيسبوك 19', url:'https://www.facebook.com/share/g/1LuGnzRdJg/' },
  { id:'fbg-20', type:'facebook_group', order:20, visible:true, platform:'facebook',
    title:'جروب فيسبوك 20', url:'https://www.facebook.com/share/g/1BXFvevyGd/' },
  { id:'fbg-21', type:'facebook_group', order:21, visible:true, platform:'facebook',
    title:'جروب فيسبوك 21', url:'https://www.facebook.com/share/g/18pinEkvrN/' },
  { id:'fbg-22', type:'facebook_group', order:22, visible:true, platform:'facebook',
    title:'جروب فيسبوك 22', url:'https://www.facebook.com/share/g/18pbbxxK3s/' },
  { id:'fbg-23', type:'facebook_group', order:23, visible:true, platform:'facebook',
    title:'جروب فيسبوك 23', url:'https://www.facebook.com/share/g/1Gf42bBtgG/' },
  { id:'fbg-24', type:'facebook_group', order:24, visible:true, platform:'facebook',
    title:'جروب فيسبوك 24', url:'https://www.facebook.com/groups/543681334455914/' },
  { id:'fbg-25', type:'facebook_group', order:25, visible:true, platform:'facebook',
    title:'جروب فيسبوك 25', url:'https://www.facebook.com/groups/1359960194756167/' },
  { id:'fbg-26', type:'facebook_group', order:26, visible:true, platform:'facebook',
    title:'جروب فيسبوك 26', url:'https://www.facebook.com/share/g/1EWXcbcRt8/' },
  { id:'fbg-27', type:'facebook_group', order:27, visible:true, platform:'facebook',
    title:'جروب فيسبوك 27', url:'https://www.facebook.com/share/g/1EQ6Xsh2FW/' },
  { id:'fbg-28', type:'facebook_group', order:28, visible:true, platform:'facebook',
    title:'جروب فيسبوك 28', url:'https://www.facebook.com/share/g/199PnBPpCn/' },
  { id:'fbg-29', type:'facebook_group', order:29, visible:true, platform:'facebook',
    title:'جروب فيسبوك 29', url:'https://www.facebook.com/share/g/18vtoW6PfL/' },
  { id:'fbg-30', type:'facebook_group', order:30, visible:true, platform:'facebook',
    title:'جروب فيسبوك 30', url:'https://www.facebook.com/share/g/1QF8n17NqU/' },
  { id:'fbg-31', type:'facebook_group', order:31, visible:true, platform:'facebook',
    title:'جروب فيسبوك 31', url:'https://www.facebook.com/share/g/1E55VAKdNQ/' },

  /* ======================  جروبات واتساب  ============================== */
  { id:'wag-1', type:'whatsapp_group', order:1, visible:true, platform:'whatsapp',
    title:'جروب واتساب 1', url:'https://chat.whatsapp.com/Kbca2x0tfUPGgJgEQK2GDd' },
  { id:'wag-2', type:'whatsapp_group', order:2, visible:true, platform:'whatsapp',
    title:'جروب واتساب 2', url:'https://chat.whatsapp.com/FnHIDnpiPUd30b0JPU3oWn' },
  { id:'wag-3', type:'whatsapp_group', order:3, visible:true, platform:'whatsapp',
    title:'جروب واتساب 3', url:'https://chat.whatsapp.com/BHS6Hz9hCXKIcbIgPYKXea' },

  /* ======================  قناة واتساب  ================================ */
  { id:'wac-1', type:'whatsapp_channel', order:1, visible:true, platform:'whatsapp',
    title:'Elawaady | WhatsApp Channel',
    url:'https://whatsapp.com/channel/0029Van76joI1rckR74sH23U' }
];

/* ترتيب الأقسام وأسماؤها — نفس الترتيب المطلوب بالظبط */
window.SITE_LINK_GROUPS = [
  { type:'official',         ar:'القنوات الرسمية',  en:'Official Channels' },
  { type:'facebook_group',   ar:'جروبات فيسبوك',   en:'Facebook Groups' },
  { type:'whatsapp_group',   ar:'جروبات واتساب',   en:'WhatsApp Groups' },
  { type:'whatsapp_channel', ar:'قناة واتساب',     en:'WhatsApp Channel' }
];
