console.log("JS cargado ✅");
const paquetes = window.PAQUETES; // usamos los datos compartidos
const RECO_LIMIT = 8; // máximo paquetes en Recomendados
const FALLBACKS = {
  "bariloche-nieve":
    "https://images.unsplash.com/photo-1546522861-8490a0a46228?auto=format&fit=crop&w=1600&q=80",
  "madrid-paris-roma":
    "https://images.unsplash.com/photo-1508050919630-b135583b29ab?auto=format&fit=crop&w=1600&q=80",
  "salta-norte-andino":
    "https://images.unsplash.com/photo-1558981974-8c6d8e5a5f4c?auto=format&fit=crop&w=1600&q=80",
  "rio-de-janeiro-playas":
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80"
};

/* ================
   Utilidades
   ================ */
function formatARS(n) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

function tarjetaHTML(p, qs = "") {
  const extra = qs ? `&${qs.slice(1)}` : "";
  const href = `detalle.html?slug=${encodeURIComponent(p.slug)}${extra}`;
  const fb = FALLBACKS[p.slug] || "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1600&q=80";
  return `
    <article class="card-paquete">
      <a class="card-link" href="${href}">
        <img
          src="${p.image}"
          alt="${p.title}"
          loading="lazy"
          onerror="this.onerror=null;this.src='${fb}'"
        />
        <div class="info">
          <h3>${p.title}</h3>
          <p>${p.nights} noches · Salida desde: ${p.origin}</p>
          <p class="precio">${formatARS(p.priceARS)}</p>
        </div>
      </a>
    </article>
  `;
}




function renderGrid(items) {
  const grid = document.getElementById("grid");
  if (!grid) return;
  const qs = window.location.search || "";
  const limited = items.slice(0, RECO_LIMIT); // 👈 tope 8
  grid.innerHTML = limited.map(p => tarjetaHTML(p, qs)).join("");
}


// comparar sin acentos y en minúsculas
function normalize(s) {
  return (s || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

// Filtro por origen, destino y mes (YYYY-MM)
function filterPackages(items, origin, destination, month) {
  const o = normalize(origin);
  const d = normalize(destination);
  const m = (month || "").trim();

  return items.filter((p) => {
    const matchOrigin = !o || normalize(p.origin).includes(o);
    const matchDest = !d || normalize(p.title).includes(d);
    const matchMonth = !m || (Array.isArray(p.months) && p.months.includes(m));
    return matchOrigin && matchDest && matchMonth;
  });
}

/* =========================================
   Helpers para leer/escribir filtros en URL
   ========================================= */
function getFiltersFromURL() {
  const params = new URLSearchParams(location.search);
  return {
    origin: params.get("origen") || "",
    destination: params.get("destino") || "",
    month: params.get("mes") || "",
  };
}

function setFiltersToURL({ origin, destination, month }, { replace = false } = {}) {
  const params = new URLSearchParams();
  if (origin) params.set("origen", origin);
  if (destination) params.set("destino", destination);
  if (month) params.set("mes", month);

  const newUrl = params.toString()
    ? `${location.pathname}?${params.toString()}`
    : location.pathname;

  if (replace) history.replaceState(null, "", newUrl);
  else history.pushState(null, "", newUrl);
}

/* =======================
   Formulario (submit/reset)
   ======================= */
const form = document.getElementById("searchForm");
const resetBtn = document.getElementById("resetBtn");

// SUBMIT: aplica filtros y escribe en la URL
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const origin      = (form.origin?.value || "").trim();
    const destination = (form.destination?.value || "").trim();
    const month       = (form.month?.value || "").trim();

    const params = new URLSearchParams();
    if (origin) params.set("origen", origin);
    if (destination) params.set("destino", destination);
    if (month) params.set("mes", month);

    const url = params.toString() ? `paquetes.html?${params.toString()}` : `paquetes.html`;
    window.location.href = url; // 👈 redirección
  });
}


// RESET: limpia inputs, limpia URL, muestra todo
if (resetBtn && form) {
  resetBtn.addEventListener("click", () => {
    form.reset();
    setFiltersToURL({ origin: "", destination: "", month: "" });
    renderGrid(paquetes);
    resetCarouselScroll(); // <--- NUEVO
  });
}

/* =========================================
   Render inicial + soporte Atrás/Adelante
   ========================================= */
if (form) {
  // Al cargar: leo la URL, pre-relleno el form y pinto
  const initial = getFiltersFromURL();

  if (initial.origin) form.origin.value = initial.origin;
  if (initial.destination) form.destination.value = initial.destination;
  if (initial.month) form.month.value = initial.month;

  const any = initial.origin || initial.destination || initial.month;
  renderGrid(
    any
      ? filterPackages(paquetes, initial.origin, initial.destination, initial.month)
      : paquetes
  );
  resetCarouselScroll(); // <--- NUEVO
} else {
  renderGrid(paquetes);
  resetCarouselScroll(); // <--- NUEVO
}

// Botones Atrás/Adelante del navegador
window.addEventListener("popstate", () => {
  if (!form) return;
  const f = getFiltersFromURL();
  form.origin.value = f.origin || "";
  form.destination.value = f.destination || "";
  form.month.value = f.month || "";
  renderGrid(filterPackages(paquetes, f.origin, f.destination, f.month));
  resetCarouselScroll(); // <--- NUEVO
});

/* =======================
   Carrusel en móvil
   ======================= */
// ===== Carrusel: flechas en móvil =====
function bindCarousel() {
  const track = document.getElementById("carTrack");
  const prev = document.getElementById("prevBtn");
  const next = document.getElementById("nextBtn");
  if (!track || !prev || !next) return;

  const jump = () => Math.round(track.clientWidth * 0.9);

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -jump(), behavior: "smooth" });
  });
  next.addEventListener("click", () => {
    track.scrollBy({ left: jump(), behavior: "smooth" });
  });
}

function resetCarouselScroll() {
  const track = document.getElementById("carTrack");
  if (!track) return;
  if (window.innerWidth < 640) track.scrollTo({ left: 0, top: 0, behavior: "auto" });
}

// Inicializar una vez (dejalo al final del archivo)
bindCarousel();

