# لوحة تحكم وتراخيص تطبيق "سجلها" سحابياً (Sajlha Admin Portal)

هذا المجلد يحتوي على لوحة ويب لإدارة التراخيص والتفعيل سحابياً وتوفير خادم وسيط (API Proxy) لذكاء سجلها الاصطناعي لحماية مفتاح API بنسبة 100%.

---

## 🚀 خطوت نشر لوحة التحكم على Vercel وقاعدة البيانات MongoDB

### الخطوة 1: إنشاء مستودع (Repository) مستقل على GitHub
1. افتح حساب GitHub الخاص بك.
2. أنشئ مستودعاً جديداً باسم `sajlha-admin-panel`.
3. قم برفع محتويات **هذا المجلد** (`sajlha_admin_panel`) فقط إلى هذا المستودع.
   - *ملاحظة:* تأكد من عدم رفع مجلد تطبيق Flutter بالكامل، فقط محتويات هذا المجلد.

### الخطوة 2: إنشاء قاعدة بيانات مجانية على MongoDB Atlas
1. قم بإنشاء حساب مجاني على موقع [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. أنشئ مشروعاً جديداً وقاعدة بيانات مجانية باسم **Shared M0 Cluster** في أي منطقة (مثال: AWS / Frankfurt).
3. اختر طريقة التفعيل بالاسم وكلمة المرور لمستخدم قاعدة البيانات، وتذكر حفظ بيانات هذا المستخدم.
4. أضف عنوان الـ IP الخاص بالشبكة للسماح بالاتصال من كل مكان (`0.0.0.0/0`) لضمان عمل خوادم Vercel Serverless.
5. انقر على **Connect** ثم اختر **Drivers** وانسخ رابط الاتصال (Connection String) الذي يشبه:
   `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority`
   - قم باستبدال `<username>` و `<password>` ببيانات المستخدم الذي أنشأته.

### الخطوة 3: نشر اللوحة على Vercel وتهيئة المتغيرات
1. اذهب لموقع [Vercel](https://vercel.com/) وسجل دخولك باستخدام حساب GitHub الخاص بك.
2. انقر على **Add New...** ثم **Project**.
3. قم باستيراد المستودع الذي أنشأته في الخطوة 1 (`sajlha-admin-panel`).
4. قبل النقر على **Deploy**، افتح قائمة **Environment Variables** وأضف المتغيرات التالية:
   - `MONGODB_URI`: رابط الاتصال الخاص بقاعدة بيانات MongoDB Atlas الذي نسخته في الخطوة 2.
   - `GEMINI_API_KEY`: مفتاح Gemini API الرسمي والنشط الخاص بك (`AIzaSyAEILvTBDFGwrmgQFwVh5GzGSMD5RkCjpE`).
   - `ADMIN_PASSWORD`: كلمة المرور السرية التي ستدخل بها للوحة الإدارة (مثال: `sajlha_admin_2026`).
5. انقر على **Deploy**.
6. بعد ثوانٍ سينتهي البناء وستحصل على رابط موقع متاح عالمياً ومجاناً (مثال: `https://sajlha.vercel.app`).

---

## 🛠️ الروابط البرمجية الموفرة للتطبيق (API Endpoints):

* **رابط المسح بالذكاء الاصطناعي:** `POST /api/ai/scan`
  - يستقبل `image` (Base64) و `mimeType` و `device_id` ويرد بالبيانات المالية المستخرجة.
* **رابط تفعيل التطبيق:** `POST /api/license/activate`
  - يربط كود الترخيص بـ `device_id`.
* **رابط فحص رخصة الجهاز:** `POST /api/license/check`
  - يفحص صلاحية الترخيص دورياً.
