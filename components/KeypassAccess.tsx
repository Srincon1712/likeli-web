"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { findPortalByAccessKey } from "@/lib/portalStorage";

export function KeypassAccess() {
  const [accessKey, setAccessKey] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const portal = findPortalByAccessKey(accessKey.trim());
    if (!portal) {
      setError("Keypass no valido o portal no disponible.");
      return;
    }
    window.location.href = `/portal/${portal.clientSlug}/${portal.accessKey}`;
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
