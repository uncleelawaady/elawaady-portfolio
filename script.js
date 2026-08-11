/* ===== Ahmed Elawaady — elawaady-db.com =====
   All copy lives in content.js. This file only renders it and runs the page.
   Copy saved in the owner dashboard overrides content.js when present.
*/

/* ---------------------------------------------------------------------------
   KASHIDA — the elongation mark (ـ, U+0640) added inside Arabic words.

   It cannot go just anywhere: the mark only renders as a stretched connection
   when the letter before it joins forward. Alef, dal, thal, ra, zay, waw, ta
   marbuta, alef maqsura and hamza never join to the letter after them, so a
   mark placed after one of those sits detached and breaks the word instead.
   The traditional position is the last joinable seam — right before the final
   letter — so that is what this picks.
--------------------------------------------------------------------------- */
const KASHIDA = true;

const TATWEEL = 'ـ';
const AR_LETTER = /[ء-غف-ي]/;
const NO_FORWARD_JOIN = new Set([...'اأإآٱدذرزوؤةىء']);

function kashidaWord(word) {
  if (word.indexOf(TATWEEL) !== -1) return word;
  const seams = [];
  for (let i = 0; i < word.length - 1; i++) {
    const a = word[i], b = word[i + 1];
    if (!AR_LETTER.test(a) || !AR_LETTER.test(b)) continue;
    if (NO_FORWARD_JOIN.has(a)) continue;
    if (a === 'ل' && 'اأإآٱ'.indexOf(b) !== -1) continue;   // keep the lam-alef ligature whole
    seams.push(i);
  }
  if (!seams.length) return word;
  const i = seams[seams.length - 1];
  return word.slice(0, i + 1) + TATWEEL + word.slice(i + 1);
}

const kashida       = (text) => text.replace(/\S+/g, kashidaWord);
const stripKashida  = (text) => text.split(TATWEEL).join('');

const KASHIDA_SKIP = new Set(['SCRIPT', 'STYLE', 'SVG', 'TEXTAREA', 'INPUT', 'CODE']);

function applyKashida(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue.trim() || !AR_LETTER.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
      for (let p = node.parentElement; p; p = p.parentElement) {
        if (KASHIDA_SKIP.has(p.tagName.toUpperCase())) return NodeFilter.FILTER_REJECT;
        if (p.getAttribute && p.getAttribute('dir') === 'ltr') return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(n => { n.nodeValue = kashida(n.nodeValue); });
}

/* ===================== Content ===================== */
/* Left over from the old standalone admin page, which saved drafts here.
   Nothing writes this key any more; it is still read so a draft left in
   someone's browser keeps working until they clear it. */
function loadContent() {
  try {
    const draft = localStorage.getItem('elawaadyDraft');
    if (draft) return JSON.parse(draft);
  } catch (e) {}
  return window.SITE_CONTENT;
}

const C = loadContent();
const WHATSAPP = C.meta.whatsapp;

/* ===================== State ===================== */
let lang  = 'ar';
let theme = 'dark';
let openCategory = null;
let query = '';

try {
  lang  = localStorage.getItem('elawaadyLang')  || 'ar';
  theme = localStorage.getItem('elawaadyTheme') || 'dark';
} catch (e) {}

const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const t   = (item) => item[lang];
const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
const txt = (id, s)    => { const el = document.getElementById(id); if (el) el.textContent = s; };
const chips = (arr) => arr.map(x => `<span>${esc(x)}</span>`).join('');
const L = (ar, en) => lang === 'ar' ? ar : en;

/* ===================== Search ===================== */
/* A category matches if its own text matches, or any of its items do. When a
   query is active, only the matching items inside a category are shown. */
function matchCat(cat) {
  if (!query) return { hit: true, items: cat.items };
  const q = stripKashida(query).toLowerCase().trim();
  const inTitle = t(cat).join(' ').toLowerCase().includes(q);
  const items = cat.items.filter(i => (i.ar + ' ' + i.en).toLowerCase().includes(q));
  if (inTitle) return { hit: true, items: cat.items };
  return { hit: items.length > 0, items };
}

/* ===================== Renderers ===================== */
function renderHero() {
  txt('heroBadge',  t(C.hero.badge));
  txt('heroTitle',  t(C.hero.title));
  txt('heroTitle2', t(C.hero.title2));
  txt('heroDesc',   t(C.hero.desc));
  txt('heroCta1',   t(C.hero.cta1));
  txt('heroCta2',   t(C.hero.cta2));
  txt('searchGo',   L('بحث', 'Search'));
  const input = document.getElementById('searchInput');
  input.placeholder = t(C.hero.search);
  input.value = query;

  set('heroFeatures', C.hero.features.map(f =>
    `<span><svg class="ic"><use href="#${esc(f.icon)}"/></svg>${esc(t(f))}</span>`).join(''));
}

function renderStats() {
  const live = C.stats.filter(s => Number(s.value) > 0);
  set('statsBand', live.map(s => `
    <div class="stat glass reveal">
      <svg class="ic"><use href="#${esc(s.icon)}"/></svg>
      <strong data-count="${Number(s.value)}" data-suffix="${esc(s.suffix || '')}">0</strong>
      <span>${esc(t(s))}</span>
    </div>`).join(''));
}

function renderAbout() {
  txt('aboutName', t(C.meta.name));
  txt('aboutRole', t(C.meta.role));
  set('aboutParas', C.about.paras[lang].map(p => `<p>${esc(p)}</p>`).join(''));
  set('aboutPoints', C.about.points.map(p =>
    `<li><svg class="ic"><use href="#${esc(p.icon)}"/></svg><span>${esc(t(p))}</span></li>`).join(''));
  set('aboutCards', C.about.cards.map(c => {
    const [label, value] = t(c);
    return `<div class="mini-card glass"><svg class="ic"><use href="#${esc(c.icon)}"/></svg>
      <h4>${esc(label)}</h4><p>${esc(value)}</p></div>`;
  }).join(''));
}

function renderExpertise() {
  const results = C.expertise.map(cat => ({ cat, ...matchCat(cat) })).filter(r => r.hit);
  const totalItems = C.expertise.reduce((n, c) => n + c.items.length, 0);

  txt('expertiseCount', query
    ? L(`${results.length} مجال فيهم نتيجة لبحثك`, `${results.length} areas match your search`)
    : L(`${C.expertise.length} مجال خبرة و${totalItems} تخصص فرعي`,
        `${C.expertise.length} areas of expertise across ${totalItems} specialisms`));

  /* Filter row */
  set('filterRow',
    `<button data-cat="" class="${openCategory ? '' : 'on'}">${esc(L('الكل', 'All'))}</button>` +
    C.expertise.map(c =>
      `<button data-cat="${esc(c.id)}" class="${openCategory === c.id ? 'on' : ''}">${esc(t(c)[0])}</button>`).join(''));

  if (!results.length) {
    set('catGrid', `<div class="empty" style="grid-column:1/-1">
      <svg class="ic"><use href="#i-search"/></svg>
      ${esc(L('مفيش نتائج للبحث ده. جرّب كلمة تانية.', 'Nothing matched that search. Try another word.'))}
    </div>`);
    set('catDetail', '');
    return;
  }

  set('catGrid', results.map(({ cat, items }) => {
    const [title, desc] = t(cat);
    const shown = items.slice(0, 3);
    const rest  = items.length - shown.length;
    return `<article class="cat-card glass reveal" data-cat="${esc(cat.id)}">
      <div class="cat-icon"><svg class="ic"><use href="#${esc(cat.icon)}"/></svg></div>
      <h3>${esc(title)}</h3>
      <p>${esc(desc)}</p>
      <div class="cat-chips">
        ${shown.map(i => `<span>${esc(t(i))}</span>`).join('')}
        ${rest > 0 ? `<span class="more">+${rest}</span>` : ''}
      </div>
      <div class="cat-foot">
        <span class="cat-count">${items.length} ${esc(L('تخصص', 'specialisms'))}</span>
        <button class="cat-open" type="button" data-open="${esc(cat.id)}">
          ${esc(L('اعرض الكل', 'View all'))} <svg class="ic"><use href="#i-arrow"/></svg>
        </button>
      </div>
    </article>`;
  }).join(''));

  /* Expanded band for the open category */
  const open = openCategory && results.find(r => r.cat.id === openCategory);
  if (!open) { set('catDetail', ''); return; }

  const [title, desc] = t(open.cat);
  set('catDetail', `
    <div class="detail-band glass">
      <div class="band-head">
        <div class="cat-icon"><svg class="ic"><use href="#${esc(open.cat.icon)}"/></svg></div>
        <div><h3>${esc(title)}</h3><small>${open.items.length} ${esc(L('تخصص', 'specialisms'))}</small></div>
        <button class="band-close" type="button" data-close="1">
          ${esc(L('إغلاق', 'Close'))} <svg class="ic"><use href="#i-close"/></svg>
        </button>
      </div>
      <div class="sub-grid">
        ${open.items.map(i => `<div class="sub-card">
          <svg class="ic"><use href="#${esc(open.cat.icon)}"/></svg>
          <strong>${esc(i.ar)}</strong><em dir="ltr">${esc(i.en)}</em>
        </div>`).join('')}
      </div>
    </div>`);
}

function renderBuilds() {
  set('buildsGrid', C.builds.map(b => {
    const [title, desc] = t(b);
    return `<article class="card glass reveal">
      <div class="card-icon"><svg class="ic"><use href="#${esc(b.icon)}"/></svg></div>
      <h3>${esc(title)}</h3><p>${esc(desc)}</p>
    </article>`;
  }).join(''));
}

function renderCase() {
  const cs = C.caseStudy, c = cs[lang];
  const arw = lang === 'ar' ? '←' : '→';   // the arrow has to follow the reading direction
  const flow = (arr, cls) => `<div class="flow ${cls}">${arr.map((s, i) =>
    `${i ? `<span class="arw">${arw}</span>` : ''}<i>${esc(s)}</i>`).join('')}</div>`;

  set('caseBody', `
    <div class="case-head">
      <div class="case-badge"><svg class="ic"><use href="#i-chip"/></svg></div>
      <div><h3>${esc(c.title)}</h3><span class="case-role">${esc(c.role)} &nbsp;•&nbsp; ${esc(c.cat)}</span></div>
    </div>
    <p class="case-lead">${esc(c.lead)}</p>
    <div class="case-cols">
      <div class="case-col"><h4>${esc(c.conceptTitle)}</h4><div class="chip-list">${chips(cs.parties)}</div></div>
      <div class="case-col"><h4>${esc(c.featuresTitle)}</h4><div class="chip-list">${chips(cs.features)}</div></div>
      <div class="case-col"><h4>${esc(c.goalsTitle)}</h4><div class="chip-list">${chips(c.goals)}</div></div>
    </div>
    <div class="case-cols">
      <div class="case-col" style="grid-column:1/-1">
        <h4>${esc(c.escrowTitle)}</h4>
        <p class="case-lead" style="margin-block:0 4px">${esc(c.escrowLead)}</p>
        ${flow(c.flow, '')}
        ${flow(c.disputeFlow, 'dispute')}
        <ul class="rules">${c.rules.map(r =>
          `<li><svg class="ic"><use href="#i-check-circle"/></svg><span>${esc(r)}</span></li>`).join('')}</ul>
        <p class="case-lead" style="margin-block-end:0"><em>${esc(c.note)}</em></p>
      </div>
    </div>`);
}

function renderJourney() {
  set('timeline', C.journey.map(j => {
    const [title, role, desc] = t(j);
    return `<article class="tl-item reveal">
      <span class="tl-year">${esc(j.year)}</span>
      <h3>${esc(title)}</h3><span class="tl-role">${esc(role)}</span><p>${esc(desc)}</p>
    </article>`;
  }).join(''));
}

function renderApproach() {
  set('approachGrid', C.approach.map(a => {
    const [title, desc] = t(a);
    return `<article class="card glass reveal">
      <div class="card-icon"><svg class="ic"><use href="#${esc(a.icon)}"/></svg></div>
      <h3>${esc(title)}</h3><p>${esc(desc)}</p>
    </article>`;
  }).join(''));
}

/* ---------------------------------------------------------------------------
   القنوات والمجتمعات
   ---------------------------------------------------------------------------
   المصدر الوحيد للروابط هو links.js. الترتيب ثابت — القنوات الرسمية، بعدين
   جروبات فيسبوك، بعدين جروبات واتساب، وآخر حاجة قناة واتساب — وكل رابط
   بيفتح في تبويب جديد بـnoopener noreferrer.
--------------------------------------------------------------------------- */
const PLATFORM_ICON = {
  store:'i-store', whatsapp:'i-whatsapp', messenger:'i-chat', instagram:'i-palette',
  facebook:'i-users', telegram:'i-telegram', x:'i-sparkles', linkedin:'i-linkedin'
};

/* الاسم اللي بيظهر تحت العنوان — الدومين والمسار من غير https:// */
function prettyURL(url) {
  try {
    const u = new URL(url);
    return (u.hostname.replace(/^www\./, '') + u.pathname).replace(/\/$/, '');
  } catch (e) { return url; }
}

const siteLinks = () => (window.SITE_LINKS || []).filter(l => l.visible !== false);

/* أول رابط في نوع معيّن — بيتستخدم لزراير الواتساب الثابتة */
function firstLink(id, fallback) {
  const l = (window.SITE_LINKS || []).find(x => x.id === id);
  return l ? l.url : fallback;
}

function renderChannels() {
  const wrap = document.getElementById('channelsWrap');
  if (!wrap) return;

  const all = siteLinks();
  const groups = window.SITE_LINK_GROUPS || [];

  wrap.innerHTML = groups.map(g => {
    const rows = all.filter(l => l.type === g.type)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
    if (!rows.length) return '';
    return `
      <section class="chan-sec">
        <h3 class="chan-head">
          <span>${esc(L(g.ar, g.en))}</span>
          <span class="chan-n" dir="ltr">${rows.length}</span>
        </h3>
        <div class="chan-grid">
          ${rows.map(l => `
            <a class="chan" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">
              <svg class="ic"><use href="#${esc(PLATFORM_ICON[l.platform] || 'i-globe')}"/></svg>
              <span class="chan-txt">
                <strong>${esc(l.title)}</strong>
                <span dir="ltr">${esc(prettyURL(l.url))}</span>
              </span>
              <svg class="ic chan-go"><use href="#i-arrow"/></svg>
            </a>`).join('')}
        </div>
      </section>`;
  }).join('');
}

function renderContact() {
  const m = C.meta;
  /* الواتساب والتليجرام واللينكدإن بيتاخدوا من سجل الروابط عشان ما يبقاش
     فيه نسختين من نفس الرابط في المشروع. */
  const wa = firstLink('off-wa-main', `https://wa.me/${m.whatsapp}`);
  const tg = firstLink('off-tg-1',    `https://t.me/${m.telegram}`);
  const ln = firstLink('off-linkedin', `https://www.linkedin.com/in/${m.linkedin}`);
  const st = firstLink('off-store',    'https://elawaady.com');
  const pretty = '+' + String(m.whatsapp).replace(/^(\d{2})(\d{3})(\d{3})(\d{4}).*$/, '$1 $2 $3 $4');

  set('contactLinks', `
    <a class="contact-card glass wa" href="${esc(wa)}" target="_blank" rel="noopener noreferrer">
      <svg class="ic"><use href="#i-whatsapp"/></svg><div><strong>WhatsApp</strong><span dir="ltr">${esc(pretty)}</span></div></a>
    <a class="contact-card glass tg" href="${esc(tg)}" target="_blank" rel="noopener noreferrer">
      <svg class="ic"><use href="#i-telegram"/></svg><div><strong>Telegram</strong><span dir="ltr">${esc(prettyURL(tg))}</span></div></a>
    <a class="contact-card glass ml" href="mailto:${esc(m.email)}">
      <svg class="ic"><use href="#i-mail"/></svg><div><strong>${esc(L('البريد', 'Email'))}</strong><span dir="ltr">${esc(m.email)}</span></div></a>
    <a class="contact-card glass ln" href="${esc(ln)}" target="_blank" rel="noopener noreferrer">
      <svg class="ic"><use href="#i-linkedin"/></svg><div><strong>LinkedIn</strong><span dir="ltr">${esc(prettyURL(ln))}</span></div></a>
    <a class="contact-card glass st" href="${esc(st)}" target="_blank" rel="noopener noreferrer">
      <svg class="ic"><use href="#i-store"/></svg><div><strong>${esc(L('المتجر الرسمي', 'Official store'))}</strong><span dir="ltr">${esc(prettyURL(st))}</span></div></a>
    <a class="contact-card glass pr" href="app.html#/proofs">
      <svg class="ic"><use href="#i-shield"/></svg><div><strong>${esc(L('تعاملات سابقة', 'Past transactions'))}</strong><span>${esc(L('تجارب موثقة', 'Verified experiences'))}</span></div></a>`);

  set('footerSocial', `
    <a href="${esc(wa)}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><svg class="ic"><use href="#i-whatsapp"/></svg></a>
    <a href="${esc(tg)}" target="_blank" rel="noopener noreferrer" aria-label="Telegram"><svg class="ic"><use href="#i-telegram"/></svg></a>
    <a href="${esc(ln)}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg class="ic"><use href="#i-linkedin"/></svg></a>
    <a href="${esc(st)}" target="_blank" rel="noopener noreferrer" aria-label="Store"><svg class="ic"><use href="#i-store"/></svg></a>
    <a href="mailto:${esc(m.email)}" aria-label="Email"><svg class="ic"><use href="#i-mail"/></svg></a>`);

  txt('footerDomain', m.domain);
  document.getElementById('fabWa').href = wa;
}

function renderRest() {
  set('communitiesGrid', chips(C.communities));
  set('networkGrid', chips(C.network));
  txt('visionTitle', C.vision[lang][0]);
  txt('visionText',  C.vision[lang][1]);
}

/* ===================== Language & theme ===================== */
function render() {
  document.querySelectorAll('[data-ar][data-en]').forEach(el => {
    const v = el.getAttribute('data-' + lang);
    if (v != null) el.textContent = v;
  });

  renderHero(); renderStats(); renderAbout(); renderExpertise();
  renderBuilds(); renderCase(); renderJourney(); renderApproach();
  renderChannels(); renderContact(); renderRest();

  observeReveals();
  runCounters();
  startTyping();

  /* Last, so it sees both the static markup and everything just rendered. */
  if (KASHIDA && lang === 'ar') applyKashida(document.body);
  startTicker();
}

function applyLang(l) {
  lang = l;
  try { localStorage.setItem('elawaadyLang', l); } catch (e) {}
  document.documentElement.lang = l;
  document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('langBtn').textContent = l === 'ar' ? 'EN' : 'ع';
  render();
}

function applyTheme(mode) {
  theme = mode;
  try { localStorage.setItem('elawaadyTheme', mode); } catch (e) {}
  if (mode === 'light') document.documentElement.setAttribute('data-theme', 'light');
  else document.documentElement.removeAttribute('data-theme');
  document.querySelector('#themeBtn use')
    .setAttribute('href', mode === 'light' ? '#i-moon' : '#i-sun');
  document.getElementById('themeBtn').classList.toggle('on', mode === 'light');
}

/* ===================== Ticker ===================== */
let tickerTimer;
function startTicker() {
  clearInterval(tickerTimer);
  const el = document.getElementById('ticker');
  const lines = C.ticker[lang].map(s => (KASHIDA && lang === 'ar') ? kashida(s) : s);
  let i = 0;
  const show = () => {
    el.textContent = lines[i];
    el.style.animation = 'none';
    void el.offsetWidth;              // restart the entrance animation
    el.style.animation = '';
    i = (i + 1) % lines.length;
  };
  show();
  if (lines.length > 1) tickerTimer = setInterval(show, 4500);
}

/* ===================== Typing ===================== */
let typeTimer;
function startTyping() {
  clearTimeout(typeTimer);
  const el = document.getElementById('typed');
  const full = t(C.hero.accent);
  const word = (KASHIDA && lang === 'ar') ? kashida(full) : full;
  let i = 0;
  (function tick() {
    el.textContent = word.slice(0, i);
    if (i < word.length) { i++; typeTimer = setTimeout(tick, 55); }
  })();
}

/* ===================== Reveal & counters ===================== */
let revealObserver;
function observeReveals() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        revealObserver.unobserve(e.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -60px 0px' });
  }
  document.querySelectorAll('.reveal:not(.in)').forEach(el => revealObserver.observe(el));
}

function runCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / 1600, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-US') + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    })(start);
  });
}

/* ===================== Boot ===================== */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  applyTheme(theme);
  applyLang(lang);

  document.getElementById('langBtn').addEventListener('click', () => applyLang(lang === 'ar' ? 'en' : 'ar'));
  document.getElementById('themeBtn').addEventListener('click', () => applyTheme(theme === 'light' ? 'dark' : 'light'));

  /* Mobile menu */
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
  });
  navLinks.addEventListener('click', e => {
    if (e.target.tagName !== 'A') return;
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.querySelector('use').setAttribute('href', '#i-menu');
  });

  /* Search — live as you type, and the header icon jumps to the field */
  const searchInput = document.getElementById('searchInput');
  let searchTimer;
  searchInput.addEventListener('input', e => {
    clearTimeout(searchTimer);
    const v = e.target.value;
    searchTimer = setTimeout(() => {
      query = v;
      openCategory = null;
      renderExpertise();
      if (KASHIDA && lang === 'ar') applyKashida(document.getElementById('expertise'));
      observeReveals();
    }, 200);
  });
  document.getElementById('heroSearch').addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('expertise').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('searchBtn').addEventListener('click', () => {
    document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => searchInput.focus(), 500);
  });

  /* Category open / close / filter — delegated so re-renders keep working */
  document.getElementById('expertise').addEventListener('click', e => {
    const openBtn  = e.target.closest('[data-open]');
    const closeBtn = e.target.closest('[data-close]');
    const filter   = e.target.closest('.filter-row button');
    if (!openBtn && !closeBtn && !filter) return;

    if (closeBtn) openCategory = null;
    else if (openBtn) openCategory = openBtn.dataset.open;
    else openCategory = filter.dataset.cat || null;

    renderExpertise();
    if (KASHIDA && lang === 'ar') applyKashida(document.getElementById('expertise'));
    observeReveals();

    if (openCategory) {
      const band = document.querySelector('.detail-band');
      if (band) band.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  /* Scroll state */
  const nav = document.getElementById('nav');
  const toTop = document.getElementById('toTop');
  const sections = [...document.querySelectorAll('section[id], header[id]')];

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    toTop.classList.toggle('show', y > 600);
    const current = sections.filter(s => s.offsetTop - 140 <= y).pop();
    if (current) {
      document.querySelectorAll('.nav-links a').forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + current.id));
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Contact form -> WhatsApp */
  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    let ok = true;
    ['name', 'contact', 'message'].forEach(n => {
      const input = f.elements[n];
      const empty = !input.value.trim();
      input.classList.toggle('err', empty);
      if (empty) ok = false;
    });
    if (!ok) return;

    const T = lang === 'ar'
      ? { head: `رسالة من ${C.meta.domain}`, name: 'الاسم', contact: 'التواصل', topic: 'الموضوع', msg: 'التفاصيل' }
      : { head: `Message from ${C.meta.domain}`, name: 'Name', contact: 'Contact', topic: 'Topic', msg: 'Details' };

    /* The option labels are elongated on screen; what leaves the site is plain. */
    const text = stripKashida(
      `*${T.head}*\n\n` +
      `${T.name}: ${f.elements.name.value.trim()}\n` +
      `${T.contact}: ${f.elements.contact.value.trim()}\n` +
      `${T.topic}: ${f.elements.topic.value}\n` +
      `${T.msg}: ${f.elements.message.value.trim()}`);

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
});

/* ===================== Live content from the dashboard ===================== */
/* The owner dashboard (app.html#/admin → محتوى البورتفوليو) saves copy into a
   publicly-readable Firestore document, content/portfolio. One plain REST call
   fetches it — no SDK, no bundle. The page has already painted from content.js
   by the time this lands, so a slow or failed call changes nothing, and an
   empty field means "keep what content.js says". */
async function loadLiveContent() {
  const fb = window.FIREBASE_CONFIG || {};
  if (!fb.projectId || !fb.apiKey) return;

  let fields;
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${fb.projectId}` +
      `/databases/(default)/documents/content/portfolio?key=${fb.apiKey}`);
    if (!res.ok) return;                  // 404 = nothing saved yet
    fields = (await res.json()).fields;
  } catch (e) { return; }
  if (!fields) return;

  const val = (key, l) => {
    const f = fields[`${key}_${l}`];
    const v = f && typeof f.stringValue === 'string' ? f.stringValue.trim() : '';
    return v || null;
  };

  /* content.js entries are { ar, en } pairs — overwrite only what was filled in */
  const put = (key, target) => {
    const ar = val(key, 'ar'), en = val(key, 'en');
    if (ar) target.ar = ar;
    if (en) target.en = en;
    return Boolean(ar || en);
  };

  /* Two headings live in the markup rather than content.js; render() reads them
     back off the data-attributes, so writing there is enough. */
  const attr = (key, id) => {
    const el = document.getElementById(id);
    if (!el) return false;
    const ar = val(key, 'ar'), en = val(key, 'en');
    if (ar) el.setAttribute('data-ar', ar);
    if (en) el.setAttribute('data-en', en);
    return Boolean(ar || en);
  };

  const hits = [
    put('name',        C.meta.name),
    put('role',        C.meta.role),
    put('role',        C.hero.accent),
    put('heroTitle',   C.hero.title),
    put('heroTitle2',  C.hero.title2),
    put('heroDesc',    C.hero.desc),
    put('heroCta1',    C.hero.cta1),
    attr('proofsTitle', 'proofsTitle'),
    attr('proofsSub',   'proofsSub')
  ];

  if (hits.some(Boolean)) render();
}

document.addEventListener('DOMContentLoaded', () => { loadLiveContent(); }, { once: true });
