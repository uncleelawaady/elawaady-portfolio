/* ===========================================================================
   محتوى موقع elawaady-db.com
   ===========================================================================
   الملف ده هو مصدر كل النصوص والأرقام في الموقع.

   تقدر تعدّله بإيدك من هنا. النصوص الأساسية (الاسم، المسمى، الواجهة، قسم
   التعاملات السابقة) تقدر كمان تغيّرها من لوحة التحكم:
   `app.html#/admin` → «محتوى البورتفوليو» — واللي بتحفظه هناك بيعلو على
   اللي هنا، وأي حقل تسيبه فاضي بيرجّع للنص المكتوب في الملف ده.

   كل نص له نسخة عربي (ar) ونسخة إنجليزي (en).
=========================================================================== */

window.SITE_CONTENT = {

  /* ---- بياناتك الأساسية ---- */
  meta: {
    domain:   'elawaady-db.com',
    whatsapp: '201055578777',
    telegram: 'elawaadyofficial',
    email:    'elawaady.official@gmail.com',
    linkedin: 'elawaadyofficial',
    name:     { ar: 'أحمد العوضي', en: 'Ahmed Elawaady' },
    /* المسمى الوظيفي الرئيسي. مكتوب هنا وفي hero.accent وفي وسوم index.html.
       أي مسمى قديم — Media Buyer أو Platform Builder — بقى مهارة فرعية جوّه
       قائمة المهارات، مش عنوان رئيسي. */
    role:     { ar: 'مؤسس مشاريع رقمية | متخصص تجارة إلكترونية', en: 'Digital Founder | E-Commerce Specialist' }
  },

  /* ---- الشريط المتحرك أعلى الصفحة ---- */
  ticker: {
    ar: ['أبني منظومات رقمية — مش خدمات منفردة', 'متاح لمشاريع وشراكات جديدة', 'من الفكرة إلى منظومة رقمية حقيقية'],
    en: ['I build digital systems — not one-off services', 'Open to new projects and partnerships', 'From ideas to digital ecosystems']
  },

  /* ---- الواجهة الرئيسية ---- */
  hero: {
    badge:  { ar: 'بورتفوليو شخصي — أحمد العوضي', en: 'Personal portfolio — Ahmed Elawaady' },
    title:  { ar: 'أحوّل الأفكار', en: 'I turn ideas' },
    title2: { ar: 'إلى منظومات رقمية', en: 'into digital systems' },
    accent: { ar: 'مؤسس مشاريع رقمية | متخصص تجارة إلكترونية', en: 'Digital Founder | E-Commerce Specialist' },
    desc: {
      ar: '١٤ مجال خبرة و٦ منظومات عملية — منصات، تجارة رقمية، ذكاء اصطناعي، أتمتة، تسويق، مجتمعات وأنظمة وساطة. مساحتي لعرض اللي بنيته ورحلتي فيه.',
      en: '14 areas of expertise across 6 working systems — platforms, digital commerce, AI, automation, marketing, communities and escrow. My space for what I have built and the road there.'
    },
    search: { ar: 'دوّر في خبراتي ومشاريعي… ذكاء اصطناعي، أتمتة، وساطة', en: 'Search my expertise and projects… AI, automation, escrow' },
    cta1:   { ar: 'استكشف خبراتي', en: 'Explore my expertise' },
    cta2:   { ar: 'تواصل معي', en: 'Get in touch' },
    features: [
      { icon: 'i-chip',      ar: 'منصات متكاملة',   en: 'Full platforms' },
      { icon: 'i-sparkles',  ar: 'ذكاء اصطناعي',    en: 'AI solutions' },
      { icon: 'i-bolt',      ar: 'أتمتة العمليات',  en: 'Automation' },
      { icon: 'i-shield',    ar: 'أنظمة وساطة',     en: 'Escrow systems' }
    ]
  },

  /* ---- الأرقام. حطّ أرقامك الحقيقية. اكتب 0 عشان الرقم يختفي من الصفحة ---- */
  stats: [
    { icon: 'i-layers', value: 12, suffix: '+', ar: 'مشروع تم بناؤه', en: 'Projects built' },
    { icon: 'i-chip',   value: 4,  suffix: '',  ar: 'منصات رقمية',    en: 'Digital platforms' },
    { icon: 'i-users',  value: 20, suffix: '+', ar: 'مجتمع رقمي',     en: 'Communities' },
    { icon: 'i-clock',  value: 8,  suffix: '+', ar: 'سنوات خبرة',     en: 'Years of experience' }
  ],

  /* ---- من أنا ---- */
  about: {
    paras: {
      ar: [
        'أنا أحمد العوضي، المعروف باسم Elawaady، مؤسس مشاريع رقمية ومتخصص تجارة إلكترونية. أعمل على بناء أنظمة تجمع بين التقنية والتجارة والتسويق والأتمتة وتجربة المستخدم، وتحويل الأفكار إلى مشروعات رقمية قابلة للتشغيل والنمو.',
        'أهتم بصورة خاصة ببناء المنظومات التي تربط بين العميل ومقدم الخدمة والمورد والإدارة والدفع والمتابعة داخل تجربة واحدة منظمة.',
        'رؤيتي ليست مجرد تقديم خدمة منفردة، وإنما تحويل العمليات الرقمية المتفرقة إلى أنظمة ومنصات منظمة يمكن إدارتها وتطويرها والتوسع بها.'
      ],
      en: [
        "I'm Ahmed Elawaady, known as Elawaady — a digital founder and e-commerce specialist. I build systems that bring together technology, commerce, marketing, automation and user experience, turning ideas into digital projects that can actually run and grow.",
        'I care in particular about building the systems that connect customer, service provider, supplier, management, payment and follow-up inside one organised experience.',
        'My aim was never to deliver a single service. It is to turn scattered digital operations into structured systems and platforms that can be managed, developed and scaled.'
      ]
    },
    points: [
      { icon: 'i-chip',     ar: 'بناء المنصات والأنظمة الرقمية', en: 'Building digital platforms and systems' },
      { icon: 'i-sparkles', ar: 'الذكاء الاصطناعي والأتمتة',     en: 'Artificial intelligence and automation' },
      { icon: 'i-swap',     ar: 'تنظيم المعاملات وأنظمة الوساطة', en: 'Structured transactions and escrow systems' },
      { icon: 'i-users',    ar: 'بناء وإدارة المجتمعات الرقمية',  en: 'Building and running digital communities' }
    ],
    cards: [
      { icon: 'i-briefcase', ar: ['المسمى', 'Founder & Builder'],       en: ['Role', 'Founder & Builder'] },
      { icon: 'i-pin',       ar: ['المقر', 'مصر — أونلاين عالميًا'],     en: ['Based in', 'Egypt — working globally'] },
      { icon: 'i-globe',     ar: ['اللغات', 'عربي • إنجليزي'],          en: ['Languages', 'Arabic • English'] },
      { icon: 'i-clock',     ar: ['الاستجابة', 'خلال ساعات'],           en: ['Response', 'Within hours'] }
    ]
  },

  /* ---- مجالات الخبرة. كل مجال بيطلع ككارت فيه أقسامه الفرعية ---- */
  expertise: [
    {
      id: 'platforms', icon: 'i-chip',
      ar: ['المنصات والأنظمة', 'بناء منصات رقمية كاملة بحسابات ولوحات تحكم وعمليات تشغيل حقيقية، مش صفحات عرض.'],
      en: ['Platforms & systems', 'Building complete digital platforms with accounts, dashboards and real operating flows — not display pages.'],
      items: [
        { ar: 'بناء المنصات',      en: 'Platform Building' },
        { ar: 'الأسواق الرقمية',   en: 'Digital Marketplaces' },
        { ar: 'لوحات التحكم',      en: 'Admin Dashboards' },
        { ar: 'إدارة الطلبات',     en: 'Order Management' },
        { ar: 'أنظمة الدفع',       en: 'Payment Systems' },
        { ar: 'تشغيل المنصات',     en: 'Platform Operations' }
      ]
    },
    {
      id: 'ai', icon: 'i-sparkles',
      ar: ['الذكاء الاصطناعي', 'استخدام أدوات الذكاء الاصطناعي لبناء حلول وأتمتة عمليات وإنتاج محتوى وربط الأدوات بالأنظمة.'],
      en: ['Artificial intelligence', 'Using AI tools to build solutions, automate operations, produce content and wire tools into systems.'],
      items: [
        { ar: 'ChatGPT',           en: 'ChatGPT' },
        { ar: 'Claude',            en: 'Claude' },
        { ar: 'Gemini',            en: 'Gemini' },
        { ar: 'Midjourney',        en: 'Midjourney' },
        { ar: 'ElevenLabs',        en: 'ElevenLabs' },
        { ar: 'أتمتة بالذكاء',     en: 'AI Automation' },
        { ar: 'سير عمل مدعوم',     en: 'AI-assisted Workflows' }
      ]
    },
    {
      id: 'dev', icon: 'i-code',
      ar: ['التطوير والأتمتة', 'بناء المواقع والمتاجر والبوتات وربطها بأنظمة الطلبات والدفع عبر واجهات برمجية.'],
      en: ['Development & automation', 'Building sites, stores and bots, then wiring them into order and payment systems through APIs.'],
      items: [
        { ar: 'تطوير المواقع',     en: 'Website Development' },
        { ar: 'المتاجر الإلكترونية', en: 'E-Commerce' },
        { ar: 'بوتات تليجرام',     en: 'Telegram Bots' },
        { ar: 'بوتات واتساب',      en: 'WhatsApp Bots' },
        { ar: 'أتمتة الطلبات',     en: 'Order Automation' },
        { ar: 'أتمتة سير العمل',   en: 'Workflow Automation' },
        { ar: 'n8n',               en: 'n8n' },
        { ar: 'ربط الواجهات',      en: 'API Integrations' }
      ]
    },
    {
      id: 'social', icon: 'i-megaphone',
      ar: ['المنصات الاجتماعية', 'خبرة تشغيلية في إدارة وتطوير ونقل ملكية الحسابات عبر المنصات الكبرى.'],
      en: ['Social platforms', 'Operational experience managing, growing and transferring accounts across the major platforms.'],
      items: [
        { ar: 'تيك توك',    en: 'TikTok' },
        { ar: 'يوتيوب',     en: 'YouTube' },
        { ar: 'فيسبوك',     en: 'Facebook' },
        { ar: 'إنستجرام',   en: 'Instagram' },
        { ar: 'سناب شات',   en: 'Snapchat' },
        { ar: 'إكس',        en: 'X / Twitter' },
        { ar: 'تليجرام',    en: 'Telegram' }
      ]
    },
    {
      id: 'marketing', icon: 'i-chart',
      ar: ['التسويق الرقمي', 'إدارة حملات مدفوعة عبر الشبكات الرئيسية مع تتبع الأداء والتحسين المستمر.'],
      en: ['Digital marketing', 'Running paid campaigns across the major networks with performance tracking and continuous optimisation.'],
      items: [
        { ar: 'إعلانات ميتا',   en: 'Meta Ads' },
        { ar: 'إعلانات جوجل',   en: 'Google Ads' },
        { ar: 'إعلانات تيك توك', en: 'TikTok Ads' },
        { ar: 'إعلانات سناب',   en: 'Snapchat Ads' },
        { ar: 'شراء الوسائط',   en: 'Media Buying' },
        { ar: 'إدارة الحملات',  en: 'Campaign Management' },
        { ar: 'تحليل الأداء',   en: 'Analytics' }
      ]
    },
    {
      id: 'escrow', icon: 'i-swap',
      ar: ['الوساطة والتوثيق', 'تنظيم المعاملات الرقمية بحيث تكون حقوق كل طرف موثقة، وتوثيق الحسابات وفق سياسات كل منصة.'],
      en: ['Escrow & verification', 'Structuring digital transactions so every party’s rights are documented, plus account verification within each platform’s policies.'],
      items: [
        { ar: 'أنظمة الوساطة',   en: 'Escrow Systems' },
        { ar: 'توثيق الاتفاقات', en: 'Agreement Documentation' },
        { ar: 'إدارة النزاعات',  en: 'Dispute Resolution' },
        { ar: 'توثيق الحسابات',  en: 'Account Verification' },
        { ar: 'حماية الأطراف',   en: 'Party Protection' }
      ]
    }
  ],

  /* ---- ما أبنيه ---- */
  builds: [
    { icon: 'i-chip',     ar: ['المنصات', 'منصات رقمية كاملة بحسابات ولوحات تحكم وعمليات تشغيل حقيقية.'],       en: ['Platforms', 'Complete digital platforms with accounts, dashboards and real operating flows.'] },
    { icon: 'i-store',    ar: ['الأسواق الرقمية', 'ربط العميل والتاجر والمورد والخدمة داخل سوق واحد منظم.'],      en: ['Marketplaces', 'Connecting customer, merchant, supplier and service inside one organised market.'] },
    { icon: 'i-users',    ar: ['المجتمعات', 'تحويل التجمعات العشوائية إلى مجتمعات منظمة لها قواعد وقيمة.'],       en: ['Communities', 'Turning scattered groups into organised communities with rules and value.'] },
    { icon: 'i-bolt',     ar: ['الأتمتة', 'أنظمة تتولى العمل المتكرر بدل ما يتعمل يدوي كل مرة.'],                 en: ['Automation', 'Systems that take over repetitive work instead of doing it by hand every time.'] },
    { icon: 'i-sparkles', ar: ['تدفقات الذكاء الاصطناعي', 'دمج أدوات الـ AI داخل سير العمل، مش استخدامها بشكل منفصل.'], en: ['AI workflows', 'Weaving AI tools into the workflow itself, not using them off to the side.'] },
    { icon: 'i-swap',     ar: ['أنظمة الوساطة', 'تنظيم المعاملات الرقمية بحيث تكون حقوق كل طرف موثقة.'],          en: ['Escrow systems', 'Structuring digital transactions so every party’s rights are documented.'] },
    { icon: 'i-cart',     ar: ['التجارة الإلكترونية', 'متاجر ومنتجات رقمية بعمليات طلب ودفع وتسليم مترابطة.'],    en: ['E-Commerce', 'Stores and digital products with order, payment and delivery wired together.'] },
    { icon: 'i-globe',    ar: ['المنظومات المتكاملة', 'ربط التقنية والتجارة والتشغيل والعميل داخل تجربة واحدة.'], en: ['Business ecosystems', 'Technology, commerce, operations and customer inside a single experience.'] }
  ],

  /* ---- دراسة الحالة الرئيسية ---- */
  caseStudy: {
    ar: {
      title: 'Elawaady XDigital Platform',
      cat: 'منصة رقمية / سوق إلكتروني / عمليات تشغيل',
      role: 'المؤسس وباني المنصة',
      lead: 'منظومة رقمية طُوّرت فكرتها لتنظيم تقديم وإدارة الخدمات الرقمية، وربط العملاء والتجار والموردين والخدمات وعمليات الدفع والمتابعة داخل نظام واحد. الهدف لم يكن إنشاء صفحة بيع، وإنما بناء منظومة سوق رقمي أكثر تنظيمًا وقابلية للتوسع.',
      conceptTitle: 'أطراف المنظومة',
      featuresTitle: 'مكونات المنصة',
      goalsTitle: 'الأهداف',
      escrowTitle: 'نظام الوساطة الآمنة',
      escrowLead: 'طوّرت تصورًا لنظام وساطة يساعد على تنظيم المعاملات الرقمية وحفظ حقوق الأطراف: توثيق الاتفاق، استلام وحفظ المبلغ، متابعة مراحل التنفيذ، توثيق المحادثات، التأكد من التسليم، إدارة النزاعات، ثم تحويل المبلغ للطرف المستحق بعد استيفاء الشروط.',
      flow: ['اتفاق واضح', 'دفع محفوظ', 'تنفيذ', 'مراجعة', 'إتمام'],
      disputeFlow: ['نزاع', 'تجميد المبلغ', 'مراجعة الأدلة', 'حل'],
      rulesTitle: 'قواعد الوساطة',
      rules: [
        'الشروط تُكتب قبل بدء المعاملة.',
        'أي تعديل يحتاج موافقة الأطراف.',
        'التسليم يتم وفق الاتفاق الموثق.',
        'النزاعات تُراجع اعتمادًا على الأدلة.',
        'المبلغ يمكن تجميده عند وجود نزاع.',
        'الوعود غير المكتوبة لا تدخل ضمن الاتفاق.'
      ],
      note: 'الاعتماد يكون على الاتفاقات والمحادثات والأدلة الموثقة، وليس على ضمانات غير قابلة للتحقق.',
      goals: ['تنظيم السوق الرقمي', 'تقليل العشوائية', 'تحسين ثقة العملاء', 'حماية أطراف التعامل', 'تسهيل الوصول للخدمات', 'جمع الخدمات في مكان واحد', 'خلق فرص عمل', 'منظومة قابلة للتوسع عربيًا']
    },
    en: {
      title: 'Elawaady XDigital Platform',
      cat: 'Digital Marketplace / Platform / Operations',
      role: 'Founder & Platform Builder',
      lead: 'A digital ecosystem designed to organise how digital services are delivered and managed, connecting customers, merchants, suppliers, services, payments and follow-up inside one system. The goal was never a sales page — it was a more structured, scalable digital marketplace.',
      conceptTitle: 'Ecosystem parties',
      featuresTitle: 'Platform features',
      goalsTitle: 'Business goals',
      escrowTitle: 'Secure escrow workflow',
      escrowLead: 'I developed a model for an escrow system that helps structure digital transactions and protect each party’s rights: documenting the agreement, holding the funds, tracking execution, recording conversations, confirming delivery, handling disputes, then releasing payment once the terms are met.',
      flow: ['Clear agreement', 'Secured payment', 'Execution', 'Review', 'Completion'],
      disputeFlow: ['Dispute', 'Freeze funds', 'Review evidence', 'Resolution'],
      rulesTitle: 'Escrow rules',
      rules: [
        'Terms are written down before the transaction starts.',
        'Any change requires both parties to agree.',
        'Delivery follows the documented agreement.',
        'Disputes are reviewed against the evidence.',
        'Funds can be frozen while a dispute is open.',
        'Unwritten promises are not part of the agreement.'
      ],
      note: 'Everything rests on documented agreements, conversations and evidence — not on guarantees that cannot be verified.',
      goals: ['Organise the digital market', 'Reduce the chaos', 'Improve customer trust', 'Protect both sides of a deal', 'Make services easier to reach', 'One place for many services', 'Create work opportunities', 'A scalable Arab-world ecosystem']
    },
    parties:  ['Customer', 'Merchant', 'Supplier', 'Services', 'Orders', 'Payments', 'Support', 'Ratings', 'Notifications', 'Escrow'],
    features: ['User Accounts', 'Merchant Accounts', 'Supplier Accounts', 'Service Catalog', 'Order Management', 'Secure Payments', 'Customer Support', 'Order Tracking', 'Notifications', 'Reviews', 'Related Services', 'Escrow Module']
  },

  /* ---- الرحلة. عدّل السنين لواقعك ---- */
  journey: [
    { year: '2018', ar: ['البداية في السوق الرقمي', 'مسوّق ومشغّل', 'بداية العمل في الخدمات الرقمية وإدارة الحسابات وبناء أول شبكة عملاء.'],
                    en: ['Entering the digital market', 'Marketer & operator', 'Started in digital services, account management and building a first client base.'] },
    { year: '2020', ar: ['بناء المجتمعات', 'مؤسس ومدير مجتمعات', 'إنشاء وإدارة قنوات ومجموعات رقمية وتحويلها إلى شبكة منظمة للعملاء والموردين.'],
                    en: ['Community building', 'Founder & community manager', 'Created and ran digital channels and groups, turning them into an organised client and supplier network.'] },
    /* شراء الإعلانات اتساب هنا كمهارة جوّه الوصف، مش كمسمى وظيفي. */
    { year: '2022', ar: ['التوسع في التجارة والتشغيل', 'مدير تشغيل ونمو', 'إدارة حملات مدفوعة وشراء وسائط عبر الشبكات الرئيسية، وبناء فرق متعددة التخصصات.'],
                    en: ['Scaling commerce & operations', 'Operations & growth lead', 'Ran paid campaigns and media buying across major networks and built multidisciplinary teams.'] },
    { year: '2024', ar: ['الأتمتة والذكاء الاصطناعي', 'مطوّر حلول', 'بناء بوتات وأنظمة أتمتة ودمج أدوات الذكاء الاصطناعي داخل سير العمل اليومي.'],
                    en: ['Automation & AI', 'Solutions developer', 'Built bots and automation systems and folded AI tools into day-to-day workflows.'] },
    { year: '2025', ar: ['Elawaady XDigital Platform', 'المؤسس وباني المنصة', 'تطوير منظومة سوق رقمي تجمع الخدمات والدفع والوساطة والمتابعة في نظام واحد.'],
                    en: ['Elawaady XDigital Platform', 'Founder & platform builder', 'Developed a marketplace ecosystem bringing services, payments, escrow and follow-up into one system.'] }
  ],

  communities: ['Facebook Groups', 'WhatsApp Communities', 'Telegram Channels', 'Digital Services Communities', 'Gaming Communities', 'YouTube Communities', 'Buying & Selling Communities'],

  network: ['Media Buyers', 'Digital Marketers', 'Social Media Managers', 'Content Creators', 'Graphic Designers', 'Video Editors', 'Motion Designers', 'Web Developers', 'Bot Developers', 'UI/UX Designers', 'SEO Specialists', 'Affiliate Marketers', 'Sales', 'Customer Support', 'Moderators', 'Account Managers'],

  approach: [
    { icon: 'i-check-circle', ar: ['وضوح', 'كل اتفاق مكتوب ومفهوم من الطرفين قبل ما الشغل يبدأ.'],        en: ['Clarity', 'Every agreement written down and understood by both sides before work starts.'] },
    { icon: 'i-layers',       ar: ['تنظيم', 'بناء هيكل للعملية بدل التعامل مع كل حالة من الصفر.'],        en: ['Structure', 'Building a process instead of handling every case from scratch.'] },
    { icon: 'i-bolt',         ar: ['أتمتة', 'كل خطوة متكررة تتحول لنظام يشتغل لوحده.'],                   en: ['Automation', 'Every repeated step becomes a system that runs itself.'] },
    { icon: 'i-chart',        ar: ['قابلية للتوسع', 'الحل يتبني بحيث يستحمل نمو الحجم من غير ما ينهار.'], en: ['Scalability', 'Built so growth in volume does not break it.'] },
    { icon: 'i-palette',      ar: ['تجربة مستخدم', 'الواجهة تخدم المستخدم مش تعقّد عليه.'],               en: ['User experience', 'The interface serves the user rather than complicating things.'] },
    { icon: 'i-shield',       ar: ['حماية التعاملات', 'توثيق كل مرحلة بحيث حقوق الأطراف محفوظة.'],        en: ['Protected transactions', 'Documenting every stage so both parties’ rights hold up.'] }
  ],

  vision: {
    ar: ['من الفكرة إلى منظومة رقمية حقيقية.', 'بناء مشروعات ومنظومات رقمية أكثر تنظيمًا وقابلية للتوسع، والاستفادة من التقنية والذكاء الاصطناعي والأتمتة لتحويل الأفكار إلى منتجات وأنظمة حقيقية تخدم المستخدم والسوق.'],
    en: ['From ideas to digital ecosystems.', 'Building digital projects and ecosystems that are more organised and more scalable — using technology, AI and automation to turn ideas into real products and systems that serve both the user and the market.']
  }
};
