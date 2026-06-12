export type OutputPlanId = "signals" | "signals_pro" | "signals_elite";
export type PortalPlanId = "signals" | "signals-pro" | "signals-elite";

export type LikeliOutputItem = Record<string, unknown> & { id?: string };

export interface LikeliClientPortalOutput {
  meta?: Record<string, unknown>;
  clientProfile?: Record<string, unknown>;
  plan?: { id?: OutputPlanId | string; planId?: OutputPlanId | string; label?: string };
  executiveSummary?: Record<string, unknown>;
  diagnosis?: Record<string, unknown>;
  trends?: LikeliOutputItem[];
  opportunities?: LikeliOutputItem[];
  contentIdeas?: LikeliOutputItem[];
  hooksLibrary?: LikeliOutputItem[];
  captionsLibrary?: LikeliOutputItem[];
  ctaLibrary?: LikeliOutputItem[];
  scripts?: LikeliOutputItem[];
  predictions?: Record<string, unknown> & { enabled?: boolean; items?: LikeliOutputItem[] };
  likeliScore?: Record<string, unknown> & { enabled?: boolean; score?: number | string | null };
  benchmarks?: Record<string, unknown> & { enabled?: boolean; items?: LikeliOutputItem[] };
  contentCalendar?: LikeliOutputItem[];
  monthlyRoadmap?: LikeliOutputItem[];
  prioritizationMatrix?: LikeliOutputItem[];
  reviewChecklists?: Record<string, unknown>;
  finalRecommendation?: Record<string, unknown>;
}

export interface StoredLikeliOutput {
  outputType: "LIKELI_CLIENT_PORTAL_OUTPUT";
  importedAt: string;
  version: string;
  portalPlanId: PortalPlanId;
  output: LikeliClientPortalOutput;
}

export interface ClientPortal {
  id?: string;
  source?: "mock" | "local";
  clientName: string;
  clientSlug: string;
  businessType: string;
  activePlan: PortalPlanId;
  accessKey: string;
  lastUpdate: string;
  nextPaymentAt?: string;
  billingDueInDays?: number;
  status: "active" | "review" | string;
  generatedOutput?: Record<string, unknown> | null;
  likeliOutput?: StoredLikeliOutput | null;
}
