/* بيمسح بيانات الاختبار اللي السكربتات سابتها في فايربيز الحقيقي.
   بيسجّل دخول بكل حساب اختبار ويمسح تقييمه وصوره بنفسه — يعني بيعدّي من
   نفس القواعد اللي المستخدم العادي بيعدّي منها، مش من باب خلفي. */

const KEY     = 'AIzaSyArFgfE-qaRRY4NtmuGXxCj_eOGekEAZlY';
const PROJECT = 'elawaady-portfolio';
const IDT = 'https://identitytoolkit.googleapis.com/v1/accounts';
const FS  = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

/* البصمات اللي طلعت من التشغيلات اللي فاتت */
const stamps = process.argv.slice(2);
if (!stamps.length){ console.log('استخدام: node cleanup.mjs <stamp> [stamp...]'); process.exit(1); }

const req = async (method, path, token, body) => {
  const r = await fetch(FS + path, {
    method,
    headers: { 'Content-Type':'application/json', ...(token ? { Authorization:`Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined
  });
  return { status: r.status, json: await r.json().catch(() => null) };
};

const signIn = async (email, password) => {
  const r = await fetch(`${IDT}:signInWithPassword?key=${KEY}`, {
    method:'POST', headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken:true })
  });
  const j = await r.json();
  return j.idToken ? { token:j.idToken, uid:j.localId } : null;
};

const del = async (email, password, stamp) => {
  const me = await signIn(email, password);
  if (!me){ console.log(`  ⏭  ${email} — مش لاقي الحساب`); return; }

  /* الصور الأول: القاعدة بتسمح لصاحبها يمسحها طول ما التقييم لسه pending */
  for (const n of [0, 1, 2]){
    const r = await req('DELETE', `/review_media/e2e_${stamp}_m${n}`, me.token);
    if (r.status === 200) console.log(`  🗑  صورة e2e_${stamp}_m${n}`);
  }
  const rev = await req('DELETE', `/reviews/e2e_${stamp}`, me.token);
  console.log(`  ${rev.status === 200 ? '🗑' : '⏭'}  تقييم e2e_${stamp} (HTTP ${rev.status})`);

  /* حساب الدخول نفسه — المستخدم بيقدر يمسح حسابه بنفسه */
  const gone = await fetch(`${IDT}:delete?key=${KEY}`, {
    method:'POST', headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({ idToken: me.token })
  });
  console.log(`  ${gone.ok ? '🗑' : '⏭'}  حساب ${email}`);
};

for (const stamp of stamps){
  console.log(`\n${stamp}`);
  await del(`e2e.${stamp}@elawaady-test.com`,   `E2e#${stamp}Aa1`,  stamp);
  await del(`e2e.o.${stamp}@elawaady-test.com`, `E2e#o${stamp}Aa1`, stamp);
}

console.log('\nملاحظة: مستندات /users بتاعة حسابات الاختبار مبتتمسحش من هنا —');
console.log('حذفها للمالك بس. امسحها من قسم «المستخدمين» في اللوحة.');
