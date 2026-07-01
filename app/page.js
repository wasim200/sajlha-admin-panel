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
      <style>{`
        /* الهوية البصرية المتوافقة مع صور التطبيق المرفقة (حجري كريمي وذهبي فاخر) */
        .landing-wrapper {
          background-color: #f4f5f8;
          color: #1e293b;
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

        /* شريط التنقل العلوي الفاخر */
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 0;
          border-bottom: 1.5px solid rgba(198, 164, 106, 0.15);
        }
        .nav-logo {
          font-size: 26px;
          font-weight: 900;
          color: #1e2235;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-logo span {
          color: #c6a46a;
        }
        .nav-links {
          display: flex;
          gap: 28px;
          align-items: center;
        }
        .nav-link {
          color: #475569;
          text-decoration: none;
          font-weight: 700;
          font-size: 14.5px;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: #c6a46a;
        }
        .btn-nav-action {
          background-color: #c6a46a;
          color: #ffffff;
          padding: 10px 24px;
          border-radius: 12px;
          font-weight: 800;
          text-decoration: none;
          font-size: 14px;
          box-shadow: 0 4px 14px rgba(198, 164, 106, 0.3);
          transition: all 0.25s ease;
        }
        .btn-nav-action:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 6px 20px rgba(198, 164, 106, 0.45);
          background-color: #bfa063;
        }

        /* قسم الهيرو الرئيسي - مستوحى من هيدر شاشة انتهاء الصلاحية */
        .hero-container-outer {
          background: linear-gradient(180deg, #151724 0%, #1e2235 100%);
          border-bottom-left-radius: 40px;
          border-bottom-right-radius: 40px;
          padding: 80px 0 100px 0;
          position: relative;
          color: #ffffff;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }
        .hero-glow-rings {
          position: absolute;
          top: 30px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 1px solid rgba(198, 164, 106, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-glow-rings-inner {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border: 1.5px solid rgba(198, 164, 106, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle, rgba(198, 164, 106, 0.15) 0%, transparent 80%);
          box-shadow: 0 0 20px rgba(198, 164, 106, 0.1);
        }
        .hero-icon {
          font-size: 32px;
          color: #c6a46a;
        }
        .hero-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding-top: 80px;
        }
        .hero-tag {
          font-size: 13.5px;
          font-weight: 800;
          color: #c6a46a;
          background-color: rgba(198, 164, 106, 0.08);
          border: 1.5px solid rgba(198, 164, 106, 0.25);
          padding: 6px 14px;
          border-radius: 20px;
          display: inline-block;
          margin-bottom: 24px;
        }
        .hero-title {
          font-size: 42px;
          font-weight: 900;
          line-height: 1.35;
          max-width: 800px;
          margin: 0 auto 24px auto;
          color: #ffffff;
        }
        .hero-title span {
          color: #c6a46a;
        }
        .hero-subtitle {
          font-size: 16.5px;
          color: #cbd5e1;
          max-width: 600px;
          line-height: 1.7;
          margin: 0 auto 40px auto;
        }
        .hero-ctas {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn-hero-primary {
          background-color: #c6a46a;
          color: #ffffff;
          padding: 14px 36px;
          border-radius: 14px;
          font-weight: 800;
          font-size: 16px;
          text-decoration: none;
          box-shadow: 0 8px 20px rgba(198, 164, 106, 0.35);
          transition: all 0.25s ease-in-out;
        }
        .btn-hero-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(198, 164, 106, 0.5);
          background-color: #bfa063;
        }
        .btn-hero-secondary {
          background-color: transparent;
          color: #ffffff;
          border: 2px solid rgba(198, 164, 106, 0.4);
          padding: 14px 36px;
          border-radius: 14px;
          font-weight: 800;
          font-size: 16px;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .btn-hero-secondary:hover {
          background-color: rgba(198, 164, 106, 0.08);
          border-color: #c6a46a;
        }

        /* حاويات الميزات والبطاقات - مستوحاة من كروت الشاشة الرئيسية */
        .features-section {
          padding: 100px 0;
        }
        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }
        .section-title {
          font-size: 32px;
          font-weight: 900;
          color: #1e2235;
          margin-bottom: 12px;
        }
        .section-title span {
          color: #c6a46a;
        }
        .section-subtitle {
          color: #64748b;
          font-size: 15.5px;
          max-width: 550px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }
        .feature-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 24px;
          padding: 34px;
          transition: all 0.25s ease;
          box-shadow: 0 10px 20px rgba(30, 34, 53, 0.02);
        }
        .feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(198, 164, 106, 0.3);
          box-shadow: 0 15px 30px rgba(198, 164, 106, 0.08);
        }
        .feature-icon-wrapper {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          background-color: rgba(198, 164, 106, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          font-size: 26px;
        }
        .feature-title {
          font-size: 18px;
          font-weight: 800;
          color: #1e2235;
          margin-bottom: 12px;
        }
        .feature-desc {
          font-size: 14px;
          color: #64748b;
          line-height: 1.7;
        }

        /* قسم الباقات وكروت الأسعار - مستوحى من كروت اختيار الباقة */
        .pricing-section {
          padding: 100px 0;
          background-color: #fafbfd;
          border-top: 1px solid rgba(226, 232, 240, 0.8);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          align-items: stretch;
          margin-top: 40px;
        }
        .pricing-card {
          background: #ffffff;
          border: 1.5px solid rgba(226, 232, 240, 0.8);
          border-radius: 24px;
          padding: 44px 34px;
          position: relative;
          transition: all 0.25s ease;
          box-shadow: 0 10px 25px rgba(30, 34, 53, 0.03);
          display: flex;
          flex-direction: column;
        }
        .pricing-card:hover {
          transform: translateY(-4px);
          border-color: rgba(198, 164, 106, 0.3);
          box-shadow: 0 15px 30px rgba(198, 164, 106, 0.08);
        }
        .pricing-card.popular {
          border: 2px solid #c6a46a;
          background-color: #fefcf8;
          box-shadow: 0 15px 35px rgba(198, 164, 106, 0.12);
        }
        .pricing-badge {
          position: absolute;
          top: 24px;
          left: 24px;
          font-size: 11px;
          font-weight: 800;
          color: #c6a46a;
          background: rgba(198, 164, 106, 0.08);
          border: 1.5px solid rgba(198, 164, 106, 0.2);
          padding: 4px 12px;
          border-radius: 20px;
        }
        .pricing-card.popular .pricing-badge {
          background: #c6a46a;
          color: #ffffff;
          border: none;
        }
        .plan-name {
          font-size: 22px;
          font-weight: 800;
          color: #1e2235;
          margin-bottom: 6px;
        }
        .plan-duration {
          font-size: 13.5px;
          color: #64748b;
          margin-bottom: 24px;
          font-weight: 700;
        }
        .plan-price-row {
          display: flex;
          align-items: baseline;
          margin-bottom: 30px;
        }
        .plan-price {
          font-size: 44px;
          font-weight: 900;
          color: #1e2235;
        }
        .plan-price-curr {
          font-size: 16px;
          color: #c6a46a;
          margin-right: 6px;
          font-weight: 800;
        }
        .plan-features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 34px 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
          flex-grow: 1;
        }
        .plan-feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: #475569;
          font-weight: 600;
        }
        .plan-feature-item::before {
          content: "✓";
          color: #c6a46a;
          font-weight: 900;
          font-size: 15px;
        }
        .btn-pricing-cta {
          display: block;
          width: 100%;
          padding: 14px;
          text-align: center;
          background-color: #ffffff;
          color: #c6a46a;
          border: 2px solid rgba(198, 164, 106, 0.4);
          border-radius: 14px;
          font-weight: 800;
          font-size: 14.5px;
          text-decoration: none;
          transition: all 0.25s;
          box-sizing: border-box;
        }
        .btn-pricing-cta:hover {
          background-color: #c6a46a;
          color: #ffffff;
          border-color: #c6a46a;
          box-shadow: 0 6px 16px rgba(198, 164, 106, 0.25);
        }
        .popular .btn-pricing-cta {
          background-color: #c6a46a;
          color: #ffffff;
          border: none;
          box-shadow: 0 8px 20px rgba(198, 164, 106, 0.3);
        }
        .popular .btn-pricing-cta:hover {
          background-color: #bfa063;
        }

        /* صندوق الإشعار المساعد - مستوحى من صندوق تلميحات التفعيل */
        .info-box {
          background-color: #fdf8f5;
          border: 1px solid rgba(198, 164, 106, 0.2);
          padding: 18px 24px;
          border-radius: 16px;
          margin-top: 40px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }
        .info-box-icon {
          color: #c6a46a;
          font-size: 20px;
          font-weight: 900;
          line-height: 1;
        }
        .info-box-text {
          font-size: 13.5px;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
          font-weight: 600;
        }

        /* قسم خطوات التشغيل */
        .guide-section {
          padding: 100px 0;
        }
        .steps-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .step-item {
          display: flex;
          gap: 24px;
          margin-bottom: 40px;
        }
        .step-number {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(198, 164, 106, 0.08);
          border: 1.5px solid #c6a46a;
          color: #c6a46a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 18px;
          flex-shrink: 0;
          box-shadow: 0 0 15px rgba(198, 164, 106, 0.1);
        }
        .step-content {
          text-align: right;
          padding-top: 6px;
        }
        .step-title {
          font-size: 18px;
          font-weight: 800;
          color: #1e2235;
          margin-bottom: 8px;
        }
        .step-desc {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
        }

        /* قسم الأسئلة الشائعة */
        .faq-section {
          padding: 100px 0;
          background-color: #fafbfd;
        }
        .faq-container {
          max-width: 750px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .faq-item {
          background-color: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.2s;
        }
        .faq-item:hover {
          border-color: rgba(198, 164, 106, 0.25);
        }
        .faq-question {
          width: 100%;
          padding: 20px 24px;
          background: transparent;
          border: none;
          color: #1e2235;
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
          font-size: 14px;
          color: #64748b;
          line-height: 1.7;
          display: none;
        }
        .faq-item.active .faq-answer {
          display: block;
        }
        .faq-arrow {
          color: #c6a46a;
          transition: transform 0.2s;
        }
        .faq-item.active .faq-arrow {
          transform: rotate(180deg);
        }

        /* التذييل */
        .footer {
          border-top: 1.5px solid rgba(198, 164, 106, 0.15);
          padding: 55px 0;
          background-color: #151724;
          color: #e2e8f0;
          text-align: center;
        }
        .footer-logo {
          font-size: 28px;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 12px;
          display: inline-block;
          text-decoration: none;
        }
        .footer-logo span {
          color: #c6a46a;
        }
        .footer-desc {
          color: #94a3b8;
          font-size: 13.5px;
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
          color: #cbd5e1;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: color 0.15s;
        }
        .footer-link:hover {
          color: #c6a46a;
        }
        .copyright {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
        }
      `}</style>

      {/* شريط التنقل */}
      <div className="container" style={{ backgroundColor: "#ffffff" }}>
        <header className="navbar">
          <a href="#" className="nav-logo">سِجِلّها<span>.</span></a>
          <nav className="nav-links">
            <a href="#features" className="nav-link">الميزات</a>
            <a href="#pricing" className="nav-link">الباقات</a>
            <a href="#guide" className="nav-link">طريقة التفعيل</a>
            <a href="#faq" className="nav-link">الأسئلة الشائعة</a>
            <a href="/admin" className="btn-nav-action">لوحة التحكم</a>
          </nav>
        </header>
      </div>

      {/* هيدر الهيرو الرئيسي (الوضع الداكن المدمج) */}
      <div className="hero-container-outer">
        <div className="hero-glow-rings">
          <div className="hero-glow-rings-inner">
            <span className="hero-icon">🔒</span>
          </div>
        </div>
        <div className="container">
          <section className="hero-section">
            <span className="hero-tag">تطبيق المحاسبة وإدارة الديون</span>
            <h2 className="hero-title">سجل ديون عملائك وفواتيرهم <span>بكل ثقة وذكاء</span></h2>
            <p className="hero-subtitle">
              تطبيق سجلها يمنحك حلاً محاسبياً متكاملاً لإدارة ديون متجرك وقراءة فواتيرك بالذكاء الاصطناعي وبدون اتصال بالإنترنت.
            </p>
            <div className="hero-ctas">
              <a href="https://wa.me/967781911651?text=مرحباً،%20أرغب%20بتحميل%20تطبيق%20سجلها%20وتجربته." target="_blank" className="btn-hero-primary">تحميل وتجربة التطبيق</a>
              <a href="#pricing" className="btn-hero-secondary">باقات التفعيل والاشتراك</a>
            </div>
          </section>
        </div>
      </div>

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
                <div className="feature-icon-wrapper">
                  <span>{feat.icon}</span>
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

          <div className="info-box">
            <span className="info-box-icon">ⓘ</span>
            <p className="info-box-text">
              اختر الباقة المناسبة لك ثم اضغط على "اشترك الآن عبر واتساب" وسيتم إرسال طلبك تلقائياً لخدمة المبيعات مع تفاصيل الباقة المحددة لخدمتك وتوليد كود تفعيل فوري.
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
