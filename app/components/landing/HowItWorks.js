"use client";

const steps = [
  {
    num: "1",
    title: "تحميل وتثبيت التطبيق",
    desc: "قم بتحميل تطبيق سجلها وتثبيته على هاتفك الأندرويد، التطبيق مجاني وجاهز للعمل مباشرة.",
  },
  {
    num: "2",
    title: "نسخ رقم الجهاز (Device ID)",
    desc: "افتح صفحة التفعيل داخل التطبيق وانسخ رقم المعرف الخاص بجهازك بنقرة واحدة.",
  },
  {
    num: "3",
    title: "إرسال الطلب ولصق الكود",
    desc: "تواصل معنا عبر واتساب للحصول على كود التفعيل المعتمد ولصقه داخل التطبيق للتفعيل الفوري.",
  },
];

export default function HowItWorks() {
  return (
    <section id="steps" className="steps-section">
      <div className="landing-container">
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "var(--color-gold-primary)", textTransform: "uppercase", letterSpacing: 1 }}>
            سهولة وسرعة
          </span>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "var(--color-text-primary)", marginTop: 8 }}>
            كيف تبدأ استخدام <span style={{ color: "var(--color-gold-primary)" }}>سِجِلّها؟</span>
          </h2>
        </div>

        <div className="steps-grid">
          {steps.map((step, i) => (
            <div key={i} className="step-card">
              <div className="step-number-badge">{step.num}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
