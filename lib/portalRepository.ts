import { mkdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { mockClients } from "@/data/portalData";
import type { ClientPortal, LikeliClientPortalOutput, PortalPlanId, StoredLikeliOutput } from "@/types/likeliPortalOutput";

export type PortalStatus = "active" | "inactive";

export interface StoredPortal {
  id: string;
  slug: string;
  name: string;
  clientName?: string;
  plan?: string;
  status: PortalStatus;
  lastPaymentDate?: string;
  createdAt: string;
  updatedAt: string;
  businessType?: string;
  activePlan?: PortalPlanId;
  accessKey?: string;
  nextPaymentAt?: string;
  billingDueInDays?: number;
}

export type CreatePortalInput = {
  name: string;
  clientName?: string;
  businessType?: string;
  plan?: string;
  activePlan?: PortalPlanId;
  status?: PortalStatus;
  lastPaymentDate?: string;
};

export type UpdatePortalInput = Partial<Omit<CreatePortalInput, "status">> & {
  status?: PortalStatus;
  nextPaymentAt?: string;
  billingDueInDays?: number;
};

const dataDir = path.join(process.cwd(), "data");
const portalsFile = path.join(dataDir, "portals.json");
const outputsDir = path.join(dataDir, "portal-outputs");
const validStatuses = new Set<PortalStatus>(["active", "inactive"]);
const validPlans = new Set<PortalPlanId>(["signals", "signals-pro", "signals-elite"]);

export async function getPortals(options: { includeMocks?: boolean; includeOutputs?: boolean } = {}) {
  const { includeMocks = true, includeOutputs = true } = options;
  const stored = await readStoredPortals();
  const storedClients = await Promise.all(stored.map((portal) => toClientPortal(portal, includeOutputs)));
  const mockClientPortals = includeMocks ? await Promise.all(mockClients.map((portal) => withPortalOutput(portal, includeOutputs))) : [];
  return [...storedClients, ...mockClientPortals];
}

export async function getPortalBySlug(slug: string, options: { includeMocks?: boolean; includeOutputs?: boolean } = {}) {
  const normalizedSlug = slugifyPortalName(slug);
  const stored = await readStoredPortals();
  const portal = stored.find((entry) => entry.slug === normalizedSlug);
  if (portal) return toClientPortal(portal, options.includeOutputs ?? true);

  if (options.includeMocks === false) return null;
  const mockPortal = mockClients.find((entry) => entry.clientSlug === normalizedSlug);
  return mockPortal ? withPortalOutput(mockPortal, options.includeOutputs ?? true) : null;
}

export async function getPortalByRoute(slug: string, accessKey: string) {
  const portal = await getPortalBySlug(slug, { includeMocks: true, includeOutputs: true });
  return portal?.accessKey === accessKey ? portal : null;
}

export async function getPortalByAccessKey(accessKey: string) {
  const normalizedKey = accessKey.trim();
  const portals = await getPortals({ includeMocks: true, includeOutputs: false });
  return portals.find((portal) => portal.accessKey === normalizedKey) || null;
}

export async function createPortal(input: CreatePortalInput) {
  const portals = await readStoredPortals();
  const now = new Date().toISOString();
  const name = cleanRequiredText(input.name || input.clientName, "name");
  const slug = uniqueSlug(slugifyPortalName(name), portals);
  const activePlan = normalizePlan(input.activePlan || input.plan);
  const portal: StoredPortal = {
    id: slug,
    slug,
    name,
    clientName: input.clientName?.trim() || name,
    businessType: input.businessType?.trim() || "",
    plan: activePlan,
    activePlan,
    status: normalizeStatus(input.status || "active"),
    lastPaymentDate: normalizeOptionalText(input.lastPaymentDate),
    accessKey: generateAccessKey(),
    createdAt: now,
    updatedAt: now,
    billingDueInDays: 30,
  };

  await writeStoredPortals([portal, ...portals]);
  return toClientPortal(portal, true);
}

export async function updatePortal(slug: string, input: UpdatePortalInput) {
  const normalizedSlug = slugifyPortalName(slug);
  const portals = await readStoredPortals();
  const index = portals.findIndex((portal) => portal.slug === normalizedSlug);
  if (index < 0) return null;

  const current = portals[index];
  const nextPlan = input.activePlan || input.plan;
  const next: StoredPortal = {
    ...current,
    name: input.name == null ? current.name : cleanRequiredText(input.name, "name"),
    clientName: input.clientName == null ? current.clientName : input.clientName.trim(),
    businessType: input.businessType == null ? current.businessType : input.businessType.trim(),
    plan: nextPlan == null ? current.plan : normalizePlan(nextPlan),
    activePlan: nextPlan == null ? current.activePlan : normalizePlan(nextPlan),
    status: input.status == null ? current.status : normalizeStatus(input.status),
    lastPaymentDate: input.lastPaymentDate == null ? current.lastPaymentDate : normalizeOptionalText(input.lastPaymentDate),
    nextPaymentAt: input.nextPaymentAt == null ? current.nextPaymentAt : normalizeOptionalText(input.nextPaymentAt),
    billingDueInDays: input.billingDueInDays == null ? current.billingDueInDays : input.billingDueInDays,
    updatedAt: new Date().toISOString(),
  };

  portals[index] = next;
  await writeStoredPortals(portals);
  return toClientPortal(next, true);
}

export async function setPortalStatus(slug: string, status: PortalStatus) {
  return updatePortal(slug, { status });
}

export async function deletePortal(slug: string) {
  const normalizedSlug = slugifyPortalName(slug);
  const portals = await readStoredPortals();
  const next = portals.filter((portal) => portal.slug !== normalizedSlug);
  if (next.length === portals.length) return false;

  await writeStoredPortals(next);
  await rm(portalOutputPath(normalizedSlug), { force: true });
  return true;
}

export async function getPortalOutput(slug: string) {
  await ensurePortalStore();
  try {
    const raw = await readFile(portalOutputPath(slug), "utf8");
    return JSON.parse(raw) as StoredLikeliOutput;
  } catch (error) {
    if (isMissingFileError(error)) return null;
    throw error;
  }
}

export async function savePortalOutput(slug: string, output: LikeliClientPortalOutput, portalPlanId: PortalPlanId) {
  const portal = await getPortalBySlug(slug, { includeMocks: true, includeOutputs: false });
  if (!portal) return null;
  const normalizedPlan = normalizePlan(portalPlanId);

  const stored: StoredLikeliOutput = {
    outputType: "LIKELI_CLIENT_PORTAL_OUTPUT",
    importedAt: new Date().toISOString(),
    version: String(output.meta?.version || "1.0"),
    portalPlanId: normalizedPlan,
    output,
  };

  await ensurePortalStore();
  await writeFile(portalOutputPath(slug), `${JSON.stringify(stored, null, 2)}\n`, "utf8");
  return stored;
}

export function slugifyPortalName(value: string) {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "portal";
}

async function readStoredPortals() {
  await ensurePortalStore();
  try {
    const raw = await readFile(portalsFile, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeStoredPortal).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (error) {
    if (!isMissingFileError(error)) throw error;
    await writeStoredPortals([]);
    return [];
  }
}

async function writeStoredPortals(portals: StoredPortal[]) {
  await ensurePortalStore();
  const ordered = [...portals].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  await writeFile(portalsFile, `${JSON.stringify(ordered, null, 2)}\n`, "utf8");
}

async function ensurePortalStore() {
  await mkdir(outputsDir, { recursive: true });
  await mkdir(dataDir, { recursive: true });
}

async function toClientPortal(portal: StoredPortal, includeOutput: boolean): Promise<ClientPortal> {
  const activePlan = normalizePlan(portal.activePlan || portal.plan);
  return {
    id: portal.id,
    source: "local",
    clientName: portal.clientName || portal.name,
    clientSlug: portal.slug,
    businessType: portal.businessType || "",
    activePlan,
    accessKey: portal.accessKey || `lk_${portal.slug}`,
    createdAt: portal.createdAt,
    lastPaymentDate: portal.lastPaymentDate,
    lastUpdate: (portal.updatedAt || portal.createdAt).slice(0, 10),
    nextPaymentAt: portal.nextPaymentAt || "",
    billingDueInDays: portal.billingDueInDays ?? 30,
    status: portal.status,
    generatedOutput: null,
    likeliOutput: includeOutput ? await getPortalOutput(portal.slug) : null,
  };
}

async function withPortalOutput(portal: ClientPortal, includeOutput: boolean): Promise<ClientPortal> {
  if (!includeOutput) return { ...portal, likeliOutput: portal.likeliOutput || null };
  return { ...portal, likeliOutput: await getPortalOutput(portal.clientSlug) };
}

function normalizeStoredPortal(value: Partial<StoredPortal>): StoredPortal {
  const name = cleanRequiredText(value.name || value.clientName || value.slug, "name");
  const slug = slugifyPortalName(value.slug || value.id || name);
  const now = new Date().toISOString();
  const activePlan = normalizePlan(value.activePlan || value.plan);
  return {
    id: value.id || slug,
    slug,
    name,
    clientName: value.clientName || name,
    businessType: value.businessType || "",
    plan: activePlan,
    activePlan,
    status: normalizeStatus(value.status || "active"),
    lastPaymentDate: normalizeOptionalText(value.lastPaymentDate),
    accessKey: value.accessKey || `lk_${slug}`,
    createdAt: value.createdAt || now,
    updatedAt: value.updatedAt || value.createdAt || now,
    nextPaymentAt: value.nextPaymentAt,
    billingDueInDays: value.billingDueInDays,
  };
}

function uniqueSlug(baseSlug: string, portals: StoredPortal[]) {
  const used = new Set(portals.map((portal) => portal.slug));
  if (!used.has(baseSlug)) return baseSlug;

  let suffix = 2;
  while (used.has(`${baseSlug}-${suffix}`)) suffix += 1;
  return `${baseSlug}-${suffix}`;
}

function cleanRequiredText(value: unknown, field: string) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) throw new Error(`${field} is required`);
  return text;
}

function normalizeOptionalText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normalizeStatus(status: unknown): PortalStatus {
  if (typeof status === "string" && validStatuses.has(status as PortalStatus)) return status as PortalStatus;
  throw new Error("Invalid portal status");
}

function normalizePlan(plan: unknown): PortalPlanId {
  if (typeof plan === "string" && validPlans.has(plan as PortalPlanId)) return plan as PortalPlanId;
  return "signals";
}

function generateAccessKey() {
  return `lk_${randomBytes(8).toString("base64url")}`;
}

function portalOutputPath(slug: string) {
  return path.join(outputsDir, `${slugifyPortalName(slug)}.json`);
}

function isMissingFileError(error: unknown) {
  return error && typeof error === "object" && "code" in error && error.code === "ENOENT";
}
