"use client";

const featuresList = [
  {
    title: "قراءة ذكية بالذكاء الاصطناعي (AI OCR)",
    desc: "التقط صورة للفاتورة الورقية أو قائمة الديون المكتوبة بخط اليد، وسيتولى التطبيق استخراج اسم العميل، المبلغ، والبيان وحفظها تلقائياً.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09"/>
      </svg>
    ),
  },
  {
    title: "أداء فائق وبدون إنترنت (Offline-First)",
    desc: "الوصول السريع لبيانات متجرك في أي وقت وبأي مكان دون الحاجة لاتصال بالإنترنت، بفضل قاعدة بيانات SQLite محلية مدمجة وسريعة.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    title: "مزامنة سحابية خاصة بـ Google Drive",
    desc: "حماية مطلقة لبيانات متجرك؛ يتم مزامنة النسخ الاحتياطية سحابياً مباشرة لحسابك الشخصي على جوجل درايف دون المرور بأي خوادم وسيطة.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
      </svg>
    ),
  },
  {
    title: "تنبيهات تلقائية عبر واتساب و SMS",
    desc: "أرسل كشوفات حساب تفصيلية لعملائك أو تذكيرات ودية بالديون المتأخرة عبر واتساب ورسائل SMS بقوالب جاهزة وقابلة للتخصيص الكامل.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    ),
  },
  {
    title: "أمان كامل وقفل بالبصمة (PIN / Biometric)",
    desc: "أمّن حسابات متجرك من المتطفلين باستخدام رمز قفل PIN مشفر، مع دعم المصادقة البيومترية كبصمة الإصبع وبصمة الوجه.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
  {
    title: "تقارير مالية وإحصائيات رسومية",
    desc: "تابع نمو أعمالك ومعدل سداد الديون، وتعرف على عملائك الأكثر مديونية عبر رسوم بيانية تفاعلية سهلة القراءة والتحليل.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="features-section">
      <div className="landing-container">
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "var(--color-gold-primary)", textTransform: "uppercase", letterSpacing: 1 }}>
            تقنيات متطورة
          </span>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "var(--color-text-primary)", marginTop: 8 }}>
            كل ما تحتاجه لإدارة محلك <span style={{ color: "var(--color-gold-primary)" }}>في تطبيق واحد</span>
          </h2>
        </div>

        <div className="features-grid">
          {featuresList.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon-box">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
