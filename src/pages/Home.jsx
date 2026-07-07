import React, { useEffect } from "react";
import { font } from "@/lib/tokens";
import { track } from "@/lib/analytics";
import HeroSection from "@/components/home2/HeroSection";
import LessonShowcase from "@/components/home2/LessonShowcase";
import HowItWorks from "@/components/home2/HowItWorks";
import Testimonials from "@/components/home2/Testimonials";
import FinalCTA from "@/components/home2/FinalCTA";
import Footer from "@/components/home2/Footer";
import { Stagger, StaggerItem } from "@/lib/motion";

const responsiveStyles = `
  @media (max-width: 880px) {
    .cf-hero { grid-template-columns: 1fr !important; gap: 56px !important; align-items: start !important; padding-top: 88px !important; }
    .cf-lesson { grid-template-columns: 1fr !important; gap: 16px !important; }
    .cf-gutter { font-size: 1.8rem !important; }
    .cf-cta { grid-template-columns: 1fr !important; gap: 32px !important; align-items: start !important; }
  }
  @media (max-width: 768px) {
    .cf-pillars { grid-template-columns: 1fr !important; gap: 32px !important; }
    .cf-quotes { grid-template-columns: 1fr !important; gap: 48px !important; }
    .cf-track-row { grid-template-columns: auto 1fr !important; }
    .cf-track-row > :last-child { grid-column: 1 / -1; justify-self: start; }
    .cf-pricing { grid-template-columns: 1fr !important; }
    .cf-pricing > div { border-right: none !important; padding: 0 0 40px !important; border-bottom: 1px solid #221F18; margin-bottom: 40px; }
    .cf-pricing > div:last-child { border-bottom: none !important; margin-bottom: 0; padding-bottom: 0 !important; }
    .cf-nav-links { display: none !important; }
  }
`;

export default function Home() {
  useEffect(() => { track("landing_view"); }, []);
  return (
    <div style={{ background: "#15130E", minHeight: "100vh", fontFamily: font.body, color: "#ECE7DC" }}>
      <style>{responsiveStyles}</style>
      <Stagger as="div">
        <StaggerItem as="div"><HeroSection /></StaggerItem>
        <StaggerItem as="div"><LessonShowcase /></StaggerItem>
        <StaggerItem as="div"><HowItWorks /></StaggerItem>
        <StaggerItem as="div"><Testimonials /></StaggerItem>
        <StaggerItem as="div"><FinalCTA /></StaggerItem>
        <StaggerItem as="div"><Footer /></StaggerItem>
      </Stagger>
    </div>
  );
}