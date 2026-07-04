"use client";
import { useState, useEffect } from "react";
import './admin-dashboard.css';
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import { ToastProvider } from "./components/Toast";
import { AdminProvider } from "./components/AdminContext";

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState("dashboard");
  const [mounted, setMounted] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("sajlha_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Detect active page from URL
    const path = window.location.pathname;
    if (path.includes("/admin/licenses")) setActivePage("licenses");
    else if (path.includes("/admin/analytics")) setActivePage("analytics");
    else if (path.includes("/admin/logs")) setActivePage("logs");
    else if (path.includes("/admin/ai-scans")) setActivePage("ai-scans");
    else if (path.includes("/admin/broadcast")) setActivePage("broadcast");
    else setActivePage("dashboard");

    const savedPwd = localStorage.getItem("sajlha_admin_pwd");
    if (savedPwd) {
      setPassword(savedPwd);
      validateAuth(savedPwd);
    } else {
      setChecking(false);
    }
  }, []);

  const validateAuth = async (pwd) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/licenses", {
        headers: { Authorization: pwd },
      });
      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("sajlha_admin_pwd", pwd);
      } else {
        setError("كلمة المرور غير صحيحة أو انتهت الجلسة.");
        setIsAuthenticated(false);
      }
    } catch {
      setError("فشل الاتصال بالخادم.");
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!password) return;
    validateAuth(password);
  };

  const handleLogout = () => {
    localStorage.removeItem("sajlha_admin_pwd");
    setPassword("");
    setIsAuthenticated(false);
    setActivePage("dashboard");
  };

  const handleNavigate = (page) => {
    setActivePage(page);
    const pathMap = {
      dashboard: "/admin",
      licenses: "/admin/licenses",
      analytics: "/admin/analytics",
      logs: "/admin/logs",
      "ai-scans": "/admin/ai-scans",
      broadcast: "/admin/broadcast",
    };
    window.history.pushState({}, "", pathMap[page] || "/admin");
  };

  if (!mounted || checking) {
    return <div style={{ backgroundColor: "var(--color-bg-primary, #F7F8FC)", minHeight: "100vh" }} />;
  }

  if (!isAuthenticated) {
    return (
      <div className="login-screen">
        <div className="login-bg-glow-1" />
        <div className="login-bg-glow-2" />
        <div className="login-card">
          <div className="login-logo-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
          </div>
          <h1 className="login-title">سِجِلّ<span>ها</span></h1>
          <p className="login-subtitle">لوحة الإدارة والتحكم السحابية</p>
          <form onSubmit={handleLogin}>
            {error && (
              <div className="alert-box alert-error" style={{ marginBottom: 20, textAlign: "right" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {error}
              </div>
            )}
            <div className="form-group">
              <label className="form-label">رمز الدخول السري للمسؤول</label>
              <input
                type="password"
                className="form-input"
                placeholder="أدخل كلمة المرور..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%" }}>
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  جاري التحقق...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  دخول إلى لوحة التحكم
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminProvider>
      <ToastProvider>
        <div className="admin-shell">
          <Sidebar activePage={activePage} onNavigate={handleNavigate} onLogout={handleLogout} />
          <main className="admin-main">
            <TopBar activePage={activePage} />
            <div className="admin-content">
              {children}
            </div>
          </main>
        </div>
      </ToastProvider>
    </AdminProvider>
  );
}
