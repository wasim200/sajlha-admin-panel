"use client";
import { useState, useEffect } from "react";
import StatCard from "./components/StatCard";
import SkeletonLoader from "./components/SkeletonLoader";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [adminLogs, setAdminLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    const auth = localStorage.getItem("sajlha_admin_pwd") || "";
    try {
      const [resStats, resAnalytics, resLogs] = await Promise.all([
        fetch("/api/admin/stats", { headers: { Authorization: auth } }),
        fetch("/api/admin/analytics", { headers: { Authorization: auth } }),
        fetch("/api/admin/logs", { headers: { Authorization: auth } }),
      ]);

      if (resStats.ok) {
        const d = await resStats.json();
        setStats(d.stats);
      }
      if (resAnalytics.ok) {
        const d = await resAnalytics.json();
        setAnalytics(d.analytics);
      }
      if (resLogs.ok) {
        const d = await resLogs.json();
        setAdminLogs((d.logs || []).slice(0, 6));
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <SkeletonLoader type="stats" />
        <div style={{ marginTop: 32 }} />
        <div className="grid-2-1">
          <SkeletonLoader type="chart" />
          <SkeletonLoader type="chart" />
        </div>
        <div style={{ marginTop: 32 }} />
        <SkeletonLoader type="list" count={5} />
      </div>
    );
  }

  const growthRate = analytics?.kpis?.growthRate || 0;

  return (
    <div>
      {/* KPI Stats Grid */}
      <div className="stats-grid section-gap">
        <StatCard
          label="إجمالي التراخيص"
          value={stats?.totalLicenses || 0}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
            </svg>
          }
          accentColor="var(--color-gold-primary)"
        />
        <StatCard
          label="التراخيص النشطة"
          value={stats?.activeLicenses || 0}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          }
          accentColor="var(--color-success)"
        />
        <StatCard
          label="تنتهي قريباً (30 يوم)"
          value={stats?.expiringSoon || 0}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          }
          accentColor="var(--color-warning)"
          trendLabel={(stats?.expiringSoon || 0) > 0 ? "⚠ تحتاج متابعة" : ""}
        />
        <StatCard
          label="مسح الذكاء الاصطناعي"
          value={stats?.totalAiScans || 0}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          }
          accentColor="var(--color-info)"
        />
        <StatCard
          label="الإيرادات المقدرة"
          value={stats?.totalRevenue || 0}
          prefix="$"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          }
          accentColor="var(--color-gold-primary)"
          trend={growthRate}
          trendLabel="مقارنة بالشهر السابق"
        />
      </div>

      {/* Charts Section */}
      <div className="grid-2-1 section-gap">
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-title-accent" />
              نمو التسجيلات والإيرادات الشهرية
            </h3>
          </div>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <ComposedChart data={analytics?.monthlyData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" opacity={0.5} />
                <XAxis dataKey="month" tick={{ fontFamily: "Inter", fontSize: 12, fill: "var(--color-text-tertiary)" }} />
                <YAxis yAxisId="left" tick={{ fontFamily: "Inter", fontSize: 12, fill: "var(--color-text-tertiary)" }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontFamily: "Inter", fontSize: 12, fill: "var(--color-text-tertiary)" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--chart-tooltip-bg)",
                    borderColor: "var(--chart-tooltip-border)",
                    borderRadius: "12px",
                    fontFamily: "Inter",
                    textAlign: "right",
                    color: "var(--color-text-primary)",
                  }}
                  labelStyle={{ fontWeight: "bold", color: "var(--color-text-primary)" }}
                />
                <Legend wrapperStyle={{ fontFamily: "Inter", fontSize: 12 }} />
                <Bar yAxisId="left" dataKey="registrations" name="تسجيلات جديدة" fill="var(--chart-bar)" radius={[6, 6, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" name="الإيرادات ($)" stroke="var(--chart-line)" strokeWidth={3} dot={{ r: 5, fill: "var(--chart-line)" }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-title-accent" />
              توزيع الباقات
            </h3>
          </div>
          <div style={{ width: "100%", height: 240, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={analytics?.packageDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(analytics?.packageDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--chart-tooltip-bg)",
                    borderColor: "var(--chart-tooltip-border)",
                    borderRadius: "12px",
                    fontFamily: "Inter",
                    textAlign: "right",
                    color: "var(--color-text-primary)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", fontSize: "12.5px", marginTop: 8 }}>
            {(analytics?.packageDistribution || []).map((entry, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: entry.color, flexShrink: 0 }} />
                <span style={{ color: "var(--color-text-secondary)", fontWeight: 700 }}>{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & KPIs */}
      <div className="grid-1-1">
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-title-accent" />
              آخر العمليات الإدارية
            </h3>
          </div>
          {adminLogs.length === 0 ? (
            <div style={{ textAlign: "center", padding: 30, color: "var(--color-text-tertiary)" }}>
              لا توجد سجلات نشاط حالياً
            </div>
          ) : (
            <div className="activity-list">
              {adminLogs.map((log) => (
                <div key={log._id} className="activity-item">
                  <div className="activity-item-content">
                    <span className="activity-tag">
                      {log.action === "create_license" ? "إصدار" :
                       log.action === "delete_license" ? "حذف" :
                       log.action === "suspend_license" ? "تعليق" :
                       log.action === "activate_license" ? "تنشيط" : "تعديل"}
                    </span>
                    <div className="activity-details">
                      <span className="activity-text">{log.details}</span>
                      <span className="activity-meta">الكود: {log.license_code}</span>
                    </div>
                  </div>
                  <span className="activity-date">{new Date(log.created_at).toLocaleString("ar-SA")}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-title-accent" />
              مؤشرات الأداء الرئيسية
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Conversion Rate */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-secondary)" }}>معدل تحويل التراخيص</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: "var(--color-text-primary)" }}>{analytics?.kpis?.conversionRate || 0}%</span>
            </div>
            <div style={{ height: 6, background: "var(--color-bg-input)", borderRadius: 20, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min(analytics?.kpis?.conversionRate || 0, 100)}%`, background: "linear-gradient(90deg, var(--color-gold-primary), var(--color-success))", borderRadius: 20, transition: "width 1s ease" }} />
            </div>

            {/* ARPU */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-secondary)" }}>متوسط قيمة العميل (ARPU)</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: "var(--color-text-primary)" }}>${analytics?.kpis?.arpu || 0}</span>
            </div>

            {/* This Month vs Last */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-secondary)" }}>تسجيلات هذا الشهر</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: "var(--color-text-primary)" }}>{analytics?.kpis?.thisMonthCount || 0}</span>
                {growthRate !== 0 && (
                  <span className={`stat-trend-badge ${growthRate >= 0 ? "trend-up" : "trend-down"}`}>
                    {growthRate >= 0 ? "+" : ""}{growthRate}%
                  </span>
                )}
              </div>
            </div>

            {/* Expired Count */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-secondary)" }}>تراخيص منتهية</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: "var(--color-warning)" }}>{stats?.expiredLicenses || 0}</span>
            </div>

            {/* Suspended */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-secondary)" }}>تراخيص موقوفة</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: "var(--color-text-tertiary)" }}>{stats?.suspendedLicenses || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
