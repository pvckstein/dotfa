import { registerScraper, util, parseCampoPerfil } from '../dotfa-core.js';

function scrapePerfil(root=document){
  const { text, slug } = util;
  const cont=root.querySelector('#perfil'); if(!cont) return {by:{},el:null};
  const by={};
  cont.querySelectorAll('[campo]').forEach(el=>{
    const k=(el.getAttribute('campo')||'').toLowerCase(); if(!k) return;
    by[k]={ title:k, html:el.innerHTML.trim(), value:text(el.innerHTML), el };
  });
  cont.querySelectorAll('[id^="field_id"]').forEach(box=>{
    const ka=(box.getAttribute('campo')||'').toLowerCase();
    const lbl=(box.querySelector('span')?.textContent||'').replace(/\s*:\s*$/,'').trim();
    const k=ka||slug(lbl)||'campo';
    const val=box.querySelector('.field_uneditable')||box;
    const html=(val.innerHTML||'').trim();
    by[k]={ title: ka?(lbl||ka):lbl, html, value:text(html), el:box };
  });
  return {by,el:cont};
}

registerScraper('perfil', () => scrapePerfil(document));
export default scrapePerfil;
