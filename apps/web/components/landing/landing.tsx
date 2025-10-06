import HeroSection from "./hero-section";
import FeaturesSection from "./features-section";
import ShowcaseSection from "./showcase-section";
import FinalCtaSection from "./final-cta-section";
import LandingFooter from "./footer";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <HeroSection />
      <FeaturesSection />
      <ShowcaseSection />
      <FinalCtaSection />
      <LandingFooter />
    </main>
  );
}
