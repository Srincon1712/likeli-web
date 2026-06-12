"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPlan, planOrder, plans } from "@/data/plans";
import { readAndValidateLikeliPortalOutput } from "@/lib/likeli-output/importLikeliPortalOutput";
import type { ClientPortal, PortalPlanId } from "@/types/likeliPortalOutput";

type ImportState = {
  rawInput: string;
  status: "idle" | "valid" | "error";
  errors: string[];
  warnings: string[];
  preview: ReturnType<typeof readAndValidateLikeliPortalOutput>["preview"];
  output: ReturnType<typeof readAndValidateLikeliPortalOutput>["output"];
};

const initialImport: ImportState = { rawInput: "", status: "idle", errors: [], warnings: [], preview: null, output: null };

export function AdminApp() {
  const [portals, setPortals] = useState<ClientPortal[]>([]);
  const [notice, setNotice] = useState("");
  const [pendingImport, setPendingImport] = useState<ClientPortal | null>(null);
  const [importState, setImportState] = useState<ImportState>(initialImport);

  async function refresh() {
    try {
      const response = await fetch("/api/portals", { cache: "no-store" });
      if (!response.ok) throw new Error("No se pudieron cargar los portales.");
      const data = await response.json() as { portals: ClientPortal[] };
      setPortals(data.portals || []);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No se pudieron cargar los portales.");
      setPortals([]);
    }
  }

  useEffect(() => {
    const handle = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(handle);
  }, []);

  async function createPortal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/portals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(formData.get("clientName") || "").trim(),
        clientName: String(formData.get("clientName") || "").trim(),
        businessType: String(formData.get("businessType") || "").trim(),
        activePlan: String(formData.get("activePlan") || "signals") as PortalPlanId,
        status: "active",
      }),
    });

    const data = await response.json() as { portal?: ClientPortal; error?: string };
    if (!response.ok || !data.portal) {
      setNotice(data.error || "No se pudo crear el portal.");
      return;
    }

    form.reset();
    setNotice(`Portal creado. Slug: ${data.portal.clientSlug}`);
    await refresh();
  }

  function readImport(rawInput: string) {
    if (!pendingImport) return;
    try {
      const result = readAndValidateLikeliPortalOutput(rawInput, pendingImport.activePlan);
      setImportState({
        rawInput,
        status: result.ok ? "valid" : "error",
        errors: result.errors,
        warnings: result.warnings,
        preview: result.preview,
        output: result.output,
      });
    } catch (error) {
      setImportState({
        rawInput,
        status: "error",
        errors: [error instanceof Error ? error.message : "No se pudo leer el JSON."],
        warnings: [],
        preview: null,
        output: null,
      });
    }
  }

  async function loadFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/\.(json|txt)$/i.test(file.name) || file.size > 2 * 1024 * 1024) {
      setImportState({ ...initialImport, status: "error", errors: ["Solo se permiten archivos .json o .txt de maximo 2 MB."] });
      return;
    }
    readImport(await file.text());
  }

  async function saveImport() {
    if (!pendingImport || !importState.output || importState.status !== "valid") return;
    const response = await fetch(`/api/portals/${encodeURIComponent(pendingImport.clientSlug)}/output`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ output: importState.output, portalPlanId: pendingImport.activePlan }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "No se pudo guardar el output." })) as { error?: string };
      setNotice(data.error || "No se pudo guardar el output.");
      return;
    }

    setNotice("Output importado correctamente.");
    setPendingImport(null);
    setImportState(initialImport);
    await refresh();
  }

  async function togglePortalStatus(portal: ClientPortal) {
    const nextStatus = portal.status === "active" ? "inactive" : "active";
    const response = await fetch(`/api/portals/${encodeURIComponent(portal.clientSlug)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "No se pudo cambiar el estado." })) as { error?: string };
      setNotice(data.error || "No se pudo cambiar el estado.");
      return;
    }

    setNotice(nextStatus === "active" ? "Portal activado." : "Portal desactivado.");
    await refresh();
  }

  async function removePortal(portal: ClientPortal) {
    const response = await fetch(`/api/portals/${encodeURIComponent(portal.clientSlug)}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "No se pudo eliminar el portal." })) as { error?: string };
      setNotice(data.error || "No se pudo eliminar el portal.");
      return;
    }

    setNotice("Portal eliminado.");
    await refresh();
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <Image src="/brand/likeli-white-transparent.png" width={112} height={40} alt="Likeli" priority />
          <p className="eyebrow">Admin</p>
          <h1>Likeli Portal</h1>
        </div>
        <Link className="button ghost" href="/portal">Ver acceso cliente</Link>
      </header>

      {notice && <div className="notice">{notice}</div>}

      <section className="admin-grid">
        <article className="admin-panel">
          <h2>Crear portal</h2>
          <form className="admin-form" onSubmit={createPortal}>
            <input name="clientName" placeholder="Nombre del cliente" required />
            <input name="businessType" placeholder="Tipo de negocio" required />
            <select name="activePlan" defaultValue="signals">
              {planOrder.map((planId) => <option value={planId} key={planId}>{plans[planId].name}</option>)}
            </select>
            <button className="button" type="submit">Crear portal</button>
          </form>
        </article>

        <article className="admin-panel wide">
          <h2>Portales</h2>
          <div className="portal-list">
            {portals.map((portal) => {
              const plan = getPlan(portal.activePlan);
              const portalId = portal.id || `${portal.clientSlug}:${portal.accessKey}`;
              return (
                <div className="portal-row" key={portalId}>
                  <div>
                    <strong>{portal.clientName}</strong>
                    <span>{portal.businessType}</span>
                    <code>/portal/{portal.clientSlug}/{portal.accessKey}</code>
                  </div>
                  <span className="pill">{plan.name}</span>
                  <span className="pill muted">{portal.status === "active" ? "Activo" : portal.status === "inactive" ? "Inactivo" : portal.status}</span>
                  <button className="button ghost" type="button" onClick={() => { setPendingImport(portal); setImportState(initialImport); }}>Importar JSON</button>
                  {portal.source === "local" && (
                    <button className="button ghost" type="button" onClick={() => void togglePortalStatus(portal)}>
                      {portal.status === "active" ? "Desactivar" : "Activar"}
                    </button>
                  )}
                  {portal.source === "local" && <button className="button danger" type="button" onClick={() => void removePortal(portal)}>Eliminar</button>}
                </div>
              );
            })}
          </div>
        </article>
      </section>

      {pendingImport && (
        <section className="modal-backdrop">
          <article className="import-modal">
            <header>
              <div>
                <p className="eyebrow">Importar output</p>
                <h2>{pendingImport.clientName}</h2>
              </div>
              <button className="icon-button" type="button" onClick={() => setPendingImport(null)}>x</button>
            </header>
            <textarea
              value={importState.rawInput}
              onChange={(event) => setImportState({ ...importState, rawInput: event.target.value, status: "idle" })}
              placeholder="Pega aqui el JSON LIKELI_CLIENT_PORTAL_OUTPUT"
            />
            <input type="file" accept=".json,.txt,application/json,text/plain" onChange={loadFile} />
            <div className="modal-actions">
              <button className="button ghost" type="button" onClick={() => readImport(importState.rawInput)}>Validar</button>
              <button className="button" type="button" disabled={importState.status !== "valid"} onClick={saveImport}>Guardar output</button>
            </div>
            {importState.status === "valid" && importState.preview && (
              <div className="import-preview">
                <strong>Output valido</strong>
                <span>{importState.preview.clientName} · {importState.preview.outputPlanLabel || importState.preview.outputPlanId}</span>
              </div>
            )}
            {importState.errors.length > 0 && <ul className="form-error">{importState.errors.map((error) => <li key={error}>{error}</li>)}</ul>}
            {importState.warnings.length > 0 && <ul className="warning-list">{importState.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>}
          </article>
        </section>
      )}
    </main>
  );
}
