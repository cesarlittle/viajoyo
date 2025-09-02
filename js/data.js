// Datos globales para ambas páginas (home, paquetes, detalle)
window.PAQUETES = [
  /* ====================== RECOMENDADOS (primeros 8) ====================== */
  // 1) ARGENTINA
  {
    slug: "iguazu-en-cuotas",
    title: "Paquete a Iguazú",
    nights: 3,
    origin: "Buenos Aires",
    priceARS: 489086,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    months: ["2025-10","2026-01"],
    includes: ["vuelo","hotel"],
    description: "Incluye excursión a Cataratas lado argentino. Opción parque nacional incluida.",
    segments: ["escapadas","playas","mv_ar"]
  },
  {
    slug: "bariloche-nieve",
    title: "Bariloche Nieve y Lagos",
    nights: 5,
    origin: "Buenos Aires",
    priceARS: 975000,
    image: "https://images.unsplash.com/photo-1542251001-dc2a0bfaaea1?auto=format&fit=crop&w=1600&q=80",
    months: ["2025-07","2025-08","2026-07"],
    includes: ["vuelo","hotel","seguro"],
    description: "Cerro Catedral, Circuito Chico y navegación opcional en el lago.",
    segments: ["escapadas","mv_ar"]
  },

  // 2) CARIBE / BRASIL
  {
    slug: "punta-cana-all-inclusive",
    title: "Punta Cana Todo Incluido",
    nights: 7,
    origin: "Buenos Aires",
    priceARS: 2199000,
    image: "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1600&q=80",
    months: ["2025-11","2026-01"],
    includes: ["vuelo","hotel","all inclusive"],
    description: "Resort frente al mar con bebidas y comidas incluidas.",
    segments: ["playas","mv_caribe"]
  },
  {
    slug: "rio-de-janeiro-playas",
    title: "Río de Janeiro Playas",
    nights: 6,
    origin: "Buenos Aires",
    priceARS: 1390000,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&q=80",
    months: ["2025-10","2025-12","2026-02"],
    includes: ["vuelo","hotel","traslados"],
    description: "Copacabana, Pan de Azúcar y Cristo Redentor.",
    segments: ["playas","mv_brasil"]
  },

  // 3) EUROPA
  {
    slug: "europa-en-oferta-19",
    title: "Europa en Oferta x 19 días",
    nights: 17,
    origin: "Buenos Aires",
    priceARS: 5278844,
    image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1600&q=80",
    months: ["2025-10","2026-05"],
    includes: ["vuelo","hotel","seguro"],
    description: "Recorrido clásico por capitales europeas con asistencia en español.",
    segments: ["verano","exoticos","mv_grupales"]
  },
  {
    slug: "madrid-paris-roma",
    title: "Madrid • París • Roma",
    nights: 12,
    origin: "Buenos Aires",
    priceARS: 4490000,
    image: "https://images.unsplash.com/photo-1526481280698-8fcc13e61552?auto=format&fit=crop&w=1600&q=80",
    months: ["2025-09","2025-11","2026-03"],
    includes: ["vuelo","hotel","traslados"],
    description: "Triángulo europeo con city tours y tiempo libre.",
    segments: ["verano","mv_grupales"]
  },

  // 4) ARGENTINA (para completar 8 recomendados)
  {
    slug: "salta-norte-andino",
    title: "Salta y Norte Andino",
    nights: 5,
    origin: "Buenos Aires",
    priceARS: 815000,
    image: "https://images.unsplash.com/photo-1559511260-2e6d9bfb87d6?auto=format&fit=crop&w=1600&q=80",
    months: ["2025-09","2025-10","2026-04"],
    includes: ["vuelo","hotel","excursiones"],
    description: "Quebrada de Humahuaca y Salinas Grandes (opc.).",
    segments: ["escapadas","mv_ar"]
  },
  {
    slug: "ushuaia-fin-del-mundo",
    title: "Ushuaia Fin del Mundo",
    nights: 4,
    origin: "Buenos Aires",
    priceARS: 1190000,
    image: "https://images.unsplash.com/photo-1544989164-31dc3c645987?auto=format&fit=crop&w=1600&q=80",
    months: ["2025-06","2025-09","2026-06"],
    includes: ["vuelo","hotel"],
    description: "Parque Nacional Tierra del Fuego y Navegación por el Beagle.",
    segments: ["escapadas","mv_ar"]
  },

  /* ====================== RESTO (también aparecen en secciones) ====================== */

  // CARIBE
  {
    slug: "cancun-all-inclusive",
    title: "Cancún Todo Incluido",
    nights: 7,
    origin: "Buenos Aires",
    priceARS: 2295000,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    months: ["2025-12","2026-02"],
    includes: ["vuelo","hotel","all inclusive"],
    description: "Arena blanca, aguas turquesa y excursión a Chichén Itzá (opc.).",
    segments: ["playas","mv_caribe"]
  },
  {
    slug: "buzios-escapada",
    title: "Búzios Escapada",
    nights: 5,
    origin: "Buenos Aires",
    priceARS: 1095000,
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80",
    months: ["2025-10","2026-01"],
    includes: ["vuelo","hotel"],
    description: "Playas de Joao Fernandes y Rua das Pedras.",
    segments: ["playas","escapadas","mv_brasil"]
  },

  // EUROPA
  {
    slug: "maravillas-europeas-sin-vuelos",
    title: "Tour Maravillas Europeas (no incluye vuelos)",
    nights: 17,
    origin: "Buenos Aires",
    priceARS: 3388058,
    image: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1600&q=80",
    months: ["2025-09","2026-03"],
    includes: ["hotel"],
    description: "Circuito terrestre con hoteles y traslados entre ciudades.",
    segments: ["verano","mv_grupales"]
  },
  {
    slug: "italia-bella",
    title: "Italia Bella (Roma • Florencia • Venecia)",
    nights: 10,
    origin: "Buenos Aires",
    priceARS: 4120000,
    image: "https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=1600&q=80",
    months: ["2025-10","2026-04"],
    includes: ["vuelo","hotel","seguro"],
    description: "Arte, gastronomía y paisajes de la península.",
    segments: ["verano","mv_grupales"]
  }
];
