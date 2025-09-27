import { registerScraper, util, parseCampoPerfil } from '../dotfa-core.js';

function scrapePost(post){
  const { text } = util;
  const by={}, autor=post.querySelector('.autor')||post;
  const u=autor.querySelector('.username'); if(u) by.username={ value:text(u.innerHTML), html:u.innerHTML.trim(), el:u };
  const a=autor.querySelector('.avatar img'); if(a) by.avatar={ value:a.src, html:a.outerHTML, el:a };
  const r=autor.querySelector('.rango'); if(r) by.rango={ value:text(r.innerHTML), html:r.innerHTML.trim(), el:r };
  const pid=autor.querySelector('.postid'); if(pid) by.postid={ value:text(pid.innerHTML), html:pid.innerHTML.trim(), el:pid };
  const f=post.querySelector('.postbody .fecha'); if(f) by.fecha={ value:text(f.innerHTML), html:f.innerHTML.trim(), el:f };
  autor.querySelectorAll('.campo_perfil').forEach(el=>{ const {key,data}=parseCampoPerfil(el); by[key]=data; });
  return by;
}

function collectPosts(){
  return [...document.querySelectorAll('.post')].map(p=>({ el:p, by:scrapePost(p) }));
}

registerScraper('posts', collectPosts);
export default collectPosts;
