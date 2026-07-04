"use client";

export default function SkeletonLoader({ type = "card", count = 1 }) {
  const renderSkeleton = () => {
    switch (type) {
      case "stats":
        return (
          <div className="skeleton-stats-grid">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-line skeleton-w40 skeleton-h12" />
                <div className="skeleton-line skeleton-w60 skeleton-h32 skeleton-mt16" />
              </div>
            ))}
          </div>
        );
      case "table":
        return (
          <div className="skeleton-table">
            <div className="skeleton-table-header">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-line skeleton-w80 skeleton-h12" />
              ))}
            </div>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="skeleton-table-row">
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j} className="skeleton-line skeleton-w-full skeleton-h14" />
                ))}
              </div>
            ))}
          </div>
        );
      case "chart":
        return (
          <div className="skeleton-card skeleton-chart">
            <div className="skeleton-line skeleton-w40 skeleton-h16" />
            <div className="skeleton-chart-bars">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton-bar"
                  style={{ height: `${30 + Math.random() * 60}%` }}
                />
              ))}
            </div>
          </div>
        );
      case "list":
        return (
          <div className="skeleton-list">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="skeleton-list-item">
                <div className="skeleton-circle" />
                <div style={{ flex: 1 }}>
                  <div className="skeleton-line skeleton-w60 skeleton-h14" />
                  <div className="skeleton-line skeleton-w40 skeleton-h10 skeleton-mt8" />
                </div>
              </div>
            ))}
          </div>
        );
      default: // card
        return (
          <div className="skeleton-card">
            <div className="skeleton-line skeleton-w60 skeleton-h16" />
            <div className="skeleton-line skeleton-w-full skeleton-h12 skeleton-mt12" />
            <div className="skeleton-line skeleton-w80 skeleton-h12 skeleton-mt8" />
          </div>
        );
    }
  };

  return <div className="skeleton-wrapper">{renderSkeleton()}</div>;
}
