"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [licenses, setLicenses] = useState([]);
  const [activeTab, setActiveTab] = useState("licenses"); // "licenses" | "logs" | "ai_scans"
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // إحصائيات متقدمة من الباكند
  const [stats, setStats] = useState({
    totalLicenses: 0,
    activeLicenses: 0,
    expiredLicenses: 0,
    suspendedLicenses: 0,
    expiringSoon: 0,
    totalAiScans: 0,
    packagesCount: { monthly: 0, yearly: 0, lifetime: 0 },
    totalRevenue: 0,
  });

  const [adminLogs, setAdminLogs] = useState([]);
  const [recentScans, setRecentScans] = useState([]);
  
  // حقول إضافة رخصة جديدة
  const [ownerName, setOwnerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [packageType, setPackageType] = useState("yearly");
  const [durationDays, setDurationDays] = useState("360");
  const [generatedCode, setGeneratedCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // فتح/إغلاق نافذة توليد كود ترخيص جديد العائمة
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // محاولة استرجاع كلمة المرور المحفوظة محلياً
    const savedPassword = localStorage.getItem("sajlha_admin_pwd");
    if (savedPassword) {
      setPassword(savedPassword);
      validateAndLoad(savedPassword);
    }
  }, []);

  const validateAndLoad = async (pwdToTest) => {
    setLoading(true);
    setError("");
    const authHeader = pwdToTest || password;
    try {
      // 1. جلب التراخيص الأساسية
      const resLicenses = await fetch("/api/admin/licenses", {
        headers: { "Authorization": authHeader },
      });

      if (resLicenses.ok) {
        const dataLicenses = await resLicenses.json();
        setLicenses(dataLicenses.licenses);
        setIsAuthenticated(true);
        if (pwdToTest) {
          localStorage.setItem("sajlha_admin_pwd", pwdToTest);
        }

        // 2. جلب الإحصائيات المتقدمة وآخر عمليات مسح AI
        const resStats = await fetch("/api/admin/stats", {
          headers: { "Authorization": authHeader },
        });
        if (resStats.ok) {
          const dataStats = await resStats.json();
          setStats(dataStats.stats);
          setRecentScans(dataStats.recentScans || []);
        }

        // 3. جلب سجل النشاط الإداري
        const resLogs = await fetch("/api/admin/logs", {
          headers: { "Authorization": authHeader },
        });
        if (resLogs.ok) {
          const dataLogs = await resLogs.json();
          setAdminLogs(dataLogs.logs || []);
        }

      } else {
        try {
          const errData = await resLicenses.json();
          setError(errData.error || "كلمة المرور غير صحيحة أو انتهت الجلسة.");
        } catch (_) {
          setError("حدث خطأ في الخادم (رمز 500). يرجى مراجعة إعدادات قاعدة البيانات.");
        }
        setIsAuthenticated(false);
      }
    } catch (err) {
      setError("فشل الاتصال بالخادم وقاعدة البيانات.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!password) return;
    validateAndLoad(password);
  };

  const handleLogout = () => {
    localStorage.removeItem("sajlha_admin_pwd");
    setPassword("");
    setIsAuthenticated(false);
    setLicenses([]);
    setAdminLogs([]);
    setRecentScans([]);
  };

  const handleCreateLicense = async (e) => {
    e.preventDefault();
    setError("");
    if (!ownerName || !phoneNumber || !durationDays) {
      setError("يرجى ملء كافة الحقول.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/licenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": password,
        },
        body: JSON.stringify({
          owner_name: ownerName,
          phone_number: phoneNumber,
          package_type: packageType,
          duration_days: durationDays,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedCode(data.license.license_code);
        setOwnerName("");
        setPhoneNumber("");
        // تحديث البيانات
        validateAndLoad(password);
      } else {
        const errData = await response.json();
        setError(errData.error || "فشل إنشاء الترخيص.");
      }
    } catch (err) {
      setError("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    setLoading(true);
    try {
      const response = await fetch("/api/admin/licenses", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": password,
        },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      if (response.ok) {
        validateAndLoad(password);
      } else {
        setError("فشل تحديث حالة الترخيص.");
      }
    } catch (err) {
      setError("حدث خطأ في الشبكة.");
    } finally {
      setLoading(false);
    }
  };

  const handleExtendLicense = async (id, currentExpiry, days) => {
    const date = new Date(currentExpiry);
    date.setDate(date.getDate() + days);
    setLoading(true);
    try {
      const response = await fetch("/api/admin/licenses", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": password,
        },
        body: JSON.stringify({ id, expires_at: date.toISOString() }),
      });
      if (response.ok) {
        validateAndLoad(password);
      } else {
        setError("فشل تمديد الترخيص.");
      }
    } catch (err) {
      setError("حدث خطأ في الشبكة.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLicense = async (id) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا الترخيص نهائياً؟")) return;
    setLoading(true);
    try {
      const response = await fetch("/api/admin/licenses", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": password,
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        validateAndLoad(password);
      } else {
        setError("فشل حذف الترخيص.");
      }
    } catch (err) {
      setError("حدث خطأ في الشبكة.");
    } finally {
      setLoading(false);
    }
  };

  // فلترة التراخيص ديناميكياً
  const filteredLicenses = licenses.filter((lic) => {
    const matchesSearch = 
      lic.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lic.phone_number.includes(searchTerm) ||
      lic.license_code.toLowerCase().includes(searchTerm.toLowerCase());

    const isExpired = new Date(lic.expires_at) <= new Date();
    const computedStatus = lic.status === "active" && isExpired ? "expired" : lic.status;
    const matchesStatus = filterStatus === "all" || computedStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="app-wrapper">
      <style>{`
        /* الهوية البصرية المطابقة للتطبيق: حجري كحلي مع خلفية كريمية فاتحة وذهبي فاخر */
        .app-wrapper {
          min-height: 100vh;
          background-color: #f4f5f8;
          color: #1e2235;
          direction: rtl;
          font-family: 'Cairo', sans-serif;
        }

        /* شاشة الدخول */
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          background-color: #f4f5f8;
        }
        .login-card {
          background-color: #ffffff;
          border: 1.5px solid rgba(198, 164, 106, 0.2);
          border-radius: 24px;
          padding: 44px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 15px 35px rgba(30, 34, 53, 0.05);
          text-align: center;
        }
        .logo-title {
          color: #c6a46a;
          font-size: 32px;
          font-weight: 900;
          margin-bottom: 6px;
          letter-spacing: 0.5px;
        }
        .logo-subtitle {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 34px;
          font-weight: 600;
        }

        /* الحقول والنماذج المشتركة */
        .form-group {
          margin-bottom: 20px;
          text-align: right;
        }
        .form-label {
          display: block;
          font-size: 13.5px;
          color: #475569;
          margin-bottom: 8px;
          font-weight: 700;
        }
        .form-input, .form-select {
          width: 100%;
          padding: 12px 16px;
          background-color: #f8f9fa;
          border: 1.5px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          color: #1e2235;
          font-family: 'Cairo', sans-serif;
          font-size: 14px;
          box-sizing: border-box;
          transition: all 0.25s ease-in-out;
        }
        .form-input::placeholder {
          color: #94a3b8;
        }
        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #c6a46a;
          box-shadow: 0 0 0 3.5px rgba(198, 164, 106, 0.15);
        }

        /* الأزرار الفاخرة */
        .btn-primary {
          width: 100%;
          padding: 14px;
          background-color: #c6a46a;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 14.5px;
          font-weight: 800;
          font-family: 'Cairo', sans-serif;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(198, 164, 106, 0.3);
          transition: all 0.25s ease-in-out;
        }
        .btn-primary:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 6px 20px rgba(198, 164, 106, 0.45);
          background-color: #bfa063;
        }

        /* شاشة الإدارة الهيكلية */
        .admin-layout {
          max-width: 1500px;
          margin: 0 auto;
          padding: 40px 24px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          border-bottom: 1.5px solid rgba(198, 164, 106, 0.2);
          padding-bottom: 24px;
        }
        .header-title-container {
          border-right: 4px solid #c6a46a;
          padding-right: 18px;
        }
        .header-title {
          font-size: 26px;
          font-weight: 900;
          color: #1e2235;
          margin: 0;
        }
        .header-subtitle {
          font-size: 13.5px;
          color: #64748b;
          margin-top: 4px;
          font-weight: 600;
        }
        .btn-logout {
          background-color: #fdf2f2;
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.15);
          padding: 10px 20px;
          border-radius: 10px;
          font-family: 'Cairo', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-logout:hover {
          background-color: #fde8e8;
          transform: translateY(-1px);
        }

        /* شبكة الإحصائيات المتقدمة الكلاسيكية */
        .advanced-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card-advanced {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 20px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 20px rgba(30, 34, 53, 0.02);
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .stat-card-advanced:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(198, 164, 106, 0.08);
          border-color: rgba(198, 164, 106, 0.25);
        }
        .stat-card-advanced::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: transparent;
        }
        .stat-card-advanced.primary::after { background: #c6a46a; }
        .stat-card-advanced.success::after { background: #10b981; }
        .stat-card-advanced.warning::after { background: #f59e0b; }
        .stat-card-advanced.danger::after { background: #ef4444; }
        .stat-card-advanced.revenue::after { background: #bca374; }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .stat-icon-wrapper {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
        }
        .stat-val-big {
          font-size: 32px;
          font-weight: 800;
          color: #1e2235;
          line-height: 1;
          margin-bottom: 4px;
        }
        .stat-lbl-small {
          font-size: 12.5px;
          color: #64748b;
          font-weight: 700;
        }

        /* التبويبات الفاخرة الملونة */
        .tabs-header {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          border-bottom: 2px solid rgba(198, 164, 106, 0.2);
          padding-bottom: 2px;
        }
        .tab-button {
          padding: 12px 24px;
          border: none;
          background: transparent;
          font-family: 'Cairo', sans-serif;
          font-size: 14.5px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }
        .tab-button:hover {
          color: #1e2235;
        }
        .tab-button.active {
          color: #c6a46a;
        }
        .tab-button.active::after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 4px;
          background-color: #c6a46a;
          border-radius: 2px;
        }

        /* الكروت والبطاقات */
        .card {
          background-color: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 24px;
          padding: 30px;
          box-shadow: 0 10px 20px rgba(30, 34, 53, 0.02);
        }
        .card-title-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .card-title {
          font-size: 17.5px;
          font-weight: 800;
          color: #1e2235;
          margin: 0;
          border-right: 4px solid #c6a46a;
          padding-right: 12px;
        }

        /* شريط البحث والفلترة */
        .search-filter-row {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .search-box {
          flex: 1;
          min-width: 250px;
        }
        .filter-select {
          width: 180px;
        }

        /* جدول التراخيص الفاخر */
        .table-container {
          overflow-x: auto;
        }
        .license-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 10px;
          text-align: right;
          font-size: 14px;
        }
        .license-table th {
          color: #64748b;
          font-weight: 700;
          padding: 8px 16px;
        }
        .license-table td {
          padding: 16px 16px;
          background-color: #ffffff;
          border-top: 1px solid rgba(226, 232, 240, 0.8);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          vertical-align: middle;
          color: #475569;
        }
        .license-table td:first-child {
          border-right: 1px solid rgba(226, 232, 240, 0.8);
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
        }
        .license-table td:last-child {
          border-left: 1px solid rgba(226, 232, 240, 0.8);
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
        }
        .license-table tr:hover td {
          background-color: #fafbfd;
          border-color: rgba(198, 164, 106, 0.2);
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
        }
        .status-active {
          background-color: rgba(16, 185, 129, 0.08);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .status-suspended {
          background-color: rgba(239, 68, 68, 0.08);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .status-expired {
          background-color: rgba(245, 158, 11, 0.08);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .actions-cell {
          display: flex;
          gap: 6px;
          justify-content: flex-end;
          align-items: center;
        }
        .btn-table-action {
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-family: 'Cairo', sans-serif;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.15s ease-in-out;
        }
        .btn-status-toggle {
          background-color: #f1f5f9;
          color: #475569;
          border-color: #cbd5e1;
        }
        .btn-status-toggle:hover {
          background-color: #e2e8f0;
        }
        .btn-extend {
          background-color: rgba(198, 164, 106, 0.08);
          color: #c6a46a;
          border-color: rgba(198, 164, 106, 0.2);
        }
        .btn-extend:hover {
          background-color: rgba(198, 164, 106, 0.15);
        }
        .btn-delete {
          background-color: #fdf2f2;
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.15);
        }
        .btn-delete:hover {
          background-color: #fde8e8;
        }

        .device-info {
          font-size: 11.5px;
          color: #64748b;
          font-family: monospace;
          background-color: #f8f9fa;
          padding: 4px 8px;
          border-radius: 6px;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .error-msg {
          background-color: #fdf2f2;
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #ef4444;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          margin-bottom: 20px;
          text-align: right;
          line-height: 1.5;
          font-weight: 600;
        }

        /* نافذة الحوار العائمة (Modal Popup) */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(30, 34, 53, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.25s ease-out;
        }
        .modal-container {
          background-color: #ffffff;
          border: 1.5px solid rgba(198, 164, 106, 0.2);
          border-radius: 24px;
          padding: 34px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 25px 50px rgba(30, 34, 53, 0.1);
          position: relative;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .modal-close-btn {
          position: absolute;
          top: 20px;
          left: 20px;
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 22px;
          cursor: pointer;
          transition: color 0.15s;
        }
        .modal-close-btn:hover {
          color: #1e2235;
        }

        .license-result {
          background-color: #fefcf8;
          border: 1.5px dashed #c6a46a;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          margin-top: 24px;
        }
        .license-code-display {
          font-size: 24px;
          font-weight: 800;
          color: #c6a46a;
          letter-spacing: 0.5px;
          margin-top: 8px;
          user-select: all;
          cursor: pointer;
        }

        /* مكونات سجل النشاط */
        .logs-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .log-item, .scan-item {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 14px;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s;
        }
        .log-item:hover, .scan-item:hover {
          background-color: #fafbfd;
          border-color: rgba(198, 164, 106, 0.15);
        }
        .log-action-tag {
          font-size: 11.5px;
          font-weight: bold;
          padding: 4px 8px;
          border-radius: 6px;
        }
        .tag-create { background: rgba(3, 105, 161, 0.08); color: #0369a1; }
        .tag-update { background: rgba(217, 119, 6, 0.08); color: #d97706; }
        .tag-delete { background: rgba(185, 28, 28, 0.08); color: #b91c1c; }
        .tag-suspend { background: rgba(194, 65, 12, 0.08); color: #c2410c; }
        .tag-activate { background: rgba(4, 120, 87, 0.08); color: #047857; }

        .log-date {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
        }

        /* سجل مسح الذكاء الاصطناعي */
        .scan-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 700;
        }
        .scan-success { background: rgba(16, 185, 129, 0.08); color: #10b981; }
        .scan-failed { background: rgba(239, 68, 68, 0.08); color: #ef4444; }
        .scan-error { background: rgba(245, 158, 11, 0.08); color: #f59e0b; }

        /* حركات التلاشي للظهور الرائع */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {!isAuthenticated ? (
        <div className="login-container">
          <div className="login-card">
            <div className="logo-title">سِجِلّها</div>
            <div className="logo-subtitle">لوحة الإدارة سحابية والتراخيص</div>
            <form onSubmit={handleLoginSubmit}>
              {error && <div className="error-msg">{error}</div>}
              <div className="form-group">
                <label className="form-label">رمز الدخول السري للوحة الإدارة</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="أدخل كلمة مرور المسؤول..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "جاري التحقق..." : "دخول للوحة التحكم"}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="admin-layout">
          {/* الترويسة الرئيسية */}
          <div className="header">
            <div className="header-title-container">
              <h1 className="header-title">لوحة تحكم وتراخيص سِجِلّها</h1>
              <div className="header-subtitle">إدارة سحابية مركزية والتحقق بالذكاء الاصطناعي</div>
            </div>
            <button onClick={handleLogout} className="btn-logout">تسجيل الخروج</button>
          </div>

          {/* شبكة الإحصائيات المتقدمة الحجرية الذهبية */}
          <div className="advanced-stats-grid">
            <div className="stat-card-advanced primary">
              <div className="stat-header">
                <span className="stat-lbl-small">إجمالي التراخيص</span>
                <span className="stat-icon-wrapper" style={{ background: "rgba(198, 164, 106, 0.08)", color: "#c6a46a" }}>🔑</span>
              </div>
              <div className="stat-val-big">{stats.totalLicenses}</div>
            </div>
            <div className="stat-card-advanced success">
              <div className="stat-header">
                <span className="stat-lbl-small">نشط وصالح</span>
                <span className="stat-icon-wrapper" style={{ background: "rgba(16, 185, 129, 0.08)", color: "#10b981" }}>🟢</span>
              </div>
              <div className="stat-val-big">{stats.activeLicenses}</div>
            </div>
            <div className="stat-card-advanced warning">
              <div className="stat-header">
                <span className="stat-lbl-small">تنتهي قريباً (30 يوم)</span>
                <span className="stat-icon-wrapper" style={{ background: "rgba(245, 158, 11, 0.08)", color: "#f59e0b" }}>⏰</span>
              </div>
              <div className="stat-val-big">{stats.expiringSoon}</div>
            </div>
            <div className="stat-card-advanced danger">
              <div className="stat-header">
                <span className="stat-lbl-small">عمليات مسح الذكاء الاصطناعي</span>
                <span className="stat-icon-wrapper" style={{ background: "rgba(239, 68, 68, 0.08)", color: "#ef4444" }}>🤖</span>
              </div>
              <div className="stat-val-big">{stats.totalAiScans}</div>
            </div>
            <div className="stat-card-advanced revenue">
              <div className="stat-header">
                <span className="stat-lbl-small">الإيرادات المقدرة</span>
                <span className="stat-icon-wrapper" style={{ background: "rgba(188, 163, 116, 0.08)", color: "#bca374" }}>💵</span>
              </div>
              <div className="stat-val-big">${stats.totalRevenue}</div>
            </div>
          </div>

          {/* تبويبات لوحة التحكم */}
          <div className="tabs-header">
            <button 
              className={`tab-button ${activeTab === "licenses" ? "active" : ""}`}
              onClick={() => setActiveTab("licenses")}
            >
              🔑 التراخيص المصدرة ({licenses.length})
            </button>
            <button 
              className={`tab-button ${activeTab === "logs" ? "active" : ""}`}
              onClick={() => setActiveTab("logs")}
            >
              📋 نشاط الإدارة ({adminLogs.length})
            </button>
            <button 
              className={`tab-button ${activeTab === "ai_scans" ? "active" : ""}`}
              onClick={() => setActiveTab("ai_scans")}
            >
              🤖 مسح الذكاء الاصطناعي ({recentScans.length})
            </button>
          </div>

          {/* محتوى التبويب النشط */}
          <div className="content-area">
            {activeTab === "licenses" && (
              <div className="card">
                <div className="card-title-bar">
                  <h2 className="card-title">تراخيص المستخدمين المفعلة</h2>
                  <button 
                    onClick={() => { setGeneratedCode(""); setIsModalOpen(true); }}
                    className="btn-primary" 
                    style={{ width: "auto", padding: "10px 24px" }}
                  >
                    + توليد كود جديد
                  </button>
                </div>

                {/* شريط البحث والفلترة */}
                <div className="search-filter-row">
                  <input
                    type="text"
                    className="form-input search-box"
                    placeholder="ابحث عن مالك، هاتف، أو كود الترخيص..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <select
                    className="form-select filter-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">كل الحالات</option>
                    <option value="active">نشط</option>
                    <option value="expired">منتهي</option>
                    <option value="suspended">موقوف</option>
                  </select>
                </div>

                {/* جدول التراخيص */}
                <div className="table-container">
                  <table className="license-table">
                    <thead>
                      <tr>
                        <th style={{ textAlign: "right" }}>كود الترخيص</th>
                        <th style={{ textAlign: "right" }}>المالك والهاتف</th>
                        <th style={{ textAlign: "right" }}>الباقة</th>
                        <th style={{ textAlign: "right" }}>عمليات AI</th>
                        <th style={{ textAlign: "right" }}>تاريخ الانتهاء</th>
                        <th style={{ textAlign: "right" }}>حالة الترخيص</th>
                        <th style={{ textAlign: "right" }}>الجهاز المقترن</th>
                        <th style={{ textAlign: "left" }}>خيارات التحكم</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLicenses.map((lic) => {
                        const isExpired = new Date(lic.expires_at) <= new Date();
                        const showStatus = lic.status === "active" && isExpired ? "expired" : lic.status;
                        
                        return (
                          <tr key={lic._id}>
                            <td style={{ fontWeight: "bold", color: "#c6a46a" }}>{lic.license_code}</td>
                            <td>
                              <div style={{ fontWeight: "bold", color: "#1e2235" }}>{lic.owner_name}</div>
                              <div style={{ fontSize: "11.5px", color: "#64748b" }}>{lic.phone_number}</div>
                            </td>
                            <td>
                              {lic.package_type === "monthly" ? "6 أشهر" : 
                               lic.package_type === "yearly" ? "سنوية" : "سنتين"}
                            </td>
                            <td style={{ fontWeight: "bold", color: "#475569" }}>
                              {lic.ai_scan_count || 0}
                            </td>
                            <td>
                              {new Date(lic.expires_at).toLocaleDateString("ar-SA")}
                            </td>
                            <td>
                              <span className={`status-badge status-${showStatus}`}>
                                {showStatus === "active" ? "نشط" : 
                                 showStatus === "expired" ? "منتهي" : "موقوف"}
                              </span>
                            </td>
                            <td>
                              {lic.device_id ? (
                                <span className="device-info" title={lic.device_id}>{lic.device_id.substring(0, 14)}...</span>
                              ) : (
                                <span style={{ fontSize: "11.5px", color: "#94a3b8", fontStyle: "italic" }}>غير مقترن</span>
                              )}
                            </td>
                            <td className="actions-cell">
                              <button 
                                onClick={() => handleToggleStatus(lic._id, lic.status)}
                                className="btn-table-action btn-status-toggle"
                              >
                                {lic.status === "active" ? "إيقاف" : "تنشيط"}
                              </button>
                              <button 
                                onClick={() => handleExtendLicense(lic._id, lic.expires_at, 360)}
                                className="btn-table-action btn-extend"
                              >
                                + سنة
                              </button>
                              <button 
                                onClick={() => handleDeleteLicense(lic._id)}
                                className="btn-table-action btn-delete"
                              >
                                حذف
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredLicenses.length === 0 && (
                        <tr>
                          <td colSpan="8" style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>
                            لا توجد تراخيص مطابقة لخيارات البحث.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "logs" && (
              <div className="card">
                <h2 className="card-title">سجل العمليات والنشاط الإداري</h2>
                <div style={{ marginBottom: "20px" }}>
                  {error && <div className="error-msg">{error}</div>}
                </div>
                <div className="logs-list">
                  {adminLogs.map((log) => (
                    <div key={log._id} className="log-item">
                      <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                        <span className={`log-action-tag ${
                          log.action === "create_license" ? "tag-create" :
                          log.action === "delete_license" ? "tag-delete" :
                          log.action === "suspend_license" ? "tag-suspend" :
                          log.action === "activate_license" ? "tag-activate" : "tag-update"
                        }`}>
                          {log.action === "create_license" ? "إنشاء ترخيص" :
                           log.action === "delete_license" ? "حذف ترخيص" :
                           log.action === "suspend_license" ? "إيقاف" :
                           log.action === "activate_license" ? "تنشيط" : "تحديث"}
                        </span>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: "700", fontSize: "14px", color: "#1e2235" }}>{log.details}</span>
                          <span style={{ fontSize: "11px", color: "#64748b" }}>الكود: {log.license_code} | IP: {log.ip_address}</span>
                        </div>
                      </div>
                      <span className="log-date">{new Date(log.created_at).toLocaleString("ar-SA")}</span>
                    </div>
                  ))}
                  {adminLogs.length === 0 && (
                    <div style={{ textAlign: "center", color: "#64748b", padding: "30px" }}>
                      لا توجد سجلات نشاط مسجلة بعد.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "ai_scans" && (
              <div className="card">
                <h2 className="card-title">آخر 10 عمليات مسح بالذكاء الاصطناعي</h2>
                <div style={{ marginBottom: "20px" }}>
                  {error && <div className="error-msg">{error}</div>}
                </div>
                <div className="logs-list">
                  {recentScans.map((scan) => (
                    <div key={scan._id} className="scan-item">
                      <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                        <span className={`scan-badge ${
                          scan.status === "success" ? "scan-success" :
                          scan.status === "failed" ? "scan-failed" : "scan-error"
                        }`}>
                          {scan.status === "success" ? "عملية ناجحة" :
                           scan.status === "failed" ? "فشلت القراءة" : "خطأ تقني"}
                        </span>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: "700", fontSize: "14px", color: "#1e2235" }}>
                            العميل: {scan.license_id?.owner_name || "غير معروف"} ({scan.license_id?.license_code || "بدون كود"})
                          </span>
                          <span style={{ fontSize: "11px", color: "#64748b" }}>
                            رقم الجهاز: {scan.device_id} {scan.error_message && `| خطأ: ${scan.error_message}`}
                          </span>
                        </div>
                      </div>
                      <span className="log-date">{new Date(scan.created_at).toLocaleString("ar-SA")}</span>
                    </div>
                  ))}
                  {recentScans.length === 0 && (
                    <div style={{ textAlign: "center", color: "#64748b", padding: "30px" }}>
                      لا توجد عمليات مسح AI مسجلة بعد.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* محاورة توليد كود ترخيص جديد العائمة (Modal) */}
          {isModalOpen && (
            <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
              <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>×</button>
                <h3 className="card-title" style={{ marginBottom: "24px" }}>توليد كود ترخيص جديد</h3>
                
                {error && <div className="error-msg">{error}</div>}
                
                <form onSubmit={handleCreateLicense}>
                  <div className="form-group">
                    <label className="form-label">اسم صاحب المحل</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="مثال: البقالة الفاخرة..."
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">رقم الهاتف</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="مثال: 9665xxxxxxxx..."
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">نوع الباقة</label>
                    <select 
                      className="form-select"
                      value={packageType}
                      onChange={(e) => {
                        setPackageType(e.target.value);
                        if (e.target.value === "monthly") setDurationDays("180"); // 6 أشهر
                        else if (e.target.value === "yearly") setDurationDays("360"); // سنة
                        else if (e.target.value === "lifetime") setDurationDays("720"); // سنتين
                      }}
                    >
                      <option value="monthly">6 أشهر (8$)</option>
                      <option value="yearly">سنة (14$)</option>
                      <option value="lifetime">سنتين (28$)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">مدة الصلاحية (أيام)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="عدد الأيام..."
                      value={durationDays}
                      onChange={(e) => setDurationDays(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? "جاري إنشاء الترخيص..." : "توليد الكود وتفعيله"}
                  </button>
                </form>

                {generatedCode && (
                  <div className="license-result">
                    <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "bold" }}>كود الترخيص الجديد (انقر للنسخ):</div>
                    <div className="license-code-display" onClick={() => {
                      navigator.clipboard.writeText(generatedCode);
                      alert("تم نسخ الكود بنجاح!");
                    }}>{generatedCode}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
