// --- doT loader + settings ---
export function loadDoT(src = 'https://cdn.jsdelivr.net/npm/dot/doT.min.js'){
  return new Promise(res => {
    if (window.doT?.template) return res(window.doT);
    if (document.querySelector('script[data-dotfa-dot]')) {
      // ya inyectado, espera a que cargue
      const check = () => window.doT?.template ? res(window.doT) : setTimeout(check, 25);
      return check();
    }
    const s = document.createElement('script');
    s.src = src; s.async = true; s.defer = true; s.setAttribute('data-dotfa-dot','1');
    s.onload = () => res(window.doT);
    document.head.appendChild(s);
  });
}

export function applyDoT(doT){
  doT.templateSettings = {
    interpolate:/\[\=\s*([\s\S]+?)\s*\]/g,
    encode:/\[\!\s*([\s\S]+?)\s*\]/g,
    evaluate:/\[\[\s*([\s\S]+?)\s*\]\]/g,
    define:/\[\[\#\#\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\]\]/g,
    use:/\[\#\s*([\s\S]+?)\s*\]/g,
    conditional:/\[\[\?(\?)?\s*([\s\S]*?)\s*\]\]/g,
    iterate:/\[\[\~\s*(?:\]\]|\s*([\s\S]+?)\s*:\s*([\w$]+)\s*(?:\s*:\s*([\w$]+))?\s*\]\])/g,
    varname:'it', strip:false, append:true, selfcontained:false
  };
}

// --- utils que usan los scrapers ---
export const util = {
  text(html){ const d=document.createElement('div'); d.innerHTML=html||''; return (d.textContent||'').trim(); },
  slug(t){ return (t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
           .replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,''); }
};

// Ejemplo util especial usado por varios scrapers
export function parseCampoPerfil(el){
  const { text, slug } = util;
  const k=(el.getAttribute('campo')||slug(el.querySelector('.label')?.textContent)||'campo').toLowerCase();
  const tmp=el.cloneNode(true); tmp.querySelector('.label')?.remove();
  return { key:k, data:{ title:k, html:(tmp.innerHTML||'').trim(), value:text(tmp.innerHTML), el } };
}

// --- registro de scrapers como plugins ---
const registry = {
  scrapers: new Map(), // nombre → función (collector/scraper)
};

// API pública
export function hasScraper(name){ return registry.scrapers.has(name); }
export function registerScraper(name, fn, { override = false } = {}){
  if (!override && registry.scrapers.has(name)) {
    console.warn(`[dotfa] scraper "${name}" ya está registrado. Usa {override:true} para sustituirlo.`);
    return false;
  }
  registry.scrapers.set(name, fn);
  return true;
}
export function unregisterScraper(name){ return registry.scrapers.delete(name); }
export function getScraper(name){ return registry.scrapers.get(name); }
export function listScrapers(){ return Array.from(registry.scrapers.keys()); }

// expón en window por si usas bundle IIFE o plugins sueltos
window.DotFA = window.DotFA || {};
Object.assign(window.DotFA, {
  registerScraper, unregisterScraper, hasScraper, getScraper, listScrapers,
  util, parseCampoPerfil, loadDoT, applyDoT
});

// (Opcional) dotReady: promesa global que puedes resolver desde el runtime
if (!window.dotReady) {
  let _resolve;
  window.dotReady = new Promise(r => { _resolve = r; });
  window.__dotReadyResolve = _resolve; // el runtime puede llamarlo cuando esté listo
}
