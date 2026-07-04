"use client";
import { useState } from "react";

const faqs = [
  {
    q: "هل يعمل تطبيق سجلها بدون الحاجة للاتصال بالإنترنت؟",
    a: "نعم تماماً، تطبيق سجلها مصمم للعمل دون اتصال بالإنترنت (Offline-first) ويحفظ جميع بيانات عملائك وديونهم محلياً في هاتفك بشكل مشفر وسريع جداً. تحتاج للإنترنت فقط عند إجراء عمليات المسح الضوئي الذكي للفواتير أو مزامنة النسخ الاحتياطية.",
  },
  {
    q: "كيف يمكنني تفعيل التطبيق والاشتراك في الباقات؟",
    a: "بسيطة جداً: قم بتحميل التطبيق وتثبيته، اذهب لصفحة الاشتراك وانسخ رقم جهازك (Device ID)، تواصل معنا بالضغط على زر 'تفعيل عبر واتساب' لإرسال طلب التفعيل بالباقة المختارة، وسنرسل لك كود التفعيل لتلصقه داخل التطبيق للتفعيل الفوري.",
  },
  {
    q: "ما هي آلية النسخ الاحتياطي وحماية بياناتي من الضياع؟",
    a: "يدعم التطبيق نسخاً احتياطياً محلياً يمكنك تصديره كملف، بالإضافة لمزامنة سحابية فائقة الأمان مباشرة لحساب Google Drive الخاص بك، مما يعني أن بياناتك ملكك تماماً ولا يستطيع أي خادم وسيط قراءتها أو الوصول إليها، ويمكنك استعادتها فوراً على أي هاتف جديد.",
  },
  {
    q: "هل يمكنني تشغيل نفس كود التفعيل على أكثر من جهاز؟",
    a: "كل كود تفعيل يقترن بجهاز واحد فقط (Device ID) لضمان أمان البيانات ومنع التكرار. إذا قمت بتغيير هاتفك، يمكنك التواصل مع الدعم الفني لنقل ترخيصك للجهاز الجديد مجاناً.",
  },
  {
    q: "ما هو حد الاستخدام للذكاء الاصطناعي في المسح الذكي؟",
    a: "الباقات المدفوعة تمنحك استخداماً غير محدود لميزة المسح الذكي بالذكاء الاصطناعي لقراءة الفواتير والديون، مع توفير خادم وسيط فائق السرعة لضمان أفضل دقة قراءة.",
  },
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section">
      <div className="landing-container">
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "var(--color-gold-primary)", textTransform: "uppercase", letterSpacing: 1 }}>
            إجابات شافية
          </span>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "var(--color-text-primary)", marginTop: 8 }}>
            الأسئلة <span style={{ color: "var(--color-gold-primary)" }}>الشائعة</span>
          </h2>
        </div>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <button className="faq-question-btn" onClick={() => toggleFaq(i)}>
                <span>{faq.q}</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-gold-primary)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transform: activeIndex === i ? "rotate(180deg)" : "none", transition: "transform 0.25s ease" }}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {activeIndex === i && <div className="faq-answer-body">{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
