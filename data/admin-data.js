window.LikeliPortal = window.LikeliPortal || {};

const localPortalStorageKey = "likeli.localClientPortals";
const localCaseLinksStorageKey = "likeli.localCaseLinks";
const localPortalOutputsStorageKey = "likeli.localPortalOutputs";

const planTemplateClients = {
  signals: {
    clientName: "Plantilla Signals",
    clientSlug: "template-signals",
    businessType: "Vista interna de plantilla",
    activePlan: "signals",
    accessKey: "template_signals",
    lastUpdate: "2026-06-11",
    nextUpdate: "2026-07-11",
    lastPaymentAt: "2026-06-11",
    nextPaymentAt: "2026-07-11",
    billingDueInDays: 18,
    status: "active",
    generatedOutput: {
      evidenceLevel: "demo",
      winningAngles: ["Claridad editorial", "Contenido rapido", "Senales accionables"],
      nextFocus: "Mostrar el alcance base del portal para clientes Signals.",
      sampleIdeas: ["Ideas base", "Hooks base", "CTAs base"],
    },
  },
  "signals-pro": {
    clientName: "Plantilla Signals Pro",
    clientSlug: "template-signals-pro",
    businessType: "Vista interna de plantilla",
    activePlan: "signals-pro",
    accessKey: "template_signals_pro",
    lastUpdate: "2026-06-11",
    nextUpdate: "2026-07-11",
    lastPaymentAt: "2026-06-11",
    nextPaymentAt: "2026-07-11",
    billingDueInDays: 18,
    status: "active",
    generatedOutput: {
      evidenceLevel: "demo",
      winningAngles: ["Priorizacion", "Guiones enriquecidos", "Benchmark"],
      nextFocus: "Mostrar los flujos avanzados disponibles desde Signals Pro.",
      sampleIdeas: ["Guiones", "Calendario", "Roadmap"],
    },
  },
  "signals-elite": {
    clientName: "Plantilla Signals Elite",
    clientSlug: "template-signals-elite",
    businessType: "Vista interna de plantilla",
    activePlan: "signals-elite",
    accessKey: "template_signals_elite",
    lastUpdate: "2026-06-11",
    nextUpdate: "2026-07-11",
    lastPaymentAt: "2026-06-11",
    nextPaymentAt: "2026-07-11",
    billingDueInDays: 18,
    status: "active",
    generatedOutput: {
      evidenceLevel: "demo",
      winningAngles: ["Recursos avanzados", "Ejecucion acelerada", "Sistema completo"],
      nextFocus: "Mostrar el alcance mas alto de recursos internos de Likeli.",
      sampleIdeas: ["Recursos avanzados", "Frameworks", "Investigacion ampliada"],
    },
  },
};

const planTemplates = Object.fromEntries(
  Object.entries(planTemplateClients).map(([planId, templateClient]) => [
    planId,
    {
      planId,
      templateClient,
      source: "plan-template",
    },
  ]),
);

function getTemplateByPlan(planId) {
  return planTemplates[planId] || planTemplates.signals;
}

function readLocalPortals() {
  try {
    const rawValue = window.localStorage?.getItem(localPortalStorageKey);
    const parsed = rawValue ? JSON.parse(rawValue) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeLocalPortals(portals) {
  try {
    window.localStorage?.setItem(localPortalStorageKey, JSON.stringify(portals));
  } catch (error) {
    // Local persistence is best-effort until Admin is connected to a backend.
  }
}

function readLocalCaseLinks() {
  try {
    const rawValue = window.localStorage?.getItem(localCaseLinksStorageKey);
    const parsed = rawValue ? JSON.parse(rawValue) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (error) {
    return {};
  }
}

function writeLocalCaseLinks(caseLinks) {
  try {
    window.localStorage?.setItem(localCaseLinksStorageKey, JSON.stringify(caseLinks));
  } catch (error) {
    // Local persistence is best-effort until Admin is connected to a backend.
  }
}

function readLocalPortalOutputs() {
  try {
    const rawValue = window.localStorage?.getItem(localPortalOutputsStorageKey);
    const parsed = rawValue ? JSON.parse(rawValue) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (error) {
    return {};
  }
}

function writeLocalPortalOutputs(outputs) {
  try {
    window.localStorage?.setItem(localPortalOutputsStorageKey, JSON.stringify(outputs));
  } catch (error) {
    // Local persistence is best-effort until Admin is connected to a backend.
  }
}

function getPortalStableId(portal) {
  return portal?.id || `${portal?.clientSlug || "portal"}:${portal?.accessKey || "access"}`;
}

function getLocalPortalOutput(portal) {
  const outputs = readLocalPortalOutputs();
  return outputs[getPortalStableId(portal)] || null;
}

function saveLocalPortalOutput(portalId, output, portalPlanId) {
  const outputs = readLocalPortalOutputs();
  const now = new Date().toISOString();

  outputs[portalId] = {
    output,
    outputType: output?.meta?.outputType || "LIKELI_CLIENT_PORTAL_OUTPUT",
    version: output?.meta?.version || "1.0",
    planId: output?.plan?.id || "",
    portalPlanId,
    importedAt: now,
    updatedAt: now,
  };

  writeLocalPortalOutputs(outputs);
  return outputs[portalId];
}

function mergePortalOutput(portal) {
  return {
    ...portal,
    likeliOutput: getLocalPortalOutput(portal),
  };
}

function getLibraryCaseUrl(caseId, fallbackUrl = "") {
  const caseLinks = readLocalCaseLinks();
  return caseLinks[caseId] || fallbackUrl || "";
}

function setLibraryCaseUrl(caseId, url) {
  const cleanUrl = String(url || "").trim();
  const caseLinks = readLocalCaseLinks();

  if (!cleanUrl) {
    delete caseLinks[caseId];
  } else {
    caseLinks[caseId] = cleanUrl;
  }

  writeLocalCaseLinks(caseLinks);
  return caseLinks;
}

function getAllClientPortals() {
  const demoPortals = (window.LikeliPortal.mockClients || []).map((portal) => ({
    ...portal,
    source: "demo",
  })).map(mergePortalOutput);
  const localPortals = readLocalPortals().map((portal) => ({
    ...portal,
    source: "local",
  })).map(mergePortalOutput);

  return [...demoPortals, ...localPortals];
}

function findPortalByAccessKey(accessKey) {
  const normalizedKey = String(accessKey || "").trim();

  return getAllClientPortals().find(
    (portal) => portal.accessKey === normalizedKey && portal.status === "active",
  );
}

function slugifyClientName(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 54);
}

function generateAccessKey() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const randomValues = new Uint32Array(12);

  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(randomValues);
  } else {
    randomValues.forEach((_, index) => {
      randomValues[index] = Math.floor(Math.random() * alphabet.length);
    });
  }

  return `lk_${Array.from(randomValues, (value) => alphabet[value % alphabet.length]).join("")}`;
}

function addOneMonth(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  date.setMonth(date.getMonth() + 1);
  return date.toISOString().slice(0, 10);
}

function calculateBillingDueInDays(nextPaymentAt) {
  const nextPayment = new Date(`${nextPaymentAt}T00:00:00`);

  if (Number.isNaN(nextPayment.getTime())) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = nextPayment.getTime() - today.getTime();
  return Math.ceil(diff / 86400000);
}

function createLocalPortal(payload) {
  const today = new Date().toISOString().slice(0, 10);
  const lastPaymentAt = payload.lastPaymentAt || today;
  const nextPaymentAt = addOneMonth(lastPaymentAt);
  const billingDueInDays = calculateBillingDueInDays(nextPaymentAt);
  const portal = {
    id: `portal_${Date.now()}`,
    source: "local",
    clientName: payload.clientName,
    businessType: payload.businessType,
    clientSlug: payload.clientSlug,
    accessKey: generateAccessKey(),
    activePlan: payload.activePlan,
    status: payload.status || "active",
    lastUpdate: today,
    nextUpdate: payload.nextUpdate || today,
    lastPaymentAt,
    nextPaymentAt,
    billingDueInDays,
    createdAt: today,
    generatedOutput: {
      evidenceLevel: "local",
      winningAngles: ["Mock local", "Portal preparado", "Datos editables despues"],
      nextFocus: `Preparar inteligencia inicial para ${payload.businessType}.`,
      sampleIdeas: ["Idea mock 01", "Idea mock 02", "Idea mock 03"],
    },
  };
  const portals = readLocalPortals();
  writeLocalPortals([portal, ...portals]);
  return portal;
}

function deleteLocalPortal(portalId) {
  const portals = readLocalPortals();
  const nextPortals = portals.filter((portal) => portal.id !== portalId);
  writeLocalPortals(nextPortals);
  return nextPortals.length !== portals.length;
}

window.LikeliPortal.localPortalStorageKey = localPortalStorageKey;
window.LikeliPortal.localCaseLinksStorageKey = localCaseLinksStorageKey;
window.LikeliPortal.localPortalOutputsStorageKey = localPortalOutputsStorageKey;
window.LikeliPortal.planTemplates = planTemplates;
window.LikeliPortal.planTemplateClients = planTemplateClients;
window.LikeliPortal.getTemplateByPlan = getTemplateByPlan;
window.LikeliPortal.readLocalPortals = readLocalPortals;
window.LikeliPortal.writeLocalPortals = writeLocalPortals;
window.LikeliPortal.readLocalCaseLinks = readLocalCaseLinks;
window.LikeliPortal.writeLocalCaseLinks = writeLocalCaseLinks;
window.LikeliPortal.readLocalPortalOutputs = readLocalPortalOutputs;
window.LikeliPortal.writeLocalPortalOutputs = writeLocalPortalOutputs;
window.LikeliPortal.getPortalStableId = getPortalStableId;
window.LikeliPortal.getLocalPortalOutput = getLocalPortalOutput;
window.LikeliPortal.saveLocalPortalOutput = saveLocalPortalOutput;
window.LikeliPortal.getLibraryCaseUrl = getLibraryCaseUrl;
window.LikeliPortal.setLibraryCaseUrl = setLibraryCaseUrl;
window.LikeliPortal.getAllClientPortals = getAllClientPortals;
window.LikeliPortal.findPortalByAccessKey = findPortalByAccessKey;
window.LikeliPortal.slugifyClientName = slugifyClientName;
window.LikeliPortal.generateAccessKey = generateAccessKey;
window.LikeliPortal.createLocalPortal = createLocalPortal;
window.LikeliPortal.deleteLocalPortal = deleteLocalPortal;
window.LikeliPortal.addOneMonth = addOneMonth;
window.LikeliPortal.calculateBillingDueInDays = calculateBillingDueInDays;
