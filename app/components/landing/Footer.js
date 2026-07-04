"use client";
import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-container">
        <Link href="/" className="footer-logo">
          سِجِلّ<span>ها</span>
        </Link>

        <p className="footer-desc">
          تطبيق المحاسبة الأسهل والأسرع لإدارة ديون المحلات والتجار بالذكاء الاصطناعي وبدون اتصال بالإنترنت.
        </p>

        <div className="footer-links">
          <a href="#showcase" className="footer-link">التطبيق</a>
          <a href="#ai-demo" className="footer-link">الذكاء الاصطناعي</a>
          <a href="#features" className="footer-link">المميزات</a>
          <a href="#pricing" className="footer-link">الأسعار</a>
          <Link href="/admin" className="footer-link">لوحة الإدارة</Link>
        </div>

        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", fontWeight: 600 }}>
          © {new Date().getFullYear()} تطبيق سجلها (Sajlha App) — جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
