# الاختبارات

تلات طبقات، كل واحدة بتجاوب على سؤال مختلف.

## `rules/` — قواعد الأمان

بتضرب على محاكي Firestore/Storage مباشرة، من غير ما تعدي على أي كود في
`app.html`. يعني حتى لو حد بدّل الجافاسكريبت أو نادى الـAPI بإيده، النتيجة
هي اللي مكتوبة هنا.

```sh
npm i -D firebase-tools @firebase/rules-unit-testing firebase
cp ../firestore.rules ../storage.rules .
npx firebase emulators:exec --project elawaady-rules-test "node rules.test.mjs"
```

## `browser/` — الواجهة على متصفح حقيقي

بتشتغل على `preview/reviews-preview.html` (الوضع التجريبي — البيانات في
المتصفح) وعلى ملفات الموقع نفسها. محتاجة Playwright.

```sh
node ../../scripts/build-preview.mjs
python3 -m http.server 8099 --bind 127.0.0.1 &
node flow.mjs    # المسار كامل: تقييم + صور → pending → اعتماد → للعامة
node dash.mjs    # لوحة التحكم الواحدة بأقسامها الخمسة
node site.mjs    # الصفحة الرئيسية وتحويلة admin.html
```

## `live/` — فايربيز الحقيقي

بتعمل حسابات اختبار حقيقية على المشروع وبتجرّب القواعد والاستعلامات فعليًا.
بتسيب وراها بيانات — امسحها من الكونسول بعد ما تخلص.

```sh
node rest.mjs                 # المسار لحد ما التقييم يبقى pending
node rest.mjs --verify <id>   # بعد ما تعتمده من اللوحة
```

خطوة الاعتماد محتاجة حساب المالك. السكربت **مش** بيطلب كلمة سر: يا إما
تعتمد من `app.html#/admin` وتشغّل `--verify`، أو تحطّ `OWNER_ID_TOKEN` في
البيئة لو عندك توكن جاهز.
