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
window.OWNER_UID = 'jJPB9z2WISN7yhW1iq99H4ncfi72';

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

/* ===========================================================================
   إصلاح صفحة «تعاملات سابقة» بدون Composite Index
   ---------------------------------------------------------------------------
   الاستعلام القديم كان where(status == approved) + orderBy(createdAt desc)،
   وده كان بيجبر Firestore يطلب Composite Index ويعرض رابط تقني للزائر.

   هنا بنجيب التقييمات المعتمدة فقط باستعلام بسيط لا يحتاج Composite Index،
   وبعدها بنرتبها محليًا. ده يحافظ على قواعد الأمان: الزائر لا يقرأ إلا
   المستندات approved أصلًا.
=========================================================================== */
(function installPublicProofsFix(){
  if (typeof window === 'undefined') return;

  var cfg = window.FIREBASE_CONFIG || {};
  if (!cfg.projectId || !cfg.apiKey) return;

  function decodeValue(v){
    if (!v) return null;
    if ('nullValue' in v) return null;
    if ('stringValue' in v) return v.stringValue;
    if ('booleanValue' in v) return !!v.booleanValue;
    if ('integerValue' in v) return Number(v.integerValue);
    if ('doubleValue' in v) return Number(v.doubleValue);
    if ('timestampValue' in v) return v.timestampValue;
    if ('referenceValue' in v) return v.referenceValue;
    if ('arrayValue' in v) return (v.arrayValue.values || []).map(decodeValue);
    if ('mapValue' in v){
      var out = {};
      var fields = v.mapValue.fields || {};
      Object.keys(fields).forEach(function(k){ out[k] = decodeValue(fields[k]); });
      return out;
    }
    return null;
  }

  function decodeDoc(doc){
    var out = {};
    var fields = (doc && doc.fields) || {};
    Object.keys(fields).forEach(function(k){ out[k] = decodeValue(fields[k]); });
    out.id = String((doc && doc.name) || '').split('/').pop();
    return out;
  }

  async function loadApproved(max){
    var endpoint = 'https://firestore.googleapis.com/v1/projects/' +
      encodeURIComponent(cfg.projectId) +
      '/databases/(default)/documents:runQuery?key=' + encodeURIComponent(cfg.apiKey);

    var res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'reviews' }],
          where: {
            fieldFilter: {
              field: { fieldPath: 'status' },
              op: 'EQUAL',
              value: { stringValue: 'approved' }
            }
          },
          limit: Math.max(1, Math.min(Number(max) || 60, 100))
        }
      })
    });

    if (!res.ok) throw new Error('تعذّر تحميل التقييمات مؤقتًا. جرّب تحديث الصفحة.');

    var raw = await res.json();
    var rows = raw.filter(function(x){ return x && x.document; })
      .map(function(x){ return decodeDoc(x.document); });

    rows.sort(function(a,b){
      var featured = (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if (featured) return featured;
      return Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0);
    });
    return rows;
  }

  var attempts = 0;
  var timer = setInterval(function(){
    attempts++;
    try {
      if (typeof api !== 'undefined' && api && api.mode === 'firebase' && !api.__publicProofsFixed){
        api.listApproved = function(max){ return loadApproved(max || 60); };
        api.__publicProofsFixed = true;
        clearInterval(timer);

        /* لو الزائر كان فاتح صفحة الإثباتات وقت تحميل الإصلاح، نعيد رسمها
           مرة واحدة فورًا عشان تختفي رسالة الـindex القديمة. */
        if ((location.hash || '#/proofs').startsWith('#/proofs')){
          setTimeout(function(){
            try { if (typeof viewProofs === 'function') viewProofs(); } catch(e){}
          }, 0);
        }
      }
    } catch(e){}
    if (attempts > 200) clearInterval(timer);
  }, 25);
})();
