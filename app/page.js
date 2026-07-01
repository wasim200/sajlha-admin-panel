"use client";

import { useState } from "react";
import './page.css';

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: "هل يعمل تطبيق سجلها بدون الحاجة للاتصال بالإنترنت؟",
      a: "نعم تماماً، تطبيق سجلها مصمم للعمل دون اتصال بالإنترنت (Offline-first) ويحفظ جميع بيانات عملائك وديونهم محلياً في هاتفك بشكل مشفر وسريع جداً. تحتاج للإنترنت فقط عند إجراء عمليات المسح الضوئي الذكي للفواتير أو مزامنة النسخ الاحتياطية."
    },
    {
      q: "كيف يمكنني تفعيل التطبيق والاشتراك في الباقات؟",
      a: "بسيطة جداً: قم بتحميل التطبيق وتثبيته، اذهب لصفحة الاشتراك وانسخ رقم جهازك (Device ID)، تواصل معنا بالضغط على زر 'تفعيل عبر واتساب' لإرسال طلب التفعيل بالباقة المختارة، وسنرسل لك كود التفعيل لتلصقه داخل التطبيق للتفعيل الفوري."
    },
    {
      q: "ما هي آلية النسخ الاحتياطي وحماية بياناتي من الضياع؟",
      a: "يدعم التطبيق نسخاً احتياطياً محلياً يمكنك تصديره كملف، بالإضافة لمزامنة سحابية فائقة الأمان مباشرة لحساب Google Drive الخاص بك، مما يعني أن بياناتك ملكك تماماً ولا يستطيع أي خادم وسيط قراءتها أو الوصول إليها، ويمكنك استعادتها فوراً على أي هاتف جديد."
    },
    {
      q: "هل يمكنني تشغيل نفس كود التفعيل على أكثر من جهاز؟",
      a: "كل كود تفعيل يقترن بجهاز واحد فقط (Device ID) لضمان أمان البيانات ومنع التكرار. إذا قمت بتغيير هاتفك، يمكنك التواصل مع الدعم الفني لنقل ترخيصك للجهاز الجديد مجاناً."
    },
    {
      q: "ما هو حد الاستخدام للذكاء الاصطناعي في المسح الذكي؟",
      a: "الباقات المدفوعة تمنحك استخداماً غير محدود لميزة المسح الذكي بالذكاء الاصطناعي لقراءة الفواتير والديون، مع توفير خادم وسيط فائق السرعة لضمان أفضل دقة قراءة."
    }
  ];

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" style={{ width: "26px", height: "26px", fill: "#c6a46a", transition: "fill 0.3s" }}>
          <path d="M19 13H5v-2h14v2zm-2-7H7v2h10V6zm2 14H5v-2h14v2zm-2-7h-4V9h4v2zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
        </svg>
      ),
      title: "قراءة ذكية بالذكاء الاصطناعي (AI OCR)",
      desc: "التقط صورة للفاتورة الورقية أو قائمة الديون المكتوبة بخط اليد، وسيتولى التطبيق استخراج اسم العميل، المبلغ، والبيان وحفظها تلقائياً."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" style={{ width: "26px", height: "26px", fill: "#c6a46a", transition: "fill 0.3s" }}>
          <path d="M11.5 2L2 13h9v9l9.5-11h-9V2z"/>
        </svg>
      ),
      title: "أداء فائق وبدون إنترنت (Offline)",
      desc: "الوصول السريع لبيانات متجرك في أي وقت وبأي مكان دون الحاجة لاتصال بالإنترنت، بفضل قاعدة بيانات SQLite محلية مدمجة وسريعة."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" style={{ width: "26px", height: "26px", fill: "#c6a46a", transition: "fill 0.3s" }}>
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z"/>
        </svg>
      ),
      title: "مزامنة سحابية خاصة بـ Google Drive",
      desc: "حماية مطلقة لبيانات متجرك؛ يتم مزامنة النسخ الاحتياطية سحابياً مباشرة لحسابك الشخصي على جوجل درايف دون المرور بأي خوادم وسيطة."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" style={{ width: "26px", height: "26px", fill: "#c6a46a", transition: "fill 0.3s" }}>
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
        </svg>
      ),
      title: "تنبيهات تلقائية عبر واتساب و SMS",
      desc: "أرسل كشوفات حساب تفصيلية لعملائك أو تذكيرات ودية بالديون المتأخرة عبر واتساب ورسائل SMS بقوالب جاهزة وقابلة للتخصيص الكامل."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" style={{ width: "26px", height: "26px", fill: "#c6a46a", transition: "fill 0.3s" }}>
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
        </svg>
      ),
      title: "أمان كامل وقفل بالبصمة (PIN/Biometric)",
      desc: "أمّن حسابات متجرك من المتطفلين باستخدام رمز قفل PIN مشفر، مع دعم المصادقة البيومترية كبصمة الإصبع وبصمة الوجه."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" style={{ width: "26px", height: "26px", fill: "#c6a46a", transition: "fill 0.3s" }}>
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
      ),
      title: "تقارير مالية وإحصائيات رسومية",
      desc: "تابع نمو أعمالك ومعدل سداد الديون، وتعرف على عملائك الأكثر مديونية عبر رسوم بيانية تفاعلية سهلة القراءة والتحليل."
    }
  ];

  const plans = [
    {
      name: "باقة 6 أشهر",
      duration: "180 يوم",
      price: "$8",
      popular: false,
      badge: "الباقة الأساسية",
      features: [
        "تفعيل كامل لجميع ميزات التطبيق الاحترافية",
        "مسح غير محدود للفواتير بالذكاء الاصطناعي",
        "مزامنة سحابية على Google Drive",
        "كشوفات حساب تفصيلية PDF",
        "دعم فني متكامل عبر واتساب"
      ],
      whatsappMsg: "مرحباً، أرغب بالاشتراك في باقة الـ 6 أشهر لتطبيق سجلها."
    },
    {
      name: "الباقة السنوية",
      duration: "360 يوم",
      price: "$14",
      popular: true,
      badge: "الأكثر طلباً وتوفيراً",
      features: [
        "تفعيل كامل لجميع ميزات التطبيق الاحترافية",
        "مسح غير محدود للفواتير بالذكاء الاصطناعي",
        "مزامنة سحابية على Google Drive",
        "كشوفات حساب تفصيلية PDF",
        "دعم فني متكامل ذو أولوية عبر واتساب"
      ],
      whatsappMsg: "مرحباً، أرغب بالاشتراك في الباقة السنوية (سنة كاملة) لتطبيق سجلها."
    },
    {
      name: "باقة سنتين",
      duration: "720 يوم",
      price: "$28",
      popular: false,
      badge: "أفضل قيمة وأمد أطول",
      features: [
        "تفعيل كامل لجميع ميزات التطبيق الاحترافية",
        "مسح غير محدود للفواتير بالذكاء الاصطناعي",
        "مزامنة سحابية على Google Drive",
        "كشوفات حساب تفصيلية PDF",
        "دعم فني مخصص وVIP على مدار الساعة"
      ],
      whatsappMsg: "مرحباً، أرغب بالاشتراك في الباقة الثنائية (سنتين) لتطبيق سجلها."
    }
  ];

  return (
    <div className="landing-wrapper">
      <div className="navbar-wrapper">
        <div className="container">
          <header className="navbar">
            <a href="#" className="nav-logo">سِجِلّها<span>.</span></a>
            <nav className="nav-links">
              <a href="#features" className="nav-link">الميزات</a>
              <a href="#pricing" className="nav-link">الباقات</a>
              <a href="#guide" className="nav-link">طريقة التفعيل</a>
              <a href="#faq" className="nav-link">الأسئلة الشائعة</a>
              <a href="/admin" className="btn btn-primary">لوحة التحكم</a>
            </nav>
          </header>
        </div>
      </div>

      <div className="hero-container-outer">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        <div className="container">
          <section className="hero-section">
            <span className="hero-tag">تطبيق المحاسبة وإدارة الديون رقم 1</span>
            <h2 className="hero-title">سجل ديون عملائك وفواتيرهم <span>بكل ثقة وذكاء</span></h2>
            <p className="hero-subtitle">
              تطبيق سجلها يمنحك حلاً محاسبياً متكاملاً لإدارة ديون متجرك وقراءة فواتيرك بالذكاء الاصطناعي وبدون اتصال بالإنترنت، مع مزامنة سحابية آمنة كلياً.
            </p>
            <div className="hero-ctas">
              <a href="https://wa.me/967781911651?text=مرحباً،%20أرغب%20بتحميل%20تطبيق%20سجلها%20وتجربته." target="_blank" className="btn btn-primary">تحميل وتجربة التطبيق مجاناً</a>
              <a href="#pricing" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>عرض باقات الاشتراك</a>
            </div>
          </section>
        </div>
      </div>

      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header fade-in">
            <h3 className="section-title">لماذا يختار التجار <span>سجلها</span>؟</h3>
            <p className="section-subtitle">
              حزمة متكاملة من الأدوات المحاسبية الحديثة والآمنة التي تسهّل إدارة تجارتك اليومية وتحفظ وقتك.
            </p>
          </div>
          <div className="features-grid">
            {features.map((feat, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon-wrapper">
                  {feat.icon}
                </div>
                <h4 className="feature-title">{feat.title}</h4>
                <p className="feature-desc">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم الباقات */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h3 className="section-title">باقات الترخيص <span>والاشتراك</span></h3>
            <p className="section-subtitle">
              اختر باقتك المفضلة وفعّل حسابك فوراً للوصول الكامل لجميع المميزات
            </p>
          </div>
          <div className="pricing-grid">
            {plans.map((plan, idx) => (
              <div key={idx} className={`pricing-card ${plan.popular ? "popular" : ""}`}>
                <span className="pricing-badge">{plan.badge}</span>
                <h4 className="plan-name">{plan.name}</h4>
                <p className="plan-duration">{plan.duration}</p>
                <div className="plan-price-row">
                  <span className="plan-price">{plan.price}</span>
                  <span className="plan-price-curr">دولار</span>
                </div>
                <ul className="plan-features-list">
                  {plan.features.map((f, i) => (
                    <li key={i} className="plan-feature-item">
                      <svg className="plan-feature-item-icon" viewBox="0 0 24 24">
                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a 
                  href={`https://wa.me/967781911651?text=${encodeURIComponent(plan.whatsappMsg)}`} 
                  target="_blank" 
                  className="btn-pricing-cta"
                >
                  اشترك الآن عبر واتساب
                </a>
              </div>
            ))}
          </div>

          <div className="info-box">
            <svg className="info-box-icon-vector" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            <p className="info-box-text">
              اختر الباقة المناسبة لك ثم اضغط على \"اشترك الآن عبر واتساب\" وسيتم إرسال طلبك تلقائياً لخدمة المبيعات مع تفاصيل الباقة المحددة لخدمتك وتوليد كود تفعيل فوري.
            </p>
          </div>
        </div>
      </section>

      {/* قسم طريقة التفعيل */}
      <section id="guide" className="guide-section">
        <div className="container">
          <div className="section-header">
            <h3 className="section-title">كيفية تفعيل <span>التطبيق</span></h3>
            <p className="section-subtitle">
              خطوات تفعيل وتجديد حسابك في تطبيق سجلها بضغطة زر
            </p>
          </div>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">١</div>
              <div className="step-content">
                <h4 className="step-title">تحميل التطبيق وتثبيته</h4>
                <p className="step-desc">قم بتحميل تطبيق سجلها وتثبيته على هاتفك، ثم اذهب لصفحة الترخيص داخل إعدادات التطبيق.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">٢</div>
              <div className="step-content">
                <h4 className="step-title">نسخ رقم الجهاز (Device ID)</h4>
                <p className="step-desc">ستجد رقماً مميزاً لجهازك في الشاشة، اضغط على زر نسخ لكي ترسله لنا لتوليد التفعيل المخصص لجهازك.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">٣</div>
              <div className="step-content">
                <h4 className="step-title">طلب وشراء كود الترخيص</h4>
                <p className="step-desc">تواصل معنا عبر واتساب المبيعات، وأرسل لنا رقم جهازك والباقة المختارة، وسنقوم بتزويدك بكود التفعيل المعتمد فوراً.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">٤</div>
              <div className="step-content">
                <h4 className="step-title">لصق الكود وتفعيل الحساب</h4>
                <p className="step-desc">الصق كود الترخيص الذي استلمته في حقل التفعيل داخل التطبيق واضغط على زر التفعيل ليفتح حسابك مدى باقتك.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* قسم الأسئلة الشائعة */}
      <section id="faq" className="faq-section">
        <div className="container">
          <div className="section-header">
            <h3 className="section-title">الأسئلة <span>الشائعة</span></h3>
            <p className="section-subtitle">
              إجابات سريعة للأسئلة التي تدور في ذهنك حول تطبيق سجلها
            </p>
          </div>
          <div className="faq-container">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`faq-item ${activeFaq === idx ? "active" : ""}`}
              >
                <button 
                  className="faq-question" 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                >
                  <span>{faq.q}</span>
                  <svg className="faq-arrow-vector" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </button>
                <div className="faq-answer">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* التذييل */}
      <footer className="footer">
        <div className="container">
          <a href="#" className="footer-logo">سِجِلّها<span>.</span></a>
          <p className="footer-desc">
            تطبيق سجلها المحاسبي لإدارة الديون والفواتير بالذكاء الاصطناعي وتسهيل إدارة متجرك بكل أمان وبساطة.
          </p>
          <div className="footer-links">
            <a href="#features" className="footer-link">الميزات</a>
            <a href="#pricing" className="footer-link">الباقات</a>
            <a href="#faq" className="footer-link">الأسئلة الشائعة</a>
            <a href="/admin" className="footer-link">بوابة الإدارة</a>
          </div>
          <p className="copyright">
            © {new Date().getFullYear()} تطبيق سجلها. جميع الحقوق محفوظة. تطوير بكل ❤️ لخدمة تجارنا.
          </p>
        </div>
      </footer>
    </div>
  );
}
