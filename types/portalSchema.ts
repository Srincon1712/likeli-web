export const LIKELI_PORTAL_SCHEMA_VERSION = "likeli-portal-v2" as const;

export type CanonicalPlanId = "signals" | "signals_pro" | "signals_elite";
export type PortalDataItem = Record<string, unknown> & { id?: string };

export interface PortalPeriod {
  startDate?: string;
  endDate?: string;
  durationDays?: number;
}

export interface CanonicalPortalMeta {
  clientName?: string;
  businessName?: string;
  plan?: CanonicalPlanId | string;
  industry?: string;
  location?: string;
  createdAt?: string;
  period?: PortalPeriod;
}

export interface PortalCaseLibraries {
  successCases: PortalDataItem[];
  failureCases: PortalDataItem[];
}

export interface CanonicalPortalModules {
  ideas: PortalDataItem[];
  hooks: PortalDataItem[];
  captions: PortalDataItem[];
  ctas: PortalDataItem[];
  trends: PortalDataItem[];
  opportunities: PortalDataItem[];
  scripts: PortalDataItem[];
  benchmarks: PortalDataItem[];
  roadmap: PortalDataItem[];
  calendar: PortalDataItem[];
  caseLibraries: PortalCaseLibraries;
}

export interface CanonicalPortalOutput {
  schemaVersion: typeof LIKELI_PORTAL_SCHEMA_VERSION;
  generatedAt?: string;
  portal: CanonicalPortalMeta;
  businessContext: Record<string, unknown>;
  analysis: Record<string, unknown>;
  modules: CanonicalPortalModules;
}

export interface PortalPlanRules {
  label: string;
  ideas: number;
  hooks: number;
  captions: number;
  ctas: number;
  trends: number;
  opportunities: number;
  scripts: number;
  predictions: boolean;
  likeliScore: boolean;
  benchmarks: boolean;
  calendar: boolean;
  roadmap: boolean;
  caseLibraries: boolean;
}
