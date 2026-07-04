"use client";
import { useState } from "react";

const showcaseTabs = [
  {
    id: "ledger",
    title: "دفتر ديون العملاء",
    desc: "متابعة أرصدة العملاء والديون المتأخرة فورياً وبدون إنترنت في قاعدة بيانات فائقة السرعة.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
    mockData: [
      { name: "أحمد العتيبي", phone: "0501234567", amount: "450 ر.س", date: "اليوم" },
      { name: "سارة الشمري", phone: "0559876543", amount: "1,200 ر.س", date: "أمس" },
      { name: "محمود البقمي", phone: "0543322110", amount: "320 ر.س", date: "منذ 3 أيام" },
    ],
  },
  {
    id: "ai-scanner",
    title: "مسح الفواتير بالـ AI",
    desc: "التقط صورة للفاتورة الورقية أو الخطية وسيقوم الذكاء الاصطناعي باستخراج الأسماء والمبالغ تلقائياً.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09"/>
      </svg>
    ),
    mockData: [
      { name: "فاتورة مواد غذائية", phone: "مسح AI ناجح", amount: "890 ر.س", date: "دقة 99.4%" },
      { name: "قائمة ديون مكتوبة", phone: "مسح AI ناجح", amount: "1,450 ر.س", date: "دقة 98.8%" },
    ],
  },
  {
    id: "whatsapp",
    title: "تنبيهات واتساب و SMS",
    desc: "إرسال كشوفات حساب تفصيلية تضمن التذكير الودي ومعدل سداد أسرع بـ 3 أضعاف.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    ),
    mockData: [
      { name: "رسالة تذكير بالدين", phone: "تم الإرسال عبر واتساب", amount: "جاهزة", date: "PDF ملحق" },
      { name: "كشف حساب شامل", phone: "تم الإرسال عبر واتساب", amount: "PDF", date: "صورة HD" },
    ],
  },
  {
    id: "cloud",
    title: "مزامنة Google Drive",
    desc: "نسخ احتياطي فوري وسري على حساب جوجل درايف الخاص بك دون مرور بياناتك بأي خوادم وسيطة.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
      </svg>
    ),
    mockData: [
      { name: "مزامنة تلقائية", phone: "Google Drive", amount: "آمن 100%", date: "مشفّر" },
    ],
  },
];

export default function AppShowcase() {
  const [activeTab, setActiveTab] = useState("ledger");
  const currentTab = showcaseTabs.find((t) => t.id === activeTab) || showcaseTabs[0];

  return (
    <section id="showcase" className="showcase-section">
      <div className="landing-container">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "var(--color-gold-primary)", textTransform: "uppercase", letterSpacing: 1 }}>
            تصميم فخم وبسيط للمحلات
          </span>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "var(--color-text-primary)", marginTop: 8 }}>
            استعراض واجهات تطبيق <span style={{ color: "var(--color-gold-primary)" }}>سِجِلّها</span>
          </h2>
        </div>

        <div className="showcase-card">
          {/* Tabs Selector */}
          <div className="showcase-info">
            <div className="showcase-tabs">
              {showcaseTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`showcase-tab-btn ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className="showcase-tab-icon">{tab.icon}</div>
                  <div>
                    <div className="showcase-tab-title">{tab.title}</div>
                    <div className="showcase-tab-desc">{tab.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Phone Mockup */}
          <div>
            <div className="phone-frame">
              <div className="phone-notch" />
              <div className="phone-screen">
                {/* Mock App Bar */}
                <div className="mockup-app-bar">
                  <span className="mockup-app-title">سِجِلّها — {currentTab.title}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82"/>
                  </svg>
                </div>

                {/* Mockup Body Content */}
                <div className="mockup-body">
                  <div className="mockup-stat-box">
                    <div className="mockup-stat-num">
                      {activeTab === "ledger" ? "1,970 ر.س" : activeTab === "ai-scanner" ? "2,340 ر.س" : "جاهز للمشاركة"}
                    </div>
                    <div className="mockup-stat-lbl">
                      {activeTab === "ledger" ? "إجمالي الديون المستحقة" : activeTab === "ai-scanner" ? "مستخرج بالذكاء الاصطناعي" : "تنبيهات واتساب تلقائية"}
                    </div>
                  </div>

                  <div style={{ fontSize: 11, fontWeight: 800, color: "var(--color-text-tertiary)", marginTop: 6 }}>
                    قائمة العمليات التفاعلية:
                  </div>

                  {currentTab.mockData.map((item, i) => (
                    <div key={i} className="mockup-debt-item">
                      <div>
                        <div className="mockup-debt-name">{item.name}</div>
                        <div className="mockup-debt-sub">{item.phone}</div>
                      </div>
                      <div style={{ textAlign: "left" }}>
                        <div className="mockup-debt-val">{item.amount}</div>
                        <div className="mockup-debt-sub">{item.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
