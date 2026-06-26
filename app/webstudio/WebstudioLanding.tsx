"use client";

import { ArrowRight, Check, ChevronDown, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import styles from "./webstudio.module.css";

const WHATSAPP_URL = "https://wa.link/33rwr3";

type BasePlan = {
  name: string;
  intro: string;
  includesTitle: string;
  includes: string[];
  fitTitle?: string;
  fit?: string[];
  note?: string;
};

type FixedPricePlan = BasePlan & {
  price: string;
  range?: never;
};

type RangePricePlan = BasePlan & {
  price?: never;
  range: [string, string, string, string];
};

type Plan = FixedPricePlan | RangePricePlan;

const whyItems = [
  {
    title: "Credibilidad",
    body: "Una web bien construida elimina la sensación de improvisación y ayuda a que tu negocio se perciba serio desde el primer contacto.",
  },
  {
    title: "Google",
    body: "Cuando alguien te busca, tu página puede ordenar la información, explicar tu oferta y convertir una búsqueda en una conversación.",
  },
  {
    title: "WhatsApp",
    body: "Las redes llaman la atención; una web preparada lleva a la persona al mensaje correcto y facilita que escriba con confianza.",
  },
  {
    title: "Activo propio",
    body: "Las redes sociales cambian constantemente. Una página web es un espacio propio para tu marca, tus clientes y tu presencia digital.",
  },
];

const processSteps = [
  ["Conocemos el proyecto", "Entiendo tu negocio, tu oferta, tus prioridades y el tipo de confianza que necesitas transmitir."],
  ["Analizamos necesidades", "Ordenamos contenido, público, objetivos y decisiones clave antes de pensar en pantallas."],
  ["Diseño", "Construyo una dirección visual limpia, moderna y coherente con lo que quieres proyectar."],
  ["Desarrollo", "Paso el diseño a una experiencia rápida, responsive y cuidada en los detalles."],
  ["Revisión", "Revisamos textos, jerarquía, ajustes visuales y funcionamiento antes de publicar."],
  ["Publicación", "Dejo la página lista para compartir y empezar a recibir visitas con seguridad."],
];

const benefits = [
  "Diseño moderno",
  "Alto rendimiento",
  "Responsive",
  "SEO",
  "Atención personalizada",
  "Comunicación directa",
  "Sin intermediarios",
  "Código limpio",
  "Optimización",
];

const plans: Plan[] = [
  {
    name: "WEB EXPRESS",
    price: "$99.900 COP",
    intro: "Tu negocio online en pocos días.",
    includesTitle: "Incluye",
    includes: [
      "Landing page",
      "Diseño limpio y moderno",
      "Adaptada para computador y celular",
      "Información organizada",
      "Optimización básica",
      "Entrega rápida",
    ],
    fitTitle: "Perfecto para",
    fit: ["Emprendedores", "Negocios nuevos", "Validar presencia digital"],
    note: "Si posteriormente decides contratar un plan superior, este valor se descuenta completamente.",
  },
  {
    name: "WEB PROFESIONAL",
    price: "$599.900 COP",
    intro: "La imagen que tu empresa merece.",
    includesTitle: "Incluye",
    includes: [
      "Landing profesional",
      "Dominio primer año",
      "Hosting",
      "Publicación",
      "Google Workspace primer mes",
      "Correos empresariales",
      "SEO",
      "Google",
      "WhatsApp",
      "Animaciones",
      "Favicon",
      "Diseño personalizado",
      "Carga rápida",
    ],
    fitTitle: "Ideal para",
    fit: ["Empresas que buscan transmitir confianza y conseguir clientes."],
  },
  {
    name: "WEB PROFESIONAL PLUS",
    price: "$899.900 COP",
    intro: "Una experiencia digital premium.",
    includesTitle: "Incluye",
    includes: [
      "Todo el plan profesional",
      "Hasta 5 páginas",
      "Animaciones premium",
      "Diseño exclusivo",
      "Mayor personalización",
      "Arquitectura escalable",
    ],
  },
  {
    name: "PROYECTO PERSONALIZADO",
    intro: "Para desarrollos especiales que necesitan una definición a medida.",
    range: ["Desde", "$599.900", "hasta", "$1.999.900"],
    includesTitle: "Puede incluir",
    includes: [
      "Sistemas",
      "Landing",
      "Corporativos",
      "Automatizaciones",
      "APIs",
      "Paneles",
      "Micrositios",
      "Desarrollos especiales",
    ],
    fitTitle: "Proceso",
    fit: ["Analizamos", "Diseñamos", "Cotizamos"],
  },
];

const faqs = [
  [
    "¿Cuánto tarda?",
    "Depende del alcance. WEB EXPRESS está pensado para salir en pocos días; los planes profesionales requieren más cuidado de contenido, diseño, desarrollo y revisión.",
  ],
  [
    "¿Necesito hosting?",
    "En los planes profesionales el hosting está incluido. Si eliges WEB EXPRESS o un proyecto personalizado, lo definimos según el alcance.",
  ],
  [
    "¿Incluye dominio?",
    "WEB PROFESIONAL y WEB PROFESIONAL PLUS incluyen dominio durante el primer año. En otros casos se revisa según el proyecto.",
  ],
  [
    "¿Puedo pedir cambios?",
    "Sí. Cada proyecto pasa por una etapa de revisión para ajustar contenido, jerarquía, detalles visuales y funcionamiento antes de publicar.",
  ],
  [
    "¿Se adapta al celular?",
    "Sí. La landing se diseña y desarrolla para computador, tablet y celular, cuidando que el contenido se vea claro en cada tamaño.",
  ],
  [
    "¿Ayudas después de publicar?",
    "Si necesitas acompañamiento después de publicar, lo conversamos directamente y definimos lo que tenga sentido para tu página.",
  ],
];

function whatsappProps(label: string) {
  return {
    href: WHATSAPP_URL,
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": `${label} por WhatsApp`,
  };
}

function hasRange(plan: Plan): plan is RangePricePlan {
  return Array.isArray(plan.range);
}

export default function WebstudioLanding() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(`.${styles.reveal}`));

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add(styles.isVisible));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.isVisible);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.16 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <a className={styles.headerBrand} href="#inicio" aria-label="Ir al inicio de WEBSTUDIO">
          WEBSTUDIO
        </a>
        <nav className={styles.nav} aria-label="Navegacion principal">
          <a href="#planes">Planes</a>
          <a {...whatsappProps("Hablar con Sebastián")} className={styles.navCta}>
            WhatsApp
          </a>
        </nav>
      </header>

      <section id="inicio" className={styles.hero} aria-labelledby="hero-title">
        <div className={`${styles.heroInner} ${styles.reveal}`}>
          <p className={styles.heroKicker}>Desarrollo web freelance premium</p>
          <h1 id="hero-title">WEBSTUDIO</h1>
          <p className={styles.heroFounder}>Por Sebastián</p>
          <p className={styles.heroPowered}>Powered by LIKELI</p>
          <p className={styles.heroCopy}>
            Páginas web limpias, rápidas y cuidadas personalmente para negocios que necesitan
            verse confiables desde el primer segundo.
          </p>
          <div className={styles.heroActions}>
            <a {...whatsappProps("Quiero mi página web")} className={styles.primaryButton}>
              <MessageCircle aria-hidden="true" size={17} />
              Quiero mi página web
            </a>
            <a {...whatsappProps("Ver planes")} className={styles.secondaryButton}>
              Ver planes
              <ArrowRight aria-hidden="true" size={17} />
            </a>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="por-que-web">
        <div className={styles.sectionIntro}>
          <span className={styles.eyebrow}>Presencia digital</span>
          <h2 id="por-que-web">¿Por qué una página web?</h2>
          <p>
            Porque hoy la confianza se forma antes de una llamada. Una web clara conecta tu marca,
            Google, WhatsApp y tus clientes en un activo propio que no depende del cambio constante
            de las redes sociales.
          </p>
        </div>
        <div className={styles.whyGrid}>
          {whyItems.map((item, index) => (
            <article className={`${styles.reveal} ${styles.insightCard}`} key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="quien-soy">
        <div className={styles.aboutGrid}>
          <div className={`${styles.reveal} ${styles.photoSlot}`} aria-label="Espacio reservado para una fotografía de Sebastián">
            <span>Foto de Sebastián</span>
          </div>
          <div className={`${styles.reveal} ${styles.aboutCopy}`}>
            <span className={styles.eyebrow}>Quién soy</span>
            <h2 id="quien-soy">Soy Sebastián, freelancer especializado en desarrollo web.</h2>
            <p>
              Trabajo personalmente cada proyecto. No delego el desarrollo, no escondo el proceso y
              no convierto tu página en una entrega más dentro de una fila anónima.
            </p>
            <p>
              Cada cliente recibe atención personalizada, comunicación directa y una construcción
              pensada para que el resultado se sienta propio, claro y profesional.
            </p>
            <p>
              Mi prioridad es calidad antes que cantidad. Prefiero hacer pocos proyectos excelentes
              que muchos mediocres.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="como-trabajo">
        <div className={styles.sectionIntro}>
          <span className={styles.eyebrow}>Proceso</span>
          <h2 id="como-trabajo">¿Cómo trabajo?</h2>
          <p>
            Un proceso simple, directo y ordenado para que sepas qué está pasando en cada etapa.
          </p>
        </div>
        <ol className={styles.processGrid}>
          {processSteps.map(([title, body], index) => (
            <li className={`${styles.reveal} ${styles.processCard}`} key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section} aria-labelledby="por-que-elegirme">
        <div className={styles.sectionIntro}>
          <span className={styles.eyebrow}>Criterio</span>
          <h2 id="por-que-elegirme">¿Por qué elegirme?</h2>
          <p>
            Porque tu página no necesita ruido. Necesita claridad, buen gusto, rendimiento y una
            persona responsable de cuidarla de principio a fin.
          </p>
        </div>
        <div className={styles.benefitGrid}>
          {benefits.map((benefit) => (
            <div className={`${styles.reveal} ${styles.benefitItem}`} key={benefit}>
              <Check aria-hidden="true" size={16} />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="planes" className={styles.section} aria-labelledby="planes-title">
        <div className={styles.sectionIntro}>
          <span className={styles.eyebrow}>Planes</span>
          <h2 id="planes-title">Elige el punto de partida correcto.</h2>
          <p>
            Tarjetas claras, sin tablas innecesarias. Si tienes dudas, lo conversamos directamente
            por WhatsApp.
          </p>
        </div>
        <div className={styles.planGrid}>
          {plans.map((plan, index) => (
            <article className={`${styles.reveal} ${styles.planCard}`} key={plan.name}>
              <div className={styles.planTopline}>
                <span>Plan {String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3>{plan.name}</h3>
              {hasRange(plan) ? (
                <div className={styles.priceRange} aria-label="Desde 599900 hasta 1999900 pesos">
                  <span>{plan.range[0]}</span>
                  <strong>{plan.range[1]}</strong>
                  <span>{plan.range[2]}</span>
                  <strong>{plan.range[3]}</strong>
                </div>
              ) : (
                <p className={styles.planPrice}>{plan.price}</p>
              )}
              <p className={styles.planIntro}>{plan.intro}</p>

              <div className={styles.planListGroup}>
                <h4>{plan.includesTitle}</h4>
                <ul>
                  {plan.includes.map((item) => (
                    <li key={item}>
                      <Check aria-hidden="true" size={15} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.fitTitle && plan.fit ? (
                <div className={styles.planListGroup}>
                  <h4>{plan.fitTitle}</h4>
                  <ul>
                    {plan.fit.map((item) => (
                      <li key={item}>
                        <Check aria-hidden="true" size={15} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {"note" in plan && plan.note ? <p className={styles.planNote}>{plan.note}</p> : null}

              <a {...whatsappProps(`Hablar por WhatsApp sobre ${plan.name}`)} className={styles.planButton}>
                Hablar por WhatsApp
                <ArrowRight aria-hidden="true" size={16} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="faq-title">
        <div className={styles.sectionIntro}>
          <span className={styles.eyebrow}>Preguntas frecuentes</span>
          <h2 id="faq-title">Dudas normales antes de empezar.</h2>
        </div>
        <div className={styles.faqList}>
          {faqs.map(([question, answer]) => (
            <details className={`${styles.reveal} ${styles.faqItem}`} key={question}>
              <summary>
                <span>{question}</span>
                <ChevronDown aria-hidden="true" size={18} />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.finalCta} aria-labelledby="cta-final">
        <div className={`${styles.reveal} ${styles.finalCtaInner}`}>
          <h2 id="cta-final">¿Listo para tener una página web que realmente represente tu negocio?</h2>
          <a {...whatsappProps("Quiero hablar contigo")} className={styles.finalButton}>
            <MessageCircle aria-hidden="true" size={18} />
            Quiero hablar contigo
          </a>
        </div>
      </section>

      <footer className={styles.footer}>
        <div>
          <strong>WEBSTUDIO</strong>
          <span>Por Sebastián</span>
          <small>Powered by LIKELI</small>
        </div>
        <a {...whatsappProps("Contactar por WhatsApp")} className={styles.footerButton}>
          WhatsApp
        </a>
      </footer>
    </main>
  );
}
