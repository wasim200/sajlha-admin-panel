"use client";
import { useState, useEffect } from "react";
import "./landing.css";
import LandingNavbar from "./components/landing/Navbar";
import HeroSection from "./components/landing/HeroSection";
import AppShowcase from "./components/landing/AppShowcase";
import InteractiveAiDemo from "./components/landing/InteractiveAiDemo";
import FeaturesGrid from "./components/landing/FeaturesGrid";
import PricingSection from "./components/landing/PricingSection";
import HowItWorks from "./components/landing/HowItWorks";
import FaqSection from "./components/landing/FaqSection";
import LandingFooter from "./components/landing/Footer";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ backgroundColor: "var(--color-bg-primary, #F7F8FC)", minHeight: "100vh" }} />;
  }

  // Schema.org JSON-LD Structured Data for Google Search Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "سجلها - Sajlha App",
    "operatingSystem": "Android, iOS",
    "applicationCategory": "BusinessApplication, FinanceApplication",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1250",
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "8",
      "highPrice": "28",
      "offerCount": "3",
    },
    "description": "تطبيق المحاسبة الأسهل لإدارة ديون العملاء والفواتير بالذكاء الاصطناعي وبدون إنترنت. مزامنة سحابية آمنة على Google Drive وتنبيهات واتساب و SMS.",
  };

  return (
    <div className="landing-wrapper">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <LandingNavbar />
      <main>
        <HeroSection />
        <AppShowcase />
        <InteractiveAiDemo />
        <FeaturesGrid />
        <PricingSection />
        <HowItWorks />
        <FaqSection />
      </main>
      <LandingFooter />
    </div>
  );
}
