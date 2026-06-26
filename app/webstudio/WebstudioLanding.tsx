"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  CircleDot,
  Clock3,
  Eye,
  Gauge,
  Layers3,
  MousePointer2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import styles from "./webstudio.module.css";

type CursorStyle = CSSProperties & {
  "--cursor-x": string;
  "--cursor-y": string;
};

const services = [
  {
    name: "Landing Express",
    price: "79.000 COP",
    eyebrow: "Entrada inteligente",
    description:
      "Una landing enfocada en presentarte con claridad, capturar interes y validar rapidamente una oferta sin invertir de mas.",
    features: [
      "Una pagina responsive",
      "Copy base y estructura comercial",
      "CTA directo a contacto",
      "Entrega agil para lanzar rapido",
    ],
    note: "Si luego compras un plan profesional, los 79.000 COP se descuentan completamente.",
  },
  {
    name: "Web Profesional",
    price: "649.000 COP",
    eyebrow: "Presencia completa",
    description:
      "Un sitio pulido para negocios que necesitan explicar, vender y transmitir confianza desde el primer scroll.",
    features: [
      "Arquitectura de contenido",
      "Diseno visual a medida",
      "Desarrollo responsive",
      "SEO tecnico basico",
    ],
  },
  {
    name: "Web Profesional Plus",
    price: "949.000 COP",
    eyebrow: "Sistema de conversion",
    description:
      "Una experiencia mas estrategica, con mayor profundidad visual, secciones avanzadas y mejor preparacion para escalar.",
    features: [
      "Direccion creativa extendida",
      "Microinteracciones premium",
      "Mas secciones y profundidad",
      "Optimización de confianza y conversion",
    ],
    featured: true,
  },
  {
    name: "Personalizado",
    price: "Cotizar",
    eyebrow: "Proyecto especial",
    description:
      "Para marcas, productos o experiencias que necesitan algo fuera de paquete: landing, sistema visual, plataforma o experimento.",
    features: [
      "Alcance definido contigo",
      "Experiencia a medida",
      "Integraciones segun necesidad",
      "Direccion estrategica completa",
    ],
  },
];

const stats = [
  {
    value: "2.5s",
    label: "LCP recomendado",
    body: "Google recomienda que el contenido principal cargue en 2.5 segundos o menos para una buena experiencia.",
    source: "web.dev Core Web Vitals",
    icon: Gauge,
  },
  {
    value: "10-20s",
    label: "Ventana critica",
    body: "Nielsen Norman Group explica que muchos usuarios abandonan paginas durante los primeros segundos si no ven valor claro.",
    source: "Nielsen Norman Group",
    icon: Eye,
  },
  {
    value: "70.22%",
    label: "Carritos abandonados",
    body: "Baymard Institute calcula este promedio a partir de 50 estudios sobre abandono de carrito en ecommerce.",
    source: "Baymard Institute 2026",
    icon: MousePointer2,
  },
  {
    value: "0.1",
    label: "CLS saludable",
    body: "La estabilidad visual tambien se mide: un CLS menor o igual a 0.1 es el umbral recomendado por Core Web Vitals.",
    source: "web.dev Core Web Vitals",
    icon: ShieldCheck,
  },
];

const processSteps = [
  ["Formulario", "Recojo contexto, objetivos, oferta, referentes y prioridades reales del negocio."],
  ["Diseño", "Convierto la informacion en una direccion visual clara, editorial y orientada a confianza."],
  ["Desarrollo", "Construyo una experiencia responsive, rapida y cuidada en cada interaccion."],
  ["Entrega", "Revisamos, ajustamos y dejamos el sitio listo para presentarse con seguridad."],
  ["Publicacion", "El sitio queda online, medible y preparado para convertirse en tu primera impresion."],
];

const portfolio = [
  {
    title: "Atelier Aurora",
    type: "Placeholder ficticio",
    description: "Concepto visual para una marca de interiorismo boutique. Reemplazar por proyecto real.",
  },
  {
    title: "Norte Cafe Studio",
    type: "Placeholder ficticio",
    description: "Exploracion editorial para un cafe de especialidad. Reemplazar por proyecto real.",
  },
  {
    title: "Casa Lirio",
    type: "Placeholder ficticio",
    description: "Direccion web para alojamiento premium. Reemplazar por proyecto real.",
  },
];

const faqs = [
  [
    "Que necesito para empezar?",
    "Necesito entender tu negocio, tu oferta, el objetivo de la pagina y cualquier material existente: logo, colores, fotos, textos o referencias. Si no tienes todo listo, tambien puedo ayudarte a ordenar la base.",
  ],
  [
    "La Landing Express sirve para vender?",
    "Sirve para presentar una oferta con claridad y llevar a una accion concreta. Es ideal para validar, lanzar rapido o tener una presencia inicial seria.",
  ],
  [
    "El valor de la Landing Express se pierde si luego quiero una web completa?",
    "No. Si luego compras un plan profesional, los 79.000 COP se descuentan completamente del nuevo proyecto.",
  ],
  [
    "Incluye dominio y hosting?",
    "Los paquetes se enfocan en diseno y desarrollo. Dominio, hosting o herramientas externas pueden cotizarse o configurarse segun el caso.",
  ],
  [
    "Puedo pedir cambios?",
    "Si. Cada proyecto incluye una etapa de revision para ajustar contenido, jerarquia y detalles visuales antes de publicar.",
  ],
  [
    "Usas plantillas?",
    "No como resultado final. Puedo usar referencias para entender direccion visual, pero la pagina se compone segun el negocio, la oferta y la experiencia que debe transmitir.",
  ],
];

export default function WebstudioLanding() {
  const [cursor, setCursor] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(`.${styles.reveal}`));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.18 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const cursorStyle = useMemo<CursorStyle>(
    () => ({
      "--cursor-x": `${cursor.x}%`,
      "--cursor-y": `${cursor.y}%`,
    }),
    [cursor],
  );

  return (
    <main
      className={styles.studio}
      style={cursorStyle}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setCursor({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100,
        });
      }}
    >
      <div className={styles.cursorGlow} aria-hidden="true" />
      <HeroSection />
      <WhoSection />
      <PhilosophySection />
      <StatsSection />
      <ServicesSection />
      <ComparisonSection />
      <ProcessSection />
      <PortfolioSection />
      <FAQSection />
      <FinalCTA />
    </main>
  );
}

function HeroSection() {
  return (
    <section className={styles.hero} aria-labelledby="webstudio-title">
      <div className={styles.heroBackdrop} aria-hidden="true">
        <Image
          src="/webstudio/studio-hero.png"
          alt=""
          width={1536}
          height={1024}
          priority
          sizes="(max-width: 820px) 88vw, 66vw"
        />
      </div>

      <nav className={styles.nav} aria-label="Navegacion de Webstudio">
        <a href="#inicio" className={styles.brand}>
          <span>Webstudio</span>
          <small>Digital presence</small>
        </a>
        <a href="#servicios" className={styles.navLink}>
          Servicios
        </a>
      </nav>

      <div id="inicio" className={styles.heroInner}>
        <div className={`${styles.reveal} ${styles.heroCopy}`}>
          <span className={styles.kicker}>Estudio digital independiente</span>
          <h1 id="webstudio-title">Paginas web con presencia de galeria.</h1>
          <p>
            Diseño y desarrollo experiencias digitales para negocios que no quieren verse
            improvisados. Construyo sitios que se sienten claros, premium y dignos de confianza
            desde el primer segundo.
          </p>
          <div className={styles.ctaRow}>
            <a className={styles.primaryButton} href="#contacto">
              Empezar mi web <ArrowRight aria-hidden="true" size={18} />
            </a>
            <a className={styles.secondaryButton} href="#servicios">
              Ver servicios
            </a>
          </div>
        </div>

        <div className={`${styles.reveal} ${styles.heroObject}`} aria-hidden="true">
          <div className={styles.frameOne}>
            <span>01</span>
            <strong>Direccion visual</strong>
          </div>
          <div className={styles.frameTwo}>
            <span>02</span>
            <strong>Desarrollo limpio</strong>
          </div>
          <div className={styles.frameThree}>
            <span>03</span>
            <strong>Estrategia digital</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhoSection() {
  return (
    <section className={styles.section} aria-labelledby="quien-soy">
      <div className={styles.split}>
        <div className={styles.reveal}>
          <span className={styles.kicker}>Quien soy</span>
          <h2 id="quien-soy">Desarrollador, diseñador obsesivo y estratega de primeras impresiones.</h2>
        </div>
        <div className={`${styles.reveal} ${styles.richText}`}>
          <p>
            Construyo paginas web para negocios que entienden que internet no es solo un lugar
            donde estar, sino un lugar donde ser percibidos.
          </p>
          <p>
            Combino programacion, experiencia de usuario, criterio visual y estrategia comercial.
            No vendo simplemente paginas. Creo presencia digital: una forma de que tu negocio se
            vea mas claro, mas serio y mas deseable.
          </p>
        </div>
      </div>
    </section>
  );
}

function PhilosophySection() {
  return (
    <section className={`${styles.section} ${styles.philosophy}`} aria-labelledby="filosofia">
      <div className={`${styles.reveal} ${styles.statement}`}>
        <span className={styles.kicker}>Filosofia</span>
        <h2 id="filosofia">
          Una web no es un gasto. Es el momento exacto en que alguien decide si confiar.
        </h2>
        <p>
          Muchas personas no leen todo. Escanean, sienten, comparan y deciden. La pagina correcta
          reduce dudas, transmite profesionalismo y hace que el negocio parezca tan serio como
          realmente es.
        </p>
      </div>
      <div className={styles.philosophyLine} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className={styles.section} aria-labelledby="estadisticas">
      <div className={styles.sectionHead}>
        <span className={styles.kicker}>Evidencia</span>
        <h2 id="estadisticas">El diseño tambien se mide.</h2>
        <p>
          Estas cifras funcionan como base editorial y tecnica para orientar decisiones de
          velocidad, confianza y conversion.
        </p>
      </div>
      <div className={styles.statsGrid}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article className={`${styles.reveal} ${styles.statCard}`} key={stat.label}>
              <Icon aria-hidden="true" size={24} />
              <strong>{stat.value}</strong>
              <h3>{stat.label}</h3>
              <p>{stat.body}</p>
              <small>{stat.source}</small>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section id="servicios" className={styles.section} aria-labelledby="servicios-title">
      <div className={styles.sectionHead}>
        <span className={styles.kicker}>Servicios</span>
        <h2 id="servicios-title">Paquetes claros para construir presencia sin ruido.</h2>
      </div>
      <div className={styles.serviceGrid}>
        {services.map((service) => (
          <article
            className={`${styles.reveal} ${styles.serviceCard} ${
              service.featured ? styles.featuredService : ""
            }`}
            key={service.name}
          >
            <span>{service.eyebrow}</span>
            <h3>{service.name}</h3>
            <strong>{service.price}</strong>
            <p>{service.description}</p>
            <ul>
              {service.features.map((feature) => (
                <li key={feature}>
                  <Check aria-hidden="true" size={16} />
                  {feature}
                </li>
              ))}
            </ul>
            {service.note ? <em>{service.note}</em> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function ComparisonSection() {
  const rows = [
    ["Objetivo", "Validar una oferta o presencia inicial", "Construir un sitio completo y confiable"],
    ["Profundidad", "Una pagina enfocada", "Varias secciones con narrativa completa"],
    ["Estrategia", "Mensaje central y CTA", "Arquitectura, jerarquia, confianza y conversion"],
    ["Mejor para", "Lanzar rapido", "Negocios listos para verse profesionales"],
  ];

  return (
    <section className={styles.section} aria-labelledby="comparativa">
      <div className={styles.sectionHead}>
        <span className={styles.kicker}>Comparativa</span>
        <h2 id="comparativa">Landing Express vs Web Profesional.</h2>
      </div>
      <div className={`${styles.reveal} ${styles.compareWrap}`}>
        <div className={styles.compareHeader}>
          <span />
          <strong>Landing</strong>
          <strong>Web Profesional</strong>
        </div>
        {rows.map(([label, landing, professional]) => (
          <div className={styles.compareRow} key={label}>
            <span>{label}</span>
            <p>{landing}</p>
            <p>{professional}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className={styles.section} aria-labelledby="proceso">
      <div className={styles.sectionHead}>
        <span className={styles.kicker}>Proceso</span>
        <h2 id="proceso">Un camino limpio, sin improvisacion.</h2>
      </div>
      <ol className={styles.timeline}>
        {processSteps.map(([title, body], index) => (
          <li className={styles.reveal} key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function PortfolioSection() {
  return (
    <section className={styles.section} aria-labelledby="portafolio">
      <div className={styles.sectionHead}>
        <span className={styles.kicker}>Portafolio</span>
        <h2 id="portafolio">Espacio reservado para proyectos reales.</h2>
        <p>
          Estos proyectos son placeholders ficticios. No representan clientes, testimonios ni
          empresas reales.
        </p>
      </div>
      <div className={styles.portfolioGrid}>
        {portfolio.map((project, index) => (
          <article className={`${styles.reveal} ${styles.projectCard}`} key={project.title}>
            <div aria-hidden="true">
              <Layers3 size={26} />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <small>{project.type}</small>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className={styles.section} aria-labelledby="faq">
      <div className={styles.sectionHead}>
        <span className={styles.kicker}>FAQ</span>
        <h2 id="faq">Dudas normales antes de invertir en tu presencia digital.</h2>
      </div>
      <div className={styles.faqList}>
        {faqs.map(([question, answer]) => (
          <details className={`${styles.reveal} ${styles.faqItem}`} key={question}>
            <summary>
              <span>{question}</span>
              <CircleDot aria-hidden="true" size={18} />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="contacto" className={`${styles.section} ${styles.finalCta}`} aria-labelledby="cta-final">
      <div className={`${styles.reveal} ${styles.finalInner}`}>
        <Sparkles aria-hidden="true" size={28} />
        <h2 id="cta-final">Tu negocio ya existe. Ahora hagamos que se vea inevitable.</h2>
        <p>
          Si alguien va a juzgarte en segundos, que esos segundos trabajen a tu favor.
        </p>
        <a className={styles.primaryButton} href="mailto:hola@likeli.co?subject=Quiero%20crear%20mi%20web">
          Quiero una pagina asi <ArrowRight aria-hidden="true" size={18} />
        </a>
        <div className={styles.availability}>
          <Clock3 aria-hidden="true" size={16} />
          <span>Cupos limitados para mantener direccion creativa real en cada proyecto.</span>
        </div>
      </div>
    </section>
  );
}
