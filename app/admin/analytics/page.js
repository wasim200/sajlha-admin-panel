"use client";
import { useState, useEffect } from "react";
import StatCard from "../components/StatCard";
import SkeletonLoader from "../components/SkeletonLoader";
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

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    const auth = localStorage.getItem("sajlha_admin_pwd") || "";
    try {
      const [resStats, resAnalytics] = await Promise.all([
        fetch("/api/admin/stats", { headers: { Authorization: auth } }),
        fetch("/api/admin/analytics", { headers: { Authorization: auth } }),
      ]);
      if (resStats.ok) {
        const d = await resStats.json();
        setStats(d.stats);
      }
      if (resAnalytics.ok) {
        const d = await resAnalytics.json();
        setAnalytics(d.analytics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <SkeletonLoader type="stats" />
        <div style={{ marginTop: 32 }} />
        <SkeletonLoader type="chart" />
      </div>
    );
  }

  const kpis = analytics?.kpis || {};

  return (
    <div>
      {/* KPI Cards */}
      <div className="stats-grid section-gap">
        <StatCard
          label="معدل تحويل التراخيص"
          value={kpis.conversionRate || 0}
          suffix="%"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          }
          accentColor="var(--color-gold-primary)"
        />
        <StatCard
          label="متوسط قيمة العميل (ARPU)"
          value={kpis.arpu || 0}
          prefix="$"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          }
          accentColor="var(--color-info)"
        />
        <StatCard
          label="تسجيلات هذا الشهر"
          value={kpis.thisMonthCount || 0}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          }
          accentColor="var(--color-success)"
          trend={kpis.growthRate || 0}
          trendLabel="مقارنة بالشهر الماضي"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid-2-1 section-gap">
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-title-accent" />
              نمو التسجيلات والإيرادات الشهرية
            </h3>
          </div>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <ComposedChart data={analytics?.monthlyData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" opacity={0.5} />
                <XAxis dataKey="month" tick={{ fontFamily: "Inter", fontSize: 12, fill: "var(--color-text-tertiary)" }} />
                <YAxis yAxisId="left" tick={{ fontFamily: "Inter", fontSize: 12, fill: "var(--color-text-tertiary)" }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontFamily: "Inter", fontSize: 12, fill: "var(--color-text-tertiary)" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--chart-tooltip-bg)", borderColor: "var(--chart-tooltip-border)", borderRadius: "12px", fontFamily: "Inter", textAlign: "right", color: "var(--color-text-primary)" }}
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
              توزيع الباقات المشتركة
            </h3>
          </div>
          <div style={{ width: "100%", height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={analytics?.packageDistribution || []} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                  {(analytics?.packageDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "var(--chart-tooltip-bg)", borderColor: "var(--chart-tooltip-border)", borderRadius: "12px", fontFamily: "Inter", textAlign: "right", color: "var(--color-text-primary)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", fontSize: "12.5px", marginTop: 8 }}>
            {(analytics?.packageDistribution || []).map((entry, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: entry.color, flexShrink: 0 }} />
                <span style={{ color: "var(--color-text-secondary)", fontWeight: 700 }}>{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Registrations Table */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3 className="card-title">
            <span className="card-title-accent" />
            أحدث المشتركين الجدد
          </h3>
        </div>
        <div className="dt-table-scroll">
          <table className="dt-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>الهاتف</th>
                <th>الباقة</th>
                <th>تاريخ التسجيل</th>
                <th>تاريخ الانتهاء</th>
              </tr>
            </thead>
            <tbody>
              {(analytics?.recentRegistrations || []).map((lic) => (
                <tr key={lic.id}>
                  <td style={{ fontWeight: 800 }}>{lic.owner_name}</td>
                  <td>{lic.phone_number}</td>
                  <td>
                    <span className="status-badge status-active" style={{ background: "var(--color-gold-muted)", color: "var(--color-gold-primary)", borderColor: "var(--color-border-active)" }}>
                      {lic.package_type === "monthly" ? "6 أشهر" : lic.package_type === "yearly" ? "سنوية" : "سنتين"}
                    </span>
                  </td>
                  <td>{new Date(lic.created_at).toLocaleDateString("ar-SA")}</td>
                  <td>{new Date(lic.expires_at).toLocaleDateString("ar-SA")}</td>
                </tr>
              ))}
              {(analytics?.recentRegistrations || []).length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: 30, color: "var(--color-text-tertiary)" }}>
                    لا توجد تسجيلات حديثة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
