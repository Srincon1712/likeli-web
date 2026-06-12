const whatsappLink = "https://wa.link/7d8vtc";

export default function CTA() {
  return (
    <section className="section-tight">
      <div className="lk-container">
        <div className="panel grid gap-8 p-7 md:grid-cols-[1fr_auto] md:items-end md:p-9">
          <div className="max-w-3xl">
            <span className="eyebrow">Siguiente paso</span>
            <h2 className="mt-6 text-4xl leading-[0.98] md:text-5xl">
              Construyamos una estrategia de contenido con más claridad.
            </h2>
          </div>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Hablemos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
