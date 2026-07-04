"use client";

const pageTitles = {
  dashboard: { title: "لوحة التحكم", subtitle: "نظرة عامة على أداء سجلها" },
  licenses: { title: "إدارة التراخيص", subtitle: "إصدار وإدارة تراخيص المستخدمين" },
  analytics: { title: "التحليلات والمخططات", subtitle: "رسوم بيانية ومؤشرات الأداء" },
  logs: { title: "سجل النشاط الإداري", subtitle: "تتبع جميع العمليات والإجراءات" },
  "ai-scans": { title: "سجل مسح الذكاء الاصطناعي", subtitle: "عمليات مسح الفواتير بالـ AI" },
  broadcast: { title: "الإشعارات وإدارة الإصدارات", subtitle: "إرسال إشعارات وإطلاق تحديثات التطبيق" },
};

export default function TopBar({ activePage }) {
  const pageInfo = pageTitles[activePage] || pageTitles.dashboard;

  return (
    <header className="topbar">
      <div className="topbar-title-section">
        <h1 className="topbar-title">{pageInfo.title}</h1>
        <p className="topbar-subtitle">{pageInfo.subtitle}</p>
      </div>
      <div className="topbar-actions">
        <div className="topbar-status">
          <span className="topbar-status-dot" />
          <span className="topbar-status-text">متصل</span>
        </div>
      </div>
    </header>
  );
}
