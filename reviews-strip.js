/* ===========================================================================
   شريط التقييمات المعتمدة — الصفحة الرئيسية (index.html)
   ---------------------------------------------------------------------------
   يجيب التقييمات approved من Firestore عبر REST (بدون Firebase SDK كامل،
   نفس أسلوب app.html) ويرسمها في شريط أفقي قابل للسحب داخل قسم #proofs.

   مهم: الاستعلام هنا بـ where فقط (status == approved) بدون orderBy —
   لأن الجمع بين الاثنين على حقلين مختلفين يتطلب Composite Index في
   Firestore غير موجود لهذا المشروع، وهو ما كان يُظهر خطأ Firestore الخام
   للزائر بدل التقييمات في صفحة "تعاملات سابقة". الترتيب هنا يتم بعد
   الجلب، في الجافاسكريبت. نفس الإصلاح مطبّق في app.html (api.listApproved).

   كل نص قادم من المستخدم (الاسم، النص، نوع التعامل) يُبنى بـ textContent
   لا innerHTML — حماية من XSS بلا الحاجة لتهريب يدوي.
=========================================================================== */
(function () {
  const mount = document.getElementById('reviewsStrip');
  if (!mount) return;

  const cfg = window.FIREBASE_CONFIG || {};
  if (!cfg.projectId || !cfg.apiKey) {
    mount.innerHTML = '';
    return; // لا نعرض شريطاً بلا محتوى حقيقي، ولا نطبع خطأ للزائر
  }

  const DEAL_LABELS = {
    escrow:     { ar: 'وساطة وضمان',        en: 'Escrow' },
    guarantee:  { ar: 'ضمان تعامل',         en: 'Guarantee' },
    trade:      { ar: 'بيع وشراء',          en: 'Trade' },
    digital:    { ar: 'خدمة رقمية',         en: 'Digital service' },
    transfer:   { ar: 'تحويل رقمي',         en: 'Transfer' },
    project:    { ar: 'مشروع',              en: 'Project' },
    consulting: { ar: 'استشارة',            en: 'Consulting' },
    other:      { ar: 'تعامل آخر',          en: 'Other' },
  };

  const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'ar');

  /* ---------- تحويل استجابة REST الخام إلى مستندات عادية ---------- */
  function decodeValue(v) {
    if (!v) return null;
    if ('nullValue' in v) return null;
    if ('stringValue' in v) return v.stringValue;
    if ('booleanValue' in v) return !!v.booleanValue;
    if ('integerValue' in v) return Number(v.integerValue);
    if ('doubleValue' in v) return Number(v.doubleValue);
    if ('timestampValue' in v) return v.timestampValue;
    if ('arrayValue' in v) return (v.arrayValue.values || []).map(decodeValue);
    if ('mapValue' in v) {
      const out = {};
      const fields = v.mapValue.fields || {};
      Object.keys(fields).forEach((k) => (out[k] = decodeValue(fields[k])));
      return out;
    }
    return null;
  }
  function decodeDoc(doc) {
    const out = {};
    const fields = (doc && doc.fields) || {};
    Object.keys(fields).forEach((k) => (out[k] = decodeValue(fields[k])));
    out.id = String((doc && doc.name) || '').split('/').pop();
    return out;
  }

  async function fetchApproved(max) {
    const endpoint =
      'https://firestore.googleapis.com/v1/projects/' +
      encodeURIComponent(cfg.projectId) +
      '/databases/(default)/documents:runQuery?key=' +
      encodeURIComponent(cfg.apiKey);

    /* مهلة زمنية: على شبكة بطيئة أو غير مستقرة قد يتعلّق fetch بلا رد
       (لا خطأ ولا نجاح) — فيفضل الشريط عالقاً في "جاري التحميل" للأبد
       بدل أن يتحول لحالة فاضية أنيقة. AbortController يضمن حداً أقصى. */
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(endpoint, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'reviews' }],
          where: {
            fieldFilter: {
              field: { fieldPath: 'status' },
              op: 'EQUAL',
              value: { stringValue: 'approved' },
            },
          },
          limit: Math.max(1, Math.min(Number(max) || 24, 60)),
        },
      }),
    }).finally(() => clearTimeout(timeout));
    if (!res.ok) throw new Error('firestore runQuery failed: ' + res.status);

    const raw = await res.json();
    const list = raw
      .filter((x) => x && x.document)
      .map((x) => decodeDoc(x.document));

    list.sort((a, b) => {
      const f = (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if (f) return f;
      return (Date.parse(b.createdAt || 0) || 0) - (Date.parse(a.createdAt || 0) || 0);
    });
    return list;
  }

  /* ---------- عناصر واجهة ---------- */
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function safeHttpsUrl(u) {
    try {
      const x = new URL(String(u || ''));
      return x.protocol === 'https:' ? x.href : '';
    } catch {
      return '';
    }
  }

  function starRow(rating) {
    const wrap = el('span', 'review-stars');
    const r = Math.max(1, Math.min(5, Number(rating) || 5));
    for (let i = 1; i <= 5; i++) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'ic review-star' + (i <= r ? ' on' : ''));
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', '#i-star');
      svg.appendChild(use);
      wrap.appendChild(svg);
    }
    return wrap;
  }

  function reviewCard(r) {
    const L = lang();
    const card = el('article', 'review-chip' + (r.featured ? ' is-featured' : ''));

    const head = el('div', 'review-chip-head');
    const photo = safeHttpsUrl(r.authorPhoto);
    if (photo) {
      const img = el('img', 'review-avatar');
      img.src = photo;
      img.alt = '';
      img.referrerPolicy = 'no-referrer';
      head.appendChild(img);
    } else {
      const name = String(r.authorName || '').trim();
      head.appendChild(el('span', 'review-avatar review-avatar-fallback', name ? name[0] : '؟'));
    }
    const nameWrap = el('div', 'review-chip-who');
    nameWrap.appendChild(el('strong', null, r.authorName || (L === 'ar' ? 'عميل' : 'Client')));
    nameWrap.appendChild(starRow(r.rating));
    head.appendChild(nameWrap);
    card.appendChild(head);

    if (r.title) card.appendChild(el('h4', 'review-chip-title', r.title));
    card.appendChild(el('p', 'review-chip-body', r.body || ''));

    const foot = el('div', 'review-chip-foot');
    const dl = DEAL_LABELS[r.dealType];
    if (dl) foot.appendChild(el('span', 'review-chip-tag', dl[L] || dl.ar));
    card.appendChild(foot);

    return card;
  }

  function emptyCard() {
    const L = lang();
    const card = el('article', 'review-chip review-chip-empty');
    card.appendChild(
      el(
        'p',
        null,
        L === 'ar'
          ? 'لسه مفيش تقييمات معروضة — كن أول من يشارك تجربته.'
          : 'No reviews yet — be the first to share your experience.'
      )
    );
    const a = el('a', 'btn btn-signature btn-sm', L === 'ar' ? 'اكتب تقييمك' : 'Write a review');
    a.href = 'app.html#/new';
    card.appendChild(a);
    return card;
  }

  function moreCard(count) {
    const L = lang();
    const card = el('article', 'review-chip review-chip-more');
    const a = el(
      'a',
      'btn btn-grad btn-sm',
      L === 'ar' ? `شوف كل التقييمات (${count})` : `See all reviews (${count})`
    );
    a.href = 'app.html#/proofs';
    card.appendChild(a);
    return card;
  }

  async function run() {
    let list;
    try {
      list = await fetchApproved(24);
    } catch (err) {
      console.warn('reviews-strip: could not load approved reviews', err);
      mount.innerHTML = '';
      return; // فشل هادئ — لا نعرض خطأ تقني للزائر
    }

    mount.innerHTML = '';
    if (!list.length) {
      mount.appendChild(emptyCard());
      return;
    }
    list.forEach((r) => mount.appendChild(reviewCard(r)));
    if (list.length > 1) mount.appendChild(moreCard(list.length));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
