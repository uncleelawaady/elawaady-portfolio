# elawaady-db.com — Ahmed Elawaady

البورتفوليو الشخصي لأحمد العوضي. موقع ثابت بالكامل (HTML / CSS / JavaScript) — مفيش build ولا سيرفر ولا قاعدة بيانات.

## الملفات

```
index.html     الصفحة + مكتبة الأيقونات (SVG sprite) جوّه الملف
style.css      الهوية البصرية كلها
script.js      المحتوى القابل للتعديل + منطق الموقع
assets/        الشعار والصورة الشخصية
CNAME          الدومين: elawaady-db.com
```

## تعديل المحتوى

كل النصوص في **`script.js`** — مفيش حاجة محتاجة تتغير في `index.html` إلا لو عايز تضيف قسم جديد.

- **`STATS`** في أول الملف: الأرقام اللي بتظهر في الموقع. غيّرها لأرقامك الحقيقية. لو حطيت `value: null` لأي عنصر هيختفي من الصفحة.
- **`DATA`**: باقي المحتوى. كل عنصر له نسخة عربي (`ar`) ونسخة إنجليزي (`en`).

```js
builds: [
  { icon:'i-chip',
    ar:['المنصات','الوصف بالعربي...'],
    en:['Platforms','Description in English...'] },
]
```

الأقسام: `typed` • `marquee` • `expertise` • `builds` • `capabilities` • `caseStudy` • `journey` • `communities` • `network` • `approach`

- **رقم الواتساب:** ثابت `WHATSAPP` في أول `script.js`.
- **الإيميل واللينكات:** في `index.html` — قسم `#contact` والفوتر.

## الهوية البصرية

الألوان كلها متغيرات في أول `style.css`:

| | |
|---|---|
| Deep Petrol | `#071F29` |
| Petrol | `#0B2A34` |
| Turquoise (أساسي) | `#10B5BF` |
| Electric Cyan | `#20D6E3` |
| Soft Aqua | `#5DE7F2` |
| Metallic Silver | `#C7D2D8` |
| Orange (توقيع فقط) | `#FF8A1C` |

الأورانج مقصود يفضل نادر — خط رفيع، نقطة، أو زرار واحد. الفيروزي هو اللون اللي الهوية تتعرف بيه.

الخطوط: **Tajawal** للعربي، **Manrope** للإنجليزي.

## بعد أي تعديل

غيّر رقم النسخة في `index.html` (`style.css?v=2` → `?v=3`) عشان تكسر كاش المتصفح عند الزوار.
