"use client";
import { usePathname } from "next/navigation";

const pageTitles = {
  "/admin": { title: "لوحة التحكم", subtitle: "نظرة عامة على أداء سجلها" },
  "/admin/licenses": { title: "إدارة التراخيص", subtitle: "إصدار وإدارة تراخيص المستخدمين" },
  "/admin/analytics": { title: "التحليلات والمخططات", subtitle: "رسوم بيانية ومؤشرات الأداء" },
  "/admin/logs": { title: "سجل النشاط الإداري", subtitle: "تتبع جميع العمليات والإجراءات" },
  "/admin/ai-scans": { title: "سجل مسح الذكاء الاصطناعي", subtitle: "عمليات مسح الفواتير بالـ AI" },
  "/admin/broadcast": { title: "الإشعارات وإدارة الإصدارات", subtitle: "إرسال إشعارات وإطلاق تحديثات التطبيق" },
};

export default function TopBar() {
  const pathname = usePathname();
  const pageInfo = pageTitles[pathname] || pageTitles["/admin"];

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
