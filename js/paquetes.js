// Datos
const paquetes = window.PAQUETES || [];

// Utils
function formatARS(n){
  return new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}).format(n);
}
function normalize(s){return (s||"").normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase();}

function tarjetaHTML(p, qs=""){
  const extra = qs ? `&${qs.slice(1)}` : "";
  const href = `detalle.html?slug=${encodeURIComponent(p.slug)}${extra}`;
  return `
    <article class="card-paquete">
      <a class="card-link" href="${href}">
        <img src="${p.image}" alt="${p.title}" referrerpolicy="no-referrer" />
        <div class="info">
          <h3>${p.title}</h3>
          <p>${p.nights} noches · Salida desde: ${p.origin}</p>
          <p class="precio">${formatARS(p.priceARS)}</p>
        </div>
      </a>
    </article>`;
}

function readParams(){
  const q = new URLSearchParams(location.search);
  return {
    origin: q.get("origen") || "",
    destination: q.get("destino") || "",
    month: q.get("mes") || "",
    segment: q.get("segment") || "",
  };
}

function writeParams(f){ // sobrescribe URL con los nuevos filtros
  const q = new URLSearchParams();
  if (f.origin) q.set("origen", f.origin);
  if (f.destination) q.set("destino", f.destination);
  if (f.month) q.set("mes", f.month);
  if (f.segment) q.set("segment", f.segment);
  const url = q.toString() ? `?${q.toString()}` : location.pathname;
  history.pushState(null, "", url);
}

function filterByAll(list, {origin, destination, month, segment}){
  const o = normalize(origin), d = normalize(destination), m = (month || "").trim();
  return list.filter(p=>{
    const okO = !o || normalize(p.origin).includes(o);
    const okD = !d || normalize(p.title).includes(d);
    const okM = !m || (Array.isArray(p.months) && p.months.includes(m));
    const okS = !segment || (Array.isArray(p.segments) && p.segments.includes(segment));
    return okO && okD && okM && okS;
  });
}

function render(){
  const grid = document.getElementById("grid");
  const chips = document.getElementById("chips");
  if (!grid) return;

  const f = readParams();
  // pintar chips (etiquetas de filtros activos)
  const tags = [];
  if (f.segment) tags.push(`<span class="tag">Segmento: ${f.segment}</span>`);
  if (f.origin) tags.push(`<span class="tag">Origen: ${f.origin}</span>`);
  if (f.destination) tags.push(`<span class="tag">Destino: ${f.destination}</span>`);
  if (f.month) tags.push(`<span class="tag">Mes: ${f.month}</span>`);
  chips.innerHTML = tags.join(" ");

  const list = filterByAll(paquetes, f);
  const qs = location.search || "";
  grid.innerHTML = list.map(p=>tarjetaHTML(p, qs)).join("");
}

function prefillFormFromURL(){
  const f = readParams();
  const form = document.getElementById("searchForm");
  if (!form) return;
  if (f.origin) form.origin.value = f.origin;
  if (f.destination) form.destination.value = f.destination;
  if (f.month) form.month.value = f.month;
}

function bindEvents(){
  const form = document.getElementById("searchForm");
  const reset = document.getElementById("resetBtn");
  if (form){
    form.addEventListener("submit",(e)=>{
      e.preventDefault();
      const filters = {
        origin: (form.origin?.value || "").trim(),
        destination: (form.destination?.value || "").trim(),
        month: (form.month?.value || "").trim(),
        segment: readParams().segment || "" // si venís de segmento, lo mantenemos
      };
      writeParams(filters);
      render();
    });
  }
  if (reset){
    reset.addEventListener("click", ()=>{
      writeParams({origin:"", destination:"", month:"", segment:""});
      const form = document.getElementById("searchForm");
      form?.reset();
      render();
    });
  }
  window.addEventListener("popstate", render);
}

// init
prefillFormFromURL();
render();
bindEvents();
