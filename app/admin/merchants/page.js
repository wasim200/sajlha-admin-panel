"use client";
import { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import SkeletonLoader from "../components/SkeletonLoader";
import { useToast } from "../components/Toast";

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPackage, setFilterPackage] = useState("");
  const [stats, setStats] = useState({ total: 0, active: 0, trial: 0, expired: 0 });
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [customDays, setCustomDays] = useState(30);
  const [actionLoading, setActionLoading] = useState(false);
  const toast = useToast();

  const getAuth = () => localStorage.getItem("sajlha_admin_pwd") || "";

  useEffect(() => {
    loadMerchants();
  }, [search, filterStatus, filterPackage]);

  const loadMerchants = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filterStatus) params.set("status", filterStatus);
      if (filterPackage) params.set("package_type", filterPackage);

      const res = await fetch(`/api/admin/merchants?${params.toString()}`, {
        headers: { Authorization: getAuth() },
      });
      if (res.ok) {
        const d = await res.json();
        setMerchants(d.data || []);
        if (d.stats) setStats(d.stats);
      } else {
        toast.error("فشل تحميل بيانات المشتركين.");
      }
    } catch {
      toast.error("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubscription = async (merchantId, action, days = 30) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/merchants/update-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuth(),
        },
        body: JSON.stringify({
          license_id: merchantId,
          action,
          custom_days: days,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message || "تم تحديث الاشتراك بنجاح!");
        setIsActionModalOpen(false);
        loadMerchants();
      } else {
        const err = await res.json();
        toast.error(err.error || "فشل تحديث الاشتراك.");
      }
    } catch {
      toast.error("خطأ أثناء تنفيذ العملية.");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDaysLeft = (expiresAt) => {
    const now = new Date();
    const exp = new Date(expiresAt);
    const diffTime = exp - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return <span style={{ color: "var(--color-danger, #e53e3e)", fontWeight: "bold" }}>منتهي</span>;
    if (diffDays > 3650) return <span style={{ color: "var(--color-success, #38a169)", fontWeight: "bold" }}>مدى الحياة</span>;
    return <span style={{ color: diffDays < 7 ? "var(--color-warning, #d69e2e)" : "inherit" }}>{diffDays} يوم متبقي</span>;
  };

  const getPackageBadge = (type, isTrial) => {
    if (isTrial || type === "trial") {
      return <span className="status-badge" style={{ backgroundColor: "#FFF5EB", color: "#DD6B20", border: "1px solid #FBD38D" }}>تجريبي</span>;
    }
    if (type === "yearly") {
      return <span className="status-badge" style={{ backgroundColor: "#EBF8FF", color: "#3182CE", border: "1px solid #90CDF4" }}>سنوي</span>;
    }
    if (type === "monthly") {
      return <span className="status-badge" style={{ backgroundColor: "#FAF5FF", color: "#805AD5", border: "1px solid #D6BCFA" }}>شهري</span>;
    }
    if (type === "lifetime") {
      return <span className="status-badge" style={{ backgroundColor: "#F0FFF4", color: "#38A169", border: "1px solid #9AE6B4" }}>مدى الحياة 👑</span>;
    }
    return <span className="status-badge">{type}</span>;
  };

  const getStatusBadge = (status, expiresAt) => {
    const expired = new Date() > new Date(expiresAt);
    if (status === "suspended") {
      return <span className="status-badge" style={{ backgroundColor: "#FED7D7", color: "#C53030" }}>معلق / محظور</span>;
    }
    if (expired || status === "expired") {
      return <span className="status-badge" style={{ backgroundColor: "#FED7D7", color: "#C53030" }}>منتهي</span>;
    }
    return <span className="status-badge" style={{ backgroundColor: "#C6F6D5", color: "#22543D" }}>نشط</span>;
  };

  const columns = [
    {
      key: "merchant_info",
      label: "المتجر والمالك",
      render: (m) => (
        <div>
          <div style={{ fontWeight: 800, fontSize: "14px", color: "var(--color-text-primary, #181A26)" }}>
            {m.shop_name ? `🏪 ${m.shop_name}` : "🏪 متجر بدون اسم"}
          </div>
          <div style={{ fontSize: "12px", color: "var(--color-text-secondary, #718096)", marginTop: "2px" }}>
            👤 {m.owner_name}
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      label: "الاتصال والتواصل",
      render: (m) => (
        <div style={{ fontSize: "13px" }}>
          <div style={{ direction: "ltr", textAlign: "right", fontWeight: 600 }}>
            📞 {m.phone_number || "—"}
          </div>
          {m.email && (
            <div style={{ fontSize: "11px", color: "var(--color-text-secondary, #718096)" }}>
              ✉️ {m.email}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "currency",
      label: "العملة والإصدار",
      render: (m) => (
        <div style={{ fontSize: "12.5px" }}>
          <span style={{ fontWeight: 700, color: "#D5B075" }}>{m.currency || "YER"}</span>
          <div style={{ fontSize: "11px", color: "var(--color-text-muted, #A0AEC0)" }}>
            v{m.app_version || "2.5.0"}
          </div>
        </div>
      ),
    },
    {
      key: "package",
      label: "نوع الباقة",
      render: (m) => getPackageBadge(m.package_type, m.is_trial),
    },
    {
      key: "status",
      label: "الحالة والمتبقي",
      render: (m) => (
        <div>
          {getStatusBadge(m.status, m.expires_at)}
          <div style={{ fontSize: "11.5px", marginTop: "4px" }}>
            {formatDaysLeft(m.expires_at)}
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      label: "إدارة الاشتراك",
      render: (m) => (
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSelectedMerchant(m);
              setIsActionModalOpen(true);
            }}
            title="خيارات الاشتراك والترقية"
            style={{ fontWeight: 700, fontSize: "12px", padding: "6px 12px" }}
          >
            ⚙️ إدارة
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleUpdateSubscription(m._id, "renew_year")}
            title="تجديد سنة كاملة فوراً"
            style={{ backgroundColor: "#2E7D68", borderColor: "#2E7D68", color: "#fff", fontSize: "12px", padding: "6px 10px" }}
          >
            +1 سنة
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* الترويسة والإحصائيات */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "var(--color-text-primary, #181A26)", margin: 0 }}>
            إدارة المشتركين والمتاجر 🏪
          </h1>
          <p style={{ color: "var(--color-text-secondary, #718096)", fontSize: "14px", marginTop: 4, margin: 0 }}>
            عرض حسابات التجار المسجلين في التطبيق، وتفعيل وتجديد وإيقاف الاشتراكات السحابية.
          </p>
        </div>
      </div>

      {/* بطاقات الإحصائيات السريعة */}
      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div className="stat-card" style={{ padding: 18, borderRadius: 16, border: "1px solid var(--color-border, #E2E8F0)", backgroundColor: "var(--color-bg-surface, #fff)" }}>
          <div style={{ fontSize: "13px", color: "var(--color-text-secondary, #718096)", fontWeight: 600 }}>إجمالي المتاجر المسجلة</div>
          <div style={{ fontSize: "26px", fontWeight: 900, color: "var(--color-text-primary, #181A26)", marginTop: 6 }}>{stats.total}</div>
        </div>
        <div className="stat-card" style={{ padding: 18, borderRadius: 16, border: "1px solid #C6F6D5", backgroundColor: "var(--color-bg-surface, #fff)" }}>
          <div style={{ fontSize: "13px", color: "#22543D", fontWeight: 600 }}>الاشتراكات النشطة</div>
          <div style={{ fontSize: "26px", fontWeight: 900, color: "#2E7D68", marginTop: 6 }}>{stats.active}</div>
        </div>
        <div className="stat-card" style={{ padding: 18, borderRadius: 16, border: "1px solid #FBD38D", backgroundColor: "var(--color-bg-surface, #fff)" }}>
          <div style={{ fontSize: "13px", color: "#744210", fontWeight: 600 }}>الفترات التجريبية</div>
          <div style={{ fontSize: "26px", fontWeight: 900, color: "#DD6B20", marginTop: 6 }}>{stats.trial}</div>
        </div>
        <div className="stat-card" style={{ padding: 18, borderRadius: 16, border: "1px solid #FED7D7", backgroundColor: "var(--color-bg-surface, #fff)" }}>
          <div style={{ fontSize: "13px", color: "#742A2A", fontWeight: 600 }}>المنتهية / المتوقفة</div>
          <div style={{ fontSize: "26px", fontWeight: 900, color: "#C62828", marginTop: 6 }}>{stats.expired}</div>
        </div>
      </div>

      {/* شريط البحث والفلاتر */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "1 1 280px" }}>
          <input
            type="text"
            className="form-input"
            placeholder="🔍 بحث بالاسم، اسم المتجر، الهاتف، البريد، أو معرّف الجهاز..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-input"
          style={{ width: "auto", minWidth: 140 }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">جميع الحالات</option>
          <option value="active">نشط فقط</option>
          <option value="expired">منتهي</option>
          <option value="suspended">معلق / محظور</option>
        </select>
        <select
          className="form-input"
          style={{ width: "auto", minWidth: 140 }}
          value={filterPackage}
          onChange={(e) => setFilterPackage(e.target.value)}
        >
          <option value="">جميع الباقات</option>
          <option value="trial">تجريبي</option>
          <option value="monthly">شهري</option>
          <option value="yearly">سنوي</option>
          <option value="lifetime">مدى الحياة</option>
        </select>
        <button className="btn btn-secondary" onClick={loadMerchants}>
          🔄 تحديث
        </button>
      </div>

      {/* جدول البيانات */}
      {loading ? (
        <SkeletonLoader rows={6} />
      ) : (
        <DataTable
          columns={columns}
          data={merchants}
          emptyMessage="لا يوجد مشتركون مطابقون لخيارات البحث."
        />
      )}

      {/* نافذة إدارة الاشتراك المنبثقة */}
      {selectedMerchant && (
        <Modal
          isOpen={isActionModalOpen}
          onClose={() => setIsActionModalOpen(false)}
          title={`إدارة اشتراك: ${selectedMerchant.shop_name || selectedMerchant.owner_name}`}
        >
          <div style={{ padding: "8px 0" }}>
            <div style={{ background: "var(--color-bg-secondary, #F7F8FC)", padding: 14, borderRadius: 12, marginBottom: 20 }}>
              <div style={{ fontSize: "13px", marginBottom: 6 }}>
                <strong>التاجر:</strong> {selectedMerchant.owner_name} | <strong>الهاتف:</strong> {selectedMerchant.phone_number}
              </div>
              <div style={{ fontSize: "13px", marginBottom: 6 }}>
                <strong>الباقة الحالية:</strong> {selectedMerchant.package_type} ({selectedMerchant.is_trial ? "تجريبي" : "مدفوع"})
              </div>
              <div style={{ fontSize: "13px" }}>
                <strong>تاريخ الانتهاء الحالي:</strong> {new Date(selectedMerchant.expires_at).toLocaleDateString("ar-EG")} ({formatDaysLeft(selectedMerchant.expires_at)})
              </div>
            </div>

            <h4 style={{ fontSize: "14px", fontWeight: 800, marginBottom: 12 }}>الإجراءات السريعة:</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              <button
                className="btn btn-primary"
                disabled={actionLoading}
                onClick={() => handleUpdateSubscription(selectedMerchant._id, "renew_year")}
                style={{ backgroundColor: "#2E7D68", borderColor: "#2E7D68" }}
              >
                🌟 تجديد سنة (365 يوم)
              </button>
              <button
                className="btn btn-primary"
                disabled={actionLoading}
                onClick={() => handleUpdateSubscription(selectedMerchant._id, "renew_month")}
                style={{ backgroundColor: "#3182CE", borderColor: "#3182CE" }}
              >
                📅 تجديد شهر (30 يوم)
              </button>
              <button
                className="btn btn-primary"
                disabled={actionLoading}
                onClick={() => handleUpdateSubscription(selectedMerchant._id, "set_lifetime")}
                style={{ backgroundColor: "#D5B075", borderColor: "#D5B075", color: "#181A26", fontWeight: 800 }}
              >
                👑 تفعيل مدى الحياة
              </button>
              <button
                className="btn btn-secondary"
                disabled={actionLoading}
                onClick={() => handleUpdateSubscription(selectedMerchant._id, "set_trial", 7)}
              >
                🎁 تمديد تجريبي (7 أيام)
              </button>
            </div>

            <div style={{ borderTop: "1px solid var(--color-border, #E2E8F0)", paddingTop: 16 }}>
              <h4 style={{ fontSize: "14px", fontWeight: 800, marginBottom: 10 }}>تمديد بعدد أيام مخصص:</h4>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="number"
                  className="form-input"
                  placeholder="عدد الأيام..."
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value)}
                  style={{ width: 120 }}
                />
                <button
                  className="btn btn-secondary"
                  disabled={actionLoading}
                  onClick={() => handleUpdateSubscription(selectedMerchant._id, "custom_days", customDays)}
                >
                  إضافة الأيام
                </button>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--color-border, #E2E8F0)", paddingTop: 16, marginTop: 16, display: "flex", justifyContent: "space-between" }}>
              {selectedMerchant.status === "suspended" ? (
                <button
                  className="btn btn-success"
                  disabled={actionLoading}
                  onClick={() => handleUpdateSubscription(selectedMerchant._id, "activate")}
                >
                  ✅ إلغاء الحظر وتنشيط الحساب
                </button>
              ) : (
                <button
                  className="btn btn-danger"
                  disabled={actionLoading}
                  onClick={() => handleUpdateSubscription(selectedMerchant._id, "suspend")}
                  style={{ backgroundColor: "#C62828", borderColor: "#C62828", color: "#fff" }}
                >
                  🚫 حظر / تعليق حساب التاجر
                </button>
              )}
              <button className="btn btn-secondary" onClick={() => setIsActionModalOpen(false)}>
                إغلاق
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
