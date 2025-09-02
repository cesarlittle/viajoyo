// Utilidades
function formatARS(n) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}
function formatMonth(m) { const [y, mm] = (m || "").split("-"); return m ? `${mm}/${y}` : ""; }

// Leer params
const params = new URLSearchParams(location.search);
const slug = params.get("slug") || "";

// Armar href de "Volver" con los mismos filtros
const keep = new URLSearchParams();
["origen", "destino", "mes"].forEach(k => { const v = params.get(k); if (v) keep.set(k, v); });
const backHref = keep.toString() ? `index.html?${keep.toString()}` : "index.html";
document.addEventListener("DOMContentLoaded", () => {
  const back = document.querySelector('a.btn[href^="index.html"]');
  if (back) back.setAttribute("href", backHref);
});

// Buscar paquete y render
const data = (window.PAQUETES || []).find(p => p.slug === slug);
const main = document.querySelector("main");
const title = document.getElementById("title");

if (!data) {
  title.textContent = "No encontramos el paquete";
  const p = document.getElementById("slugLine");
  if (p) p.textContent = "Verificá el enlace o volvé al inicio.";
} else {
  title.textContent = data.title;
  const container = document.createElement("section");
  container.className = "detail";
  container.innerHTML = `
    <div class="detail-hero">
      <img src="${data.image}" alt="${data.title}" referrerpolicy="no-referrer" />
    </div>
    <div class="detail-info">
      <p class="detail-price">${formatARS(data.priceARS)}</p>
      <p class="detail-line"><strong>Noches:</strong> ${data.nights}</p>
      <p class="detail-line"><strong>Salida desde:</strong> ${data.origin}</p>
      <p class="detail-line"><strong>Fechas:</strong> ${data.months.map(formatMonth).join(", ")}</p>
      <div class="detail-tags">
        ${data.includes.map(i => `<span class="tag">${i}</span>`).join(" ")}
      </div>
      <p class="detail-desc">${data.description || ""}</p>
      <div class="detail-actions">
        <a class="btn" href="${backHref}">← Volver</a>
        <button class="btn">Consultar</button>
      </div>
    </div>
  `;
  const slugLine = document.getElementById("slugLine");
  if (slugLine) slugLine.remove();
  main.appendChild(container);
}
