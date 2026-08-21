/* ===========================================================================
   محتوى موقع elawaady-db.com
   ===========================================================================
   الملف ده هو مصدر كل النصوص والأرقام في الموقع.

   تقدر تعدّله بإيدك من هنا، أو — الأسهل — تفتح صفحة الإدارة `admin.html`
   وتعدّل من واجهة، وفي الآخر تضغط «تصدير» فتنزّلك نسخة جديدة من الملف ده
   ترفعها مكان القديمة على GitHub.

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
    { icon: 'i-chip', ar: ['المنصات', 'منصات رقمية كاملة بحسابات ولوحات تحكم وعمليات تشغيل حقيقية.',
        'منصات مبنية بحسابات مستخدمين حقيقية ولوحة تحكم للإدارة والمراجعة، مش صفحة عرض ثابتة — كل بيانات ودخول وحالة لها مكانها.'],
      en: ['Platforms', 'Complete digital platforms with accounts, dashboards and real operating flows.',
        'Platforms built with real user accounts and an admin dashboard for management and review — not a static landing page. Every piece of data, login and status has its place.'] },

    { icon: 'i-store', ar: ['الأسواق الرقمية', 'ربط العميل ومقدم الخدمة أو صاحب العرض داخل سوق رقمي منظم.',
        'السوق الرقمي يعرض الخدمات والمنتجات والأصول الرقمية المسموح بعرضها وفق القوانين وسياسات المنصة المعنية، مع البيانات الأساسية والسعر والصور والإثباتات وطريقة الطلب أو التواصل. الهدف هو أن يفهم المستخدم العرض قبل بدء التعامل، ثم يبدأ طلبًا رسميًا أو يتواصل لبدء إجراءات الوساطة عند الحاجة.'],
      en: ['Digital markets', 'Connecting the customer with the service provider or offer owner inside an organised digital market.',
        'The digital market displays services, products and digital assets allowed under the relevant laws and platform policies, along with the core details, price, photos, proof and how to order or get in touch. The goal is for the user to understand the offer before starting a deal, then place a formal order or reach out to start mediation when needed.'] },

    { icon: 'i-users', ar: ['المجتمعات', 'تحويل التجمعات العشوائية إلى مجتمعات منظمة لها قواعد وقيمة.',
        'بناء وإدارة مجتمعات متخصصة حول الخدمات الرقمية، التجارة، التسويق والمجالات المهنية المختلفة، مع قواعد واضحة وإدارة وتنظيم وتقييمات وتجارب موثقة.'],
      en: ['Communities', 'Turning scattered groups into organised communities with rules and value.',
        'Building and running specialised communities around digital services, trade, marketing and various professional fields, with clear rules, management, organisation, ratings and documented experiences.'] },

    { icon: 'i-bolt', ar: ['الأتمتة', 'أنظمة تتولى العمل المتكرر بدل تنفيذه يدويًا كل مرة.',
        'مثال حقيقي لمسار أتمتة متكرر في مشاريعي.'],
      en: ['Automation', 'Systems that take over repetitive work instead of doing it by hand every time.',
        'A real, recurring automation path from my projects.'],
      flow: { ar: ['طلب جديد', 'إشعار', 'تحقق', 'تحديث الحالة', 'متابعة', 'إغلاق الطلب'],
              en: ['New order', 'Notification', 'Verification', 'Status update', 'Follow-up', 'Close the order'] },
      uses: { ar: ['تنظيم الطلبات', 'الإشعارات', 'تحديث حالة الأوردر', 'ربط المتجر بوسائل التواصل', 'ربط الطلبات بلوحة التحكم', 'تقليل الأخطاء اليدوية', 'توفير وقت الإدارة'],
              en: ['Organising orders', 'Notifications', 'Updating order status', 'Linking the store to messaging channels', 'Linking orders to the dashboard', 'Cutting manual errors', 'Saving management time'] } },

    { icon: 'i-sparkles', ar: ['تدفقات الذكاء الاصطناعي', 'دمج أدوات AI داخل سير العمل بدل استخدامها كأدوات منفصلة.',
        'حيث يكون للذكاء الاصطناعي قيمة فعلية داخل سير العمل — لا يتخذ قرارات مالية أو قانونية بشكل مستقل.'],
      en: ['AI workflows', 'Weaving AI tools into the workflow itself, not using them off to the side.',
        'Wherever AI adds real value inside the workflow — it never makes financial or legal decisions on its own.'],
      uses: { ar: ['ترتيب البيانات', 'كتابة وصف الخدمات', 'تحليل الطلبات', 'تجهيز رسائل مساعدة', 'مساعدة المستخدم داخل الموقع', 'تنظيم العمليات', 'تجهيز تنبيهات للإدارة', 'دعم خدمة العملاء'],
              en: ['Organising data', 'Writing service descriptions', 'Analysing requests', 'Preparing help messages', 'Assisting the user on the site', 'Organising operations', 'Preparing alerts for management', 'Supporting customer service'] } },

    { icon: 'i-swap', ar: ['أنظمة الوساطة', 'تنظيم المعاملات الرقمية بحيث تكون خطوات الاتفاق والتسليم موثقة وواضحة.',
        'أي عملية تخضع لقوانين الدولة وسياسات المنصة أو الخدمة المستخدمة، ولا يتم دعم نقل أو بيع أي أصل أو حساب إذا كان ذلك مخالفًا لشروط المنصة أو القانون.'],
      en: ['Mediation systems', 'Structuring digital transactions so the agreement and delivery steps are documented and clear.',
        'Every deal is subject to the laws of the state and the policies of the platform or service used; transferring or selling any asset or account is never supported if it violates that platform’s terms or the law.'],
      steps: { ar: ['طلب الوساطة.', 'مراجعة بيانات الأطراف والعرض.', 'تحديد السعر والشروط.', 'مراجعة الإثباتات.', 'تحديد آلية التنفيذ أو التسليم.', 'متابعة التنفيذ.', 'تأكيد الاستلام.', 'إغلاق العملية وتسجيل التقييم.'],
               en: ['Request mediation.', 'Review the parties’ and offer’s details.', 'Set the price and terms.', 'Review the proof.', 'Set the execution or delivery method.', 'Follow up on execution.', 'Confirm receipt.', 'Close the deal and record the review.'] },
      linkTo: '/mediation.html' },

    { icon: 'i-cart', ar: ['التجارة الإلكترونية', 'متاجر ومنتجات رقمية بعمليات طلب ودفع وتسليم مترابطة.',
        'أقسام رئيسية وفرعية، صفحات خدمات، صور وإثباتات، سلة طلبات، شراء أو طلب خدمة، ملخص أوردر، تواصل رسمي، تقييمات، وإدارة من لوحة التحكم.'],
      en: ['E-commerce', 'Stores and digital products with order, payment and delivery wired together.',
        'Main and sub sections, service pages, photos and proof, an order cart, buying or requesting a service, an order summary, official contact, reviews, and management from the dashboard.'] },

    { icon: 'i-globe', ar: ['المنظومات المتكاملة', 'ربط التقنية والتجارة والتشغيل داخل تجربة واحدة.',
        'كل جزء من النظام متصل بالباقي، مش بيشتغل لوحده.'],
      en: ['Integrated systems', 'Tying technology, commerce and operations into a single experience.',
        'Every part of the system is connected to the rest — nothing runs on its own.'],
      integrations: ['Store', 'Orders', 'Dashboard', 'Reviews', 'Customers', 'Notifications', 'Automation', 'AI', 'Communication'] }
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
    { icon: 'i-check-circle', ar: ['وضوح', 'كل اتفاق مكتوب ومفهوم من الطرفين قبل ما الشغل يبدأ.', 'تحديد الخدمة والسعر وطريقة التنفيذ والتسليم قبل البداية.'],
      en: ['Clarity', 'Every agreement written down and understood by both sides before work starts.', 'Defining the service, price, execution method and delivery before anything begins.'] },
    { icon: 'i-layers',       ar: ['تنظيم', 'بناء هيكل للعملية بدل التعامل مع كل حالة من الصفر.', 'كل عملية لها خطوات وحالة وبيانات واضحة بدل إدارة الحالات بشكل عشوائي.'],
      en: ['Structure', 'Building a process instead of handling every case from scratch.', 'Every process has clear steps, status and data instead of managing cases at random.'] },
    { icon: 'i-bolt',         ar: ['أتمتة', 'كل خطوة متكررة تتحول لنظام يشتغل لوحده.', 'تحويل الخطوات المتكررة إلى Workflows تقلل العمل اليدوي والأخطاء.'],
      en: ['Automation', 'Every repeated step becomes a system that runs itself.', 'Turning repeated steps into workflows that cut down manual work and errors.'] },
    { icon: 'i-chart',        ar: ['قابلية للتوسع', 'الحل يتبني بحيث يستحمل نمو الحجم من غير ما ينهار.', 'بناء النظام بحيث يمكن إضافة خدمات ومستخدمين وأقسام وطلبات بدون إعادة بنائه من البداية.'],
      en: ['Scalability', 'Built so growth in volume does not break it.', 'Built so services, users, sections and requests can be added without rebuilding it from scratch.'] },
    { icon: 'i-palette',      ar: ['تجربة المستخدم', 'الواجهة تخدم المستخدم مش تعقّد عليه.', 'جعل المستخدم يفهم الخدمة ويطلبها ويتابع العملية بسهولة.'],
      en: ['User experience', 'The interface serves the user rather than complicating things.', 'Making it easy for the user to understand the service, request it, and track the process.'] },
    { icon: 'i-shield',       ar: ['حماية التعاملات', 'توثيق كل مرحلة بحيث حقوق الأطراف محفوظة.', 'استخدام التوثيق والمراجعة والإثباتات والوساطة عند الحاجة.'],
      en: ['Protected transactions', 'Documenting every stage so both parties’ rights hold up.', 'Using documentation, review, proof and mediation whenever they are needed.'] }
  ],

  vision: {
    ar: ['من الفكرة إلى منظومة رقمية حقيقية', 'Elawaady XDigital تعمل على بناء منظومات رقمية مترابطة تساعد على تنظيم الخدمات والأسواق والتعاملات وتحويل الأفكار إلى منتجات وأنظمة قابلة للتوسع.',
      'نحن لا نتعامل مع المشروع كخدمة منفردة، بل نبني منظومة تربط التقنية والتشغيل والتجارة وتجربة المستخدم داخل مسار واحد واضح، مع الاستفادة من الأتمتة والذكاء الاصطناعي حيث يكون لهما قيمة فعلية.'],
    en: ['From an idea to a real digital ecosystem', 'Elawaady XDigital builds connected digital ecosystems that organise services, markets and transactions, turning ideas into scalable products and systems.',
      'We don’t treat a project as a one-off service. We build an ecosystem that ties technology, operations, commerce and user experience into a single clear path — using automation and AI wherever they add real value.']
  },

  /* ---- الأدوات والتقنيات ---- */
  tools: [
    { id:'shopify', color:'#95BF47', type:{ar:'منصة متاجر',en:'Store platform'},
      use:{ar:'إطلاق وإدارة متاجر إلكترونية جاهزة للدفع والشحن.',en:'Launching and running online stores ready for payment and shipping.'},
      flow:{ar:'عميل يفتح المتجر → يضيف للسلة → يدفع → يتحدث الأوردر في لوحة التحكم.',en:'Customer opens the store → adds to cart → pays → the order updates in the dashboard.'} },
    { id:'woocommerce', color:'#96588A', type:{ar:'منصة متاجر (WordPress)',en:'Store platform (WordPress)'},
      use:{ar:'متاجر مبنية على ووردبريس لمشاريع تحتاج مرونة أكبر في التصميم.',en:'WordPress-based stores for projects that need more design flexibility.'},
      flow:{ar:'إعداد المنتجات → ربط بوابة دفع → استقبال الطلبات وتتبعها.',en:'Set up products → connect a payment gateway → receive and track orders.'} },
    { id:'stripe', color:'#635BFF', type:{ar:'بوابة دفع',en:'Payment gateway'},
      use:{ar:'تحصيل المدفوعات أونلاين بأمان لمشاريع التجارة الإلكترونية.',en:'Collecting online payments securely for e-commerce projects.'},
      flow:{ar:'طلب جديد → إنشاء فاتورة Stripe → تأكيد الدفع → تحديث حالة الأوردر تلقائيًا.',en:'New order → create a Stripe invoice → confirm payment → the order status updates automatically.'} },
    { id:'paypal', color:'#003087', type:{ar:'بوابة دفع',en:'Payment gateway'},
      use:{ar:'استقبال مدفوعات دولية بديلة عن التحويل البنكي المباشر.',en:'Receiving international payments as an alternative to direct bank transfer.'},
      flow:{ar:'إرسال رابط دفع PayPal → استلام تأكيد الدفع → متابعة التنفيذ.',en:'Send a PayPal payment link → receive payment confirmation → proceed with execution.'} },
    { id:'firebase', color:'#FFA000', type:{ar:'خلفية تطبيقات (Backend)',en:'App backend'},
      use:{ar:'تسجيل الدخول وقاعدة البيانات وقواعد الصلاحيات لكل حسابات ولوحات التحكم في مشاريعي.',en:'Authentication, database and permission rules behind every account system and dashboard I build.'},
      flow:{ar:'تسجيل مستخدم → Firestore يخزن البيانات → Security Rules تمنع أي وصول غير مصرح.',en:'A user registers → Firestore stores the data → Security Rules block any unauthorised access.'} },
    { id:'cloudinary', color:'#3448C5', type:{ar:'استضافة وصور',en:'Media hosting'},
      use:{ar:'رفع وتحسين صور الإثبات والمنتجات بدون تحميل السيرفر.',en:'Uploading and optimising proof and product images without loading the server.'},
      flow:{ar:'رفع صورة من المتصفح → تعمل ضغط وتصغير تلقائي → تتخزن ويرجع رابط جاهز للعرض.',en:'Upload an image from the browser → it’s compressed and resized automatically → a ready-to-display link comes back.'} },
    { id:'zapier', color:'#FF4A00', type:{ar:'أتمتة',en:'Automation'},
      use:{ar:'ربط أدوات مختلفة مع بعض بدون كتابة كود لكل عملية بسيطة.',en:'Connecting different tools together without writing code for every simple task.'},
      flow:{ar:'طلب جديد في المتجر → Zapier يبعت إشعار واتساب وإيميل تلقائي.',en:'New order in the store → Zapier sends an automatic WhatsApp notification and email.'} },
    { id:'make', color:'#6D00CC', type:{ar:'أتمتة بصرية',en:'Visual automation'},
      use:{ar:'بناء Workflows أكثر تعقيدًا بشكل بصري بدون كود.',en:'Building more complex workflows visually, without code.'},
      flow:{ar:'حدث في نظام → فرع شرطي (لو/غير كده) → أكتر من إجراء يتنفذ بالتوازي.',en:'An event in one system → a conditional branch (if/else) → several actions run in parallel.'} },
    { id:'n8n', color:'#EA4B71', type:{ar:'أتمتة (Self-hosted)',en:'Automation (self-hosted)'},
      use:{ar:'أتمتة داخلية للمشاريع اللي محتاجة تحكم كامل في البيانات.',en:'Internal automation for projects that need full control over their data.'},
      flow:{ar:'Webhook يستقبل بيانات → معالجة داخل n8n → تحديث Firestore أو إرسال إشعار.',en:'A webhook receives data → it’s processed inside n8n → Firestore is updated or a notification is sent.'} },
    { id:'meta-ads', color:'#0866FF', type:{ar:'إعلانات ممولة',en:'Paid ads'},
      use:{ar:'حملات إعلانية على فيسبوك وإنستجرام لتوليد طلبات وعملاء.',en:'Ad campaigns on Facebook and Instagram to generate orders and customers.'},
      flow:{ar:'استهداف جمهور → إعلان يوصل لصفحة الخدمة → طلب أو تواصل مباشر.',en:'Target an audience → the ad leads to a service page → a direct order or contact.'} },
    { id:'google-ads', color:'#4285F4', type:{ar:'إعلانات ممولة',en:'Paid ads'},
      use:{ar:'الظهور في نتائج البحث للي بيدوّر على خدمة بعينها.',en:'Appearing in search results for people looking for a specific service.'},
      flow:{ar:'بحث المستخدم عن كلمة مفتاحية → إعلان يظهر → زيارة صفحة الخدمة.',en:'A user searches a keyword → the ad appears → they visit the service page.'} },
    { id:'tiktok-ads', color:'#000000', type:{ar:'إعلانات ممولة',en:'Paid ads'},
      use:{ar:'الوصول لجمهور أصغر سنًا عبر محتوى فيديو قصير.',en:'Reaching a younger audience through short video content.'},
      flow:{ar:'فيديو إعلاني قصير → مشاهدة → زيارة الرابط في البايو أو الإعلان.',en:'A short ad video → a view → a visit through the bio or ad link.'} },
    { id:'figma', color:'#F24E1E', type:{ar:'تصميم واجهات',en:'UI design'},
      use:{ar:'تصميم واجهات المواقع والتطبيقات قبل التنفيذ.',en:'Designing site and app interfaces before development.'},
      flow:{ar:'Wireframe → تصميم كامل → مشاركة الرابط للمراجعة → تسليم للتطوير.',en:'Wireframe → full design → share the link for review → hand off to development.'} },
    { id:'notion', color:'#000000', type:{ar:'إدارة مهام ومحتوى',en:'Task & content management'},
      use:{ar:'تنظيم خطط المشاريع والمحتوى وقوائم المهام.',en:'Organising project plans, content and task lists.'},
      flow:{ar:'إضافة مهمة → تحديد حالتها → متابعة التقدم في لوحة واحدة.',en:'Add a task → set its status → track progress on one board.'} },
    { id:'chatgpt', color:'#10A37F', type:{ar:'ذكاء اصطناعي',en:'AI'},
      use:{ar:'صياغة أوصاف الخدمات والردود ومساعدة العملاء.',en:'Drafting service descriptions, replies, and customer help.'},
      flow:{ar:'سؤال أو طلب صياغة → رد مسودة → مراجعة وتعديل قبل الاستخدام.',en:'A question or drafting request → a draft reply → review and edit before use.'} },
    { id:'claude', color:'#D97757', type:{ar:'ذكاء اصطناعي',en:'AI'},
      use:{ar:'تحليل بيانات وتنظيم محتوى طويل ومهام تقنية.',en:'Analysing data, organising long content, and technical tasks.'},
      flow:{ar:'بيانات خام → تلخيص أو تنظيم → مخرجات جاهزة للاستخدام.',en:'Raw data → summarised or organised → output ready to use.'} },
    { id:'gemini', color:'#8E75B2', type:{ar:'ذكاء اصطناعي',en:'AI'},
      use:{ar:'مساعدة إضافية في البحث وصياغة المحتوى.',en:'Extra help with research and content drafting.'},
      flow:{ar:'سؤال بحثي → إجابة مع مصادر → استخدامها كنقطة بداية.',en:'A research question → an answer with sources → used as a starting point.'} },
    { id:'whatsapp-business', color:'#25D366', type:{ar:'تواصل رسمي',en:'Official contact'},
      use:{ar:'استقبال الطلبات والتواصل الرسمي مع العملاء.',en:'Receiving orders and official contact with customers.'},
      flow:{ar:'رسالة عميل → رد سريع → متابعة الطلب حتى يتم.',en:'A customer message → a fast reply → following the order through to completion.'} },
    { id:'google-analytics', color:'#E37400', type:{ar:'تحليلات',en:'Analytics'},
      use:{ar:'متابعة زوار الموقع ومصادر الزيارات ومعدلات التحويل.',en:'Tracking site visitors, traffic sources and conversion rates.'},
      flow:{ar:'زائر يدخل الموقع → يتسجل المصدر والسلوك → تقرير أداء دوري.',en:'A visitor enters the site → the source and behaviour are logged → a periodic performance report.'} }
  ]
};
