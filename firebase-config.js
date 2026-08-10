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
  apiKey:            'AIzaSyArFgfE-qaRRY4NtmuGXxCj_eOGekEAZlY',
  authDomain:        'elawaady-portfolio.firebaseapp.com',
  projectId:         'elawaady-portfolio',
  storageBucket:     'elawaady-portfolio.firebasestorage.app',
  messagingSenderId: '560876347955',
  appId:             '1:560876347955:web:b97e81229906b8d9957946'
};

/* الـUID بتاعك — نفس اللي في firestore.rules و storage.rules.
   بيتستخدم في الواجهة عشان تظهر أو تخفي أزرار الإدارة وبس؛ الحماية
   الحقيقية في القواعد نفسها، مش هنا. */
window.OWNER_UID = '6tHYcsC5BQOhJVsLL5rOs30YJ7m1';

/* SaaS visual skin + wording sync for app.html.
   The review/account app remains functional as-is; this layer only makes it
   visually consistent with the main portfolio and changes public-facing copy. */
(function(){
  if(typeof document==='undefined') return;
  var link=document.createElement('link');
  link.rel='stylesheet';
  link.href='app-saas.css?v=2';
  link.dataset.saasSkin='1';
  document.head.appendChild(link);

  var replacements=[
    ['إثباتات تعاملات العوضي','تعاملات سابقة'],
    ['إثباتات التعاملات','تعاملات سابقة'],
    ['إثباتات التعامل','تعاملات سابقة'],
    ['شوف الإثباتات','تعاملات سابقة']
  ];

  function patchText(root){
    if(!root || !root.ownerDocument) return;
    var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    var node;
    while((node=walker.nextNode())){
      var v=node.nodeValue;
      if(!v || !v.trim()) continue;
      var next=v;
      replacements.forEach(function(pair){ next=next.split(pair[0]).join(pair[1]); });
      if(next!==v) node.nodeValue=next;
    }
    root.querySelectorAll && root.querySelectorAll('[data-ar]').forEach(function(el){
      var ar=el.getAttribute('data-ar')||'';
      replacements.forEach(function(pair){ ar=ar.split(pair[0]).join(pair[1]); });
      el.setAttribute('data-ar',ar);
    });
    root.querySelectorAll && root.querySelectorAll('img[src*="assets/portraits/"]').forEach(function(img){
      img.removeAttribute('srcset');
      img.setAttribute('src','assets/ahmed-portrait.svg');
    });
  }

  function run(){
    document.title=document.title.replace('إثباتات تعاملات العوضي','تعاملات سابقة');
    patchText(document.body);
    var observer=new MutationObserver(function(muts){
      muts.forEach(function(m){
        m.addedNodes.forEach(function(n){ if(n.nodeType===1) patchText(n); });
      });
    });
    observer.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
})();