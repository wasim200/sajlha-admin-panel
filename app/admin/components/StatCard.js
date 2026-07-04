"use client";
import AnimatedCounter from "./AnimatedCounter";

export default function StatCard({ label, value, prefix = "", suffix = "", icon, accentColor, trend, trendLabel }) {
  return (
    <div className="stat-card" style={{ "--accent": accentColor || "var(--color-gold-primary)" }}>
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        <span className="stat-card-icon-wrapper" style={{ color: accentColor || "var(--color-gold-primary)" }}>
          {icon}
        </span>
      </div>
      <div className="stat-card-value">
        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
      </div>
      {(trend !== undefined || trendLabel) && (
        <div className="stat-card-trend">
          {trend !== undefined && (
            <span className={`stat-trend-badge ${trend >= 0 ? "trend-up" : "trend-down"}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: trend < 0 ? "rotate(180deg)" : "none" }}>
                <polyline points="18 15 12 9 6 15"/>
              </svg>
              {Math.abs(trend)}%
            </span>
          )}
          {trendLabel && <span className="stat-trend-label">{trendLabel}</span>}
        </div>
      )}
      <div className="stat-card-accent-bar" />
    </div>
  );
}
