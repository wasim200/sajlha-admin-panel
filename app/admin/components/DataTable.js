"use client";
import { useState, useMemo } from "react";
import EmptyState from "./EmptyState";

export default function DataTable({ columns, data, searchPlaceholder, filters, actions, emptyTitle, emptyDescription, pageSize = 10 }) {
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");

  // Filtering
  const filteredData = useMemo(() => {
    let result = data || [];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const val = col.accessor ? row[col.accessor] : "";
          return String(val || "").toLowerCase().includes(q);
        })
      );
    }

    // Custom filter
    if (activeFilter !== "all" && filters?.filterFn) {
      result = result.filter((row) => filters.filterFn(row, activeFilter));
    }

    // Sort
    if (sortCol) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortCol] ?? "";
        const bVal = b[sortCol] ?? "";
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        }
        return sortDir === "asc"
          ? String(aVal).localeCompare(String(bVal), "ar")
          : String(bVal).localeCompare(String(aVal), "ar");
      });
    }

    return result;
  }, [data, search, sortCol, sortDir, activeFilter, columns, filters]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (accessor) => {
    if (!accessor) return;
    if (sortCol === accessor) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(accessor);
      setSortDir("asc");
    }
  };

  return (
    <div className="data-table-wrapper">
      {/* Search & Filter Bar */}
      <div className="dt-toolbar">
        <div className="dt-search-box">
          <svg className="dt-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="dt-search-input"
            placeholder={searchPlaceholder || "بحث..."}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>

        {filters?.options && (
          <div className="dt-filter-pills">
            <button
              className={`dt-filter-pill ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => { setActiveFilter("all"); setCurrentPage(1); }}
            >
              الكل
            </button>
            {filters.options.map((opt) => (
              <button
                key={opt.value}
                className={`dt-filter-pill ${activeFilter === opt.value ? "active" : ""}`}
                onClick={() => { setActiveFilter(opt.value); setCurrentPage(1); }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {actions && <div className="dt-actions">{actions}</div>}
      </div>

      {/* Table */}
      {paginatedData.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="dt-table-scroll">
          <table className="dt-table">
            <thead>
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={col.sortable ? "dt-th-sortable" : ""}
                    onClick={() => col.sortable && handleSort(col.accessor)}
                  >
                    <span className="dt-th-content">
                      {col.header}
                      {col.sortable && sortCol === col.accessor && (
                        <svg className="dt-sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: sortDir === "desc" ? "rotate(180deg)" : "none" }}>
                          <polyline points="18 15 12 9 6 15"/>
                        </svg>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, ri) => (
                <tr key={row._id || row.id || ri}>
                  {columns.map((col, ci) => (
                    <td key={ci}>
                      {col.render ? col.render(row) : row[col.accessor] || "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="dt-pagination">
          <span className="dt-page-info">
            عرض {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, filteredData.length)} من {filteredData.length}
          </span>
          <div className="dt-page-buttons">
            <button
              className="dt-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>
              </svg>
            </button>
            <button
              className="dt-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <button
                  key={page}
                  className={`dt-page-btn ${currentPage === page ? "active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}
            <button
              className="dt-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
            <button
              className="dt-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
