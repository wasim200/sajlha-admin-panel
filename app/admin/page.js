"use client";

import { useState, useEffect } from "react";
import './admin.css';
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
  Cell 
} from 'recharts';

// مكون العدادات التصاعدية لتطبيق الأنيميشن المالي التفاعلي
function AnimatedCounter({ value }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    if (end === 0) {
      setCount(0);
      return;
    }
    const duration = 1200; // مدة الأنيميشن بالملي ثانية
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // دالة Ease Out لجعله يبطئ تدريجياً في النهاية
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentCount = Math.floor(easeProgress * end);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    }

    requestAnimationFrame(updateCount);
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
}

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
  
  // بيانات التحليلات والرسوم البيانية المتقدمة
  const [analytics, setAnalytics] = useState({
    monthlyData: [],
    packageDistribution: [],
    recentRegistrations: [],
    kpis: {
      conversionRate: 0,
      arpu: 0,
      thisMonthCount: 0,
      lastMonthCount: 0,
      growthRate: 0,
    }
  });
  
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

        // 4. جلب بيانات التحليلات المتقدمة والرسوم البيانية
        const resAnalytics = await fetch("/api/admin/analytics", {
          headers: { "Authorization": authHeader },
        });
        if (resAnalytics.ok) {
          const dataAnalytics = await resAnalytics.json();
          setAnalytics(dataAnalytics.analytics);
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

  if (!mounted) {
    return <div style={{ backgroundColor: "#0B0D17", minHeight: "100vh" }}></div>;
  }

  return (
    <div className="app-wrapper">
      {/* هالات التوهج الجرانيتية */}
      <div className="parallax-glow-1"></div>
      <div className="parallax-glow-2"></div>

      {!isAuthenticated ? (
        <div className="login-container">
          <div className="login-card">
            <div className="logo-title">سِجِلّها</div>
            <div className="logo-subtitle">لوحة الإدارة سحابية والتراخيص</div>
            <form onSubmit={handleLoginSubmit}>
              {error && <div className="error-msg">{error}</div>}
              <div className="form-group">
                <label className="form-label">رمز الدخول السري للمسؤول</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="كلمة المرور..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading} style={{ background: "#131626", color: "#ffffff", border: "none" }}>
                {loading ? "جاري التحقق..." : "دخول إلى الكونسول"}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="admin-layout">
          {/* ترويسة الكونسول */}
          <div className="header">
            <div className="header-title-container">
              <h1 className="header-title">كونسول إدارة تراخيص سِجِلّها</h1>
              <div className="header-subtitle">البنية السحابية الحجرية لإصدار وفحص التراخيص بالذكاء الاصطناعي</div>
            </div>
            <button onClick={handleLogout} className="btn-logout">إنهاء الجلسة</button>
          </div>

          {/* شبكة الإحصائيات الجرانيتية المحدثة */}
          <div className="advanced-stats-grid">
            <div className="stat-card-advanced active-card">
              <div className="stat-header">
                <span className="stat-lbl-small">إجمالي التراخيص المصدرة</span>
                <span className="stat-icon-wrapper">
                  <svg className="stat-icon-vector" viewBox="0 0 24 24">
                    <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                  </svg>
                </span>
              </div>
              <div className="stat-val-big">
                <AnimatedCounter value={stats.totalLicenses} />
              </div>
            </div>
            <div className="stat-card-advanced active-card">
              <div className="stat-header">
                <span className="stat-lbl-small">التراخيص النشطة</span>
                <span className="stat-icon-wrapper">
                  <svg className="stat-icon-vector" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </span>
              </div>
              <div className="stat-val-big">
                <AnimatedCounter value={stats.activeLicenses} />
              </div>
            </div>
            <div className="stat-card-advanced active-card">
              <div className="stat-header">
                <span className="stat-lbl-small">تنتهي قريباً (30 يوم)</span>
                <span className="stat-icon-wrapper">
                  <svg className="stat-icon-vector" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                </span>
              </div>
              <div className="stat-val-big">
                <AnimatedCounter value={stats.expiringSoon} />
              </div>
            </div>
            <div className="stat-card-advanced active-card">
              <div className="stat-header">
                <span className="stat-lbl-small">فحوصات الذكاء الاصطناعي</span>
                <span className="stat-icon-wrapper">
                  <svg className="stat-icon-vector" viewBox="0 0 24 24">
                    <path d="M19 13H5v-2h14v2zm-2-7H7v2h10V6zm2 14H5v-2h14v2zm-2-7h-4v-2h4v2zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                  </svg>
                </span>
              </div>
              <div className="stat-val-big">
                <AnimatedCounter value={stats.totalAiScans} />
              </div>
            </div>
            <div className="stat-card-advanced active-card">
              <div className="stat-header">
                <span className="stat-lbl-small">الإيرادات المقدرة</span>
                <span className="stat-icon-wrapper">
                  <svg className="stat-icon-vector" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/>
                  </svg>
                </span>
              </div>
              <div className="stat-val-big">
                $<AnimatedCounter value={stats.totalRevenue} />
              </div>
            </div>
          </div>

          {/* تبويبات الكونسول */}
          <div className="tabs-header">
            <button 
              className={`tab-button ${activeTab === "licenses" ? "active" : ""}`}
              onClick={() => setActiveTab("licenses")}
            >
              <svg className="tab-icon-vector" viewBox="0 0 24 24">
                <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65z"/>
              </svg>
              قاعدة التراخيص ({licenses.length})
            </button>
            <button 
              className={`tab-button ${activeTab === "logs" ? "active" : ""}`}
              onClick={() => setActiveTab("logs")}
            >
              <svg className="tab-icon-vector" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              التدقيق والنشاط الإداري ({adminLogs.length})
            </button>
            <button 
              className={`tab-button ${activeTab === "ai_scans" ? "active" : ""}`}
              onClick={() => setActiveTab("ai_scans")}
            >
              <svg className="tab-icon-vector" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              سجل مسح AI ({recentScans.length})
            </button>
            <button 
              className={`tab-button ${activeTab === "analytics" ? "active" : ""}`}
              onClick={() => setActiveTab("analytics")}
            >
              <svg className="tab-icon-vector" viewBox="0 0 24 24">
                <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
              </svg>
              التحليلات والمخططات الذكية
            </button>
          </div>

          {/* مساحة العرض الرئيسية */}
          <div className="content-area">
            {activeTab === "licenses" && (
              <div className="card">
                <div className="card-title-bar">
                  <h2 className="card-title">تراخيص المستخدمين المفعلة</h2>
                  <button 
                    onClick={() => { setGeneratedCode(""); setIsModalOpen(true); }}
                    className="btn-primary" 
                    style={{ width: "auto", padding: "10px 24px", background: "#131626", color: "#ffffff", border: "none" }}
                  >
                    + إصدار ترخيص
                  </button>
                </div>

                {/* خيارات البحث والفلترة */}
                <div className="search-filter-row">
                  <input
                    type="text"
                    className="form-input search-box"
                    placeholder="بحث في كود الترخيص، المالك، أو الهاتف..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <select
                    className="form-select filter-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">كل الحالات</option>
                    <option value="active">نشط وصالح</option>
                    <option value="expired">منتهي الصلاحية</option>
                    <option value="suspended">موقوف مؤقتاً</option>
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
                        <th style={{ textAlign: "right" }}>مسحات AI</th>
                        <th style={{ textAlign: "right" }}>تاريخ الانتهاء</th>
                        <th style={{ textAlign: "right" }}>الحالة</th>
                        <th style={{ textAlign: "right" }}>الجهاز المقترن</th>
                        <th style={{ textAlign: "left" }}>إجراءات التحكم</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLicenses.map((lic) => {
                        const isExpired = new Date(lic.expires_at) <= new Date();
                        const showStatus = lic.status === "active" && isExpired ? "expired" : lic.status;
                        
                        return (
                          <tr key={lic._id}>
                            <td style={{ fontWeight: "bold", color: "var(--color-gold-cream)" }}>{lic.license_code}</td>
                            <td>
                              <div style={{ fontWeight: "bold", color: "#ffffff" }}>{lic.owner_name}</div>
                              <div style={{ fontSize: "12px", color: "var(--color-gold-cream)", opacity: 0.7 }}>{lic.phone_number}</div>
                            </td>
                            <td>
                              {lic.package_type === "monthly" ? "6 أشهر" : 
                               lic.package_type === "yearly" ? "سنوية" : "سنتين"}
                            </td>
                            <td style={{ fontWeight: "bold" }}>
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
                                <span style={{ fontSize: "12px", color: "var(--color-gold-cream)", opacity: 0.5, fontStyle: "italic" }}>غير مقترن</span>
                              )}
                            </td>
                            <td className="actions-cell">
                              <button 
                                onClick={() => handleToggleStatus(lic._id, lic.status)}
                                className="btn-table-action"
                                title="إيقاف / تفعيل مؤقت"
                              >
                                <svg className="action-icon-vector" viewBox="0 0 24 24">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-9H8v2h8v-2z"/>
                                </svg>
                                {lic.status === "active" ? "تعليق" : "تنشيط"}
                              </button>
                              <button 
                                onClick={() => handleExtendLicense(lic._id, lic.expires_at, 360)}
                                className="btn-table-action"
                                title="تمديد الرخصة لسنة إضافية"
                              >
                                <svg className="action-icon-vector" viewBox="0 0 24 24">
                                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                </svg>
                                + سنة
                              </button>
                              <button 
                                onClick={() => handleDeleteLicense(lic._id)}
                                className="btn-table-action delete-action"
                                title="حذف نهائي"
                              >
                                <svg className="action-icon-vector" viewBox="0 0 24 24">
                                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                </svg>
                                حذف
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredLicenses.length === 0 && (
                        <tr>
                          <td colSpan="8" style={{ textAlign: "center", color: "var(--color-gold-cream)", opacity: 0.7, padding: "40px" }}>
                            لا توجد تراخيص مسجلة مطابقة للبحث.
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
                        <span className="log-action-tag">
                          {log.action === "create_license" ? "إصدار" :
                           log.action === "delete_license" ? "حذف" :
                           log.action === "suspend_license" ? "تعليق" :
                           log.action === "activate_license" ? "تنشيط" : "تعديل"}
                        </span>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: "700", fontSize: "14.5px", color: "#ffffff" }}>{log.details}</span>
                          <span style={{ fontSize: "12px", color: "var(--color-gold-cream)", opacity: 0.7 }}>الكود: {log.license_code} | IP: {log.ip_address}</span>
                        </div>
                      </div>
                      <span className="log-date">{new Date(log.created_at).toLocaleString("ar-SA")}</span>
                    </div>
                  ))}
                  {adminLogs.length === 0 && (
                    <div style={{ textAlign: "center", color: "var(--color-gold-cream)", opacity: 0.5, padding: "30px" }}>
                      لا توجد سجلات تدقيق مسجلة حالياً.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "ai_scans" && (
              <div className="card">
                <h2 className="card-title">آخر عمليات مسح الفواتير بالذكاء الاصطناعي</h2>
                <div style={{ marginBottom: "20px" }}>
                  {error && <div className="error-msg">{error}</div>}
                </div>
                <div className="logs-list">
                  {recentScans.map((scan) => (
                    <div key={scan._id} className="scan-item">
                      <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                        <span className="scan-badge scan-success">
                          {scan.status === "success" ? "قراءة ناجحة" : "فشل القراءة"}
                        </span>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: "700", fontSize: "14.5px", color: "#ffffff" }}>
                            العميل: {scan.license_id?.owner_name || "غير معروف"} ({scan.license_id?.license_code || "بدون كود"})
                          </span>
                          <span style={{ fontSize: "12px", color: "var(--color-gold-cream)", opacity: 0.7 }}>
                            رقم الجهاز: {scan.device_id} {scan.error_message && `| تفاصيل الخطأ: ${scan.error_message}`}
                          </span>
                        </div>
                      </div>
                      <span className="log-date">{new Date(scan.created_at).toLocaleString("ar-SA")}</span>
                    </div>
                  ))}
                  {recentScans.length === 0 && (
                    <div style={{ textAlign: "center", color: "var(--color-gold-cream)", opacity: 0.5, padding: "30px" }}>
                      لا توجد عمليات مسح AI مسجلة بعد.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                {/* بطاقات KPI إضافية */}
                <div className="analytics-kpis-grid">
                  <div className="stat-card-advanced active-card">
                    <div className="stat-header">
                      <span className="stat-lbl-small">معدل تحويل التراخيص</span>
                      <span className="stat-icon-wrapper">
                        <svg className="stat-icon-vector" viewBox="0 0 24 24">
                          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                        </svg>
                      </span>
                    </div>
                    <div className="stat-val-big">
                      {analytics.kpis.conversionRate}%
                    </div>
                  </div>

                  <div className="stat-card-advanced active-card">
                    <div className="stat-header">
                      <span className="stat-lbl-small">متوسط قيمة العميل (ARPU)</span>
                      <span className="stat-icon-wrapper">
                        <svg className="stat-icon-vector" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/>
                        </svg>
                      </span>
                    </div>
                    <div className="stat-val-big">
                      ${analytics.kpis.arpu}
                    </div>
                  </div>

                  <div className="stat-card-advanced active-card">
                    <div className="stat-header">
                      <span className="stat-lbl-small">نمو التسجيلات هذا الشهر</span>
                      <span className="stat-icon-wrapper">
                        <svg className="stat-icon-vector" viewBox="0 0 24 24">
                          <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>
                        </svg>
                      </span>
                    </div>
                    <div className="stat-val-big" style={{ color: analytics.kpis.growthRate >= 0 ? "#2e7d68" : "#c62828" }}>
                      {analytics.kpis.growthRate >= 0 ? "+" : ""}{analytics.kpis.growthRate}%
                    </div>
                  </div>
                </div>

                {/* شبكة الرسوم البيانية */}
                <div className="charts-grid-container">
                  <div className="card chart-card">
                    <h3 className="card-title" style={{ marginBottom: "20px" }}>نمو التسجيلات والإيرادات الشهرية</h3>
                    <div style={{ width: "100%", height: 300 }}>
                      <ResponsiveContainer>
                        <ComposedChart data={analytics.monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e8e2d8" opacity={0.5} />
                          <XAxis dataKey="month" tick={{ fontFamily: 'Cairo', fontSize: 12, fill: '#5A607F' }} />
                          <YAxis yAxisId="left" tick={{ fontFamily: 'Cairo', fontSize: 12, fill: '#5A607F' }} />
                          <YAxis yAxisId="right" orientation="right" tick={{ fontFamily: 'Cairo', fontSize: 12, fill: '#5A607F' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E8E2D8', borderRadius: '12px', fontFamily: 'Cairo', textAlign: 'right' }} 
                            labelStyle={{ fontWeight: 'bold', color: '#131626' }}
                          />
                          <Legend wrapperStyle={{ fontFamily: 'Cairo', fontSize: 12 }} />
                          <Bar yAxisId="left" dataKey="registrations" name="تسجيلات جديدة" fill="#131626" radius={[4, 4, 0, 0]} />
                          <Line yAxisId="right" type="monotone" dataKey="revenue" name="الإيرادات ($)" stroke="#B08B4E" strokeWidth={3} dot={{ r: 5, fill: '#B08B4E' }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="card chart-card">
                    <h3 className="card-title" style={{ marginBottom: "20px" }}>توزيع الباقات المشتركة</h3>
                    <div style={{ width: "100%", height: 300, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                      <div style={{ width: "100%", height: 240 }}>
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie
                              data={analytics.packageDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {analytics.packageDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E8E2D8', borderRadius: '12px', fontFamily: 'Cairo', textAlign: 'right' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", fontFamily: 'Cairo', fontSize: '13px' }}>
                        {analytics.packageDistribution.map((entry, index) => (
                          <div key={index} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: entry.color }}></span>
                            <span style={{ color: "#5A607F", fontWeight: "700" }}>{entry.name}: {entry.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* جدول أحدث المشتركين */}
                <div className="card">
                  <h3 className="card-title" style={{ marginBottom: "20px" }}>أحدث المشتركين الجدد</h3>
                  <div className="table-container">
                    <table className="license-table">
                      <thead>
                        <tr>
                          <th>الاسم</th>
                          <th>الهاتف</th>
                          <th>نوع الباقة</th>
                          <th>تاريخ التسجيل</th>
                          <th>تاريخ الانتهاء</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.recentRegistrations.map((lic) => (
                          <tr key={lic.id}>
                            <td style={{ fontWeight: "700" }}>{lic.owner_name}</td>
                            <td>{lic.phone_number}</td>
                            <td>
                              <span className="status-badge status-active">
                                {lic.package_type === "monthly" ? "6 أشهر" : lic.package_type === "yearly" ? "سنوية" : "سنتين"}
                              </span>
                            </td>
                            <td>{new Date(lic.created_at).toLocaleDateString("ar-SA")}</td>
                            <td>{new Date(lic.expires_at).toLocaleDateString("ar-SA")}</td>
                          </tr>
                        ))}
                        {analytics.recentRegistrations.length === 0 && (
                          <tr>
                            <td colSpan="5" style={{ textAlign: "center", padding: "30px", opacity: 0.5 }}>
                              لا توجد تسجيلات حديثة.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* محاورة توليد كود ترخيص جديد العائمة */}
          {isModalOpen && (
            <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
              <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>×</button>
                <h3 className="card-title" style={{ marginBottom: "24px" }}>إصدار كود ترخيص جديد</h3>
                
                {error && <div className="error-msg">{error}</div>}
                
                <form onSubmit={handleCreateLicense}>
                  <div className="form-group">
                    <label className="form-label">اسم صاحب المحل / المشترك</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="اسم صاحب المحل..."
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
                      placeholder="رقم الهاتف..."
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">نوع الباقة المالية</label>
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
                    <input
                      type="number"
                      className="form-input"
                      placeholder="عدد الأيام..."
                      value={durationDays}
                      onChange={(e) => setDurationDays(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={loading} style={{ background: "#131626", color: "#ffffff", border: "none" }}>
                    {loading ? "جاري إنشاء الترخيص..." : "توليد كود التفعيل المعتمد"}
                  </button>
                </form>

                {generatedCode && (
                  <div className="license-result">
                    <div style={{ fontSize: "12px", color: "var(--color-gold-cream)", opacity: 0.7, fontWeight: "bold" }}>كود الترخيص الجديد (انقر للنسخ الفوري):</div>
                    <div className="license-code-display" onClick={() => {
                      navigator.clipboard.writeText(generatedCode);
                      alert("تم نسخ كود التفعيل بنجاح!");
                    }}>
                      {generatedCode}
                      <svg style={{ width: "16px", height: "16px", fill: "currentColor" }} viewBox="0 0 24 24">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                      </svg>
                    </div>
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
