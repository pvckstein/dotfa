import { registerScraper, util, parseCampoPerfil } from '../dotfa-core.js';

function textOr(el, def='') { return el ? util.text(el.innerHTML) : def; }

function scrapePost(post){
  const by = {};
  const autor = post.querySelector('.autor') || post;

  by.username = textOr(autor.querySelector('.username'), 'Invitado');
  by.avatar   = autor.querySelector('.avatar img')?.src || autor.querySelector('img')?.src || '';
  by.rango    = textOr(autor.querySelector('.rango'));
  by.postid   = textOr(autor.querySelector('.postid'));
  by.fecha    = textOr(post.querySelector('.postbody .fecha'));

  // Campos de perfil adicionales (como primitivos si parseCampoPerfil te da .value)
  autor.querySelectorAll('.campo_perfil').forEach(el=>{
    const { key, data } = parseCampoPerfil(el);
    by[key] = data?.value ?? data ?? '';
  });

  return by;
}

function collectPosts(){
  // Solo posts mostrados: <div id="p123" class="post">…</div>
  const postsEls = [...document.querySelectorAll('#posts .post[id^="p"]')]
    // y que realmente tengan contenido de post
    .filter(el => el.querySelector('.postbody .content'));

  return postsEls.map(p => ({ el:p, by:scrapePost(p) }));
}


registerScraper('posts', collectPosts);
export default collectPosts;
