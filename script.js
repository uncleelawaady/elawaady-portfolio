/* ===== Ahmed Elawaady — Personal Digital Portfolio (elawaady-db.com) =====
   Every piece of editable copy lives in the DATA block below.
   Each entry carries an Arabic (ar) and an English (en) version.
*/

const WHATSAPP = '201055578777';

/* ---------------------------------------------------------------------------
   STATS — set these to your real figures before sharing the site.
   They are the only numbers on the page, so they should be ones you can stand
   behind. Leave a value as null to hide that tile entirely.
--------------------------------------------------------------------------- */
const STATS = [
  { icon:'i-layers',   value:12,  suffix:'+', ar:'مشروع تم بناؤه',    en:'Projects built' },
  { icon:'i-chip',     value:4,   suffix:'',  ar:'منصات رقمية',       en:'Digital platforms' },
  { icon:'i-users',    value:20,  suffix:'+', ar:'مجتمع رقمي',        en:'Communities' },
  { icon:'i-swap',     value:30,  suffix:'+', ar:'خدمة تُدار',        en:'Services managed' },
  { icon:'i-code',     value:25,  suffix:'+', ar:'تقنية وأداة',       en:'Technologies' },
  { icon:'i-clock',    value:8,   suffix:'+', ar:'سنوات خبرة',        en:'Years of experience' }
];

const DATA = {
  /* Rotating line under the name */
  typed: {
    ar: ['رائد أعمال رقمي', 'مؤسس منصات', 'باني أنظمة رقمية', 'مطوّر حلول ذكاء اصطناعي'],
    en: ['Digital Entrepreneur', 'Platform Founder', 'Digital Systems Builder', 'AI Solutions Developer']
  },

  marquee: {
    ar: ['ريادة أعمال رقمية','منصات رقمية','ذكاء اصطناعي','أتمتة العمليات','تطوير الويب','تجارة إلكترونية','بناء المجتمعات','أنظمة وساطة','تسويق رقمي','تطوير الأعمال'],
    en: ['Digital Entrepreneurship','Digital Platforms','Artificial Intelligence','Workflow Automation','Web Development','E-Commerce','Community Building','Escrow Systems','Digital Marketing','Business Development']
  },

  /* Areas of Expertise — rendered as pills, not a bullet list */
  expertise: [
    'Digital Entrepreneurship','Digital Platforms','E-Commerce','Social Media Business',
    'AI Solutions','Workflow Automation','Web Development','Bot Development',
    'Digital Marketing','Media Buying','Platform Operations','Escrow Systems',
    'Community Building','Business Development'
  ],

  /* What I Build */
  builds: [
    { icon:'i-chip',      ar:['المنصات','بناء منصات رقمية كاملة بحسابات ولوحات تحكم وعمليات تشغيل حقيقية.'],           en:['Platforms','Complete digital platforms with accounts, dashboards and real operating flows.'] },
    { icon:'i-store',     ar:['الأسواق الرقمية','ربط العميل والتاجر والمورد والخدمة داخل سوق واحد منظم.'],              en:['Marketplaces','Connecting customer, merchant, supplier and service inside one organised market.'] },
    { icon:'i-users',     ar:['المجتمعات','تحويل التجمعات العشوائية إلى مجتمعات منظمة لها قواعد وقيمة.'],               en:['Communities','Turning scattered groups into organised communities with rules and value.'] },
    { icon:'i-bolt',      ar:['الأتمتة','أنظمة تتولى العمل المتكرر بدل ما يتعمل يدوي كل مرة.'],                        en:['Automation','Systems that take over repetitive work instead of doing it by hand every time.'] },
    { icon:'i-sparkles',  ar:['تدفقات الذكاء الاصطناعي','دمج أدوات الـ AI داخل سير العمل، مش استخدامها بشكل منفصل.'],  en:['AI workflows','Weaving AI tools into the workflow itself, not using them off to the side.'] },
    { icon:'i-swap',      ar:['أنظمة الوساطة','تنظيم المعاملات الرقمية بحيث تكون حقوق كل طرف موثقة.'],                 en:['Escrow systems','Structuring digital transactions so every party’s rights are documented.'] },
    { icon:'i-cart',      ar:['التجارة الإلكترونية','متاجر ومنتجات رقمية بعمليات طلب ودفع وتسليم مترابطة.'],           en:['E-Commerce','Stores and digital products with order, payment and delivery wired together.'] },
    { icon:'i-globe',     ar:['المنظومات المتكاملة','ربط التقنية والتجارة والتشغيل والعميل داخل تجربة واحدة.'],        en:['Business ecosystems','Technology, commerce, operations and customer inside a single experience.'] }
  ],

  /* Capability groups — each a card with its own list */
  capabilities: [
    {
      icon:'i-megaphone',
      ar:['المنصات الاجتماعية','خبرة تشغيلية في إدارة وتطوير ونقل ملكية الحسابات عبر المنصات الكبرى.'],
      en:['Social platforms','Operational experience managing, growing and transferring accounts across the major platforms.'],
      items:['TikTok','YouTube','Facebook','Instagram','Snapchat','X / Twitter','Telegram']
    },
    {
      icon:'i-badge',
      ar:['التوثيق','عمليات التوثيق تخضع دائمًا لمتطلبات وسياسات كل منصة، وكل حالة تُقيَّم بشكل مستقل دون وعود غير واقعية.'],
      en:['Platform verification','Verification always follows each platform’s own requirements and policies. Every case is assessed on its own merits — no unrealistic promises.'],
      items:['TikTok','Snapchat','Facebook','Instagram','X','WhatsApp Business']
    },
    {
      icon:'i-chart',
      ar:['التسويق الرقمي','إدارة حملات مدفوعة عبر الشبكات الرئيسية مع تتبع الأداء والتحسين المستمر.'],
      en:['Digital marketing','Running paid campaigns across the major networks with performance tracking and continuous optimisation.'],
      items:['Meta Ads','Google Ads','TikTok Ads','Snapchat Ads','YouTube Ads','Media Buying','Campaign Management','Analytics']
    },
    {
      icon:'i-sparkles',
      ar:['الذكاء الاصطناعي','استخدام أدوات الذكاء الاصطناعي لبناء حلول، أتمتة العمليات، إنتاج المحتوى، وربط الأدوات بالأنظمة الرقمية.'],
      en:['Artificial intelligence','Using AI tools to build solutions, automate operations, produce content and wire tools into digital systems.'],
      items:['ChatGPT','Claude','Gemini','Midjourney','Perplexity','ElevenLabs','AI Automation','AI-assisted Workflows']
    },
    {
      icon:'i-code',
      ar:['التطوير والأتمتة','بناء المواقع والمتاجر والبوتات وربطها بأنظمة الطلبات والدفع عبر واجهات برمجية.'],
      en:['Development & automation','Building sites, stores and bots, then wiring them into order and payment systems through APIs.'],
      items:['Website Development','E-Commerce','Telegram Bots','WhatsApp Bots','Order Automation','Workflow Automation','n8n','API Integrations']
    },
    {
      icon:'i-cart',
      ar:['التجارة الرقمية','خبرة في أسواق المنتجات الرقمية — الاشتراكات وبطاقات الهدايا وأرصدة الألعاب وخدمات البث.'],
      en:['Digital commerce','Experience across digital product markets — subscriptions, gift cards, gaming credits and streaming services.'],
      items:['Digital Subscriptions','Gift Cards','Gaming Credits','Streaming Services','Software & AI Subscriptions']
    }
  ],

  /* Featured case study */
  caseStudy: {
    ar:{
      title:'Elawaady XDigital Platform',
      cat:'منصة رقمية / سوق إلكتروني / عمليات تشغيل',
      role:'المؤسس وباني المنصة',
      lead:'منظومة رقمية طُوّرت فكرتها لتنظيم تقديم وإدارة الخدمات الرقمية، وربط العملاء والتجار والموردين والخدمات وعمليات الدفع والمتابعة داخل نظام واحد. الهدف لم يكن إنشاء صفحة بيع، وإنما بناء منظومة سوق رقمي أكثر تنظيمًا وقابلية للتوسع.',
      conceptTitle:'أطراف المنظومة',
      featuresTitle:'مكونات المنصة',
      goalsTitle:'الأهداف',
      escrowTitle:'نظام الوساطة الآمنة',
      escrowLead:'طوّرت تصورًا لنظام وساطة يساعد على تنظيم المعاملات الرقمية وحفظ حقوق الأطراف: توثيق الاتفاق، استلام وحفظ المبلغ، متابعة مراحل التنفيذ، توثيق المحادثات، التأكد من التسليم، إدارة النزاعات، ثم تحويل المبلغ للطرف المستحق بعد استيفاء الشروط.',
      flow:['اتفاق واضح','دفع محفوظ','تنفيذ','مراجعة','إتمام'],
      disputeFlow:['نزاع','تجميد المبلغ','مراجعة الأدلة','حل'],
      rulesTitle:'قواعد الوساطة',
      rules:[
        'الشروط تُكتب قبل بدء المعاملة.',
        'أي تعديل يحتاج موافقة الأطراف.',
        'التسليم يتم وفق الاتفاق الموثق.',
        'النزاعات تُراجع اعتمادًا على الأدلة.',
        'المبلغ يمكن تجميده عند وجود نزاع.',
        'الوعود غير المكتوبة لا تدخل ضمن الاتفاق.'
      ],
      note:'الاعتماد يكون على الاتفاقات والمحادثات والأدلة الموثقة، وليس على ضمانات غير قابلة للتحقق.',
      goals:['تنظيم السوق الرقمي','تقليل العشوائية','تحسين ثقة العملاء','حماية أطراف التعامل','تسهيل الوصول للخدمات','جمع الخدمات في مكان واحد','خلق فرص عمل','منظومة قابلة للتوسع عربيًا']
    },
    en:{
      title:'Elawaady XDigital Platform',
      cat:'Digital Marketplace / Platform / Operations',
      role:'Founder & Platform Builder',
      lead:'A digital ecosystem designed to organise how digital services are delivered and managed, connecting customers, merchants, suppliers, services, payments and follow-up inside one system. The goal was never a sales page — it was a more structured, scalable digital marketplace.',
      conceptTitle:'Ecosystem parties',
      featuresTitle:'Platform features',
      goalsTitle:'Business goals',
      escrowTitle:'Secure escrow workflow',
      escrowLead:'I developed a model for an escrow system that helps structure digital transactions and protect each party’s rights: documenting the agreement, holding the funds, tracking execution, recording conversations, confirming delivery, handling disputes, then releasing payment once the terms are met.',
      flow:['Clear agreement','Secured payment','Execution','Review','Completion'],
      disputeFlow:['Dispute','Freeze funds','Review evidence','Resolution'],
      rulesTitle:'Escrow rules',
      rules:[
        'Terms are written down before the transaction starts.',
        'Any change requires both parties to agree.',
        'Delivery follows the documented agreement.',
        'Disputes are reviewed against the evidence.',
        'Funds can be frozen while a dispute is open.',
        'Unwritten promises are not part of the agreement.'
      ],
      note:'Everything rests on documented agreements, conversations and evidence — not on guarantees that cannot be verified.',
      goals:['Organise the digital market','Reduce the chaos','Improve customer trust','Protect both sides of a deal','Make services easier to reach','One place for many services','Create work opportunities','A scalable Arab-world ecosystem']
    },
    parties:['Customer','Merchant','Supplier','Services','Orders','Payments','Support','Ratings','Notifications','Escrow'],
    features:['User Accounts','Merchant Accounts','Supplier Accounts','Service Catalog','Order Management','Secure Payments','Customer Support','Order Tracking','Notifications','Reviews','Related Services','Escrow Module']
  },

  /* Journey timeline — adjust years to match your own record */
  journey: [
    { year:'2018', ar:['البداية في السوق الرقمي','مسوّق ومشغّل','بداية العمل في الخدمات الرقمية وإدارة الحسابات وبناء أول شبكة عملاء.'],
                   en:['Entering the digital market','Marketer & operator','Started in digital services, account management and building a first client base.'] },
    { year:'2020', ar:['بناء المجتمعات','مؤسس ومدير مجتمعات','إنشاء وإدارة قنوات ومجموعات رقمية وتحويلها إلى شبكة منظمة للعملاء والموردين.'],
                   en:['Community building','Founder & community manager','Created and ran digital channels and groups, turning them into an organised client and supplier network.'] },
    { year:'2022', ar:['التوسع في التسويق والتشغيل','مشتري إعلانات ومدير عمليات','إدارة حملات مدفوعة عبر الشبكات الرئيسية وبناء فرق متعددة التخصصات.'],
                   en:['Scaling marketing & operations','Media buyer & operations lead','Ran paid campaigns across major networks and built multidisciplinary teams.'] },
    { year:'2024', ar:['الأتمتة والذكاء الاصطناعي','مطوّر حلول','بناء بوتات وأنظمة أتمتة ودمج أدوات الذكاء الاصطناعي داخل سير العمل اليومي.'],
                   en:['Automation & AI','Solutions developer','Built bots and automation systems and folded AI tools into day-to-day workflows.'] },
    { year:'2025', ar:['Elawaady XDigital Platform','المؤسس وباني المنصة','تطوير منظومة سوق رقمي تجمع الخدمات والدفع والوساطة والمتابعة في نظام واحد.'],
                   en:['Elawaady XDigital Platform','Founder & platform builder','Developed a marketplace ecosystem bringing services, payments, escrow and follow-up into one system.'] }
  ],

  /* Communities */
  communities: ['Facebook Groups','WhatsApp Communities','Telegram Channels','Digital Services Communities','Gaming Communities','YouTube Communities','Buying & Selling Communities'],

  /* Professional network disciplines */
  network: ['Media Buyers','Digital Marketers','Social Media Managers','Content Creators','Graphic Designers','Video Editors','Motion Designers','Web Developers','Bot Developers','UI/UX Designers','SEO Specialists','Affiliate Marketers','Sales','Customer Support','Moderators','Account Managers'],

  /* Approach */
  approach: [
    { icon:'i-check-circle', ar:['وضوح','كل اتفاق مكتوب ومفهوم من الطرفين قبل ما الشغل يبدأ.'],        en:['Clarity','Every agreement written down and understood by both sides before work starts.'] },
    { icon:'i-layers',       ar:['تنظيم','بناء هيكل للعملية بدل التعامل مع كل حالة من الصفر.'],        en:['Structure','Building a process instead of handling every case from scratch.'] },
    { icon:'i-bolt',         ar:['أتمتة','كل خطوة متكررة تتحول لنظام يشتغل لوحده.'],                   en:['Automation','Every repeated step becomes a system that runs itself.'] },
    { icon:'i-chart',        ar:['قابلية للتوسع','الحل يتبني بحيث يستحمل نمو الحجم من غير ما ينهار.'], en:['Scalability','Built so growth in volume does not break it.'] },
    { icon:'i-palette',      ar:['تجربة مستخدم','الواجهة تخدم المستخدم مش تعقّد عليه.'],               en:['User experience','The interface serves the user rather than complicating things.'] },
    { icon:'i-shield',       ar:['حماية التعاملات','توثيق كل مرحلة بحيث حقوق الأطراف محفوظة.'],        en:['Protected transactions','Documenting every stage so both parties’ rights hold up.'] }
  ]
};

/* ===================== Language ===================== */
let lang = localStorage.getItem('elawaadyLang') || 'ar';

function applyLang(l) {
  lang = l;
  localStorage.setItem('elawaadyLang', l);

  const html = document.documentElement;
  html.lang = l;
  html.dir = l === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('langBtn').textContent = l === 'ar' ? 'EN' : 'ع';

  document.querySelectorAll('[data-ar][data-en]').forEach(el => {
    const val = el.getAttribute('data-' + l);
    if (val != null) el.textContent = val;
  });

  buildSections();
  startTyping();
}

/* ===================== Section builders ===================== */
const t = (item) => item[lang];
const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
const chips = (arr) => arr.map(x => `<span>${x}</span>`).join('');

function buildSections() {
  /* Marquee — duplicated so the loop has no visible seam */
  const items = DATA.marquee[lang];
  set('marqueeTrack', [...items, ...items]
    .map(s => `<span><svg class="ic"><use href="#i-diamond"/></svg>${s}</span>`).join(''));

  /* Areas of expertise */
  set('expertiseGrid', chips(DATA.expertise));

  /* What I build */
  set('buildsGrid', DATA.builds.map(b => {
    const [title, desc] = t(b);
    return `<article class="card glass reveal">
      <div class="card-icon"><svg class="ic"><use href="#${b.icon}"/></svg></div>
      <h3>${title}</h3><p>${desc}</p>
    </article>`;
  }).join(''));

  /* Capability groups */
  set('capsGrid', DATA.capabilities.map(c => {
    const [title, desc] = t(c);
    return `<article class="card glass reveal">
      <div class="card-icon"><svg class="ic"><use href="#${c.icon}"/></svg></div>
      <h3>${title}</h3><p>${desc}</p>
      <ul class="card-list">${c.items.map(i => `<li>${i}</li>`).join('')}</ul>
    </article>`;
  }).join(''));

  /* Case study — the flow arrow has to follow the reading direction, not the glyph */
  const cs = DATA.caseStudy, c = cs[lang];
  const arw = lang === 'ar' ? '←' : '→';
  set('caseBody', `
    <div class="case-head">
      <div class="case-badge"><svg class="ic"><use href="#i-chip"/></svg></div>
      <div>
        <h3>${c.title}</h3>
        <span class="case-role">${c.role} &nbsp;•&nbsp; ${c.cat}</span>
      </div>
    </div>
    <p class="case-lead">${c.lead}</p>

    <div class="case-cols">
      <div class="case-col">
        <h4>${c.conceptTitle}</h4>
        <div class="chip-list">${chips(cs.parties)}</div>
      </div>
      <div class="case-col">
        <h4>${c.featuresTitle}</h4>
        <div class="chip-list">${chips(cs.features)}</div>
      </div>
      <div class="case-col">
        <h4>${c.goalsTitle}</h4>
        <div class="chip-list">${chips(c.goals)}</div>
      </div>
    </div>

    <div class="case-cols">
      <div class="case-col" style="grid-column:1/-1">
        <h4>${c.escrowTitle}</h4>
        <p class="case-lead" style="margin-block:0 4px">${c.escrowLead}</p>
        <div class="flow">${c.flow.map((s, i) =>
          `${i ? `<span class="arw">${arw}</span>` : ''}<i>${s}</i>`).join('')}</div>
        <div class="flow dispute">${c.disputeFlow.map((s, i) =>
          `${i ? `<span class="arw">${arw}</span>` : ''}<i>${s}</i>`).join('')}</div>
        <ul class="rules">
          ${c.rules.map(r => `<li><svg class="ic"><use href="#i-check-circle"/></svg><span>${r}</span></li>`).join('')}
        </ul>
        <p class="case-lead" style="margin-block-end:0"><em>${c.note}</em></p>
      </div>
    </div>
  `);

  /* Journey timeline */
  set('timeline', DATA.journey.map(j => {
    const [title, role, desc] = t(j);
    return `<article class="tl-item reveal">
      <span class="tl-year">${j.year}</span>
      <h3>${title}</h3>
      <span class="tl-role">${role}</span>
      <p>${desc}</p>
    </article>`;
  }).join(''));

  /* Communities & network */
  set('communitiesGrid', chips(DATA.communities));
  set('networkGrid', chips(DATA.network));

  /* Approach */
  set('approachGrid', DATA.approach.map(a => {
    const [title, desc] = t(a);
    return `<article class="card glass reveal">
      <div class="card-icon"><svg class="ic"><use href="#${a.icon}"/></svg></div>
      <h3>${title}</h3><p>${desc}</p>
    </article>`;
  }).join(''));

  /* Stats */
  set('statsBand', STATS.filter(s => s.value != null).map(s => `
    <div class="stat glass reveal">
      <svg class="ic"><use href="#${s.icon}"/></svg>
      <strong data-count="${s.value}" data-suffix="${s.suffix || ''}">0</strong>
      <span>${s[lang]}</span>
    </div>`).join(''));

  observeReveals();
  runCounters();
}

/* ===================== Typing effect ===================== */
let typeTimer;
function startTyping() {
  clearTimeout(typeTimer);
  const el = document.getElementById('typed');
  const words = DATA.typed[lang];
  let w = 0, i = 0, deleting = false;

  (function tick() {
    const word = words[w];
    el.textContent = word.slice(0, i);

    if (!deleting && i < word.length) { i++; typeTimer = setTimeout(tick, 90); }
    else if (!deleting) { deleting = true; typeTimer = setTimeout(tick, 1700); }
    else if (i > 0) { i--; typeTimer = setTimeout(tick, 45); }
    else { deleting = false; w = (w + 1) % words.length; typeTimer = setTimeout(tick, 250); }
  })();
}

/* ===================== Reveal on scroll ===================== */
let revealObserver;
function observeReveals() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        revealObserver.unobserve(e.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -60px 0px' });
  }
  document.querySelectorAll('.reveal:not(.in)').forEach(el => revealObserver.observe(el));
}

/* ===================== Counters ===================== */
function runCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    const dur = 1600;
    (function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-US') + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    })(start);
  });
}

/* ===================== Nav, scroll, form ===================== */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  applyLang(lang);

  document.getElementById('langBtn').addEventListener('click', () => {
    applyLang(lang === 'ar' ? 'en' : 'ar');
  });

  const navLinks = document.getElementById('navLinks');
  document.getElementById('navToggle').addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.addEventListener('click', e => { if (e.target.tagName === 'A') navLinks.classList.remove('open'); });

  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');
  const sections = [...document.querySelectorAll('section[id], header[id]')];

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

    const current = sections.filter(s => s.offsetTop - 130 <= y).pop();
    if (current) {
      document.querySelectorAll('.nav-links a').forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + current.id));
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Contact form -> WhatsApp with the message pre-filled */
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

    const L = lang === 'ar'
      ? { head: 'رسالة من elawaady-db.com', name: 'الاسم', contact: 'التواصل', topic: 'الموضوع', msg: 'التفاصيل' }
      : { head: 'Message from elawaady-db.com', name: 'Name', contact: 'Contact', topic: 'Topic', msg: 'Details' };

    const text =
      `*${L.head}*\n\n` +
      `${L.name}: ${f.elements.name.value.trim()}\n` +
      `${L.contact}: ${f.elements.contact.value.trim()}\n` +
      `${L.topic}: ${f.elements.topic.value}\n` +
      `${L.msg}: ${f.elements.message.value.trim()}`;

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
});
