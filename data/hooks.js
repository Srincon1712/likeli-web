window.LikeliPortal = window.LikeliPortal || {};

const hooks = [
  {
    id: "hook-01",
    hook: "Esto pasa cuando sales de la ciudad por una noche.",
    use: "Abrir reels de experiencia y transformacion.",
    contentType: "Aspiracional",
    intensity: "Medio",
    format: "Reel",
    example: "Mostrar ruido de ciudad y cortar a silencio, vista y descanso.",
    category: "Deseo",
  },
  {
    id: "hook-02",
    hook: "No reserves una escapada sin revisar esto primero.",
    use: "Introducir piezas educativas y carruseles de checklist.",
    contentType: "Educativo",
    intensity: "Fuerte",
    format: "Carrusel",
    example: "Slide 1 con promesa, luego errores y recomendaciones concretas.",
    category: "Prevencion",
  },
  {
    id: "hook-03",
    hook: "Cinco detalles que hacen que una noche se sienta premium.",
    use: "Mostrar producto sin sonar vendedor.",
    contentType: "Producto",
    intensity: "Suave",
    format: "Reel",
    example: "Planos cerrados de texturas, luz, vista, cama y bebida.",
    category: "Valor",
  },
  {
    id: "hook-04",
    hook: "Si solo tienes 48 horas, este plan tiene sentido.",
    use: "Conectar con personas con poco tiempo disponible.",
    contentType: "Conversion",
    intensity: "Medio",
    format: "Historia",
    example: "Secuencia de llegada, cena, descanso, desayuno y salida.",
    category: "Decision",
  },
];

window.LikeliPortal.hooks = hooks;
