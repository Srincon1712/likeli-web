import type { ClientPortal, PortalPlanId } from "@/types/likeliPortalOutput";

export const mockClients: ClientPortal[] = [
  {
    id: "mock-refugio-del-oso",
    source: "mock",
    clientName: "Refugio del Oso",
    clientSlug: "refugio-del-oso",
    businessType: "Glamping / turismo de naturaleza",
    activePlan: "signals-pro",
    accessKey: "lk_8f3Kx92LmQp7",
    lastUpdate: "2026-06-01",
    nextPaymentAt: "2026-06-30",
    billingDueInDays: 18,
    status: "active",
    generatedOutput: {
      nextFocus: "Convertir interes en reservas usando ideas con alta claridad visual.",
      sampleIdeas: [
        "Antes y despues de llegar al refugio",
        "Tres momentos que hacen que una noche se sienta premium",
        "Que empacar para una escapada de dos dias",
      ],
    },
  },
  {
    id: "mock-canelo-hub",
    source: "mock",
    clientName: "Canelo Hub",
    clientSlug: "canelo-hub",
    businessType: "Restaurante / cafe",
    activePlan: "signals",
    accessKey: "lk_demoSignals",
    lastUpdate: "2026-06-03",
    nextPaymentAt: "2026-06-24",
    billingDueInDays: 12,
    status: "active",
    generatedOutput: null,
  },
  {
    id: "mock-norte-studio",
    source: "mock",
    clientName: "Norte Studio",
    clientSlug: "norte-studio",
    businessType: "Marca de servicios creativos",
    activePlan: "signals-elite",
    accessKey: "lk_demoElite",
    lastUpdate: "2026-06-05",
    nextPaymentAt: "2026-06-19",
    billingDueInDays: 7,
    status: "review",
    generatedOutput: {
      nextFocus: "Empaquetar conocimiento experto en piezas cortas y repetibles.",
      sampleIdeas: [
        "Errores invisibles que bajan la conversion",
        "Como se ve un sistema visual antes de escalar",
        "Diagnostico rapido de una cuenta en 45 segundos",
      ],
    },
  },
];

export const localPortalsStorageKey = "likeli.localPortals";
export const localPortalOutputsStorageKey = "likeli.localPortalOutputs";

export function slugifyClientName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function getPortalStableId(portal: ClientPortal) {
  return portal.id || `${portal.clientSlug}:${portal.accessKey}`;
}

export function createLocalPortalSeed(input: {
  clientName: string;
  businessType: string;
  clientSlug: string;
  activePlan: PortalPlanId;
  status: string;
  lastPaymentAt?: string;
}): ClientPortal {
  const slug = slugifyClientName(input.clientSlug || input.clientName);
  return {
    id: `local-${slug}-${Date.now()}`,
    source: "local",
    clientName: input.clientName,
    businessType: input.businessType,
    clientSlug: slug,
    activePlan: input.activePlan,
    accessKey: `lk_${Math.random().toString(36).slice(2, 10)}`,
    lastUpdate: new Date().toISOString().slice(0, 10),
    nextPaymentAt: "",
    billingDueInDays: 30,
    status: input.status || "active",
    generatedOutput: null,
  };
}
