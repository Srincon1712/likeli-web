import { defaultContent } from "@/data/defaultContent";
import type { ClientPortal, LikeliClientPortalOutput } from "@/types/likeliPortalOutput";

export function getPortalOutputSections(client: ClientPortal) {
  const output = client.likeliOutput?.output;
  const premiumEnabled = client.activePlan !== "signals";
  const source = (output || defaultContent) as LikeliClientPortalOutput & typeof defaultContent;

  return {
    overview: {
      executiveSummary: output?.executiveSummary || {},
      diagnosis: output?.diagnosis || {},
      finalRecommendation: output?.finalRecommendation || defaultContent.likeliScore,
    },
    trends: source.trends || [],
    opportunities: source.opportunities || [],
    contentIdeas: source.contentIdeas || [],
    hooksLibrary: source.hooksLibrary || [],
    captionsLibrary: source.captionsLibrary || [],
    ctaLibrary: source.ctaLibrary || [],
    scripts: premiumEnabled ? source.scripts || [] : [],
    predictions: premiumEnabled ? source.predictions || { enabled: false, items: [] } : { enabled: false, items: [] },
    likeliScore: premiumEnabled ? source.likeliScore || {} : { enabled: false, score: null, explanation: "" },
    benchmarks: premiumEnabled ? source.benchmarks || { enabled: false, items: [] } : { enabled: false, items: [] },
    contentCalendar: premiumEnabled ? source.contentCalendar || [] : [],
    monthlyRoadmap: premiumEnabled ? source.monthlyRoadmap || [] : [],
    prioritization: output?.prioritizationMatrix || [],
    checklists: output?.reviewChecklists || {},
    finalRecommendation: output?.finalRecommendation || {},
    hasImportedOutput: Boolean(output),
  };
}
