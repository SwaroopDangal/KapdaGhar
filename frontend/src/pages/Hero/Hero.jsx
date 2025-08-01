import BestSeller from "@/components/BestSeller";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import LatestCollections from "@/components/LatestCollections";
import React from "react";

const Hero = () => {
  return (
    <div className="space-y-12 px-4 md:px-10 py-8">
      <HeroBanner />
      <LatestCollections />
      <BestSeller />
      <Footer />
    </div>
  );
};

export default Hero;
