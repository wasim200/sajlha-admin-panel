"use client";
import { useState, useEffect } from "react";
import SkeletonLoader from "../components/SkeletonLoader";
import EmptyState from "../components/EmptyState";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    const auth = localStorage.getItem("sajlha_admin_pwd") || "";
    try {
      const res = await fetch("/api/admin/logs", { headers: { Authorization: auth } });
      if (res.ok) {
        const d = await res.json();
        setLogs(d.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const actionLabels = {
    create_license: { label: "إصدار ترخيص", color: "var(--color-success)" },
    delete_license: { label: "حذف ترخيص", color: "var(--color-danger)" },
    suspend_license: { label: "تعليق ترخيص", color: "var(--color-warning)" },
    activate_license: { label: "تنشيط ترخيص", color: "var(--color-info)" },
    update_license: { label: "تعديل ترخيص", color: "var(--color-text-secondary)" },
  };

  const filteredLogs = filter === "all" ? logs : logs.filter((l) => l.action === filter);

  if (loading) return <SkeletonLoader type="list" count={8} />;

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h3 className="card-title">
          <span className="card-title-accent" />
          سجل العمليات والنشاط الإداري
        </h3>
        <span style={{ fontSize: 13, color: "var(--color-text-tertiary)", fontWeight: 700 }}>
          {filteredLogs.length} عملية
        </span>
      </div>

      {/* Filter Pills */}
      <div className="dt-filter-pills" style={{ marginBottom: 20 }}>
        {[
          { value: "all", label: "الكل" },
          { value: "create_license", label: "إصدار" },
          { value: "activate_license", label: "تنشيط" },
          { value: "suspend_license", label: "تعليق" },
          { value: "delete_license", label: "حذف" },
        ].map((opt) => (
          <button
            key={opt.value}
            className={`dt-filter-pill ${filter === opt.value ? "active" : ""}`}
            onClick={() => setFilter(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {filteredLogs.length === 0 ? (
        <EmptyState
          title="لا توجد سجلات"
          description="لا توجد سجلات تدقيق مطابقة للفلتر المحدد."
          icon={
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          }
        />
      ) : (
        <div className="activity-list">
          {filteredLogs.map((log) => {
            const info = actionLabels[log.action] || { label: "عملية", color: "var(--color-text-secondary)" };
            return (
              <div key={log._id} className="activity-item">
                <div className="activity-item-content">
                  <span className="activity-tag" style={{ color: info.color, borderColor: info.color, background: `${info.color}15` }}>
                    {info.label}
                  </span>
                  <div className="activity-details">
                    <span className="activity-text">{log.details}</span>
                    <span className="activity-meta">الكود: {log.license_code} | IP: {log.ip_address}</span>
                  </div>
                </div>
                <span className="activity-date">{new Date(log.created_at).toLocaleString("ar-SA")}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
