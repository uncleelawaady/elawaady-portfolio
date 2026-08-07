/* ===== شاشة الدخول للوحة التحكم =====
   بتشتغل في وضعين: «اختر باسورد» أول مرة لما يكون الإعداد فاضي، و«دخول»
   بعد كده. الاشتقاق بياخد حوالي ثانية بقصد — عشان تخمين الباسورد يفضل مكلف.
*/

(() => {
  const $ = (id) => document.getElementById(id);
  const body = document.body;

  const form    = $('gateForm');
  const pass    = $('gatePass');
  const confirm = $('gateConfirm');
  const msgBox  = $('gateMsg');

  const cfg     = AUTH.config();
  const setup   = !cfg;                        // مفيش باسورد متسطب لسه
  let attempts  = 0;

  const say = (text) => { msgBox.textContent = text; msgBox.classList.add('show'); };
  const hush = () => msgBox.classList.remove('show');

  function unlock() {
    AUTH.markOpen();
    body.classList.remove('locked');
    window.dispatchEvent(new Event('admin:unlocked'));
  }

  /* جلسة مفتوحة بالفعل في نفس التبويب */
  if (AUTH.isOpen()) { body.classList.remove('locked'); }

  if (setup) {
    $('gateTitle').textContent = 'اختار كلمة سر';
    $('gateSub').textContent   = 'أول مرة تفتح اللوحة. اختار كلمة سر تحميها.';
    $('gateLabel').textContent = 'كلمة السر الجديدة';
    $('gateConfirmWrap').style.display = '';
    $('gateGo').textContent = 'تسطيب كلمة السر';
    pass.autocomplete = 'new-password';
  }

  /* لو المتصفح مقفل التخزين، الاشتقاق شغال بس مفيش مكان يحفظ فيه */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hush();

    const value = pass.value;
    if (!value) return;

    if (setup) {
      if (value.length < 8) return say('خليها 8 حروف على الأقل.');
      if (value !== confirm.value) return say('الكلمتين مش زي بعض.');
    }

    form.classList.add('busy');
    $('gateGo').textContent = 'لحظة…';
    /* فرصة للمتصفح يرسم حالة الانتظار قبل ما الاشتقاق يشغّل الـ CPU */
    await new Promise(r => setTimeout(r, 30));

    if (setup) {
      const salt = AUTH.randomSalt();
      const hash = AUTH.derive(value, salt);
      AUTH.saveLocal({ salt, hash });

      $('gateOut').innerHTML =
        '<div class="codebox">window.ADMIN_AUTH = {\n' +
        `  salt: '${salt}',\n  hash: '${hash}'\n};</div>` +
        '<p class="gate-note" style="border:0;padding:0;margin-top:10px">' +
        'انسخ ده وحطه في ملف <b>admin-config.js</b> وارفعه على GitHub، عشان ' +
        'كلمة السر تشتغل على أي جهاز مش على المتصفح ده بس.</p>';

      form.style.display = 'none';
      setTimeout(unlock, 400);
      return;
    }

    const hash = AUTH.derive(value, cfg.salt);
    form.classList.remove('busy');
    $('gateGo').textContent = 'دخول';

    if (hash === cfg.hash) { unlock(); return; }

    attempts++;
    pass.value = '';
    say(attempts >= 3 ? 'كلمة السر غلط. لو نسيتها، فضّي القيمتين في admin-config.js وارفعه.'
                      : 'كلمة السر غلط.');
  });

  /* ---- أزرار شريط الحفظ ---- */
  window.addEventListener('DOMContentLoaded', () => {
    const lock = $('btnLock');
    if (lock) lock.addEventListener('click', () => { AUTH.close(); location.reload(); });

    const change = $('btnPass');
    if (change) change.addEventListener('click', async () => {
      const now = prompt('كلمة السر الجديدة (8 حروف على الأقل):');
      if (now == null) return;
      if (now.length < 8) return alert('قصيرة أوي.');
      if (now !== prompt('أعد كتابتها:')) return alert('الكلمتين مش زي بعض.');

      const salt = AUTH.randomSalt();
      const hash = AUTH.derive(now, salt);
      AUTH.saveLocal({ salt, hash });

      prompt('انسخ ده وحطه في ملف admin-config.js وارفعه على GitHub:',
        `window.ADMIN_AUTH = { salt: '${salt}', hash: '${hash}' };`);
    });
  });
})();
