const principles = [
  {
    label: "01",
    title: "Claridad antes que intuición",
    copy: "Cada recomendación explica qué publicar, por qué importa y cómo llevar una idea a contenido accionable.",
  },
  {
    label: "02",
    title: "Sistema antes que piezas sueltas",
    copy: "Ideas, hooks, captions, CTAs, guiones y calendario funcionan como una misma arquitectura de contenido.",
  },
  {
    label: "03",
    title: "Velocidad con criterio",
    copy: "El sistema ayuda a avanzar rápido, pero con una estructura sobria, legible y preparada para aprender.",
  },
  {
    label: "04",
    title: "Inteligencia acumulativa",
    copy: "La marca aprende de patrones, casos, reseñas y resultados para decidir mejor el siguiente contenido.",
  },
];

const plans = [
  {
    tag: "Signals",
    title: "Inteligencia base",
    description: "Base para negocios que crean su propio contenido y necesitan saber qué publicar.",
    price: "199.000 COP / mes",
    items: ["20 ideas", "20 hooks", "20 captions", "20 CTAs", "Tendencias y oportunidades"],
  },
  {
    tag: "Pro",
    title: "Validación de potencial",
    description: "Sistema para descubrir qué publicar y validar cuáles ideas tienen mayor potencial.",
    price: "599.000 COP / mes",
    items: ["30 ideas", "12 guiones", "Predicción", "Puntuación Likeli", "Benchmark"],
  },
  {
    tag: "Elite",
    title: "Ejecución acelerada",
    description: "Inteligencia avanzada con apoyo operativo para acelerar la ejecución del contenido.",
    price: "1.199.000 COP / mes",
    items: ["40 ideas", "16 guiones", "8 revisiones", "10 videos editados", "Recursos avanzados"],
  },
  {
    tag: "Custom",
    title: "Portal a medida",
    description: "Para operaciones turísticas con necesidades específicas de inteligencia, recursos o investigación.",
    price: "A medida",
    items: ["Alcance definido", "Sistema adaptable", "Prioridades por etapa", "Dirección estratégica", "Portal personalizado"],
  },
];

const reviews = [
  {
    quote: "Sentí que ya conocía el lugar antes de llegar.",
    name: "Trust signal",
  },
  {
    quote: "Me convenció porque se veía real, no como publicidad.",
    name: "Emotional proof",
  },
];

const faqs = [
  {
    question: "¿Likeli trabaja solo con alojamientos?",
    answer:
      "No. Likeli está enfocado en turismo y experiencias: alojamientos, glampings, cabañas, fincas, tours, gastronomía, aventura y bienestar.",
  },
  {
    question: "¿Qué entrega Likeli?",
    answer:
      "Entrega ideas, hooks, captions, CTAs, guiones, scores, predicciones, calendarios recomendados, casos, benchmarks y recursos según el plan.",
  },
  {
    question: "¿Likeli promete viralidad?",
    answer:
      "No. Likeli reduce incertidumbre y ayuda a tomar mejores decisiones de contenido, pero no promete resultados garantizados.",
  },
  {
    question: "¿Necesito producir todo desde cero?",
    answer:
      "No. El sistema puede partir del contexto del negocio, contenido existente, referentes, tendencias y casos de industria.",
  },
];

const whatsappLink = "https://wa.link/7d8vtc";

export default function Benefits() {
  return (
    <>
      <section id="sistema" className="section border-b hairline">
        <div className="lk-container">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="section-head lg:sticky lg:top-28">
              <span className="eyebrow">Sistema / metodología</span>
              <h2 className="title">No hacemos contenido aislado. Construimos inteligencia de contenido.</h2>
              <p className="lead">
                Likeli ordena los puntos que normalmente viven desconectados: ideas, formatos, hooks, reseñas, casos y
                calendario. El resultado es una estrategia más clara, priorizada y accionable.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {principles.map((principle) => (
                <article key={principle.label} className="panel panel-hover p-6">
                  <span className="mono text-xs text-accent">{principle.label}</span>
                  <h3 className="mt-5 text-2xl leading-tight">{principle.title}</h3>
                  <p className="copy mt-4">{principle.copy}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-2">
            <article className="panel-muted p-7 md:p-8">
              <span className="section-kicker">Problema</span>
              <h3 className="mt-5 text-3xl leading-tight">Un buen negocio turístico puede publicar mucho sin aprender lo suficiente.</h3>
              <p className="copy mt-5">
                Ideas sueltas, formatos elegidos por intuición, hooks débiles y aprendizajes dispersos crean fricción
                donde deberia haber claridad.
              </p>
            </article>
            <article className="panel-muted p-7 md:p-8">
              <span className="section-kicker">Solución</span>
              <h3 className="mt-5 text-3xl leading-tight">Una capa de inteligencia integrada, clara y accionable.</h3>
              <p className="copy mt-5">
                Organizamos cada señal de contenido como parte de un mismo sistema: útil para decidir, manejable para operar
                y consistente para la marca.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="planes" className="section border-b hairline">
        <div className="lk-container">
          <div className="grid gap-6 md:grid-cols-[1fr_0.72fr] md:items-end">
            <div className="section-head">
              <span className="eyebrow">Planes / inteligencia</span>
              <h2 className="title">Elige el nivel de estructura que necesita tu operación.</h2>
            </div>
            <p className="copy md:pb-2">
              Todos los planes comparten la misma lógica: menos incertidumbre, más claridad de contenido y un sistema que
              pueda aprender en el tiempo.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => (
              <article key={plan.tag} className="panel panel-hover flex min-h-110 flex-col p-6">
                <span className="section-kicker">{plan.tag}</span>
                <h3 className="mt-5 text-2xl leading-tight">{plan.title}</h3>
                <p className="copy mt-4">{plan.description}</p>
                <p className="mt-6 border-y hairline py-4 text-2xl font-semibold leading-tight text-lk-beige">{plan.price}</p>
                <ul className="mt-6 grid gap-3">
                  {plan.items.map((item) => (
                    <li key={item} className="grid grid-cols-[10px_1fr] gap-3 mono text-xs leading-6 text-muted">
                      <span className="mt-2 h-px w-2 bg-lk-red-bright" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary mt-auto w-full">
                  Elegir plan
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="clientes" className="section-tight border-b hairline">
        <div className="lk-container">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <div className="section-head">
              <span className="eyebrow">Clientes / señal real</span>
              <h2 className="title">Las reseñas también alimentan el sistema.</h2>
            </div>

            <div className="grid gap-4">
              {reviews.map((review) => (
                <article key={review.name} className="panel-muted p-6 md:p-7">
                  <p className="text-xl leading-8 text-lk-beige">“{review.quote}”</p>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t hairline pt-4 mono text-xs uppercase tracking-[0.12em] text-faint">
                    <strong className="font-semibold text-lk-gray-light">{review.name}</strong>
                    <span>Cliente Likeli</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="section-tight">
        <div className="lk-container grid gap-10 lg:grid-cols-[0.76fr_1.24fr]">
          <aside className="section-head h-fit lg:sticky lg:top-28">
            <span className="eyebrow">FAQ / precisión</span>
            <h2 className="title">Preguntas frecuentes</h2>
            <p className="lead">
              Lo esencial para entender cómo funciona Likeli, qué incluye el proceso y cómo se adapta al ritmo de un
              negocio turístico real.
            </p>
          </aside>

          <div className="grid gap-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="group panel-muted p-5 md:p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold leading-tight text-lk-beige">
                  {faq.question}
                  <span className="mono text-lg font-normal text-accent transition group-open:rotate-45">+</span>
                </summary>
                <p className="copy mt-4 max-w-3xl">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
