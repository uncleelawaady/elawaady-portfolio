/* ===== قفل لوحة التحكم =====
   ------------------------------------------------------------------
   اقرا ده قبل ما تعتمد عليه:

   ده موقع ثابت، والصفحة دي وكودها متاحين للناس. يعني القفل بيمنع أي حد
   يفتح اللوحة بالصدفة أو من فضول، لكنه مش هيوقف حد فاهم وبيقرا الكود.

   وده مقبول هنا بالتحديد لأن اللوحة مفيهاش أي مفتاح ولا باسورد ولا وصول
   للريبو، ومش بتغيّر الموقع الحقيقي — كل اللي بتعمله إنها تعدّل نسخة في
   متصفح اللي فاتحها. النشر الفعلي بيحصل لما ترفع الملف بإيدك.

   الباسورد نفسه مش مكتوب في أي ملف. اللي بيتخزن هو ناتج تشفير من اتجاه
   واحد (SHA-256) بملح عشوائي و150 ألف تكرار — عشان لو حد جاب الهاش
   يفضل تخمين الباسورد مكلّف.
   ------------------------------------------------------------------ */

const AUTH = (() => {
  const ITERATIONS = 150000;
  const SESSION_KEY = 'elawaadyAdminOpen';
  const LOCAL_CFG   = 'elawaadyAdminCfg';

  /* ---------- SHA-256 ----------
     مكتوبة هنا بدل ما نعتمد على crypto.subtle، لأن الأخيرة مش شغالة لما
     تفتح الملف من جهازك مباشرة (file://) — والصفحة لازم تشتغل في الحالتين. */
  const K = new Uint32Array([
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
  ]);

  const rotr = (x, n) => (x >>> n) | (x << (32 - n));

  function sha256(bytes) {
    const len = bytes.length;
    const bitLen = len * 8;
    const withPad = new Uint8Array((((len + 9) >> 6) + 1) << 6);
    withPad.set(bytes);
    withPad[len] = 0x80;
    /* الطول بيتكتب 64 بت في الآخر — بنكتب أقل 32 بت وبس، وده كفاية لأي
       مدخل واقعي هنا (أقل من 512 ميجابت). */
    new DataView(withPad.buffer).setUint32(withPad.length - 4, bitLen >>> 0, false);

    const H = new Uint32Array([
      0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19
    ]);
    const w = new Uint32Array(64);
    const view = new DataView(withPad.buffer);

    for (let off = 0; off < withPad.length; off += 64) {
      for (let i = 0; i < 16; i++) w[i] = view.getUint32(off + i * 4, false);
      for (let i = 16; i < 64; i++) {
        const s0 = rotr(w[i-15],7) ^ rotr(w[i-15],18) ^ (w[i-15] >>> 3);
        const s1 = rotr(w[i-2],17) ^ rotr(w[i-2],19)  ^ (w[i-2] >>> 10);
        w[i] = (w[i-16] + s0 + w[i-7] + s1) >>> 0;
      }
      let [a,b,c,d,e,f,g,h] = H;
      for (let i = 0; i < 64; i++) {
        const S1  = rotr(e,6) ^ rotr(e,11) ^ rotr(e,25);
        const ch  = (e & f) ^ (~e & g);
        const t1  = (h + S1 + ch + K[i] + w[i]) >>> 0;
        const S0  = rotr(a,2) ^ rotr(a,13) ^ rotr(a,22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const t2  = (S0 + maj) >>> 0;
        h = g; g = f; f = e; e = (d + t1) >>> 0;
        d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      H[0]=(H[0]+a)>>>0; H[1]=(H[1]+b)>>>0; H[2]=(H[2]+c)>>>0; H[3]=(H[3]+d)>>>0;
      H[4]=(H[4]+e)>>>0; H[5]=(H[5]+f)>>>0; H[6]=(H[6]+g)>>>0; H[7]=(H[7]+h)>>>0;
    }

    const out = new Uint8Array(32);
    new DataView(out.buffer).setUint32(0,  H[0], false);
    new DataView(out.buffer).setUint32(4,  H[1], false);
    new DataView(out.buffer).setUint32(8,  H[2], false);
    new DataView(out.buffer).setUint32(12, H[3], false);
    new DataView(out.buffer).setUint32(16, H[4], false);
    new DataView(out.buffer).setUint32(20, H[5], false);
    new DataView(out.buffer).setUint32(24, H[6], false);
    new DataView(out.buffer).setUint32(28, H[7], false);
    return out;
  }

  const enc = new TextEncoder();
  const hex = (bytes) => [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');

  function concat(a, b) {
    const out = new Uint8Array(a.length + b.length);
    out.set(a); out.set(b, a.length);
    return out;
  }

  /* التكرار هو اللي بيخلي التخمين مكلف: كل محاولة لازم تعدي 150 ألف دورة */
  function derive(password, salt) {
    const saltBytes = enc.encode(salt);
    let h = sha256(concat(saltBytes, enc.encode(password)));
    for (let i = 0; i < ITERATIONS; i++) h = sha256(concat(h, saltBytes));
    return hex(h);
  }

  const randomSalt = () => {
    const b = new Uint8Array(16);
    (window.crypto || window.msCrypto).getRandomValues(b);
    return hex(b);
  };

  /* الإعداد ممكن يكون في الملف المرفوع، أو محفوظ محليًا لو لسه متصدّرش */
  function config() {
    try {
      const local = localStorage.getItem(LOCAL_CFG);
      if (local) return JSON.parse(local);
    } catch (e) {}
    const c = window.ADMIN_AUTH;
    return (c && c.hash) ? c : null;
  }

  const saveLocal = (cfg) => { try { localStorage.setItem(LOCAL_CFG, JSON.stringify(cfg)); } catch (e) {} };
  const isOpen    = () => { try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch (e) { return false; } };
  const markOpen  = () => { try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {} };
  const close     = () => { try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {} };

  return { derive, randomSalt, config, saveLocal, isOpen, markOpen, close, ITERATIONS };
})();
