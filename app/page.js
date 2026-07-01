"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [licenses, setLicenses] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, expired: 0, suspended: 0 });
  
  // حقول إضافة رخصة جديدة
  const [ownerName, setOwnerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [packageType, setPackageType] = useState("yearly");
  const [durationDays, setDurationDays] = useState("365");
  const [generatedCode, setGeneratedCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    try {
      const response = await fetch("/api/admin/licenses", {
        headers: {
          "Authorization": pwdToTest || password,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setLicenses(data.licenses);
        setStats(data.stats);
        setIsAuthenticated(true);
        if (pwdToTest) {
          localStorage.setItem("sajlha_admin_pwd", pwdToTest);
        }
      } else {
        try {
          const errData = await response.json();
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

  return (
    <div className="app-wrapper">
      <style>{`
        /* الهوية البصرية الفاتحة لتطبيق سجلها المستوحاة من تطبيق سهم المالي */
        .app-wrapper {
          min-height: 100vh;
          background-color: #fafafc;
          color: #1e293b;
          direction: rtl;
          font-family: 'Cairo', sans-serif;
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
        .form-input {
          width: 100%;
          padding: 12px 16px;
          background-color: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          color: #0f172a;
          font-family: 'Cairo', sans-serif;
          font-size: 14px;
          box-sizing: border-box;
          transition: all 0.2s ease-in-out;
        }
        .form-input::placeholder {
          color: #94a3b8;
        }
        .form-input:focus {
          outline: none;
          border-color: #2e7d68; /* لون النجاح السعودي الأخضر بتطبيق سجلها */
          box-shadow: 0 0 0 3.5px rgba(46, 125, 104, 0.12);
        }
        .form-select {
          width: 100%;
          padding: 12px 16px;
          background-color: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          color: #0f172a;
          font-family: 'Cairo', sans-serif;
          font-size: 14px;
          box-sizing: border-box;
          transition: all 0.2s ease-in-out;
        }
        .form-select:focus {
          outline: none;
          border-color: #2e7d68;
          box-shadow: 0 0 0 3.5px rgba(46, 125, 104, 0.12);
        }

        /* الأزرار الفاخرة */
        .btn-primary {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #2e7d68, #225c4d); /* أخضر سهم المالي وسجلها */
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 14.5px;
          font-weight: 700;
          font-family: 'Cairo', sans-serif;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(46, 125, 104, 0.18);
          transition: all 0.2s ease-in-out;
        }
        .btn-primary:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 6px 18px rgba(46, 125, 104, 0.28);
        }
        .btn-primary:active {
          transform: translateY(0);
        }

        /* شاشة الدخول */
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          background-color: #f1f5f9;
        }
        .login-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 44px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
          text-align: center;
        }
        .logo-title {
          color: #2e7d68; /* الأخضر الأساسي المميز لسجلها */
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

        /* شاشة الإدارة */
        .admin-layout {
          max-width: 1320px;
          margin: 0 auto;
          padding: 40px 24px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 36px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 24px;
        }
        .header-title-container {
          border-right: 4px solid #2e7d68; /* أخضر سجلها */
          padding-right: 18px;
        }
        .header-title {
          font-size: 26px;
          font-weight: 900;
          color: #0f172a;
          margin: 0;
        }
        .header-subtitle {
          font-size: 13.5px;
          color: #64748b;
          margin-top: 4px;
          font-weight: 600;
        }
        .btn-logout {
          background-color: #fff1f2;
          color: #e11d48;
          border: 1px solid #fecdd3;
          padding: 10px 20px;
          border-radius: 10px;
          font-family: 'Cairo', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-logout:hover {
          background-color: #ffe4e6;
          transform: translateY(-1px);
        }

        /* الإحصائيات */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .stat-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(15, 23, 42, 0.015);
          transition: all 0.2s;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          border-color: #cbd5e1;
          box-shadow: 0 8px 16px rgba(15, 23, 42, 0.04);
        }
        .stat-value {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 13px;
          color: #64748b;
          font-weight: 700;
        }

        /* الكروت والبطاقات */
        .card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 30px;
          box-shadow: 0 6px 12px rgba(15, 23, 42, 0.01);
        }
        .card-title {
          font-size: 17.5px;
          font-weight: 800;
          color: #0f172a;
          margin-top: 0;
          margin-bottom: 24px;
          border-right: 4px solid #d5b075; /* لون اللمسة الذهبية */
          padding-right: 12px;
        }

        /* هيكل المحتوى الرئيسي */
        .main-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media(min-width: 950px) {
          .main-content {
            grid-template-columns: 360px 1fr;
          }
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
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: middle;
        }
        .license-table td:first-child {
          border-right: 1px solid #e2e8f0;
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
        }
        .license-table td:last-child {
          border-left: 1px solid #e2e8f0;
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
        }
        .license-table tr:hover td {
          background-color: #f8fafc;
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
          background-color: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }
        .status-suspended {
          background-color: #fff1f2;
          color: #be123c;
          border: 1px solid #fecdd3;
        }
        .status-expired {
          background-color: #fffbeb;
          color: #b45309;
          border: 1px solid #fde68a;
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
          background-color: #fffbeb;
          color: #b45309;
          border-color: #fde68a;
        }
        .btn-extend:hover {
          background-color: #fef3c7;
        }
        .btn-delete {
          background-color: #fff1f2;
          color: #e11d48;
          border-color: #fecdd3;
        }
        .btn-delete:hover {
          background-color: #ffe4e6;
        }

        .device-info {
          font-size: 11.5px;
          color: #475569;
          font-family: monospace;
          background-color: #f8fafc;
          padding: 4px 8px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }

        .error-msg {
          background-color: #fff1f2;
          border: 1px solid #fecdd3;
          color: #e11d48;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          margin-bottom: 20px;
          text-align: right;
          line-height: 1.5;
          font-weight: 600;
        }
        .license-result {
          background-color: #f0fdf4;
          border: 1.5px dashed #2e7d68;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          margin-top: 24px;
        }
        .license-code-display {
          font-size: 22px;
          font-weight: 800;
          color: #2e7d68;
          letter-spacing: 0.5px;
          margin-top: 8px;
          user-select: all;
          cursor: pointer;
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
          <div className="header">
            <div className="header-title-container">
              <h1 className="header-title">لوحة تحكم وتراخيص سِجِلّها</h1>
              <div className="header-subtitle">إدارة سحابية مركزية والتحقق بالذكاء الاصطناعي</div>
            </div>
            <button onClick={handleLogout} className="btn-logout">تسجيل الخروج</button>
          </div>

          <div className="main-content">
            {/* العمود الجانبي */}
            <div className="sidebar">
              {/* الإحصائيات */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value" style={{ color: "#2e7d68" }}>{stats.total}</div>
                  <div className="stat-label">إجمالي التراخيص</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: "#047857" }}>{stats.active}</div>
                  <div className="stat-label">نشط وصالح</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: "#b45309" }}>{stats.expired}</div>
                  <div className="stat-label">منتهي</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: "#be123c" }}>{stats.suspended}</div>
                  <div className="stat-label">موقوف مؤقتاً</div>
                </div>
              </div>

              {/* توليد رخصة جديدة */}
              <div className="card">
                <h2 className="card-title">توليد كود ترخيص جديد</h2>
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
                      onChange={(e) => setPackageType(e.target.value)}
                    >
                      <option value="monthly">باقة شهرية</option>
                      <option value="yearly">باقة سنوية</option>
                      <option value="lifetime">باقة مدى الحياة</option>
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
                    {loading ? "جاري إنشاء الترخيص..." : "توليد الكود"}
                  </button>
                </form>

                {generatedCode && (
                  <div className="license-result">
                    <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "bold" }}>كود الترخيص الجديد (انقر للتحديد والنسخ):</div>
                    <div className="license-code-display">{generatedCode}</div>
                  </div>
                )}
              </div>
            </div>

            {/* جدول التراخيص */}
            <div className="card" style={{ height: "fit-content" }}>
              <h2 className="card-title">تراخيص المستخدمين المفعلة</h2>
              <div className="table-container">
                <table className="license-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "right" }}>كود الترخيص</th>
                      <th style={{ textAlign: "right" }}>المالك والهاتف</th>
                      <th style={{ textAlign: "right" }}>الباقة</th>
                      <th style={{ textAlign: "right" }}>تاريخ الانتهاء</th>
                      <th style={{ textAlign: "right" }}>حالة الترخيص</th>
                      <th style={{ textAlign: "right" }}>الجهاز المقترن</th>
                      <th style={{ textAlign: "left" }}>خيارات التحكم</th>
                    </tr>
                  </thead>
                  <tbody>
                    {licenses.map((lic) => {
                      const isExpired = new Date(lic.expires_at) <= new Date();
                      const showStatus = lic.status === "active" && isExpired ? "expired" : lic.status;
                      
                      return (
                        <tr key={lic._id}>
                          <td style={{ fontWeight: "bold", color: "#2e7d68" }}>{lic.license_code}</td>
                          <td>
                            <div style={{ fontWeight: "bold" }}>{lic.owner_name}</div>
                            <div style={{ fontSize: "11.5px", color: "#64748b" }}>{lic.phone_number}</div>
                          </td>
                          <td>
                            {lic.package_type === "monthly" ? "شهرية" : 
                             lic.package_type === "yearly" ? "سنوية" : "مدى الحياة"}
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
                              <span className="device-info">{lic.device_id}</span>
                            ) : (
                              <span style={{ fontSize: "11.5px", color: "#94a3b8", fontStyle: "italic" }}>غير مقترن بعد</span>
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
                              onClick={() => handleExtendLicense(lic._id, lic.expires_at, 365)}
                              className="btn-table-action btn-extend"
                            >
                              تمديد سنة
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
                    {licenses.length === 0 && (
                      <tr>
                        <td colSpan="7" style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>
                          لا يوجد أي أكواد تفعيل حالياً. قم بإنشاء كود من القائمة الجانبية.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
