"use client";

import { createLocalPortalSeed, getPortalStableId, localPortalOutputsStorageKey, localPortalsStorageKey, mockClients } from "@/data/portalData";
import type { ClientPortal, LikeliClientPortalOutput, PortalPlanId, StoredLikeliOutput } from "@/types/likeliPortalOutput";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function readLocalPortals() {
  return readJson<ClientPortal[]>(localPortalsStorageKey, []);
}

export function writeLocalPortals(portals: ClientPortal[]) {
  writeJson(localPortalsStorageKey, portals);
}

export function readLocalPortalOutputs() {
  return readJson<Record<string, StoredLikeliOutput>>(localPortalOutputsStorageKey, {});
}

export function writeLocalPortalOutputs(outputs: Record<string, StoredLikeliOutput>) {
  writeJson(localPortalOutputsStorageKey, outputs);
}

export function getLocalPortalOutput(portal: ClientPortal) {
  return readLocalPortalOutputs()[getPortalStableId(portal)] || null;
}

export function saveLocalPortalOutput(portal: ClientPortal, output: LikeliClientPortalOutput, portalPlanId: PortalPlanId) {
  const outputs = readLocalPortalOutputs();
  outputs[getPortalStableId(portal)] = {
    outputType: "LIKELI_CLIENT_PORTAL_OUTPUT",
    importedAt: new Date().toISOString(),
    version: String(output.meta?.version || "1.0"),
    portalPlanId,
    output,
  };
  writeLocalPortalOutputs(outputs);
}

export function getAllClientPortals() {
  const local = readLocalPortals();
  return [...mockClients, ...local].map((portal) => ({ ...portal, likeliOutput: getLocalPortalOutput(portal) }));
}

export function findPortalByAccessKey(accessKey: string) {
  return getAllClientPortals().find((portal) => portal.accessKey === accessKey) || null;
}

export function findPortalByRoute(clientSlug: string, accessKey: string) {
  return getAllClientPortals().find((portal) => portal.clientSlug === clientSlug && portal.accessKey === accessKey) || null;
}

export function createLocalPortal(input: Parameters<typeof createLocalPortalSeed>[0]) {
  const portal = createLocalPortalSeed(input);
  writeLocalPortals([...readLocalPortals(), portal]);
  return portal;
}

export function deleteLocalPortal(portalId: string) {
  const nextPortals = readLocalPortals().filter((portal) => getPortalStableId(portal) !== portalId);
  writeLocalPortals(nextPortals);
  const outputs = readLocalPortalOutputs();
  delete outputs[portalId];
  writeLocalPortalOutputs(outputs);
}
