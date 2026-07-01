"use client";

import { useState } from "react";

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
      icon: "🤖",
      title: "قراءة ذكية بالذكاء الاصطناعي (AI OCR)",
      desc: "التقط صورة للفاتورة الورقية أو قائمة الديون المكتوبة بخط اليد، وسيتولى التطبيق استخراج اسم العميل، المبلغ، والبيان وحفظها تلقائياً."
    },
    {
      icon: "⚡",
      title: "أداء فائق وبدون إنترنت (Offline)",
      desc: "الوصول السريع لبيانات متجرك في أي وقت وبأي مكان دون الحاجة لاتصال بالإنترنت، بفضل قاعدة بيانات SQLite محلية مدمجة وسريعة."
    },
    {
      icon: "☁️",
      title: "مزامنة سحابية خاصة بـ Google Drive",
      desc: "حماية مطلقة لبيانات متجرك؛ يتم مزامنة النسخ الاحتياطية سحابياً مباشرة لحسابك الشخصي على جوجل درايف دون المرور بأي خوادم وسيطة."
    },
    {
      icon: "💬",
      title: "تنبيهات تلقائية عبر واتساب و SMS",
      desc: "أرسل كشوفات حساب تفصيلية لعملائك أو تذكيرات ودية بالديون المتأخرة عبر واتساب ورسائل SMS بقوالب جاهزة وقابلة للتخصيص الكامل."
    },
    {
      icon: "🔒",
      title: "أمان كامل وقفل بالبصمة (PIN/Biometric)",
      desc: "أمّن حسابات متجرك من المتطفلين باستخدام رمز قفل PIN مشفر، مع دعم المصادقة البيومترية كبصمة الإصبع وبصمة الوجه."
    },
    {
      icon: "📊",
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
      name: "الباقة الثنائية",
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
      <style>{`
        /* الهوية البصرية الحجرية والذهبية الفاخرة */
        .landing-wrapper {
          background-color: #0b0c10;
          color: #e2e8f0;
          font-family: 'Cairo', sans-serif;
          direction: rtl;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* حاويات الأقسام */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* شريط التنقل العلوي */
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 0;
          border-bottom: 1px solid rgba(213, 176, 117, 0.1);
        }
        .nav-logo {
          font-size: 24px;
          font-weight: 900;
          color: #d5b075;
          text-decoration: none;
          text-shadow: 0 0 10px rgba(213, 176, 117, 0.2);
        }
        .nav-links {
          display: flex;
          gap: 24px;
          align-items: center;
        }
        .nav-link {
          color: #94a3b8;
          text-decoration: none;
          font-weight: 700;
          font-size: 14.5px;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: #ffffff;
        }
        .btn-nav-action {
          background: linear-gradient(135deg, #d5b075, #bca374);
          color: #0b0c10;
          padding: 8px 20px;
          border-radius: 10px;
          font-weight: 700;
          text-decoration: none;
          font-size: 13.5px;
          box-shadow: 0 4px 12px rgba(213, 176, 117, 0.25);
          transition: all 0.25s;
        }
        .btn-nav-action:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(213, 176, 117, 0.35);
        }

        /* قسم الهيرو الرئيسي */
        .hero-section {
          padding: 80px 0 120px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
        }
        .hero-glow-gold {
          position: absolute;
          top: 10%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(213, 176, 117, 0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 1;
        }
        .hero-tag {
          font-size: 14px;
          font-weight: 800;
          color: #d5b075;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 20px;
          padding: 6px 14px;
          background-color: rgba(213, 176, 117, 0.07);
          border: 1px solid rgba(213, 176, 117, 0.2);
          border-radius: 20px;
          display: inline-block;
        }
        .hero-title {
          font-size: 48px;
          font-weight: 900;
          color: #ffffff;
          line-height: 1.3;
          margin: 0 auto 24px auto;
          max-width: 800px;
        }
        .hero-title span {
          color: #d5b075;
          text-shadow: 0 0 15px rgba(213, 176, 117, 0.15);
        }
        .hero-subtitle {
          font-size: 17px;
          color: #94a3b8;
          max-width: 600px;
          line-height: 1.7;
          margin: 0 auto 40px auto;
        }
        .hero-ctas {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-bottom: 60px;
          flex-wrap: wrap;
        }
        .btn-hero-primary {
          background: linear-gradient(135deg, #d5b075, #bca374);
          color: #0b0c10;
          padding: 14px 34px;
          border-radius: 14px;
          font-weight: 800;
          font-size: 16px;
          text-decoration: none;
          box-shadow: 0 10px 24px rgba(213, 176, 117, 0.25);
          transition: all 0.25s ease-in-out;
        }
        .btn-hero-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(213, 176, 117, 0.35);
        }
        .btn-hero-secondary {
          background-color: #12131c;
          color: #ffffff;
          border: 1.5px solid rgba(213, 176, 117, 0.3);
          padding: 14px 34px;
          border-radius: 14px;
          font-weight: 800;
          font-size: 16px;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .btn-hero-secondary:hover {
          background-color: rgba(213, 176, 117, 0.05);
          border-color: #d5b075;
          transform: translateY(-1px);
        }

        /* موك آب الهاتف الذكي الحركي */
        .hero-mockup-wrapper {
          width: 100%;
          max-width: 850px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .hero-mockup {
          background: #11131e;
          border: 2px solid rgba(213, 176, 117, 0.2);
          border-radius: 28px;
          padding: 8px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(213, 176, 117, 0.05);
          transition: transform 0.4s ease-out;
        }
        .hero-mockup:hover {
          transform: translateY(-5px) scale(1.01);
          border-color: rgba(213, 176, 117, 0.4);
        }
        .mockup-inner {
          background: #090a0e;
          border-radius: 22px;
          overflow: hidden;
          aspect-ratio: 16/9;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .mockup-svg-placeholder {
          color: rgba(213, 176, 117, 0.4);
          font-size: 64px;
          font-weight: 900;
          letter-spacing: 2px;
          text-shadow: 0 0 20px rgba(213, 176, 117, 0.2);
        }

        /* قسم الميزات */
        .features-section {
          padding: 100px 0;
          background-color: #0e0f17;
          border-top: 1px solid rgba(213, 176, 117, 0.05);
        }
        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }
        .section-title {
          font-size: 34px;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 12px;
        }
        .section-title span {
          color: #d5b075;
        }
        .section-subtitle {
          color: #94a3b8;
          font-size: 15.5px;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
        }
        .feature-card {
          background: #11131e;
          border: 1px solid rgba(213, 176, 117, 0.06);
          border-radius: 20px;
          padding: 34px;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(213, 176, 117, 0.25);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        }
        .feature-icon {
          font-size: 38px;
          margin-bottom: 20px;
          display: inline-block;
        }
        .feature-title {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 12px;
        }
        .feature-desc {
          font-size: 13.5px;
          color: #94a3b8;
          line-height: 1.7;
        }

        /* قسم الباقات والأسعار */
        .pricing-section {
          padding: 100px 0;
          background-color: #0b0c10;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
          align-items: center;
        }
        .pricing-card {
          background: #11131e;
          border: 1.5px solid rgba(213, 176, 117, 0.08);
          border-radius: 24px;
          padding: 44px 34px;
          position: relative;
          transition: all 0.25s ease;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        }
        .pricing-card:hover {
          transform: scale(1.015);
          border-color: rgba(213, 176, 117, 0.35);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .pricing-card.popular {
          border-color: #d5b075;
          box-shadow: 0 15px 35px rgba(213, 176, 117, 0.15);
        }
        .pricing-badge {
          position: absolute;
          top: 24px;
          left: 24px;
          font-size: 11px;
          font-weight: 800;
          color: #d5b075;
          background: rgba(213, 176, 117, 0.08);
          border: 1px solid rgba(213, 176, 117, 0.25);
          padding: 4px 12px;
          border-radius: 20px;
        }
        .pricing-card.popular .pricing-badge {
          background: #d5b075;
          color: #0b0c10;
        }
        .plan-name {
          font-size: 20px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 6px;
        }
        .plan-duration {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 24px;
          font-weight: 600;
        }
        .plan-price-row {
          display: flex;
          align-items: baseline;
          margin-bottom: 30px;
        }
        .plan-price {
          font-size: 48px;
          font-weight: 900;
          color: #ffffff;
        }
        .plan-price-curr {
          font-size: 16px;
          color: #d5b075;
          margin-right: 4px;
          font-weight: 800;
        }
        .plan-features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 34px 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .plan-feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13.5px;
          color: #cbd5e1;
          font-weight: 600;
        }
        .plan-feature-item::before {
          content: "✓";
          color: #d5b075;
          font-weight: 900;
        }
        .btn-pricing-cta {
          display: block;
          width: 100%;
          padding: 14px;
          text-align: center;
          background-color: #161824;
          color: #ffffff;
          border: 1px solid rgba(213, 176, 117, 0.25);
          border-radius: 12px;
          font-weight: 800;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.25s;
          box-sizing: border-box;
        }
        .btn-pricing-cta:hover {
          background: linear-gradient(135deg, #d5b075, #bca374);
          color: #0b0c10;
          box-shadow: 0 6px 16px rgba(213, 176, 117, 0.25);
        }
        .popular .btn-pricing-cta {
          background: linear-gradient(135deg, #d5b075, #bca374);
          color: #0b0c10;
          border: none;
          box-shadow: 0 8px 20px rgba(213, 176, 117, 0.3);
        }

        /* قسم خطوت التشغيل */
        .guide-section {
          padding: 100px 0;
          background-color: #0e0f17;
        }
        .steps-container {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }
        .step-item {
          display: flex;
          gap: 24px;
          margin-bottom: 40px;
          position: relative;
        }
        .step-number {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(213, 176, 117, 0.1);
          border: 1.5px solid #d5b075;
          color: #d5b075;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 18px;
          flex-shrink: 0;
          box-shadow: 0 0 15px rgba(213, 176, 117, 0.15);
        }
        .step-content {
          text-align: right;
          padding-top: 6px;
        }
        .step-title {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 8px;
        }
        .step-desc {
          font-size: 13.5px;
          color: #94a3b8;
          line-height: 1.6;
        }

        /* قسم الأسئلة الشائعة */
        .faq-section {
          padding: 100px 0;
          background-color: #0b0c10;
        }
        .faq-container {
          max-width: 750px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .faq-item {
          background-color: #11131e;
          border: 1px solid rgba(213, 176, 117, 0.08);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.2s;
        }
        .faq-item:hover {
          border-color: rgba(213, 176, 117, 0.25);
        }
        .faq-question {
          width: 100%;
          padding: 20px 24px;
          background: transparent;
          border: none;
          color: #ffffff;
          text-align: right;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Cairo', sans-serif;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .faq-answer {
          padding: 0 24px 20px 24px;
          font-size: 13.5px;
          color: #94a3b8;
          line-height: 1.7;
          display: none;
        }
        .faq-item.active .faq-answer {
          display: block;
        }
        .faq-arrow {
          color: #d5b075;
          transition: transform 0.2s;
        }
        .faq-item.active .faq-arrow {
          transform: rotate(180deg);
        }

        /* قسم التذييل */
        .footer {
          border-top: 1px solid rgba(213, 176, 117, 0.1);
          padding: 50px 0;
          background-color: #08090d;
          text-align: center;
        }
        .footer-logo {
          font-size: 28px;
          font-weight: 900;
          color: #d5b075;
          margin-bottom: 12px;
          display: inline-block;
          text-decoration: none;
          text-shadow: 0 0 10px rgba(213, 176, 117, 0.2);
        }
        .footer-desc {
          color: #64748b;
          font-size: 13px;
          max-width: 450px;
          margin: 0 auto 30px auto;
          line-height: 1.6;
        }
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-bottom: 30px;
        }
        .footer-link {
          color: #94a3b8;
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 600;
          transition: color 0.15s;
        }
        .footer-link:hover {
          color: #ffffff;
        }
        .copyright {
          font-size: 12px;
          color: #475569;
          font-weight: 600;
        }
      `}</style>

      {/* شريط التنقل */}
      <div className="container">
        <header className="navbar">
          <a href="#" className="nav-logo">سِجِلّها</a>
          <nav className="nav-links">
            <a href="#features" className="nav-link">الميزات</a>
            <a href="#pricing" className="nav-link">الباقات</a>
            <a href="#guide" className="nav-link">طريقة التفعيل</a>
            <a href="#faq" className="nav-link">الأسئلة الشائعة</a>
            <a href="/admin" className="btn-nav-action">لوحة التحكم</a>
          </nav>
        </header>
      </div>

      {/* قسم البداية (Hero Section) */}
      <main className="container">
        <section className="hero-section">
          <div className="hero-glow-gold"></div>
          <span className="hero-tag">تطبيق المحاسبة الذكي للمحلات</span>
          <h2 className="hero-title">سجل ديون عملائك وفواتيرهم <span>بكل ثقة وذكاء</span></h2>
          <p className="hero-subtitle">
            ودّع دفاتر الديون الورقية ومشاكل الحسابات! تطبيق سجلها يمنحك حلاً متكاملاً لإدارة ديون متجرك وقراءة فواتيرك بالذكاء الاصطناعي وبدون اتصال بالإنترنت.
          </p>
          <div className="hero-ctas">
            <a href="https://wa.me/967781911651?text=مرحباً،%20أرغب%20بتحميل%20تطبيق%20سجلها%20وتجربته." target="_blank" className="btn-hero-primary">تحميل وتجربة التطبيق</a>
            <a href="#pricing" className="btn-hero-secondary">باقات التفعيل والاشتراك</a>
          </div>

          <div className="hero-mockup-wrapper">
            <div className="hero-mockup">
              <div className="mockup-inner">
                <span className="mockup-svg-placeholder">SAJ-PRO</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* قسم الميزات */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h3 className="section-title">لماذا يختار التجار <span>سجلها</span>؟</h3>
            <p className="section-subtitle">
              حزمة متكاملة من الأدوات المحاسبية الحديثة والآمنة التي تسهّل إدارة تجارتك اليومية
            </p>
          </div>
          <div className="features-grid">
            {features.map((feat, idx) => (
              <div key={idx} className="feature-card">
                <span className="feature-icon">{feat.icon}</span>
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
                    <li key={i} className="plan-feature-item">{f}</li>
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
                <h4 className="step-title">شراء كود الترخيص</h4>
                <p className="step-desc">تواصل معنا عبر قنوات الاتصال بالأسفل، أرسل لنا رقم جهازك والباقة المختارة، وسنقوم بتسجيلك وتزويدك بكود التفعيل فوراً.</p>
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
                  <span className="faq-arrow">▼</span>
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
          <a href="#" className="footer-logo">سِجِلّها</a>
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
