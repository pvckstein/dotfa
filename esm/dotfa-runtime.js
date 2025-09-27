// esm/dotfa-runtime.js
import {
  loadDoT, applyDoT, getScraper, util, parseCampoPerfil
} from '../dotfa-core.js';

// scrapers del foro (DOM / globals)
import '../scrapers/posts.js';
import '../scrapers/perfil.js';
import '../scrapers/memberlist.js';
import '../scrapers/user.js';

// modes (no-HTML del foro)
import { renderCustom }                 from '../modes/custom.js';
import { renderFetch, renderFetchData } from '../modes/fetch.js';
import { renderPage }                   from '../modes/page.js';

// --------- helpers internos ---------
const tplCache = new Map(); // tplId -> compiled function

function compileTpl(doT, tplId, html){
  let fn = tplCache.get(tplId);
  if (!fn){
    fn = doT.template(html);
    tplCache.set(tplId, fn);
  }
  return fn;
}

export default async function init(){
  const doT = await loadDoT();
  if (!doT?.template){ console.warn('[dot] doT no disponible'); return; }

  // Parcheo único de la sintaxis [[ ]]
  if (!doT.__dotPatched){ applyDoT(doT); doT.__dotPatched = true; }

  // Datos base vía scrapers
  const postsS   = getScraper('posts');
  const perfilS  = getScraper('perfil');
  const userS    = getScraper('user');

  const posts    = postsS ? postsS() : [];
  const perfil   = perfilS ? perfilS() : { by:{}, el:null };
  const userPack = userS ? userS() : { user:null, lang:null, board:null };
  const { user, lang, board } = userPack;

  // 1) Templating inline del postheader si contiene doT
  posts.forEach(p=>{
    const h = p.el.querySelector('.postheader'); if (!h) return;
    const raw = h.innerHTML; if (!/\[\[|\[\=|\[\!|\[\#/.test(raw)) return;
    // Compila "anónimo" sin id de tpl (no está en <template>)
    const fn = doT.template(raw);
    h.innerHTML = fn({ by:p.by, ...userPack });
  });

  // 2) Render de hosts [dot]
  const hosts = [...document.querySelectorAll('[dot]')];

  await Promise.all(hosts.map(async host=>{
    const scrap = (host.getAttribute('scrap')||'').trim();

    // ----- modos "no scraper" -----
    if (scrap === 'custom')       return renderCustom(host, doT, user);
    if (scrap === 'fetch')        return renderFetch(host, doT, user, 'fetch');
    if (scrap === 'fetch-html')   return renderFetch(host, doT, user, 'fetch-html');
    if (scrap === 'page')         return renderPage(host, doT, user);

    // ----- a partir de aquí: modos basados en scrapers del foro -----

    const tplId = host.getAttribute('dot');
    const tpl   = document.getElementById(tplId);
    if (!tpl) return;

    const fn = compileTpl(doT, tplId, tpl.innerHTML);

    // posts (lista)
    if (scrap === 'posts'){
      // enriquecimiento opcional con JSON común: from="fetch|fetch-html"
      let extra = {};
      const from = (host.getAttribute('from')||'').trim();
      if (from === 'fetch' || from === 'fetch-html'){
        const url    = host.getAttribute('url');
        const path   = host.getAttribute('path');
        const into   = host.getAttribute('into');
        const selScr = host.getAttribute('script');
        const selAny = host.getAttribute('select');
        try{
          const data = await renderFetchData({ from, url, path, into, selScr, selAny });
          extra = data || {};
        }catch(e){ console.warn('[dot] enrich posts fallo:', e); }
      }

      // Render eficiente con DocumentFragment (evita innerHTML +=)
      const frag = document.createDocumentFragment();
      posts.forEach(p => {
        const html = fn({ by:p.by, user, lang, board, postEl:p.el, ...extra });
        const tmp  = document.createElement('div'); tmp.innerHTML = html;
        while (tmp.firstChild) frag.appendChild(tmp.firstChild);
      });
      host.innerHTML = '';
      host.appendChild(frag);
      return;
    }

    // perfil (único)
    if (scrap === 'perfil'){
      host.innerHTML = fn({ by:perfil.by, user, lang, board, perfilEl:perfil.el });
      return;
    }

    // memberlist (único)
    if (scrap === 'memberlist'){
      const mlS  = getScraper('memberlist');
      const data = mlS ? mlS() : { title:'', form_html:'', members:[], pagination_html:'' };
      host.innerHTML = fn({ ...data, user, lang, board });
      return;
    }

    // user (único) — datos globales (_userdata, _lang, _board)
    if (scrap === 'user'){
      host.innerHTML = fn(userPack);
      return;
    }

    // ----- Fallback genérico: si existe un scraper con ese nombre, úsalo -----
    const anyS = getScraper(scrap);
    if (anyS){
      const data = anyS() || {};
      host.innerHTML = fn({ ...data, user, lang, board });
      return;
    }

    // Si llega aquí, scrap no reconocido
    console.warn('[dot] scrap no reconocido:', scrap);
  }));

  // API mínima para debug / integración externa
  const readyObj = { doT, getScraper, util, parseCampoPerfil };
  window.dotReady = Promise.resolve(readyObj);
  window.__dotReadyResolve?.(readyObj);
}
