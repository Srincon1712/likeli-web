import { adaptPortalOutput } from "@/lib/portalDataAdapter";
import type { ClientPortal, LikeliClientPortalOutput } from "@/types/likeliPortalOutput";

export function getPortalOutputSections(client: ClientPortal) {
  const rawOutput = client.likeliOutput?.output;
  const output = rawOutput
    ? adaptPortalOutput(rawOutput, { createdAt: client.createdAt, plan: client.activePlan }).output
    : undefined;
  const premiumEnabled = client.activePlan !== "signals";
  const source = (output || {}) as LikeliClientPortalOutput;

  return {
    overview: {
      executiveSummary: output?.executiveSummary || {},
      diagnosis: output?.diagnosis || {},
      finalRecommendation: output?.finalRecommendation || {},
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
    caseLibraries: output?.caseLibraries || { successCases: [], failureCases: [] },
    hasImportedOutput: Boolean(output),
  };
}
