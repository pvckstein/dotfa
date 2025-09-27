// esm/modes/page.js
// Renderiza scrap="page" (índice/anclas de h1..h6, con level)

function collectPage({ within, select='h1,h2,h3', mode='text', title }){
  let root = document;
  if (within){ const r = document.querySelector(within); if (r) root = r; }

  const nodes = [...root.querySelectorAll(select)];
  const items = nodes.map((el,i)=>{
    const m = (el.tagName||'').match(/^H(\d)$/i);
    const level = m ? parseInt(m[1],10) : 0;

    if (!el.id){
      const base = ((el.textContent||'')
        .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
        .toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')) || ('sec-'+i);
      let id = base, n=1;
      while (document.getElementById(id)) id = base + '-' + n++;
      el.id = id;
    }
    const val = mode === 'html' ? (el.innerHTML||'').trim() : (el.textContent||'').trim();
    return { id: el.id, text: val, level };
  }).filter(x => x.text);

  return { titulo: title || document.title || 'Página', items };
}

export function renderPage(host, doT, user){
  const tplId = host.getAttribute('dot');
  const tpl   = document.getElementById(tplId);
  if (!tpl) return;

  const within = host.getAttribute('within');
  const select = host.getAttribute('select') || 'h1,h2,h3';
  const mode   = (host.getAttribute('mode') || 'text').toLowerCase();
  const title  = host.getAttribute('title');
  const into   = host.getAttribute('into') || 'items';

  const data = collectPage({ within, select, mode, title });
  const pack = { titulo: data.titulo }; pack[into] = data.items;

  const fn = doT.template(tpl.innerHTML);
  host.innerHTML = fn({ ...pack, user });
}
