/* ===== لوحة تحكم elawaady-db.com =====
   تقرأ content.js، تخلي كل حاجة قابلة للتعديل، وفي الآخر تصدّر نسخة جديدة
   من الملف. مفيش أي مفتاح ولا اتصال بسيرفر — التعديلات في متصفحك لحد ما
   تصدّر الملف وترفعه بنفسك.
*/

const ORIGINAL = structuredClone(window.SITE_CONTENT);
const DRAFT_KEY = 'elawaadyDraft';

let data  = load();
let dirty = false;
let tab   = 'meta';

function load() {
  try {
    const d = localStorage.getItem(DRAFT_KEY);
    if (d) return JSON.parse(d);
  } catch (e) {}
  return structuredClone(ORIGINAL);
}

/* الأيقونات المتاحة — نفس اللي موجودة في الموقع */
const ICONS = ['i-chip','i-sparkles','i-code','i-megaphone','i-chart','i-swap','i-store','i-users',
               'i-layers','i-bolt','i-cart','i-globe','i-shield','i-clock','i-briefcase','i-pin',
               'i-palette','i-check-circle','i-search','i-diamond'];

const TABS = [
  { id:'meta',       name:'بياناتك',        count:() => null },
  { id:'hero',       name:'الواجهة',         count:() => data.hero.features.length },
  { id:'ticker',     name:'الشريط العلوي',   count:() => data.ticker.ar.length },
  { id:'stats',      name:'الأرقام',         count:() => data.stats.length },
  { id:'about',      name:'من أنا',          count:() => data.about.paras.ar.length },
  { id:'expertise',  name:'مجالات الخبرة',   count:() => data.expertise.length },
  { id:'builds',     name:'ما أبنيه',        count:() => data.builds.length },
  { id:'journey',    name:'الرحلة',          count:() => data.journey.length },
  { id:'approach',   name:'أسلوب العمل',     count:() => data.approach.length },
  { id:'lists',      name:'المجتمعات والشبكة', count:() => data.communities.length + data.network.length },
  { id:'vision',     name:'الرؤية',          count:() => null }
];

/* ===================== أدوات مساعدة ===================== */
const $  = (s, r = document) => r.querySelector(s);
const el = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));

function markDirty() {
  dirty = true;
  const s = el('status');
  s.textContent = 'فيه تعديلات مش متصدّرة';
  s.className = 'status dirty';
}

/* كل حقل بيمسك مساره في الداتا، فمفيش حاجة اسمها «نسيت أربط الحقل ده» */
function bind(path, opts = {}) {
  const { type = 'input', dir = 'auto', ph = '' } = opts;
  const val = get(path);
  const common = `data-path="${esc(path)}" dir="${dir}" placeholder="${esc(ph)}"`;
  if (type === 'textarea') return `<textarea ${common}>${esc(val)}</textarea>`;
  if (type === 'number')   return `<input type="number" min="0" ${common} value="${esc(val)}">`;
  if (type === 'icon') {
    return `<select ${common}>${ICONS.map(i =>
      `<option value="${i}" ${i === val ? 'selected' : ''}>${i}</option>`).join('')}</select>`;
  }
  return `<input type="text" ${common} value="${esc(val)}">`;
}

function get(path) {
  return path.split('.').reduce((o, k) => o?.[/^\d+$/.test(k) ? Number(k) : k], data);
}
function put(path, value) {
  const keys = path.split('.');
  const last = keys.pop();
  const obj  = keys.reduce((o, k) => o[/^\d+$/.test(k) ? Number(k) : k], data);
  obj[/^\d+$/.test(last) ? Number(last) : last] = value;
}

const field = (label, badge, inner) =>
  `<div class="field"><label>${esc(label)}${badge ? `<span class="lg">${esc(badge)}</span>` : ''}</label>${inner}</div>`;

const pair = (label, base, opts) => `<div class="row">
  ${field(label, 'عربي', bind(base + '.ar', { ...opts, dir:'rtl' }))}
  ${field(label, 'EN',   bind(base + '.en', { ...opts, dir:'ltr' }))}
</div>`;

/* عنصر في قائمة: عنوان + أزرار ترتيب وحذف */
function itemHead(title, list, i) {
  return `<div class="item-head">
    <b>${esc(title)}</b>
    <div class="spacer"></div>
    <button class="move" data-move="${list}:${i}:-1" ${i === 0 ? 'disabled' : ''} title="فوق">↑</button>
    <button class="move" data-move="${list}:${i}:1" ${i === get(list).length - 1 ? 'disabled' : ''} title="تحت">↓</button>
    <button class="icon-x" data-del="${list}:${i}" title="حذف">×</button>
  </div>`;
}

/* ===================== الشاشات ===================== */
const VIEWS = {

  meta: () => `
    <div class="panel"><h3>بياناتك</h3>
      ${field('الدومين', '', bind('meta.domain', { dir:'ltr' }))}
      <div class="row">
        ${field('رقم واتساب (بكود الدولة، من غير +)', '', bind('meta.whatsapp', { dir:'ltr', ph:'201055578777' }))}
        ${field('يوزر تليجرام (من غير @)', '', bind('meta.telegram', { dir:'ltr' }))}
      </div>
      <div class="row">
        ${field('البريد', '', bind('meta.email', { dir:'ltr' }))}
        ${field('لينكدإن (اليوزر بس)', '', bind('meta.linkedin', { dir:'ltr' }))}
      </div>
      ${pair('الاسم', 'meta.name')}
      ${pair('المسمى الوظيفي', 'meta.role')}
    </div>`,

  hero: () => `
    <div class="panel"><h3>الواجهة الرئيسية</h3>
      ${pair('الشارة فوق العنوان', 'hero.badge')}
      ${pair('العنوان — السطر الأول', 'hero.title')}
      ${pair('العنوان — السطر التاني', 'hero.title2')}
      ${pair('السطر المتحرك تحت العنوان', 'hero.accent')}
      ${pair('الوصف', 'hero.desc', { type:'textarea' })}
      ${pair('نص خانة البحث', 'hero.search')}
      <div class="row">
        ${pair('زرار أساسي', 'hero.cta1')}
        ${pair('زرار ثانوي', 'hero.cta2')}
      </div>
    </div>

    <div class="panel"><h3>المميزات تحت الأزرار</h3>
      ${data.hero.features.map((f, i) => `<div class="item">
        ${itemHead('ميزة ' + (i + 1), 'hero.features', i)}
        ${field('الأيقونة', '', bind(`hero.features.${i}.icon`, { type:'icon' }))}
        ${pair('النص', `hero.features.${i}`)}
      </div>`).join('')}
      <button class="add" data-add="hero.features">+ إضافة ميزة</button>
    </div>`,

  ticker: () => `
    <div class="panel"><h3>الجُمل اللي بتلف في الشريط العلوي</h3>
      <p class="hint">كل جملة بتظهر ٤ ثواني وبعدين اللي بعدها. لازم عدد الجمل العربي = الإنجليزي.</p>
      ${data.ticker.ar.map((_, i) => `<div class="item">
        ${itemHead('جملة ' + (i + 1), 'ticker.ar', i)}
        <div class="row">
          ${field('الجملة', 'عربي', bind(`ticker.ar.${i}`, { dir:'rtl' }))}
          ${field('الجملة', 'EN',   bind(`ticker.en.${i}`, { dir:'ltr' }))}
        </div>
      </div>`).join('')}
      <button class="add" data-add="ticker">+ إضافة جملة</button>
    </div>`,

  stats: () => `
    <div class="panel"><h3>الأرقام</h3>
      <p class="hint">حطّ أرقامك الحقيقية. أي رقم تخليه <b>صفر</b> هيختفي من الموقع تمامًا.</p>
      ${data.stats.map((s, i) => `<div class="item">
        ${itemHead('رقم ' + (i + 1), 'stats', i)}
        <div class="row">
          ${field('الرقم', '', bind(`stats.${i}.value`, { type:'number' }))}
          ${field('علامة بعده', '', bind(`stats.${i}.suffix`, { dir:'ltr', ph:'+' }))}
        </div>
        ${field('الأيقونة', '', bind(`stats.${i}.icon`, { type:'icon' }))}
        ${pair('التسمية', `stats.${i}`)}
      </div>`).join('')}
      <button class="add" data-add="stats">+ إضافة رقم</button>
    </div>`,

  about: () => `
    <div class="panel"><h3>فقرات «من أنا»</h3>
      ${data.about.paras.ar.map((_, i) => `<div class="item">
        ${itemHead('فقرة ' + (i + 1), 'about.paras.ar', i)}
        <div class="row">
          ${field('الفقرة', 'عربي', bind(`about.paras.ar.${i}`, { type:'textarea', dir:'rtl' }))}
          ${field('الفقرة', 'EN',   bind(`about.paras.en.${i}`, { type:'textarea', dir:'ltr' }))}
        </div>
      </div>`).join('')}
      <button class="add" data-add="about.paras">+ إضافة فقرة</button>
    </div>

    <div class="panel"><h3>النقاط بالأيقونات</h3>
      ${data.about.points.map((p, i) => `<div class="item">
        ${itemHead('نقطة ' + (i + 1), 'about.points', i)}
        ${field('الأيقونة', '', bind(`about.points.${i}.icon`, { type:'icon' }))}
        ${pair('النص', `about.points.${i}`)}
      </div>`).join('')}
      <button class="add" data-add="about.points">+ إضافة نقطة</button>
    </div>

    <div class="panel"><h3>الكروت الصغيرة جنب الصورة</h3>
      ${data.about.cards.map((c, i) => `<div class="item">
        ${itemHead('كارت ' + (i + 1), 'about.cards', i)}
        ${field('الأيقونة', '', bind(`about.cards.${i}.icon`, { type:'icon' }))}
        <div class="row">
          ${field('العنوان', 'عربي', bind(`about.cards.${i}.ar.0`, { dir:'rtl' }))}
          ${field('العنوان', 'EN',   bind(`about.cards.${i}.en.0`, { dir:'ltr' }))}
        </div>
        <div class="row">
          ${field('القيمة', 'عربي', bind(`about.cards.${i}.ar.1`, { dir:'rtl' }))}
          ${field('القيمة', 'EN',   bind(`about.cards.${i}.en.1`, { dir:'ltr' }))}
        </div>
      </div>`).join('')}
      <button class="add" data-add="about.cards">+ إضافة كارت</button>
    </div>`,

  expertise: () => `
    <div class="panel"><h3>مجالات الخبرة</h3>
      <p class="hint">كل مجال بيطلع ككارت في الموقع، وجواه التخصصات اللي تحته.</p>
    </div>
    ${data.expertise.map((c, i) => `<div class="panel">
      ${itemHead(c.ar[0] || 'مجال ' + (i + 1), 'expertise', i)}
      ${field('الأيقونة', '', bind(`expertise.${i}.icon`, { type:'icon' }))}
      <div class="row">
        ${field('العنوان', 'عربي', bind(`expertise.${i}.ar.0`, { dir:'rtl' }))}
        ${field('العنوان', 'EN',   bind(`expertise.${i}.en.0`, { dir:'ltr' }))}
      </div>
      <div class="row">
        ${field('الوصف', 'عربي', bind(`expertise.${i}.ar.1`, { type:'textarea', dir:'rtl' }))}
        ${field('الوصف', 'EN',   bind(`expertise.${i}.en.1`, { type:'textarea', dir:'ltr' }))}
      </div>
      <div class="sub-items">
        <label style="font-size:.8rem;font-weight:700;color:var(--muted)">التخصصات (${c.items.length})</label>
        ${c.items.map((it, j) => `<div class="sub-row">
          <input type="text" dir="rtl" data-path="expertise.${i}.items.${j}.ar" value="${esc(it.ar)}" placeholder="بالعربي">
          <input type="text" dir="ltr" data-path="expertise.${i}.items.${j}.en" value="${esc(it.en)}" placeholder="In English">
          <button class="icon-x" data-del="expertise.${i}.items:${j}">×</button>
        </div>`).join('')}
        <button class="add" data-add="expertise.${i}.items">+ إضافة تخصص</button>
      </div>
    </div>`).join('')}
    <button class="add" data-add="expertise">+ إضافة مجال خبرة</button>`,

  builds: () => `
    <div class="panel"><h3>ما أبنيه</h3>
      ${data.builds.map((b, i) => `<div class="item">
        ${itemHead(b.ar[0] || 'عنصر ' + (i + 1), 'builds', i)}
        ${field('الأيقونة', '', bind(`builds.${i}.icon`, { type:'icon' }))}
        <div class="row">
          ${field('العنوان', 'عربي', bind(`builds.${i}.ar.0`, { dir:'rtl' }))}
          ${field('العنوان', 'EN',   bind(`builds.${i}.en.0`, { dir:'ltr' }))}
        </div>
        <div class="row">
          ${field('الوصف', 'عربي', bind(`builds.${i}.ar.1`, { type:'textarea', dir:'rtl' }))}
          ${field('الوصف', 'EN',   bind(`builds.${i}.en.1`, { type:'textarea', dir:'ltr' }))}
        </div>
      </div>`).join('')}
      <button class="add" data-add="builds">+ إضافة عنصر</button>
    </div>`,

  journey: () => `
    <div class="panel"><h3>محطات الرحلة</h3>
      ${data.journey.map((j, i) => `<div class="item">
        ${itemHead(j.year + ' — ' + (j.ar[0] || ''), 'journey', i)}
        ${field('السنة', '', bind(`journey.${i}.year`, { dir:'ltr' }))}
        <div class="row">
          ${field('العنوان', 'عربي', bind(`journey.${i}.ar.0`, { dir:'rtl' }))}
          ${field('العنوان', 'EN',   bind(`journey.${i}.en.0`, { dir:'ltr' }))}
        </div>
        <div class="row">
          ${field('الدور', 'عربي', bind(`journey.${i}.ar.1`, { dir:'rtl' }))}
          ${field('الدور', 'EN',   bind(`journey.${i}.en.1`, { dir:'ltr' }))}
        </div>
        <div class="row">
          ${field('الوصف', 'عربي', bind(`journey.${i}.ar.2`, { type:'textarea', dir:'rtl' }))}
          ${field('الوصف', 'EN',   bind(`journey.${i}.en.2`, { type:'textarea', dir:'ltr' }))}
        </div>
      </div>`).join('')}
      <button class="add" data-add="journey">+ إضافة محطة</button>
    </div>`,

  approach: () => `
    <div class="panel"><h3>أسلوب العمل</h3>
      ${data.approach.map((a, i) => `<div class="item">
        ${itemHead(a.ar[0] || 'عنصر ' + (i + 1), 'approach', i)}
        ${field('الأيقونة', '', bind(`approach.${i}.icon`, { type:'icon' }))}
        <div class="row">
          ${field('العنوان', 'عربي', bind(`approach.${i}.ar.0`, { dir:'rtl' }))}
          ${field('العنوان', 'EN',   bind(`approach.${i}.en.0`, { dir:'ltr' }))}
        </div>
        <div class="row">
          ${field('الوصف', 'عربي', bind(`approach.${i}.ar.1`, { type:'textarea', dir:'rtl' }))}
          ${field('الوصف', 'EN',   bind(`approach.${i}.en.1`, { type:'textarea', dir:'ltr' }))}
        </div>
      </div>`).join('')}
      <button class="add" data-add="approach">+ إضافة عنصر</button>
    </div>`,

  lists: () => `
    <div class="panel"><h3>المجتمعات</h3>
      ${data.communities.map((c, i) => `<div class="sub-row" style="margin-bottom:8px">
        <input type="text" dir="ltr" data-path="communities.${i}" value="${esc(c)}" style="grid-column:1/3">
        <button class="icon-x" data-del="communities:${i}">×</button>
      </div>`).join('')}
      <button class="add" data-add="communities">+ إضافة</button>
    </div>

    <div class="panel"><h3>الشبكة المهنية</h3>
      ${data.network.map((n, i) => `<div class="sub-row" style="margin-bottom:8px">
        <input type="text" dir="ltr" data-path="network.${i}" value="${esc(n)}" style="grid-column:1/3">
        <button class="icon-x" data-del="network:${i}">×</button>
      </div>`).join('')}
      <button class="add" data-add="network">+ إضافة</button>
    </div>`,

  vision: () => `
    <div class="panel"><h3>الرؤية</h3>
      <div class="row">
        ${field('العنوان', 'عربي', bind('vision.ar.0', { dir:'rtl' }))}
        ${field('العنوان', 'EN',   bind('vision.en.0', { dir:'ltr' }))}
      </div>
      <div class="row">
        ${field('النص', 'عربي', bind('vision.ar.1', { type:'textarea', dir:'rtl' }))}
        ${field('النص', 'EN',   bind('vision.en.1', { type:'textarea', dir:'ltr' }))}
      </div>
    </div>

    <div class="panel"><h3>دراسة الحالة</h3>
      <p class="hint">دراسة الحالة فيها تفاصيل كتير ومتشعبة، فتعديلها من ملف <b>content.js</b> مباشرة
      أوضح وأسرع — دوّر على <code>caseStudy</code>. أي تعديل تعمله هناك بيفضل موجود لما تصدّر من هنا.</p>
    </div>`
};

/* ===================== الإضافة والحذف ===================== */
const BLANKS = {
  'hero.features':  () => ({ icon:'i-bolt', ar:'ميزة جديدة', en:'New feature' }),
  'stats':          () => ({ icon:'i-layers', value:0, suffix:'+', ar:'تسمية', en:'Label' }),
  'about.points':   () => ({ icon:'i-check-circle', ar:'نقطة جديدة', en:'New point' }),
  'about.cards':    () => ({ icon:'i-briefcase', ar:['عنوان','قيمة'], en:['Title','Value'] }),
  'builds':         () => ({ icon:'i-chip', ar:['عنوان','وصف'], en:['Title','Description'] }),
  'approach':       () => ({ icon:'i-check-circle', ar:['عنوان','وصف'], en:['Title','Description'] }),
  'journey':        () => ({ year:String(new Date().getFullYear()), ar:['عنوان','الدور','وصف'], en:['Title','Role','Description'] }),
  'expertise':      () => ({ id:'cat' + Date.now(), icon:'i-chip', ar:['مجال جديد','وصف المجال'],
                             en:['New area','Area description'], items:[{ ar:'تخصص', en:'Specialism' }] }),
  'communities':    () => 'New Community',
  'network':        () => 'New Role'
};

function addTo(path) {
  /* الحقول اللي ليها نسختين متوازيتين لازم يزيدوا مع بعض */
  if (path === 'ticker')            { data.ticker.ar.push('جملة جديدة'); data.ticker.en.push('New line'); }
  else if (path === 'about.paras')  { data.about.paras.ar.push('فقرة جديدة'); data.about.paras.en.push('New paragraph'); }
  else if (/^expertise\.\d+\.items$/.test(path)) get(path).push({ ar:'تخصص', en:'Specialism' });
  else if (BLANKS[path])            get(path).push(BLANKS[path]());
  else return;
  markDirty(); renderPanel();
}

function delFrom(spec) {
  const idx  = Number(spec.slice(spec.lastIndexOf(':') + 1));
  const path = spec.slice(0, spec.lastIndexOf(':'));

  if (path === 'ticker.ar')          { data.ticker.ar.splice(idx, 1); data.ticker.en.splice(idx, 1); }
  else if (path === 'about.paras.ar'){ data.about.paras.ar.splice(idx, 1); data.about.paras.en.splice(idx, 1); }
  else get(path).splice(idx, 1);

  markDirty(); renderPanel();
}

function moveIn(spec) {
  const [path, iStr, dStr] = spec.split(':');
  const i = Number(iStr), d = Number(dStr), j = i + d;
  const swap = (arr) => { if (j < 0 || j >= arr.length) return; [arr[i], arr[j]] = [arr[j], arr[i]]; };

  if (path === 'ticker.ar')           { swap(data.ticker.ar); swap(data.ticker.en); }
  else if (path === 'about.paras.ar') { swap(data.about.paras.ar); swap(data.about.paras.en); }
  else swap(get(path));

  markDirty(); renderPanel();
}

/* ===================== التصدير ===================== */
const HEADER = `/* ===========================================================================
   محتوى موقع elawaady-db.com
   ===========================================================================
   الملف ده اتولّد من لوحة التحكم (admin.html).
   تقدر تعدّله بإيدك، أو تفتح اللوحة تاني وتعدّل وتصدّر نسخة جديدة.
=========================================================================== */

window.SITE_CONTENT = `;

function exportFile() {
  const body = JSON.stringify(data, null, 2)
    /* اسم المفتاح من غير علامات تنصيص لما يكون اسم صالح — عشان الملف يفضل مقروء */
    .replace(/^(\s*)"([A-Za-z_$][\w$]*)":/gm, '$1$2:');

  const blob = new Blob([HEADER + body + ';\n'], { type:'text/javascript;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'content.js';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);

  saveDraft();
  const s = el('status');
  s.textContent = 'اتصدّر ✓ ارفعه على GitHub مكان القديم';
  s.className = 'status ok';
  dirty = false;
}

function saveDraft() {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    const s = el('status');
    s.textContent = 'المسودة اتحفظت';
    s.className = 'status ok';
  } catch (e) {
    const s = el('status');
    s.textContent = 'المتصفح رفض الحفظ — صدّر الملف بدل ما تفقد التعديلات';
    s.className = 'status dirty';
  }
}

function importFile(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const text = String(r.result);
      const start = text.indexOf('{');
      const end   = text.lastIndexOf('}');
      if (start === -1 || end === -1) throw new Error('مفيش محتوى');
      /* eslint-disable-next-line no-new-func */
      const parsed = Function('"use strict";return (' + text.slice(start, end + 1) + ')')();
      if (!parsed || !parsed.meta || !parsed.expertise) throw new Error('الملف مش شكله ملف محتوى');
      data = parsed;
      markDirty(); renderTabs(); renderPanel();
      el('status').textContent = 'الملف اتقرا ✓';
    } catch (err) {
      alert('مقدرتش أقرا الملف: ' + err.message);
    }
  };
  r.readAsText(file);
}

/* ===================== الرسم ===================== */
function renderTabs() {
  el('tabs').innerHTML = TABS.map(t => {
    const n = t.count();
    return `<button data-tab="${t.id}" class="${tab === t.id ? 'on' : ''}">
      <span>${t.name}</span>${n != null ? `<span class="n">${n}</span>` : ''}
    </button>`;
  }).join('');
}

function renderPanel() {
  el('tabTitle').textContent = TABS.find(t => t.id === tab).name;
  el('panel').innerHTML = VIEWS[tab]();
  renderTabs();
}

/* ===================== الأحداث ===================== */
document.addEventListener('input', e => {
  const path = e.target.dataset.path;
  if (!path) return;
  put(path, e.target.type === 'number' ? Number(e.target.value) : e.target.value);
  markDirty();
});

document.addEventListener('click', e => {
  const tabBtn = e.target.closest('[data-tab]');
  const addBtn = e.target.closest('[data-add]');
  const delBtn = e.target.closest('[data-del]');
  const movBtn = e.target.closest('[data-move]');

  if (tabBtn) { tab = tabBtn.dataset.tab; renderPanel(); window.scrollTo({ top:0 }); }
  else if (addBtn) addTo(addBtn.dataset.add);
  else if (delBtn) { if (confirm('تحذف العنصر ده؟')) delFrom(delBtn.dataset.del); }
  else if (movBtn) moveIn(movBtn.dataset.move);
});

el('btnExport').addEventListener('click', exportFile);
el('btnSave').addEventListener('click', saveDraft);
el('fileIn').addEventListener('change', e => { if (e.target.files[0]) importFile(e.target.files[0]); });
el('btnReset').addEventListener('click', () => {
  if (!confirm('هيرجع كل حاجة زي ما هي في الملف المرفوع، وتفقد أي تعديل مش متصدّر. تكمّل؟')) return;
  localStorage.removeItem(DRAFT_KEY);
  data = structuredClone(ORIGINAL);
  dirty = false;
  renderPanel();
  el('status').textContent = 'رجع للأصلي';
  el('status').className = 'status';
});

window.addEventListener('beforeunload', e => { if (dirty) e.preventDefault(); });

/* البداية */
renderPanel();
el('status').textContent = localStorage.getItem(DRAFT_KEY) ? 'فيه مسودة محفوظة' : 'جاهز';
