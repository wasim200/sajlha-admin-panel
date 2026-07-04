"use client";
import { useState } from "react";

const samples = [
  {
    id: 1,
    name: "فاتورة بخط اليد",
    imageText: "قائمة ديون محل أبو فهد:\n- أحمد العتيبي: 450 ر.س (حليب وجبن)\n- خالد الدوسري: 280 ر.س (رز وسكر)\n- محمد الشهري: 650 ر.س (زيت وشاي)",
    extracted: {
      customer: "أحمد العتيبي",
      amount: "450 ر.س",
      items: "حليب، جبن، أغراض سوبرماركت",
      confidence: "99.4%",
      speed: "0.4 ثانية",
    },
  },
  {
    id: 2,
    name: "فاتورة مطبوعة",
    imageText: "مؤسسة الرمال للتموينات - فاتورة #1042\nالعميل: شركة الأفق لتقنية المعلومات\nالمبلغ المستحق: 1,250 ر.س\nتاريخ الاستحقاق: 2026/07/15",
    extracted: {
      customer: "شركة الأفق لتقنية المعلومات",
      amount: "1,250 ر.س",
      items: "فاتورة تموينات #1042",
      confidence: "99.9%",
      speed: "0.3 ثانية",
    },
  },
  {
    id: 3,
    name: "قائمة ديون سريعة",
    imageText: "ديون شهر يوليو:\nسالم المطيري - 320 ريال (دفتر 1)\nفهد القحطاني - 1,100 ريال (قسط أول)",
    extracted: {
      customer: "فهد القحطاني",
      amount: "1,100 ر.س",
      items: "قسط أول ديون شهر يوليو",
      confidence: "98.7%",
      speed: "0.5 ثانية",
    },
  },
];

export default function InteractiveAiDemo() {
  const [selectedSample, setSelectedSample] = useState(samples[0]);
  const [isScanning, setIsScanning] = useState(false);

  const handleSelectSample = (sample) => {
    setSelectedSample(sample);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 700);
  };

  return (
    <section id="ai-demo" className="ai-demo-section">
      <div className="landing-container">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "var(--color-gold-primary)", textTransform: "uppercase", letterSpacing: 1 }}>
            تقنية حصريّة بالذكاء الاصطناعي
          </span>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "var(--color-text-primary)", marginTop: 8 }}>
            جرب ماسح الفواتير بالذكاء الاصطناعي <span style={{ color: "var(--color-gold-primary)" }}>مباشرة الآن</span>
          </h2>
          <p style={{ fontSize: 15, color: "var(--color-text-secondary)", maxWidth: 540, margin: "12px auto 0 auto" }}>
            اختر عينة فاتورة أدناه وسيقوم الذكاء الاصطناعي بقراءة الخط واستخراج الاسم والمبلغ وفهرستها فوراً!
          </p>
        </div>

        <div className="ai-demo-card">
          {/* Sample Picker */}
          <div className="sample-invoices-picker">
            {samples.map((s) => (
              <button
                key={s.id}
                className={`sample-picker-btn ${selectedSample.id === s.id ? "active" : ""}`}
                onClick={() => handleSelectSample(s)}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="ai-demo-grid">
            {/* Invoice Image Mockup */}
            <div className="invoice-preview-box">
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--color-text-tertiary)", marginBottom: 12 }}>
                📷 صورة الفاتورة المدخلة (ورقية / بخط اليد):
              </div>
              <div className="invoice-paper-mock">
                {isScanning && <div className="scanning-line" />}
                <pre style={{ margin: 0, fontFamily: "inherit", whiteSpace: "pre-wrap" }}>
                  {selectedSample.imageText}
                </pre>
              </div>
            </div>

            {/* AI Extracted Result */}
            <div className="ai-extracted-box">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ fontSize: 15, fontWeight: 900, color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-primary)" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  نتيجة استخراج الذكاء الاصطناعي:
                </span>
                <span className="status-badge status-active">
                  {isScanning ? "جاري المسح..." : `دقة ${selectedSample.extracted.confidence}`}
                </span>
              </div>

              {isScanning ? (
                <div style={{ padding: 40, textAlign: "center", color: "var(--color-gold-primary)", fontWeight: 800 }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite", marginBottom: 12 }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  <div>جاري تحليل الخط وقراءة المبالغ بواسطة AI...</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
                    <span style={{ fontSize: 13, color: "var(--color-text-tertiary)", fontWeight: 700 }}>اسم العميل:</span>
                    <span style={{ fontSize: 14, fontWeight: 900, color: "var(--color-text-primary)" }}>{selectedSample.extracted.customer}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
                    <span style={{ fontSize: 13, color: "var(--color-text-tertiary)", fontWeight: 700 }}>المبلغ الاستخراجي:</span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: "var(--color-gold-primary)" }}>{selectedSample.extracted.amount}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
                    <span style={{ fontSize: 13, color: "var(--color-text-tertiary)", fontWeight: 700 }}>التفاصيل المستخرجة:</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-secondary)" }}>{selectedSample.extracted.items}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
                    <span style={{ fontSize: 13, color: "var(--color-text-tertiary)", fontWeight: 700 }}>سرعة المعالجة:</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "var(--color-success)" }}>{selectedSample.extracted.speed}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
