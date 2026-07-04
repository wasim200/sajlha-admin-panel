"use client";

export default function HeroSection() {
  return (
    <section className="hero-outer">
      <div className="landing-container">
        <div style={{ textAlignment: "center" }}>
          {/* Badge */}
          <div style={{ textAlign: "center" }}>
            <div className="hero-badge-wrapper">
              <span className="hero-badge-dot" />
              <span>جيل جديد من الذكاء الاصطناعي للمحلات التجارية v2.5</span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="hero-title-main">
            سِجِلّها — المحاسبة وإدارة الديون الذكية <span>بدون إنترنت</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle-text">
            التطبيق الأسهل للمحلات والتجار لإدارة ديون العملاء والفواتير بالذكاء الاصطناعي (AI OCR)، مزامنة سحابية آمنة على Google Drive، وتنبيهات تلقائية عبر واتساب و SMS.
          </p>

          {/* CTA Buttons */}
          <div className="hero-ctas-group">
            <a href="#pricing" className="btn-primary btn-gold" style={{ padding: "16px 36px", fontSize: 16 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              تفعيل التطبيق واختيار الباقة
            </a>
            <a href="#ai-demo" className="btn-outline" style={{ padding: "16px 32px", fontSize: 16 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
              </svg>
              تجربة الـ AI مباشرة
            </a>
          </div>

          {/* Stats Bar */}
          <div className="hero-stats-row">
            <div className="hero-stat-item">
              <div className="hero-stat-number">100%</div>
              <div className="hero-stat-label">عمل بدون إنترنت (SQLite)</div>
            </div>
            <div className="hero-stat-item">
              <div className="hero-stat-number">&lt; 1 ثانية</div>
              <div className="hero-stat-label">سرعة المسح بالذكاء الاصطناعي</div>
            </div>
            <div className="hero-stat-item">
              <div className="hero-stat-number">Google Drive</div>
              <div className="hero-stat-label">مزامنة سحابية خاصة وشخصية</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
