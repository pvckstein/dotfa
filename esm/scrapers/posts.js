// esm/scrapers/posts.js
import { registerScraper, util, parseCampoPerfil } from '../dotfa-core.js';

function textOr(el, def='') { return el ? util.text(el.innerHTML) : def; }

function enrichUserIds(autor, by){
  // Candidatos donde suele estar el link al perfil
  const aPerfil =
    autor.querySelector('.username a[href^="/u"]') ||
    autor.querySelector('.avatar a[href^="/u"]') ||
    autor.querySelector('[campo="linkperfil"] a[href^="/u"]');

  if (aPerfil){
    const rel = aPerfil.getAttribute('href') || '';
    const abs = aPerfil.href || rel;
    const m   = rel.match(/\/u(\d+)/);
    if (m){
      by.userid   = m[1];            // "1"
      by.posterid = 'u' + m[1];      // "u1"
    }
    by.profile_href     = rel;       // relativo (ej: "/u1")
    by.profile_abs_href = abs;       // absoluto (resuelto por el navegador)
  }

  // Enlace a MP si existe (útil por si quieres construir cosas con el id)
  const aMp = autor.querySelector('[campo="linkmp"] a');
  if (aMp){
    by.mp_href     = aMp.getAttribute('href') || '';
    by.mp_abs_href = aMp.href || by.mp_href;
    // a veces el id viene como ?u=1 en el MP
    if (!by.userid){
      const um = by.mp_href.match(/[?&]u=(\d+)/);
      if (um){
        by.userid   = um[1];
        by.posterid = 'u' + um[1];
      }
    }
  }
}

function scrapePost(post){
  const by = {};
  const autor = post.querySelector('.autor') || post;

  // Básicos (planos)
  by.username = textOr(autor.querySelector('.username'), 'Invitado');
  by.avatar   = autor.querySelector('.avatar img')?.src || autor.querySelector('img')?.src || '';
  by.rango    = textOr(autor.querySelector('.rango'));
  by.postid   = textOr(autor.querySelector('.postid'));
  by.fecha    = textOr(post.querySelector('.postbody .fecha'));

  // ID de usuario y enlaces (perfil / MP)
  enrichUserIds(autor, by);

  // Campos de perfil adicionales (como primitivos si parseCampoPerfil te da .value)
  autor.querySelectorAll('.campo_perfil').forEach(el=>{
    const parsed = parseCampoPerfil(el);
    if (!parsed) return;
    const { key, data } = parsed; // data: { value, html, el }
    by[key] = data?.value ?? data ?? '';
  });

  return by;
}

function collectPosts(){
  // Solo posts mostrados: <div id="p123" class="post">…</div>
  const postsEls = [...document.querySelectorAll('#posts .post[id^="p"]')]
    .filter(el => el.querySelector('.postbody .content')); // asegúrate que es un post real

  return postsEls.map(p => ({ el:p, by:scrapePost(p) }));
}

registerScraper('posts', collectPosts);
export default collectPosts;
