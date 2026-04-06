import React from "react";
import HeroScene from "../components/landing/HeroScene";
import PathSplitScene from "../components/landing/PathSplitScene";
import LearningScene from "../components/landing/LearningScene";
import FeaturesScene from "../components/landing/FeaturesScene";
import ProgressScene from "../components/landing/ProgressScene";
import FinalCTAScene from "../components/landing/FinalCTAScene";

export default function Home() {
  return (
    <div style={{ background: "#080808", overflowX: "hidden" }}>
      <HeroScene />
      <PathSplitScene />
      <LearningScene />
      <FeaturesScene />
      <ProgressScene />
      <FinalCTAScene />
    </div>
  );
}