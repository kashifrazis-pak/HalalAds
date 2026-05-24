import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import HowItWorks from "@/components/sections/HowItWorks";
import FeaturesSection from "@/components/sections/FeaturesSection";
import MarketSection from "@/components/sections/MarketSection";
import WaitlistSection from "@/components/sections/WaitlistSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <FeaturesSection />
        <MarketSection />
        <WaitlistSection />
      </main>
      <Footer />
    </>
  );
}
