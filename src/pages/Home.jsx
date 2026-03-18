import React from "react";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import StatsSection from "../components/home/StatsSection";
import CTASection from "../components/home/CTASection";

export default function Home() {
  return (
    <div className="bg-[#0f0f0f]">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
    </div>
  );
}