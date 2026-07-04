"use client";
import { useState } from "react";
import Modal from "../../admin/components/Modal";

const plans = [
  {
    id: "6m",
    name: "باقة 6 أشهر",
    duration: "180 يوم",
    price: "$8",
    popular: false,
    badge: "الباقة الأساسية",
    features: [
      "تفعيل كامل لجميع ميزات التطبيق الاحترافية",
      "مسح غير محدود للفواتير بالذكاء الاصطناعي",
      "مزامنة سحابية على Google Drive",
      "كشوفات حساب تفصيلية PDF وصورة",
      "دعم فني متكامل عبر واتساب",
    ],
    whatsappMsg: "مرحباً، أرغب بالاشتراك في باقة الـ 6 أشهر لتطبيق سجلها.",
  },
  {
    id: "1y",
    name: "الباقة السنوية",
    duration: "360 يوم",
    price: "$14",
    popular: true,
    badge: "الأكثر طلباً وتوفيراً 🔥",
    features: [
      "تفعيل كامل لجميع ميزات التطبيق الاحترافية",
      "مسح غير محدود للفواتير بالذكاء الاصطناعي",
      "مزامنة سحابية على Google Drive",
      "كشوفات حساب تفصيلية PDF وصورة",
      "دعم فني متكامل ذو أولوية عبر واتساب",
    ],
    whatsappMsg: "مرحباً، أرغب بالاشتراك في الباقة السنوية (سنة كاملة) لتطبيق سجلها.",
  },
  {
    id: "2y",
    name: "باقة سنتين",
    duration: "720 يوم",
    price: "$28",
    popular: false,
    badge: "أفضل قيمة وأمد أطول",
    features: [
      "تفعيل كامل لجميع ميزات التطبيق الاحترافية",
      "مسح غير محدود للفواتير بالذكاء الاصطناعي",
      "مزامنة سحابية على Google Drive",
      "كشوفات حساب تفصيلية PDF وصورة",
      "دعم فني مخصص وVIP على مدار الساعة",
    ],
    whatsappMsg: "مرحباً، أرغب بالاشتراك في الباقة الثنائية (سنتين) لتطبيق سجلها.",
  },
];

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [deviceId, setDeviceId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleActivateClick = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    if (!selectedPlan) return;
    const cleanDevice = deviceId.trim() || "لم يتم إدخال Device ID";
    const fullMsg = `${selectedPlan.whatsappMsg}\nرقم الجهاز (Device ID): ${cleanDevice}`;
    const url = `https://wa.me/967781911651?text=${encodeURIComponent(fullMsg)}`;
    window.open(url, "_blank");
    setIsModalOpen(false);
  };

  return (
    <section id="pricing" className="pricing-section">
      <div className="landing-container">
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "var(--color-gold-primary)", textTransform: "uppercase", letterSpacing: 1 }}>
            خطط ترخيص شفافة
          </span>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "var(--color-text-primary)", marginTop: 8 }}>
            اختر الباقة المناسبة <span style={{ color: "var(--color-gold-primary)" }}>لمتجرك</span>
          </h2>
          <p style={{ fontSize: 15, color: "var(--color-text-secondary)", maxWidth: 500, margin: "12px auto 0 auto" }}>
            لا توجد رسوم خفية. تفعيل فوري ومباشر لجهازك مع تحديثات مجانية مستمرة.
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <div key={plan.id} className={`pricing-card ${plan.popular ? "popular" : ""}`}>
              {plan.badge && <span className="pricing-badge">{plan.badge}</span>}
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-duration">{plan.duration}</div>
              <div className="plan-price-row">
                <span className="plan-price">{plan.price}</span>
                <span className="plan-currency">دولار</span>
              </div>

              <ul className="plan-features">
                {plan.features.map((feat, i) => (
                  <li key={i} className="plan-feature-item">
                    <svg className="plan-feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>

              <button
                className={`btn-primary ${plan.popular ? "btn-gold" : "btn-outline"}`}
                onClick={() => handleActivateClick(plan)}
                style={{ width: "100%", justifyContent: "center" }}
              >
                تفعيل عبر واتساب 💬
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp Device ID Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="تفعيل ترخيص سجلها عبر واتساب">
        <form onSubmit={handleSendWhatsApp}>
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", fontWeight: 700 }}>
              الباقة المختارة: <strong style={{ color: "var(--color-gold-primary)" }}>{selectedPlan?.name} ({selectedPlan?.price})</strong>
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">انسخ رقم الجهاز (Device ID) من صفحة الاشتراك في التطبيق:</label>
            <input
              type="text"
              className="form-input"
              placeholder="مثال: 8A4F-99B2-C1D0-E3F4"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
            />
            <span style={{ fontSize: 11.5, color: "var(--color-text-tertiary)", marginTop: 6, display: "block" }}>
              * يمكنك العثور على رقم الجهاز داخل تطبيق سجلها في القائمة الجانبية ➔ "عن التطبيق والتفعيل".
            </span>
          </div>

          <button type="submit" className="btn-primary btn-gold" style={{ width: "100%", justifyContent: "center" }}>
            الانتقال للواتساب لتأكيد التفعيل 💬
          </button>
        </form>
      </Modal>
    </section>
  );
}
