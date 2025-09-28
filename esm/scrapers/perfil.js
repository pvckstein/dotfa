// esm/scrapers/perfil.js
import { registerScraper, util, parseCampoPerfil } from '../dotfa-core.js';

function decodeHtmlEntities(str){
  if (!str) return '';
  const ta = document.createElement('textarea');
  ta.innerHTML = str;
  return ta.value;
}

function scrapePerfil(root = document){
  const { text, slug } = util;
  const cont = root.querySelector('#perfil');
  if (!cont) return { by:{}, el:null };

  const by = {};

  // 1) Bloques con atributo [campo="..."] → clave directa (lowercase)
  cont.querySelectorAll('[campo]').forEach(el=>{
    const k = (el.getAttribute('campo') || '').toLowerCase();
    if (!k) return;
    const htmlRaw = (el.innerHTML || '').trim();
    by[k] = {
      title: k,
      html  : htmlRaw,
      value : text(htmlRaw),
      el
    };
  });

  // 2) Campos con label (".campo_perfil") → clave desde atributo "campo" o slug del label
  cont.querySelectorAll('[id^="field_id"]').forEach(box=>{
    const ka  = (box.getAttribute('campo') || '').toLowerCase(); // opcional
    const lbl = (box.querySelector('span')?.textContent || '')
                  .replace(/\s*:\s*$/, '').trim();
    const key = ka || slug(lbl) || 'campo';

    const valEl  = box.querySelector('.field_uneditable') || box;
    const htmlRaw = (valEl.innerHTML || '').trim();

    by[key] = {
      title : ka ? (lbl || ka) : lbl,
      html  : htmlRaw,
      value : text(htmlRaw),
      el    : box
    };
  });

  // 3) Avatar: añade src limpio y corrige html (no-escapado) si venía con entidades
  const img = cont.querySelector('.avatar img');
  if (by.avatar) {
    // src como primitivo
    by.avatar.src = img?.src || '';

    // html real del <img> (no entidades)
    const raw = img ? img.outerHTML : by.avatar.html;
    by.avatar.html = /&lt;|&gt;|&amp;/.test(raw) ? decodeHtmlEntities(raw) : raw;
  }

  return { by, el: cont };
}

registerScraper('perfil', () => scrapePerfil(document));
export default scrapePerfil;
