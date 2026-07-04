"use client";
import { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import SkeletonLoader from "../components/SkeletonLoader";
import { useToast } from "../components/Toast";

export default function LicensesPage() {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [packageType, setPackageType] = useState("yearly");
  const [durationDays, setDurationDays] = useState("360");
  const [creating, setCreating] = useState(false);
  const [latestVersion, setLatestVersion] = useState("2.5.0");
  const toast = useToast();

  const getAuth = () => localStorage.getItem("sajlha_admin_pwd") || "";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resLic, resVer] = await Promise.all([
        fetch("/api/admin/licenses", { headers: { Authorization: getAuth() } }),
        fetch("/api/public/version-check"),
      ]);
      if (resLic.ok) {
        const d = await resLic.json();
        setLicenses(d.licenses || []);
      }
      if (resVer.ok) {
        const d = await resVer.json();
        if (d.success && d.versionInfo) setLatestVersion(d.versionInfo.latestVersion || "2.5.0");
      }
    } catch {
      toast.error("فشل تحميل بيانات التراخيص.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLicense = async (e) => {
    e.preventDefault();
    if (!ownerName || !phoneNumber || !durationDays) {
      toast.warning("يرجى ملء كافة الحقول.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/licenses", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: getAuth() },
        body: JSON.stringify({
          owner_name: ownerName,
          phone_number: phoneNumber,
          package_type: packageType,
          duration_days: durationDays,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedCode(data.license.license_code);
        setOwnerName("");
        setPhoneNumber("");
        toast.success("تم إصدار الترخيص بنجاح!");
        loadData();
      } else {
        const err = await res.json();
        toast.error(err.error || "فشل إنشاء الترخيص.");
      }
    } catch {
      toast.error("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      const res = await fetch("/api/admin/licenses", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: getAuth() },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      if (res.ok) {
        toast.success(nextStatus === "active" ? "تم تنشيط الترخيص." : "تم تعليق الترخيص.");
        loadData();
      } else {
        toast.error("فشل تحديث حالة الترخيص.");
      }
    } catch {
      toast.error("حدث خطأ في الشبكة.");
    }
  };

  const handleExtendLicense = async (id, currentExpiry, days) => {
    const date = new Date(currentExpiry);
    date.setDate(date.getDate() + days);
    try {
      const res = await fetch("/api/admin/licenses", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: getAuth() },
        body: JSON.stringify({ id, expires_at: date.toISOString() }),
      });
      if (res.ok) {
        toast.success(`تم تمديد الترخيص لـ ${days} يوم إضافي.`);
        loadData();
      } else {
        toast.error("فشل تمديد الترخيص.");
      }
    } catch {
      toast.error("حدث خطأ في الشبكة.");
    }
  };

  const handleDeleteLicense = async (id) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا الترخيص نهائياً؟")) return;
    try {
      const res = await fetch("/api/admin/licenses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: getAuth() },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        toast.success("تم حذف الترخيص بنجاح.");
        loadData();
      } else {
        toast.error("فشل حذف الترخيص.");
      }
    } catch {
      toast.error("حدث خطأ في الشبكة.");
    }
  };

  const columns = [
    {
      header: "كود الترخيص",
      accessor: "license_code",
      sortable: true,
      render: (row) => (
        <span style={{ fontWeight: 800, color: "var(--color-text-secondary)", fontFamily: "monospace", fontSize: 13 }}>
          {row.license_code}
        </span>
      ),
    },
    {
      header: "المالك",
      accessor: "owner_name",
      sortable: true,
      render: (row) => (
        <div>
          <div style={{ fontWeight: 800, color: "var(--color-text-primary)" }}>{row.owner_name}</div>
          <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{row.phone_number}</div>
        </div>
      ),
    },
    {
      header: "الباقة",
      accessor: "package_type",
      sortable: true,
      render: (row) => (
        <span className="status-badge status-active" style={{ background: "var(--color-gold-muted)", color: "var(--color-gold-primary)", borderColor: "var(--color-border-active)" }}>
          {row.package_type === "monthly" ? "6 أشهر" : row.package_type === "yearly" ? "سنوية" : "سنتين"}
        </span>
      ),
    },
    {
      header: "الإصدار",
      accessor: "app_version",
      render: (row) => {
        const isLatest = row.app_version === latestVersion;
        return (
          <span className={`version-badge ${isLatest ? "version-latest" : "version-outdated"}`}>
            v{row.app_version || "2.5.0"}
          </span>
        );
      },
    },
    {
      header: "مسح AI",
      accessor: "ai_scan_count",
      sortable: true,
      render: (row) => <span style={{ fontWeight: 800 }}>{row.ai_scan_count || 0}</span>,
    },
    {
      header: "الانتهاء",
      accessor: "expires_at",
      sortable: true,
      render: (row) => new Date(row.expires_at).toLocaleDateString("ar-SA"),
    },
    {
      header: "الحالة",
      accessor: "status",
      render: (row) => {
        const isExpired = new Date(row.expires_at) <= new Date();
        const showStatus = row.status === "active" && isExpired ? "expired" : row.status;
        return (
          <span className={`status-badge status-${showStatus}`}>
            {showStatus === "active" ? "نشط" : showStatus === "expired" ? "منتهي" : "موقوف"}
          </span>
        );
      },
    },
    {
      header: "الجهاز",
      render: (row) =>
        row.device_id ? (
          <span style={{ fontSize: 12, fontFamily: "monospace", color: "var(--color-text-secondary)", background: "var(--color-bg-input)", padding: "4px 8px", borderRadius: 6 }} title={row.device_id}>
            {row.device_id.substring(0, 14)}...
          </span>
        ) : (
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", fontStyle: "italic" }}>غير مقترن</span>
        ),
    },
    {
      header: "إجراءات",
      render: (row) => (
        <div className="actions-cell">
          <button className="btn-outline btn-sm" onClick={() => handleToggleStatus(row._id, row.status)} title="إيقاف / تفعيل">
            {row.status === "active" ? "تعليق" : "تنشيط"}
          </button>
          <button className="btn-outline btn-sm" onClick={() => handleExtendLicense(row._id, row.expires_at, 360)} title="تمديد سنة">
            + سنة
          </button>
          <button className="btn-danger btn-sm" onClick={() => handleDeleteLicense(row._id)} title="حذف نهائي">
            حذف
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <SkeletonLoader type="table" count={6} />;
  }

  return (
    <div>
      <div className="dashboard-card">
        <DataTable
          columns={columns}
          data={licenses}
          searchPlaceholder="بحث بالكود، الاسم، أو الهاتف..."
          filters={{
            options: [
              { value: "active", label: "نشط" },
              { value: "expired", label: "منتهي" },
              { value: "suspended", label: "موقوف" },
            ],
            filterFn: (row, filter) => {
              const isExpired = new Date(row.expires_at) <= new Date();
              const computed = row.status === "active" && isExpired ? "expired" : row.status;
              return computed === filter;
            },
          }}
          actions={
            <button className="btn-primary btn-sm" onClick={() => { setGeneratedCode(""); setIsModalOpen(true); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              إصدار ترخيص
            </button>
          }
          emptyTitle="لا توجد تراخيص"
          emptyDescription="لم يتم العثور على تراخيص مطابقة للبحث."
          pageSize={12}
        />
      </div>

      {/* Modal: Create License */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="إصدار كود ترخيص جديد">
        <form onSubmit={handleCreateLicense}>
          <div className="form-group">
            <label className="form-label">اسم صاحب المحل / المشترك</label>
            <input type="text" className="form-input" placeholder="اسم صاحب المحل..." value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">رقم الهاتف</label>
            <input type="text" className="form-input" placeholder="رقم الهاتف..." value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">نوع الباقة</label>
            <select
              className="form-select"
              value={packageType}
              onChange={(e) => {
                setPackageType(e.target.value);
                if (e.target.value === "monthly") setDurationDays("180");
                else if (e.target.value === "yearly") setDurationDays("360");
                else if (e.target.value === "lifetime") setDurationDays("720");
              }}
            >
              <option value="monthly">6 أشهر (8$)</option>
              <option value="yearly">سنوية (14$)</option>
              <option value="lifetime">سنتين (28$)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">مدة صلاحية الترخيص (أيام)</label>
            <input type="number" className="form-input" placeholder="عدد الأيام..." value={durationDays} onChange={(e) => setDurationDays(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary" disabled={creating} style={{ width: "100%" }}>
            {creating ? "جاري إنشاء الترخيص..." : "توليد كود التفعيل"}
          </button>
        </form>

        {generatedCode && (
          <div className="license-result">
            <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", fontWeight: 700 }}>كود الترخيص الجديد (انقر للنسخ):</div>
            <div
              className="license-code-display"
              onClick={() => {
                navigator.clipboard.writeText(generatedCode);
                toast.success("تم نسخ كود التفعيل!");
              }}
            >
              {generatedCode}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
