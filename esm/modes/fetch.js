// esm/modes/fetch.js
// Renderiza scrap="fetch" y scrap="fetch-html" (carga JSON remoto o extraído de HTML)

const cache = new Map();
const byPath = (obj, p) => !p ? obj
  : p.split('.').reduce((a,k)=>(a && a[k] != null) ? a[k] : undefined, obj);

async function loadJson({ from, url, selScr, selAny }){
  const key = [from, url, selScr||'', selAny||''].join('|');
  if (cache.has(key)) return cache.get(key);

  let json;
  if (from === 'fetch'){
    const r = await fetch(url, { credentials:'same-origin' });
    if (!r.ok) throw new Error('HTTP '+r.status);
    json = await r.json();
  } else if (from === 'fetch-html'){
    const r = await fetch(url, { credentials:'same-origin' });
    if (!r.ok) throw new Error('HTTP '+r.status);
    const html = await r.text();
    const doc  = new DOMParser().parseFromString(html, 'text/html');
    let jt = '';
    // Prioridad: selector explícito → <script type="application/json"> → selector fallback
    if (selScr){ const el = doc.querySelector(selScr); if (el) jt = el.textContent || ''; }
    if (!jt){ const el = doc.querySelector('script[type="application/json"]'); if (el) jt = el.textContent || ''; }
    if (!jt && selAny){ const el = doc.querySelector(selAny); if (el) jt = el.textContent || ''; }
    if (!jt) throw new Error('No se encontró JSON embebido en la página destino');
    json = JSON.parse(jt);
  } else {
    return null;
  }
  cache.set(key, json);
  return json;
}

export async function renderFetch(host, doT, user, mode /* 'fetch' | 'fetch-html' */){
  const tplId = host.getAttribute('dot');
  const tpl   = document.getElementById(tplId);
  if (!tpl) return;

  const url    = host.getAttribute('url');
  const path   = host.getAttribute('path');  // opcional: proyección
  const into   = host.getAttribute('into');  // opcional: envolver en { [into]: data }
  const selScr = host.getAttribute('script'); // solo fetch-html
  const selAny = host.getAttribute('select'); // solo fetch-html

  if (!url){ console.warn('[dot] scrap="'+mode+'" requiere url'); return; }

  const fn = doT.template(tpl.innerHTML);
  host.innerHTML = '<div class="dot-loading">Cargando…</div>';

  try{
    const base = await loadJson({ from:mode, url, selScr, selAny });
    let data   = byPath(base, path);
    if (into){ const pack={}; pack[into]=data; data=pack; }
    host.innerHTML = fn({ ...(data||{}), user });
  }catch(e){
    console.warn('[dot] '+mode+' fallo:', e);
    host.innerHTML = '<div class="dot-error">No se pudo cargar.</div>';
  }
}

/**
 * renderFetchData
 * Usado por otros modos (ej. scrap="posts") para enriquecer datos
 * sin necesidad de renderizar plantilla directamente.
 */
export async function renderFetchData({ from = 'fetch', url, path, into, selScr, selAny }) {
  if (!url) return null;
  const base = await loadJson({ from, url, selScr, selAny });
  let data = byPath(base, path);
  if (into) {
    const pack = {};
    pack[into] = data;
    return pack;
  }
  return data ?? base;
}
