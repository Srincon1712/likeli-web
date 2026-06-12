import ComparisonSection from "./ComparisonSection";
import FAQSection from "./FAQSection";
import FinalCTA from "./FinalCTA";
import ImplementationSection from "./ImplementationSection";
import PricingSection from "./PricingSection";
import ProblemSection from "./ProblemSection";
import ReviewSignals from "./ReviewSignals";
import SolutionSection from "./SolutionSection";
import TrustBar from "./TrustBar";
import UseCases from "./UseCases";

export default function HomeSections() {
  return (
    <>
      <TrustBar />
      <ProblemSection />
      <SolutionSection />
      <UseCases />
      <ReviewSignals />
      <ComparisonSection />
      <PricingSection />
      <ImplementationSection />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
