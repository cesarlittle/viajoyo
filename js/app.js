/**
 * VIAJOYO - Portal de Noticias Turisticas
 * Main Application JavaScript
 */

// ============================================
// DATA MANAGEMENT
// ============================================

// Global data stores
let packagesData = { packages: [], segments: [] };
let newsData = { news: [], categories: [] };
let flightsData = { flights: [] };
let activitiesData = { activities: [] };
let assistanceData = { assistance: [] };

// Google Apps Script URL for packages
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbziIgDvHMen1FR__wfFphXVZiN9q0o5uZ2tMQhbI9zNaTiun3Zs6SWXytAXiTJLcxAIyA/exec';

// Visual Segments Configuration
const VISUAL_SEGMENTS = [
  { id: 'verano', name: 'Verano', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80' },
  { id: 'playas', name: 'Playas', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
  { id: 'exoticos', name: 'Exoticos', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80' },
  { id: 'escapadas', name: 'Escapadas', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80' },
  { id: 'grupales', name: 'Grupales', image: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?auto=format&fit=crop&w=600&q=80' }
];

// ============================================
// DATA LOADING
// ============================================

/**
 * Load packages from Google Apps Script
 */
async function loadPackagesFromScript() {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data)) {
        packagesData.packages = data.map((pkg, index) => ({
          id: index + 1,
          slug: pkg.slug || pkg.titulo?.toLowerCase().replace(/\s+/g, '-') || `paquete-${index}`,
          title: pkg.titulo || pkg.title || '',
          destination: pkg.destino || pkg.destination || '',
          nights: parseInt(pkg.noches || pkg.nights) || 0,
          origin: pkg.origen || pkg.origin || 'Buenos Aires',
          priceARS: parseInt(pkg.precioARS || pkg.priceARS) || 0,
          priceUSD: parseInt(pkg.precioUSD || pkg.priceUSD) || 0,
          image: pkg.imagen || pkg.image || '',
          months: pkg.meses ? (Array.isArray(pkg.meses) ? pkg.meses : pkg.meses.split(',').map(m => m.trim())) : [],
          includes: pkg.incluye ? (Array.isArray(pkg.incluye) ? pkg.incluye : pkg.incluye.split(',').map(i => i.trim())) : [],
          description: pkg.descripcion || pkg.description || '',
          segments: pkg.segmentos ? (Array.isArray(pkg.segmentos) ? pkg.segmentos : pkg.segmentos.split(',').map(s => s.trim())) : [],
          badge: pkg.badge || null,
          featured: pkg.destacado === true || pkg.featured === true || pkg.destacado === 'si'
        }));
        console.log('Loaded', packagesData.packages.length, 'packages from Google Script');
        return true;
      }
    }
  } catch (error) {
    console.error('Error loading from Google Script:', error);
  }
  return false;
}

/**
 * Load data from JSON files
 */
async function loadData() {
  try {
    // Try loading packages from Google Script first
    const scriptLoaded = await loadPackagesFromScript();

    // Load other data from JSON files
    const [news, flights, activities, assistance] = await Promise.all([
      fetch('data/news.json').then(r => r.ok ? r.json() : { news: [], categories: [] }),
      fetch('data/flights.json').then(r => r.ok ? r.json() : { flights: [] }),
      fetch('data/activities.json').then(r => r.ok ? r.json() : { activities: [] }),
      fetch('data/assistance.json').then(r => r.ok ? r.json() : { assistance: [] })
    ]);

    // If Google Script failed, load packages from local JSON
    if (!scriptLoaded) {
      const packagesLocal = await fetch('data/packages.json').then(r => r.ok ? r.json() : { packages: [], segments: [] });
      packagesData = packagesLocal;
    }

    newsData = news;
    flightsData = flights;
    activitiesData = activities;
    assistanceData = assistance;

    return true;
  } catch (error) {
    console.error('Error loading data:', error);
    return false;
  }
}

/**
 * Load packages from Google Sheets
 * @param {string} spreadsheetId - Google Sheets spreadsheet ID
 * @param {string} apiKey - Google API Key
 */
async function loadFromGoogleSheets(spreadsheetId, apiKey) {
  const range = 'Paquetes!A2:M100';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.values) {
      const packages = data.values.map((row, index) => ({
        id: index + 1,
        slug: row[0] || '',
        title: row[1] || '',
        destination: row[2] || '',
        nights: parseInt(row[3]) || 0,
        origin: row[4] || 'Buenos Aires',
        priceARS: parseInt(row[5]) || 0,
        priceUSD: parseInt(row[6]) || 0,
        image: row[7] || '',
        months: row[8] ? row[8].split(',').map(m => m.trim()) : [],
        includes: row[9] ? row[9].split(',').map(i => i.trim()) : [],
        description: row[10] || '',
        segments: row[11] ? row[11].split(',').map(s => s.trim()) : [],
        badge: row[12] || null
      }));

      packagesData.packages = packages;
      console.log('Loaded', packages.length, 'packages from Google Sheets');
      return true;
    }
  } catch (error) {
    console.error('Error loading from Google Sheets:', error);
  }
  return false;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format price in ARS
 */
function formatARS(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format price in USD
 */
function formatUSD(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format date
 */
function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Get relative time
 */
function getRelativeTime(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} dias`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  return formatDate(dateStr);
}

/**
 * Generate star rating HTML
 */
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  let html = '';

  for (let i = 0; i < fullStars; i++) {
    html += '<span>&#9733;</span>';
  }
  if (hasHalf) {
    html += '<span>&#9734;</span>';
  }
  for (let i = fullStars + (hasHalf ? 1 : 0); i < 5; i++) {
    html += '<span style="opacity: 0.3">&#9733;</span>';
  }

  return html;
}

// ============================================
// RENDER FUNCTIONS
// ============================================

/**
 * Render categories
 */
function renderCategories() {
  const container = document.getElementById('categoriesList');
  if (!container || !packagesData.segments) return;

  const icons = {
    'verano': '&#9728;',
    'invierno': '&#10052;',
    'playas': '&#127958;',
    'exoticos': '&#127796;',
    'escapadas': '&#128663;',
    'grupales': '&#128101;',
    'patagonia': '&#127956;',
    'blackfriday': '&#127991;'
  };

  const activeSegments = packagesData.segments.filter(s => s.active);

  container.innerHTML = activeSegments.map(segment => `
    <a href="paquetes.html?categoria=${segment.id}" class="category-tag ${getActiveCategory() === segment.id ? 'category-tag--active' : ''}">
      <span class="category-tag__icon">${icons[segment.id] || '&#128205;'}</span>
      ${segment.name}
    </a>
  `).join('');
}

/**
 * Get active category from URL
 */
function getActiveCategory() {
  const params = new URLSearchParams(window.location.search);
  return params.get('categoria') || '';
}

/**
 * Render visual segments grid (like the image grid)
 */
function renderVisualSegments() {
  const container = document.getElementById('visualSegments');
  if (!container) return;

  container.innerHTML = VISUAL_SEGMENTS.map(segment => `
    <a href="paquetes.html?categoria=${segment.id}" class="segment-card">
      <img src="${segment.image}" alt="${segment.name}" loading="lazy">
      <div class="segment-card__overlay">
        <span class="segment-card__title">${segment.name}</span>
      </div>
    </a>
  `).join('');
}

/**
 * Render featured news (for homepage)
 */
function renderFeaturedNews() {
  const container = document.getElementById('featuredNews');
  if (!container || !newsData.news) return;

  const featured = newsData.news.filter(n => n.featured);
  const mainNews = featured[0] || newsData.news[0];
  const sideNews = newsData.news.slice(1, 4);

  if (!mainNews) return;

  container.innerHTML = `
    <a href="noticia.html?slug=${mainNews.slug}" class="news-featured__main">
      <img src="${mainNews.image}" alt="${mainNews.title}" loading="lazy">
      <div class="news-featured__content">
        <span class="news-featured__category">${mainNews.category}</span>
        <h3 class="news-featured__title">${mainNews.title}</h3>
        <p class="news-featured__excerpt">${mainNews.excerpt}</p>
      </div>
    </a>
    <div class="news-featured__sidebar">
      ${sideNews.map(news => `
        <a href="noticia.html?slug=${news.slug}" class="news-sidebar-card">
          <div class="news-sidebar-card__image">
            <img src="${news.image}" alt="${news.title}" loading="lazy">
          </div>
          <div class="news-sidebar-card__content">
            <h4 class="news-sidebar-card__title">${news.title}</h4>
            <span class="news-sidebar-card__meta">${getRelativeTime(news.date)}</span>
          </div>
        </a>
      `).join('')}
    </div>
  `;
}

/**
 * Render latest news grid
 */
function renderLatestNews() {
  const container = document.getElementById('latestNews');
  if (!container || !newsData.news) return;

  const news = newsData.news.slice(0, 6);

  container.innerHTML = news.map(item => `
    <a href="noticia.html?slug=${item.slug}" class="news-card">
      <div class="news-card__image">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        <span class="news-card__category">${item.category}</span>
      </div>
      <div class="news-card__body">
        <h3 class="news-card__title">${item.title}</h3>
        <p class="news-card__excerpt">${item.excerpt}</p>
        <div class="news-card__meta">
          <div class="news-card__author">
            <span class="news-card__author-avatar">AL</span>
            <span>${item.author}</span>
          </div>
          <span>${getRelativeTime(item.date)}</span>
        </div>
      </div>
    </a>
  `).join('');
}

/**
 * Render all news (for news page)
 */
function renderAllNews() {
  const container = document.getElementById('allNews');
  if (!container || !newsData.news) return;

  container.innerHTML = newsData.news.map(item => `
    <a href="noticia.html?slug=${item.slug}" class="news-card">
      <div class="news-card__image">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        <span class="news-card__category">${item.category}</span>
      </div>
      <div class="news-card__body">
        <h3 class="news-card__title">${item.title}</h3>
        <p class="news-card__excerpt">${item.excerpt}</p>
        <div class="news-card__meta">
          <div class="news-card__author">
            <span class="news-card__author-avatar">AL</span>
            <span>${item.author}</span>
          </div>
          <span>${getRelativeTime(item.date)}</span>
        </div>
      </div>
    </a>
  `).join('');
}

/**
 * Render featured packages
 */
function renderFeaturedPackages() {
  const container = document.getElementById('featuredPackages');
  if (!container || !packagesData.packages) return;

  const featured = packagesData.packages.filter(p => p.featured).slice(0, 8);

  container.innerHTML = featured.map(pkg => renderPackageCard(pkg)).join('');
}

/**
 * Render all packages (for packages page)
 */
function renderAllPackages() {
  const container = document.getElementById('allPackages');
  if (!container || !packagesData.packages) return;

  const category = getActiveCategory();
  let packages = packagesData.packages;

  if (category) {
    packages = packages.filter(p => p.segments && p.segments.includes(category));
  }

  if (packages.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">&#128269;</div>
        <h3 class="empty-state__title">No hay paquetes disponibles</h3>
        <p class="empty-state__text">No encontramos paquetes para esta categoria. Prueba con otra busqueda.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = packages.map(pkg => renderPackageCard(pkg)).join('');
}

/**
 * Render single package card
 */
function renderPackageCard(pkg) {
  const badgeHTML = pkg.badge ? `<span class="package-card__badge package-card__badge--${pkg.badge}">${pkg.badge === 'hot' ? 'Oferta' : pkg.badge === 'new' ? 'Nuevo' : pkg.badge}</span>` : '';

  return `
    <article class="package-card">
      <a href="paquete.html?slug=${pkg.slug}">
        <div class="package-card__image">
          <img src="${pkg.image}" alt="${pkg.title}" loading="lazy">
          ${badgeHTML}
        </div>
        <div class="package-card__body">
          <span class="package-card__destination">${pkg.destination}</span>
          <h3 class="package-card__title">${pkg.title}</h3>
          <div class="package-card__details">
            <span class="package-card__detail">&#128197; ${pkg.nights} noches</span>
            <span class="package-card__detail">&#9992; Desde ${pkg.origin}</span>
          </div>
          <div class="package-card__includes">
            ${pkg.includes.slice(0, 3).map(inc => `<span class="package-card__include">${inc}</span>`).join('')}
          </div>
          <div class="package-card__footer">
            <div>
              <span class="package-card__price-label">Desde</span>
              <div class="package-card__price">${formatARS(pkg.priceARS)}</div>
            </div>
            <span class="package-card__cta">Ver mas</span>
          </div>
        </div>
      </a>
    </article>
  `;
}

/**
 * Render featured flights
 */
function renderFeaturedFlights() {
  const container = document.getElementById('featuredFlights');
  if (!container || !flightsData.flights) return;

  const flights = flightsData.flights.slice(0, 4);

  container.innerHTML = flights.map(flight => `
    <article class="flight-card">
      <div class="flight-card__header">
        <div class="flight-card__airline">
          <div class="flight-card__airline-logo">${flight.airlineCode}</div>
          <span class="flight-card__airline-name">${flight.airline}</span>
        </div>
        <span class="flight-card__status flight-card__status--${flight.status}">${flight.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}</span>
      </div>
      <div class="flight-card__route">
        <div class="flight-card__city">
          <span class="flight-card__code">${flight.origin}</span>
          <span class="flight-card__city-name">${flight.originCity}</span>
        </div>
        <div class="flight-card__path">
          <div class="flight-card__line"></div>
        </div>
        <div class="flight-card__city">
          <span class="flight-card__code">${flight.destination}</span>
          <span class="flight-card__city-name">${flight.destinationCity}</span>
        </div>
      </div>
      <div class="flight-card__details">
        <div>
          <div>${formatDate(flight.departureDate)}</div>
          <div>${flight.duration} ${flight.stops > 0 ? '(' + flight.stops + ' escala)' : 'Directo'}</div>
        </div>
        <div class="flight-card__price">
          <div class="flight-card__price-value">${formatARS(flight.priceARS)}</div>
        </div>
      </div>
    </article>
  `).join('');
}

/**
 * Render all flights (for flights page)
 */
function renderAllFlights() {
  const container = document.getElementById('allFlights');
  if (!container || !flightsData.flights) return;

  container.innerHTML = flightsData.flights.map(flight => `
    <article class="flight-card">
      <div class="flight-card__header">
        <div class="flight-card__airline">
          <div class="flight-card__airline-logo">${flight.airlineCode}</div>
          <span class="flight-card__airline-name">${flight.airline}</span>
        </div>
        <span class="flight-card__status flight-card__status--${flight.status}">${flight.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}</span>
      </div>
      <div class="flight-card__route">
        <div class="flight-card__city">
          <span class="flight-card__code">${flight.origin}</span>
          <span class="flight-card__city-name">${flight.originCity}</span>
        </div>
        <div class="flight-card__path">
          <div class="flight-card__line"></div>
        </div>
        <div class="flight-card__city">
          <span class="flight-card__code">${flight.destination}</span>
          <span class="flight-card__city-name">${flight.destinationCity}</span>
        </div>
      </div>
      <div class="flight-card__details">
        <div>
          <div>${formatDate(flight.departureDate)}</div>
          <div>${flight.duration} ${flight.stops > 0 ? '(' + flight.stops + ' escala en ' + flight.stopCity + ')' : 'Directo'}</div>
        </div>
        <div class="flight-card__price">
          <div class="flight-card__price-value">${formatARS(flight.priceARS)}</div>
          <div style="font-size: 13px; color: #767676;">${formatUSD(flight.priceUSD)}</div>
        </div>
      </div>
    </article>
  `).join('');
}

/**
 * Render featured activities
 */
function renderFeaturedActivities() {
  const container = document.getElementById('featuredActivities');
  if (!container || !activitiesData.activities) return;

  const activities = activitiesData.activities.slice(0, 4);

  container.innerHTML = activities.map(activity => `
    <article class="activity-card">
      <a href="actividad.html?slug=${activity.slug}">
        <div class="activity-card__image">
          <img src="${activity.image}" alt="${activity.title}" loading="lazy">
        </div>
        <div class="activity-card__body">
          <span class="activity-card__location">${activity.location}</span>
          <h3 class="activity-card__title">${activity.title}</h3>
          <div class="activity-card__rating">
            <span class="activity-card__stars">${generateStars(activity.rating)}</span>
            <span class="activity-card__reviews">(${activity.reviews})</span>
          </div>
          <div class="activity-card__footer">
            <span class="activity-card__price">${formatARS(activity.priceARS)}</span>
            <span class="activity-card__duration">${activity.duration}</span>
          </div>
        </div>
      </a>
    </article>
  `).join('');
}

/**
 * Render all activities (for activities page)
 */
function renderAllActivities() {
  const container = document.getElementById('allActivities');
  if (!container || !activitiesData.activities) return;

  container.innerHTML = activitiesData.activities.map(activity => `
    <article class="activity-card">
      <a href="actividad.html?slug=${activity.slug}">
        <div class="activity-card__image">
          <img src="${activity.image}" alt="${activity.title}" loading="lazy">
        </div>
        <div class="activity-card__body">
          <span class="activity-card__location">${activity.location}</span>
          <h3 class="activity-card__title">${activity.title}</h3>
          <div class="activity-card__rating">
            <span class="activity-card__stars">${generateStars(activity.rating)}</span>
            <span class="activity-card__reviews">(${activity.reviews} opiniones)</span>
          </div>
          <div class="activity-card__footer">
            <span class="activity-card__price">${formatARS(activity.priceARS)}</span>
            <span class="activity-card__duration">${activity.duration}</span>
          </div>
        </div>
      </a>
    </article>
  `).join('');
}

/**
 * Render featured assistance
 */
function renderFeaturedAssistance() {
  const container = document.getElementById('featuredAssistance');
  if (!container || !assistanceData.assistance) return;

  const plans = assistanceData.assistance.slice(0, 3);

  container.innerHTML = plans.map(plan => `
    <article class="assistance-card ${plan.featured ? 'assistance-card--featured' : ''}">
      <div class="assistance-card__icon">&#128137;</div>
      <h3 class="assistance-card__title">${plan.name}</h3>
      <p class="assistance-card__coverage">Cobertura: ${plan.coverage}</p>
      <div class="assistance-card__features">
        ${plan.features.slice(0, 5).map(feature => `
          <div class="assistance-card__feature">
            <span class="assistance-card__check">&#10003;</span>
            ${feature}
          </div>
        `).join('')}
      </div>
      <div class="assistance-card__price">
        <span class="assistance-card__price-label">Desde</span>
        <span class="assistance-card__price-value">USD ${plan.pricePerDay}</span>
        <span class="assistance-card__price-period">/ dia</span>
      </div>
      <a href="asistencias.html" class="btn btn--primary btn--full">Cotizar</a>
    </article>
  `).join('');
}

/**
 * Render all assistance plans (for assistance page)
 */
function renderAllAssistance() {
  const container = document.getElementById('allAssistance');
  if (!container || !assistanceData.assistance) return;

  container.innerHTML = assistanceData.assistance.map(plan => `
    <article class="assistance-card ${plan.featured ? 'assistance-card--featured' : ''}">
      <div class="assistance-card__icon">&#128137;</div>
      <h3 class="assistance-card__title">${plan.name}</h3>
      <p class="assistance-card__coverage">Cobertura: ${plan.coverage}</p>
      <div class="assistance-card__features">
        ${plan.features.map(feature => `
          <div class="assistance-card__feature">
            <span class="assistance-card__check">&#10003;</span>
            ${feature}
          </div>
        `).join('')}
      </div>
      <div class="assistance-card__price">
        <span class="assistance-card__price-label">Desde</span>
        <span class="assistance-card__price-value">USD ${plan.pricePerDay}</span>
        <span class="assistance-card__price-period">/ dia</span>
      </div>
      <button class="btn btn--primary btn--full" onclick="alert('Funcionalidad de cotizacion - Contactenos para mas informacion')">Cotizar</button>
    </article>
  `).join('');
}

/**
 * Render single news article
 */
function renderNewsArticle() {
  const container = document.getElementById('newsArticle');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  const article = newsData.news.find(n => n.slug === slug);

  if (!article) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">&#128240;</div>
        <h3 class="empty-state__title">Noticia no encontrada</h3>
        <p class="empty-state__text">La noticia que buscas no existe o fue eliminada.</p>
        <a href="noticias.html" class="btn btn--primary mt-2">Ver todas las noticias</a>
      </div>
    `;
    return;
  }

  document.title = `${article.title} | Viajoyo`;

  container.innerHTML = `
    <article class="article">
      <header class="article__header">
        <span class="article__category">${article.category}</span>
        <h1 class="article__title">${article.title}</h1>
        <div class="article__meta">
          <div class="article__author">
            <span class="article__author-avatar">AL</span>
            <div>
              <strong>${article.author}</strong>
              <div>${formatDate(article.date)}</div>
            </div>
          </div>
        </div>
      </header>

      <img src="${article.image}" alt="${article.title}" class="article__image">

      <div class="article__content">
        ${article.content}
      </div>

      <div class="article__tags">
        ${article.tags.map(tag => `<a href="noticias.html?tag=${encodeURIComponent(tag)}" class="article__tag">${tag}</a>`).join('')}
      </div>

      ${article.source ? `
      <div class="article__source">
        <strong>Fuente:</strong>
        ${article.sourceUrl ? `<a href="${article.sourceUrl}" target="_blank" rel="noopener noreferrer">${article.source}</a>` : article.source}
      </div>
      ` : ''}
    </article>
  `;
}

/**
 * Render single package detail
 */
function renderPackageDetail() {
  const container = document.getElementById('packageDetail');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  const pkg = packagesData.packages.find(p => p.slug === slug);

  if (!pkg) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">&#127747;</div>
        <h3 class="empty-state__title">Paquete no encontrado</h3>
        <p class="empty-state__text">El paquete que buscas no existe o ya no esta disponible.</p>
        <a href="paquetes.html" class="btn btn--primary mt-2">Ver todos los paquetes</a>
      </div>
    `;
    return;
  }

  document.title = `${pkg.title} | Viajoyo`;

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr; gap: 32px;">
      <div>
        <img src="${pkg.image}" alt="${pkg.title}" style="width: 100%; height: 400px; object-fit: cover; border-radius: 12px;">
      </div>
      <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.12);">
        <span style="font-size: 12px; font-weight: 600; color: #767676; text-transform: uppercase;">${pkg.destination}</span>
        <h1 style="font-size: 28px; margin: 8px 0 16px;">${pkg.title}</h1>

        <div style="display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap;">
          <span style="display: flex; align-items: center; gap: 4px; font-size: 14px;">&#128197; ${pkg.nights} noches</span>
          <span style="display: flex; align-items: center; gap: 4px; font-size: 14px;">&#9992; Desde ${pkg.origin}</span>
        </div>

        <p style="color: #484848; line-height: 1.6; margin-bottom: 20px;">${pkg.description}</p>

        <div style="margin-bottom: 20px;">
          <h4 style="margin-bottom: 12px;">Incluye:</h4>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${pkg.includes.map(inc => `<span style="padding: 6px 12px; background: #F7F7F7; border-radius: 4px; font-size: 13px;">${inc}</span>`).join('')}
          </div>
        </div>

        <div style="border-top: 1px solid #EBEBEB; padding-top: 20px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-size: 13px; color: #767676;">Precio por persona</span>
            <div style="font-size: 32px; font-weight: 800; color: #FF5A5F;">${formatARS(pkg.priceARS)}</div>
            <span style="font-size: 14px; color: #767676;">${formatUSD(pkg.priceUSD)}</span>
          </div>
          <button class="btn btn--primary" style="padding: 14px 32px;" onclick="alert('Funcionalidad de consulta - Contactenos para mas informacion')">Consultar</button>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// SEARCH & FILTERS
// ============================================

/**
 * Handle search form submission
 */
function handleSearch(event) {
  event.preventDefault();

  const form = event.target;
  const origin = form.origin?.value || '';
  const destination = form.destination?.value || '';
  const dates = form.dates?.value || '';

  const params = new URLSearchParams();
  if (destination) params.set('destino', destination);
  if (origin) params.set('origen', origin);
  if (dates) params.set('fecha', dates);

  window.location.href = `paquetes.html?${params.toString()}`;
}

// ============================================
// ANALYTICS & TRACKING
// ============================================

/**
 * Track ad click
 */
function trackAdClick(bannerId) {
  if (typeof gtag === 'function') {
    gtag('event', 'ad_click', {
      'banner_id': bannerId,
      'page': window.location.pathname
    });
  }
  console.log('Ad clicked:', bannerId);
}

/**
 * Track page view
 */
function trackPageView() {
  if (typeof gtag === 'function') {
    gtag('event', 'page_view', {
      'page_title': document.title,
      'page_location': window.location.href,
      'page_path': window.location.pathname
    });
  }
}

// ============================================
// MOBILE MENU
// ============================================

function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('nav--open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('nav--open');
      }
    });
  }
}

// ============================================
// SEARCH TABS
// ============================================

function initSearchTabs() {
  const tabs = document.querySelectorAll('.search-tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('search-tab--active'));
      tab.classList.add('search-tab--active');
    });
  });
}

// ============================================
// INITIALIZATION
// ============================================

async function init() {
  // Load all data
  await loadData();

  // Initialize UI components
  initMobileMenu();
  initSearchTabs();

  // Render components based on current page
  const page = window.location.pathname.split('/').pop() || 'index.html';

  // Common renders
  renderCategories();

  // Page-specific renders
  switch (page) {
    case 'index.html':
    case '':
      renderVisualSegments();
      renderFeaturedNews();
      renderLatestNews();
      renderFeaturedPackages();
      renderFeaturedFlights();
      renderFeaturedActivities();
      renderFeaturedAssistance();
      break;

    case 'noticias.html':
      renderAllNews();
      break;

    case 'noticia.html':
      renderNewsArticle();
      break;

    case 'paquetes.html':
      renderAllPackages();
      break;

    case 'paquete.html':
      renderPackageDetail();
      break;

    case 'vuelos.html':
      renderAllFlights();
      break;

    case 'actividades.html':
      renderAllActivities();
      break;

    case 'asistencias.html':
      renderAllAssistance();
      break;
  }

  // Bind search form
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', handleSearch);
  }

  // Track page view
  trackPageView();
}

// Make trackAdClick globally available
window.trackAdClick = trackAdClick;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
