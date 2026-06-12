import CursorReactiveCard from "@/components/ui/CursorReactiveCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Image from "next/image";

const cases = [
  {
    id: "alojamientos",
    title: "Alojamientos boutique",
    detail: "Atmósfera, detalle, descanso, estética, confianza y experiencia completa.",
    image: "/use-cases/alojamientos-boutique.jpg",
    imageAlt: "Alojamiento boutique turístico",
  },
  {
    id: "glampings",
    title: "Glampings",
    detail: "Deseo visual, escapada, pareja, naturaleza, privacidad y momentos memorables.",
    image: "/use-cases/glampings.jpg",
    imageAlt: "Glamping en entorno natural",
  },
  {
    id: "cabanas",
    title: "Cabañas",
    detail: "Contenido cozy, familiar, rural o premium según el posicionamiento del alojamiento.",
    image: "/use-cases/cabanas.jpg",
    imageAlt: "Cabaña turística en la montaña",
  },
  {
    id: "fincas",
    title: "Fincas turísticas",
    detail: "Espacios, actividades, naturaleza, grupos, descanso y planes de fin de semana.",
    image: "/use-cases/fincas-turisticas.jpg",
    imageAlt: "Finca turística para descanso",
  },
  {
    id: "tours",
    title: "Tours",
    detail: "Rutas, dudas, experiencia y reducción de fricción antes de reservar.",
    image: "/use-cases/tours.jpg",
    imageAlt: "Tour turístico guiado",
  },
  {
    id: "gastronomia",
    title: "Experiencias gastronómicas",
    detail: "Sabor, origen, ambiente, proceso, ritual y motivos para visitar.",
    image: "/use-cases/experiencias-gastronomicas.jpg",
    imageAlt: "Experiencia gastronómica turística",
  },
  {
    id: "aventura",
    title: "Aventura",
    detail: "Trekking, naturaleza, rutas, cuevas, montaña y experiencia real al aire libre.",
    image: "/use-cases/aventura.jpg",
    imageAlt: "Experiencia de aventura al aire libre",
  },
  {
    id: "bienestar",
    title: "Bienestar turístico",
    detail: "Descanso, desconexión, spa, calma, naturaleza y pausa emocional.",
    image: "/use-cases/bienestar-turistico.jpg",
    imageAlt: "Bienestar turístico y desconexión",
  },
];

export default function UseCases() {
  return (
    <section id="casos-de-uso" className="section border-b hairline">
      <div className="lk-container">
        <SectionHeader
          eyebrow="Use cases"
          title="Para negocios donde la experiencia se vende antes de vivirse."
          copy="Cada tipo de negocio turístico necesita contenido distinto. Likeli adapta la inteligencia, las ideas y los guiones al contexto real de cada experiencia."
        />

        <div className="use-case-grid mt-12">
          {cases.map((item, index) => (
            <CursorReactiveCard key={item.id} className="use-case-card p-5">
              <div className="relative mb-5 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#ffeaea]/[0.075] bg-[#ffeaea]/[0.05]">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 719px) 100vw, 25vw"
                />
              </div>
              <span className="mono text-[0.62rem] uppercase tracking-[0.15em] text-faint">case / 0{index + 1}</span>
              <h3 className="mt-5 text-xl leading-tight">{item.title}</h3>
              <p className="copy mt-4 text-sm">{item.detail}</p>
            </CursorReactiveCard>
          ))}
        </div>
      </div>
    </section>
  );
}
