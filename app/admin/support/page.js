"use client";
import { useState, useEffect } from "react";
import SkeletonLoader from "../components/SkeletonLoader";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import { useToast } from "../components/Toast";

export default function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, in_progress: 0, resolved: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Selected Ticket for Modal Details & Status Update
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState("new");
  const [savingStatus, setSavingStatus] = useState(false);

  const toast = useToast();
  const getAuth = () => localStorage.getItem("sajlha_admin_pwd") || "";

  useEffect(() => {
    loadTickets();
  }, [statusFilter, typeFilter]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`/api/admin/support?${params.toString()}`, {
        headers: { Authorization: getAuth() },
      });

      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
        if (data.stats) setStats(data.stats);
      } else {
        toast.error("فشل تحميل رسائل الدعم الفني.");
      }
    } catch {
      toast.error("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadTickets();
  };

  const openTicketModal = (ticket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status);
    setAdminNotes(ticket.admin_notes || "");
    setModalOpen(true);
  };

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;
    setSavingStatus(true);
    try {
      const res = await fetch("/api/admin/support", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuth(),
        },
        body: JSON.stringify({
          id: selectedTicket._id,
          status: newStatus,
          admin_notes: adminNotes,
        }),
      });

      if (res.ok) {
        toast.success("تم تحديث حالة التذكرة بنجاح!");
        setModalOpen(false);
        loadTickets();
      } else {
        toast.error("فشل تحديث التذكرة.");
      }
    } catch {
      toast.error("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleDeleteTicket = async (id) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذه التذكرة؟")) return;
    try {
      const res = await fetch(`/api/admin/support?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: getAuth() },
      });

      if (res.ok) {
        toast.success("تم حذف التذكرة بنجاح.");
        setModalOpen(false);
        loadTickets();
      } else {
        toast.error("فشل حذف التذكرة.");
      }
    } catch {
      toast.error("حدث خطأ أثناء الاتصال بالخادم.");
    }
  };

  const getWhatsAppLink = (ticket) => {
    if (!ticket.phone_number) return null;
    let cleanPhone = ticket.phone_number.replace(/\D/g, "");
    if (cleanPhone.length === 9 && (cleanPhone.startsWith("7") || cleanPhone.startsWith("9"))) {
      cleanPhone = "967" + cleanPhone;
    }
    const text = encodeURIComponent(
      `مرحباً أخي ${ticket.sender_name || "التاجر العزيز"}،\nتواصل معك فريق الدعم الفني لتطبيق *سجلها* بخصوص تذكرتك رقم (${ticket.ticket_number}) وموضوع: "${ticket.subject}".\n\nكيف يمكننا مساعدتك؟`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "issue":
        return { label: "🚨 مشكلة فنية", color: "var(--color-danger, #EF4444)", bg: "rgba(239, 68, 68, 0.1)" };
      case "suggestion":
        return { label: "💡 اقتراح ميزة", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" };
      case "license_request":
        return { label: "🔑 طلب ترخيص", color: "var(--color-gold-primary, #D5B075)", bg: "rgba(213, 176, 117, 0.1)" };
      case "inquiry":
      default:
        return { label: "💬 استفسار عام", color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)" };
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "new":
        return { label: "جديدة", className: "badge-success", style: { backgroundColor: "#10B981", color: "#fff" } };
      case "in_progress":
        return { label: "قيد المتابعة", className: "badge-warning", style: { backgroundColor: "#3B82F6", color: "#fff" } };
      case "resolved":
        return { label: "تم الحل", className: "badge-info", style: { backgroundColor: "#059669", color: "#fff" } };
      case "closed":
      default:
        return { label: "مغلقة", className: "badge-secondary", style: { backgroundColor: "#6B7280", color: "#fff" } };
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="card-header" style={{ marginBottom: 24, padding: 0 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 900, fontFamily: "var(--font-heading)" }}>
            صندوق رسائل ودعم التجار
          </h2>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 4 }}>
            متابعة استفسارات ومقترحات وبلاغات مستخدمي تطبيق سجلها والرد المباشر عليهم
          </p>
        </div>
        <button className="btn-secondary" onClick={loadTickets} title="تحديث القائمة">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          تحديث
        </button>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid" style={{ marginBottom: 24, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <div className="stat-card" style={{ borderRight: "4px solid var(--color-gold-primary)" }}>
          <span className="stat-card-label">إجمالي الرسائل والتذاكر</span>
          <span className="stat-card-value">{stats.total}</span>
        </div>
        <div className="stat-card" style={{ borderRight: "4px solid #10B981" }}>
          <span className="stat-card-label">رسائل جديدة غير معالجة</span>
          <span className="stat-card-value" style={{ color: "#10B981" }}>{stats.new}</span>
        </div>
        <div className="stat-card" style={{ borderRight: "4px solid #3B82F6" }}>
          <span className="stat-card-label">قيد المتابعة والمعالجة</span>
          <span className="stat-card-value" style={{ color: "#3B82F6" }}>{stats.in_progress}</span>
        </div>
        <div className="stat-card" style={{ borderRight: "4px solid #059669" }}>
          <span className="stat-card-label">تم حلها وإغلاقها</span>
          <span className="stat-card-value" style={{ color: "#059669" }}>{stats.resolved}</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="dashboard-card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
          {/* Status Tabs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { key: "all", label: `الكل (${stats.total})` },
              { key: "new", label: `جديدة (${stats.new})` },
              { key: "in_progress", label: `قيد المتابعة (${stats.in_progress})` },
              { key: "resolved", label: `تم الحل (${stats.resolved})` },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`btn-filter ${statusFilter === tab.key ? "active" : ""}`}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  border: "1px solid var(--color-border-primary)",
                  backgroundColor: statusFilter === tab.key ? "var(--color-gold-primary)" : "transparent",
                  color: statusFilter === tab.key ? "#fff" : "var(--color-text-primary)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onClick={() => setStatusFilter(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Type Dropdown & Search Form */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <select
              className="form-input"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ padding: "6px 12px", fontSize: 13, minWidth: 140 }}
            >
              <option value="all">جميع التصنيفات</option>
              <option value="inquiry">💬 استفسار عام</option>
              <option value="issue">🚨 مشكلة فنية</option>
              <option value="suggestion">💡 اقتراح ميزة</option>
              <option value="license_request">🔑 طلب ترخيص</option>
            </select>

            <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: 6 }}>
              <input
                type="text"
                className="form-input"
                placeholder="بحث بالاسم، الهاتف، الموضوع..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ padding: "6px 12px", fontSize: 13, width: 220 }}
              />
              <button type="submit" className="btn-primary" style={{ padding: "6px 12px", fontSize: 12 }}>
                بحث
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <SkeletonLoader type="list" count={6} />
      ) : tickets.length === 0 ? (
        <EmptyState
          title="لا توجد رسائل دعم فني"
          description="صندوق الوارد نظيف ولا توجد أي استفسارات مطابقة للتصفية الحالية."
          icon={
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          }
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {tickets.map((ticket) => {
            const typeInfo = getTypeLabel(ticket.type);
            const statusInfo = getStatusBadge(ticket.status);
            const waLink = getWhatsAppLink(ticket);

            return (
              <div
                key={ticket._id}
                className="dashboard-card"
                style={{
                  padding: 18,
                  borderRight: `5px solid ${typeInfo.color}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                {/* Header Row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 800,
                        backgroundColor: "var(--color-bg-secondary)",
                        border: "1px solid var(--color-border-primary)",
                      }}
                    >
                      {ticket.ticket_number}
                    </span>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: typeInfo.bg,
                        color: typeInfo.color,
                      }}
                    >
                      {typeInfo.label}
                    </span>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        ...statusInfo.style,
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
                    {new Date(ticket.created_at).toLocaleString("ar-YE")}
                  </span>
                </div>

                {/* Subject & Message */}
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 800, color: "var(--color-text-primary)", marginBottom: 6 }}>
                    {ticket.subject}
                  </h4>
                  <p
                    style={{
                      fontSize: 13.5,
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.6,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {ticket.message}
                  </p>
                </div>

                {/* Sender Info & Actions Footer */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                    paddingTop: 10,
                    borderTop: "1px solid var(--color-border-primary)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", fontSize: 12.5, color: "var(--color-text-secondary)" }}>
                    <span>
                      👤 <strong>{ticket.sender_name}</strong>
                    </span>
                    {ticket.shop_name && (
                      <span>
                        🏪 <em>{ticket.shop_name}</em>
                      </span>
                    )}
                    {ticket.phone_number && (
                      <span>
                        📱 <b dir="ltr">{ticket.phone_number}</b>
                      </span>
                    )}
                    <span>📱 إصدار: v{ticket.app_version || "2.5.0"}</span>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    {waLink && (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{
                          backgroundColor: "#25D366",
                          color: "#fff",
                          borderColor: "#25D366",
                          fontSize: 12,
                          padding: "6px 12px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          textDecoration: "none",
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.419-.101.824z" />
                        </svg>
                        رد عبر واتساب
                      </a>
                    )}
                    <button
                      className="btn-primary"
                      style={{ fontSize: 12, padding: "6px 12px" }}
                      onClick={() => openTicketModal(ticket)}
                    >
                      إدارة التذكرة
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Details & Action Modal */}
      {modalOpen && selectedTicket && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`إدارة تذكرة الدعم [${selectedTicket.ticket_number}]`}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Ticket Info Card */}
            <div
              style={{
                backgroundColor: "var(--color-bg-secondary)",
                padding: 14,
                borderRadius: 10,
                border: "1px solid var(--color-border-primary)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontWeight: 800, fontSize: 14 }}>{selectedTicket.subject}</span>
                <span style={{ fontSize: 11.5, color: "var(--color-text-tertiary)" }}>
                  {new Date(selectedTicket.created_at).toLocaleString("ar-YE")}
                </span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--color-text-secondary)", whiteSpace: "pre-line" }}>
                {selectedTicket.message}
              </p>
            </div>

            {/* Merchant Details Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12 }}>
              <div>
                <strong>التاجر:</strong> {selectedTicket.sender_name}
              </div>
              <div>
                <strong>المتجر:</strong> {selectedTicket.shop_name || "غير محدد"}
              </div>
              <div>
                <strong>الهاتف:</strong> {selectedTicket.phone_number || "غير متوفر"}
              </div>
              <div>
                <strong>الإصدار:</strong> v{selectedTicket.app_version || "2.5.0"}
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <strong>معرّف الجهاز:</strong> <code style={{ fontSize: 11 }}>{selectedTicket.device_id || "غير متوفر"}</code>
              </div>
            </div>

            <hr style={{ borderColor: "var(--color-border-primary)", margin: "4px 0" }} />

            {/* Status Change */}
            <div className="form-group">
              <label className="form-label">حالة التذكرة</label>
              <select
                className="form-input"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="new">جديدة (New)</option>
                <option value="in_progress">قيد المتابعة (In Progress)</option>
                <option value="resolved">تم الحل (Resolved)</option>
                <option value="closed">مغلقة (Closed)</option>
              </select>
            </div>

            {/* Internal Admin Notes */}
            <div className="form-group">
              <label className="form-label">ملاحظات الإدارة الداخلية (خاصة بالمسؤول)</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="أضف أي ملاحظات أو إجراءات تمت مع هذا التاجر..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                style={{ resize: "vertical" }}
              />
            </div>

            {/* Modal Actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
              <button
                type="button"
                className="btn-danger"
                style={{ fontSize: 12, padding: "8px 14px" }}
                onClick={() => handleDeleteTicket(selectedTicket._id)}
              >
                حذف التذكرة
              </button>

              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
                  إلغاء
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleUpdateTicket}
                  disabled={savingStatus}
                >
                  {savingStatus ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
