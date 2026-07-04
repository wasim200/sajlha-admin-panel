"use client";
import { useState, useEffect } from "react";
import SkeletonLoader from "../components/SkeletonLoader";
import EmptyState from "../components/EmptyState";

export default function AiScansPage() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    setLoading(true);
    const auth = localStorage.getItem("sajlha_admin_pwd") || "";
    try {
      const res = await fetch("/api/admin/stats", { headers: { Authorization: auth } });
      if (res.ok) {
        const d = await res.json();
        setScans(d.recentScans || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <SkeletonLoader type="list" count={8} />;

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h3 className="card-title">
          <span className="card-title-accent" />
          سجل مسح الفواتير بالذكاء الاصطناعي
        </h3>
        <span style={{ fontSize: 13, color: "var(--color-text-tertiary)", fontWeight: 700 }}>
          {scans.length} عملية مسح
        </span>
      </div>

      {scans.length === 0 ? (
        <EmptyState
          title="لا توجد عمليات مسح"
          description="لم يتم تسجيل أي عمليات مسح ذكاء اصطناعي بعد."
          icon={
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4"/>
            </svg>
          }
        />
      ) : (
        <div className="activity-list">
          {scans.map((scan) => (
            <div key={scan._id} className="activity-item">
              <div className="activity-item-content">
                <span
                  className="activity-tag"
                  style={{
                    color: scan.status === "success" ? "var(--color-success)" : "var(--color-danger)",
                    borderColor: scan.status === "success" ? "var(--color-success-border)" : "var(--color-danger-border)",
                    background: scan.status === "success" ? "var(--color-success-bg)" : "var(--color-danger-bg)",
                  }}
                >
                  {scan.status === "success" ? "قراءة ناجحة" : "فشل القراءة"}
                </span>
                <div className="activity-details">
                  <span className="activity-text">
                    العميل: {scan.license_id?.owner_name || "غير معروف"} ({scan.license_id?.license_code || "—"})
                  </span>
                  <span className="activity-meta">
                    جهاز: {scan.device_id}
                    {scan.error_message && ` | خطأ: ${scan.error_message}`}
                  </span>
                </div>
              </div>
              <span className="activity-date">{new Date(scan.created_at).toLocaleString("ar-SA")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
