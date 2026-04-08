import React from "react";
import HeroSection from "@/components/home2/HeroSection";
import BentoGrid from "@/components/home2/BentoGrid";
import HowItWorks from "@/components/home2/HowItWorks";
import Testimonials from "@/components/home2/Testimonials";
import Pricing from "@/components/home2/Pricing";
import FinalCTA from "@/components/home2/FinalCTA";
import Footer from "@/components/home2/Footer";

const responsiveStyles = `
  @media (max-width: 768px) {
    .cf-bento { grid-template-columns: 1fr !important; }
    .cf-bento > div { grid-column: span 1 !important; grid-row: span 1 !important; }
    .cf-steps { grid-template-columns: 1fr !important; }
    .cf-steps > div { border-right: none !important; padding-left: 0 !important; padding-bottom: 32px; border-bottom: 1px solid #1e1e1e; }
    .cf-steps > div:last-child { border-bottom: none !important; padding-bottom: 0; }
    .cf-testimonials { grid-template-columns: 1fr !important; }
    .cf-pricing { grid-template-columns: 1fr !important; }
    .cf-nav-links { display: none !important; }
  }
`;

export default function Home() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>
      <style>{responsiveStyles}</style>
      <HeroSection />
      <BentoGrid />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}