"use client";
import { useState } from "react";
import Link from "next/link";

export default function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="landing-nav-wrapper">
      <div className="landing-container">
        <nav className="landing-nav">
          {/* Logo */}
          <Link href="/" className="landing-logo">
            <div className="landing-logo-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
            </div>
            <span>سِجِلّ</span>ها
          </Link>

          {/* Desktop Links */}
          <div className="landing-nav-links">
            <a href="#showcase" className="landing-nav-link">استعراض التطبيق</a>
            <a href="#ai-demo" className="landing-nav-link">تجربة الـ AI</a>
            <a href="#features" className="landing-nav-link">المميزات</a>
            <a href="#pricing" className="landing-nav-link">الباقات والأسعار</a>
            <a href="#steps" className="landing-nav-link">طريقة التفعيل</a>
            <a href="#faq" className="landing-nav-link">الأسئلة الشائعة</a>
          </div>

          {/* Actions */}
          <div className="landing-nav-actions">
            <Link href="/admin" className="btn-outline btn-sm">
              لوحة الإدارة
            </Link>
            <a href="#pricing" className="btn-primary btn-sm btn-gold">
              تفعيل الاشتراك
            </a>
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {mobileOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="mobile-drawer" onClick={() => setMobileOpen(false)}>
          <a href="#showcase" className="mobile-drawer-link">استعراض التطبيق</a>
          <a href="#ai-demo" className="mobile-drawer-link">تجربة مسح AI</a>
          <a href="#features" className="mobile-drawer-link">المميزات</a>
          <a href="#pricing" className="mobile-drawer-link">الباقات والأسعار</a>
          <a href="#steps" className="mobile-drawer-link">طريقة التفعيل</a>
          <a href="#faq" className="mobile-drawer-link">الأسئلة الشائعة</a>
          <Link href="/admin" className="btn-primary" style={{ marginTop: 12, textAlign: "center" }}>
            لوحة الإدارة
          </Link>
        </div>
      )}
    </header>
  );
}
