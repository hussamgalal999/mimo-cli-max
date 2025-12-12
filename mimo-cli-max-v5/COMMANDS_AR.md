# 🎯 MIMO-CLI-MAX - دليل الأوامر الكامل

## 📋 جميع الأوامر المتاحة

### 🚀 أوامر التشغيل الأساسية

```powershell
# 1. التثبيت
npm install

# 2. البناء (Build)
npm run build

# 3. التنظيف (Clean)
npm run clean
```

---

## 🎮 أوامر التشغيل التفاعلي

### 1. **الوضع التفاعلي (REPL)**
```powershell
npm run mimo:repl
```
**الوصف:** يفتح واجهة تفاعلية للتحدث مع جميع الوكلاء الـ7

**مثال:**
```
> Create a REST API with Express
> Add authentication with JWT
> Generate tests
```

---

### 2. **التشغيل المباشر**
```powershell
npm run mimo
```
**الوصف:** يشغل MIMO بشكل مباشر

---

## 🎨 أوامر العروض التوضيحية (Demos)

### 1. **العرض الرئيسي - جميع الوكلاء**
```powershell
npm run mimo:demo
```
**الوصف:** يعرض جميع الوكلاء الـ7 في العمل:
- Market Analyst
- Product Manager
- Solutions Architect
- Product Owner
- Core Executor
- QA Engineer
- DevOps Specialist

---

### 2. **عرض النماذج - 100+ نموذج AI**
```powershell
npm run mimo:models
```
**الوصف:** يعرض جميع نماذج الذكاء الاصطناعي المتاحة:
- 🇺🇸 أمريكا: OpenAI, Anthropic, Google, Perplexity, Groq
- 🇨🇳 الصين: Alibaba, Baidu, Tencent, ByteDance, Zhipu AI
- 🇪🇺 أوروبا: Mistral, Aleph Alpha
- 🇯🇵 اليابان: Rakuten, Stability AI
- 🇰🇷 كوريا: Naver HyperCLOVA

---

### 3. **عرض الأدوات - 50+ أداة**
```powershell
npm run mimo:tools
```
**الوصف:** يعرض جميع الأدوات المتاحة:
- 📁 FileSystem (قراءة/كتابة الملفات)
- 💻 Terminal (تنفيذ الأوامر)
- 🌐 Browser (أتمتة المتصفح)
- 🔧 Git (عمليات Git)
- 🧪 Testing (اختبارات تلقائية)

---

### 4. **عرض سير العمل (BMAD)**
```powershell
npm run mimo:workflow
```
**الوصف:** يعرض سير عمل BMAD الكامل:
- Validation (التحقق)
- Planning (التخطيط)
- Development (التطوير)
- Delivery (التسليم)

---

### 5. **عرض Perplexity - البحث الهجين** 🆕
```powershell
npm run mimo:perplexity
```
**الوصف:** يعرض قدرات Perplexity الهجينة:
- 🌐 بحث على الإنترنت مع مصادر
- 💻 برمجة نقية بدون بحث
- 🧠 استنتاج متقدم
- 🔄 هجين: بحث ← برمجة

---

## 🧪 أوامر الاختبار والجودة

### 1. **تشغيل الاختبارات**
```powershell
npm test
```
**الوصف:** يشغل جميع الاختبارات باستخدام Jest

---

### 2. **فحص الكود (Lint)**
```powershell
npm run lint
```
**الوصف:** يفحص الكود للتأكد من جودته

---

### 3. **تنسيق الكود (Format)**
```powershell
npm run format
```
**الوصف:** ينسق الكود باستخدام Prettier

---

## 📦 أوامر النشر

### 1. **التشغيل الإنتاجي**
```powershell
npm start
```
**الوصف:** يشغل النسخة المبنية (dist/)

---

### 2. **التحضير للنشر**
```powershell
npm run prepublishOnly
```
**الوصف:** يبني المشروع قبل النشر

---

## 🎯 أوامر مباشرة (CLI Commands)

### استخدام الوكلاء مباشرة:

```powershell
# Claude - Backend Specialist
npx tsx bin/mimo.ts c "How to implement JWT?"

# Gemini - System Architect
npx tsx bin/mimo.ts g "Design microservices architecture"

# Aider - Frontend Developer
npx tsx bin/mimo.ts a "Create React component"

# Codex - DevOps Engineer
npx tsx bin/mimo.ts x "Setup Docker"

# Perplexity - Researcher
npx tsx bin/mimo.ts p "Latest TypeScript features"
```

---

## 🔧 إعداد المشروع

### 1. **نسخ ملف البيئة**
```powershell
cp .env.example .env
```

### 2. **إضافة مفاتيح API**
افتح `.env` وأضف مفاتيحك:

```env
# OpenAI
OPENAI_API_KEY=sk-your_key_here

# Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-your_key_here

# Google (Gemini)
GOOGLE_API_KEY=your_key_here

# Perplexity
PERPLEXITY_API_KEY=pplx-your_key_here

# Groq (مجاني!)
GROQ_API_KEY=gsk-your_key_here
```

---

## 📚 ملفات التوثيق المتاحة

### 1. **README.md**
```powershell
# عرض الملف
cat README.md
```
**المحتوى:**
- نظرة عامة على MIMO
- جميع المميزات
- 10 مزودي AI
- 20+ نموذج
- دليل التثبيت

---

### 2. **USER_GUIDE.md**
```powershell
# عرض الملف
cat USER_GUIDE.md
```
**المحتوى:**
- دليل المستخدم الكامل
- أمثلة عملية
- استكشاف الأخطاء
- أفضل الممارسات
- 500+ سطر من التوثيق

---

### 3. **QUICKSTART.md**
```powershell
# عرض الملف
cat QUICKSTART.md
```
**المحتوى:**
- دليل البدء السريع
- الأوامر الأساسية
- أمثلة سريعة

---

## 🌟 أوامر مفيدة إضافية

### عرض جميع الأوامر المتاحة:
```powershell
npm run
```

### عرض معلومات المشروع:
```powershell
npm info
```

### تحديث التبعيات:
```powershell
npm update
```

### فحص الثغرات الأمنية:
```powershell
npm audit
```

---

## 🎯 سيناريوهات الاستخدام الشائعة

### 1. **البدء السريع (للمبتدئين)**
```powershell
# 1. التثبيت
npm install

# 2. نسخ البيئة
cp .env.example .env

# 3. إضافة مفتاح Groq (مجاني!)
# افتح .env وأضف: GROQ_API_KEY=gsk-...

# 4. تشغيل العرض
npm run mimo:demo
```

---

### 2. **استكشاف النماذج**
```powershell
# عرض جميع النماذج
npm run mimo:models

# عرض Perplexity
npm run mimo:perplexity

# عرض الأدوات
npm run mimo:tools
```

---

### 3. **التطوير التفاعلي**
```powershell
# فتح REPL
npm run mimo:repl

# ثم اكتب:
> Create a blog with Next.js
> Add authentication
> Generate tests
```

---

### 4. **البحث والبرمجة (Perplexity)**
```powershell
npm run mimo:perplexity
```
**يعرض:**
- بحث على الإنترنت مع مصادر
- برمجة نقية
- استنتاج متقدم
- سير عمل هجين

---

## 📊 ملخص الأوامر

| الأمر | الوصف | الاستخدام |
|-------|--------|-----------|
| `npm install` | تثبيت التبعيات | مرة واحدة |
| `npm run mimo:demo` | عرض جميع الوكلاء | تجربة |
| `npm run mimo:models` | عرض 100+ نموذج | استكشاف |
| `npm run mimo:tools` | عرض 50+ أداة | استكشاف |
| `npm run mimo:perplexity` | عرض Perplexity | بحث + برمجة |
| `npm run mimo:workflow` | عرض BMAD | سير العمل |
| `npm run mimo:repl` | وضع تفاعلي | تطوير |
| `npm run mimo` | تشغيل مباشر | إنتاج |
| `npm test` | اختبارات | جودة |
| `npm run build` | بناء | نشر |

---

## 🚀 البدء الآن!

### الخطوة 1: التثبيت
```powershell
npm install
```

### الخطوة 2: الإعداد
```powershell
cp .env.example .env
# أضف مفتاح API واحد على الأقل
```

### الخطوة 3: التجربة
```powershell
# جرب العرض
npm run mimo:demo

# أو جرب Perplexity
npm run mimo:perplexity

# أو افتح REPL
npm run mimo:repl
```

---

## 💡 نصائح مهمة

### 1. **للمبتدئين:**
ابدأ بـ Groq (مجاني وسريع):
```env
GROQ_API_KEY=gsk-your_key_here
```
احصل على المفتاح: https://console.groq.com

---

### 2. **لأفضل جودة برمجة:**
استخدم Claude:
```env
ANTHROPIC_API_KEY=sk-ant-your_key_here
```
احصل على المفتاح: https://console.anthropic.com

---

### 3. **للبحث والتوثيق:**
استخدم Perplexity:
```env
PERPLEXITY_API_KEY=pplx-your_key_here
```
احصل على المفتاح: https://www.perplexity.ai/settings/api

---

### 4. **للخصوصية (محلي ومجاني):**
استخدم Ollama:
```powershell
# تثبيت Ollama
curl -fsSL https://ollama.com/install.sh | sh

# تحميل نموذج
ollama pull llama3.2

# لا حاجة لمفتاح API!
```

---

## 📞 الحصول على المساعدة

### عرض المساعدة:
```powershell
npx tsx bin/mimo.ts help
```

### قراءة التوثيق:
- [README.md](file:///d:/MIMO-MAX-V2/mimo-cli-max-v5/README.md) - نظرة عامة
- [USER_GUIDE.md](file:///d:/MIMO-MAX-V2/mimo-cli-max-v5/USER_GUIDE.md) - دليل المستخدم
- [QUICKSTART.md](file:///d:/MIMO-MAX-V2/mimo-cli-max-v5/QUICKSTART.md) - بدء سريع

---

## 🎉 جاهز للاستخدام!

جميع الأوامر موثقة وجاهزة. ابدأ الآن:

```powershell
npm run mimo:demo
```

**استمتع بالبرمجة مع MIMO! 🚀**
