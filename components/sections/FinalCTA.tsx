import Button from "@/components/ui/Button";

const whatsappLink = "https://wa.link/jyx9l0";

export default function FinalCTA() {
  return (
    <section id="demo" className="section-tight">
      <div className="lk-container">
        <div className="final-cta">
          <div className="hero-light hero-light-red" />
          <span className="eyebrow">Next signal</span>
          <h2 className="mt-7 max-w-4xl text-5xl font-bold leading-[0.95] md:text-7xl">
            Decide mejor qué publicar.
          </h2>
          <p className="lead mt-6 max-w-2xl">
            Una primera lectura de tu negocio puede mostrar qué tipo de contenido deberías crear, qué oportunidades estás dejando pasar y cómo organizar tu estrategia con más claridad.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={whatsappLink} target="_blank" rel="noopener noreferrer">Analizar mi negocio</Button>
            <Button href="/portal" variant="secondary">
              Portal
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
