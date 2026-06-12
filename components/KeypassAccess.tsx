"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import type { ClientPortal } from "@/types/likeliPortalOutput";

export function KeypassAccess() {
  const [accessKey, setAccessKey] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const response = await fetch(`/api/portals?accessKey=${encodeURIComponent(accessKey.trim())}`, { cache: "no-store" });
    const data = await response.json().catch(() => ({})) as { portal?: ClientPortal; error?: string };

    if (response.status === 403) {
      setError("Portal inactivo. Este portal no esta disponible actualmente.");
      return;
    }

    if (!response.ok || !data.portal) {
      setError("Keypass no valido o portal no disponible.");
      return;
    }

    window.location.href = `/portal/${data.portal.clientSlug}/${data.portal.accessKey}`;
  }

  return (
    <main className="center-screen">
      <section className="access-card">
        <Image src="/brand/likeli-white-transparent.png" width={132} height={48} alt="Likeli" priority />
        <h1>Bienvenido al portal de cliente</h1>
        <form className="keypass-form" onSubmit={submit}>
          <label>
            <span>Keypass</span>
            <input value={accessKey} onChange={(event) => setAccessKey(event.target.value)} autoComplete="off" required />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="button" type="submit">Entrar al portal</button>
        </form>
      </section>
    </main>
  );
}
