import ComparisonSection from "./ComparisonSection";
import FAQSection from "./FAQSection";
import FinalCTA from "./FinalCTA";
import ImplementationSection from "./ImplementationSection";
import LandingReveal from "@/components/LandingReveal";
import PricingSection from "./PricingSection";
import ProblemSection from "./ProblemSection";
import ReviewSignals from "./ReviewSignals";
import SolutionSection from "./SolutionSection";
import TrustBar from "./TrustBar";
import UseCases from "./UseCases";

export default function HomeSections() {
  return (
    <>
      <LandingReveal>
        <TrustBar />
      </LandingReveal>
      <LandingReveal>
        <ProblemSection />
      </LandingReveal>
      <LandingReveal>
        <SolutionSection />
      </LandingReveal>
      <LandingReveal>
        <UseCases />
      </LandingReveal>
      <LandingReveal>
        <ReviewSignals />
      </LandingReveal>
      <LandingReveal>
        <ComparisonSection />
      </LandingReveal>
      <LandingReveal>
        <PricingSection />
      </LandingReveal>
      <LandingReveal>
        <ImplementationSection />
      </LandingReveal>
      <LandingReveal>
        <FAQSection />
      </LandingReveal>
      <LandingReveal>
        <FinalCTA />
      </LandingReveal>
    </>
  );
}
