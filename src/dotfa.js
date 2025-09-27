/*! dotfa v1.1.0 — ForoActivo + doT (bundle, incluye scrap="memberlist") */
(function(){
  if(window.DotFA) return;
  window.DotFA={
    version:'1.1.0',
    loadDoT(){return new Promise(r=>{
      if(window.doT?.template) return r(window.doT);
      const s=document.createElement('script'); s.src='https://cdn.jsdelivr.net/npm/dot/doT.min.js';
      s.onload=()=>r(window.doT); document.head.appendChild(s);
    })},
    text(h){const d=document.createElement('div'); d.innerHTML=h||''; return (d.textContent||'').trim();},
    slug(t){return (t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');},
    parseCampoPerfil(el){
      const k=(el.getAttribute('campo')||this.slug(el.querySelector('.label')?.textContent)||'campo').toLowerCase();
      const tmp=el.cloneNode(true); tmp.querySelector('.label')?.remove();
      return {key:k,data:{title:k,html:(tmp.innerHTML||'').trim(),value:this.text(tmp.innerHTML),el}};
    },
    scrapePost(post){
      const by={}, autor=post.querySelector('.autor')||post, T=this.text.bind(this);
      const u=autor.querySelector('.username'); if(u) by.username={value:T(u.innerHTML),html:u.innerHTML.trim(),el:u};
      const a=autor.querySelector('.avatar img'); if(a) by.avatar={value:a.src,html:a.outerHTML,el:a};
      const r=autor.querySelector('.rango'); if(r) by.rango={value:T(r.innerHTML),html:r.innerHTML.trim(),el:r};
      const pid=autor.querySelector('.postid'); if(pid) by.postid={value:T(pid.innerHTML),html:pid.innerHTML.trim(),el:pid};
      const f=post.querySelector('.postbody .fecha'); if(f) by.fecha={value:T(f.innerHTML),html:f.innerHTML.trim(),el:f};
      autor.querySelectorAll('.campo_perfil').forEach(el=>{const {key,data}=this.parseCampoPerfil(el); by[key]=data;});
      return by;
    },
    scrapePerfil(root=document){
      const cont=root.querySelector('#perfil'); if(!cont) return {by:{},el:null};
      const by={}, T=this.text.bind(this), S=this.slug.bind(this);
      cont.querySelectorAll('[campo]').forEach(el=>{
        const k=(el.getAttribute('campo')||'').toLowerCase(); if(!k) return;
        by[k]={title:k,html:el.innerHTML.trim(),value:T(el.innerHTML),el};
      });
      cont.querySelectorAll('[id^="field_id"]').forEach(box=>{
        const ka=(box.getAttribute('campo')||'').toLowerCase();
        const lbl=(box.querySelector('span')?.textContent||'').replace(/\s*:\s*$/,'').trim();
        const k=ka||S(lbl)||'campo'; const val=box.querySelector('.field_uneditable')||box;
        const html=(val.innerHTML||'').trim();
        by[k]={title: ka?(lbl||ka):lbl, html, value:T(html), el:box};
      });
      return {by,el:cont};
    }
  };
})();

(async function(){
  if(window.__DOT_FA_BUNDLE__) return; window.__DOT_FA_BUNDLE__=true;
  const FA=window.DotFA; if(!FA){console.warn('[dot] Core no cargado'); return;}
  const doT=await FA.loadDoT(); if(!doT?.template){console.warn('[dot] doT no disponible'); return;}

  // doT con sintaxis de corchetes
  (function applyDoT(doT){
    doT.templateSettings={
      interpolate:/\[\=\s*([\s\S]+?)\s*\]/g,
      encode:/\[\!\s*([\s\S]+?)\s*\]/g,
      evaluate:/\[\[\s*([\s\S]+?)\s*\]\]/g,
      define:/\[\[\#\#\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\]\]/g,
      use:/\[\#\s*([\s\S]+?)\s*\]/g,
      conditional:/\[\[\?(\?)?\s*([\s\S]*?)\s*\]\]/g,
      iterate:/\[\[\~\s*(?:\]\]|\s*([\s\S]+?)\s*:\s*([\w$]+)\s*(?:\s*:\s*([\w$]+))?\s*\]\])/g,
      varname:'it', strip:false, append:true, selfcontained:false
    };
  })(doT);

  const user=window._userdata||window.userdata||null;
  const posts=[...document.querySelectorAll('.post')].map(p=>({el:p,by:FA.scrapePost(p)}));
  const perfil=FA.scrapePerfil(document);

  // Render inline del postheader si lleva doT
  posts.forEach(p=>{
    const h=p.el.querySelector('.postheader'); if(!h) return;
    const raw=h.innerHTML; if(!/\[\[|\[\=|\[\!|\[\#/.test(raw)) return;
    const fn=doT.template(raw); h.innerHTML=fn({by:p.by,user});
  });

  // Helpers fetch + cache
  const getByPath=(obj,p)=>!p?obj:p.split('.').reduce((a,k)=>(a&&a[k]!=null)?a[k]:undefined,obj);
  const cache=new Map();
  async function loadJson({from,url,selScr,selAny}){
    const key=[from,url,selScr||'',selAny||''].join('|');
    if(cache.has(key)) return cache.get(key);
    let json;
    if(from==='fetch'){
      const r=await fetch(url,{credentials:'same-origin'}); if(!r.ok) throw new Error('HTTP '+r.status);
      json=await r.json();
    }else if(from==='fetch-html'){
      const r=await fetch(url,{credentials:'same-origin'}); if(!r.ok) throw new Error('HTTP '+r.status);
      const html=await r.text(); const doc=new DOMParser().parseFromString(html,'text/html');
      let jt=''; if(selScr){const el=doc.querySelector(selScr); if(el) jt=el.textContent||'';}
      if(!jt){const el=doc.querySelector('script[type="application/json"]'); if(el) jt=el.textContent||'';}
      if(!jt && selAny){const el=doc.querySelector(selAny); if(el) jt=el.textContent||'';}
      if(!jt) throw new Error('No se encontró JSON embebido');
      json=JSON.parse(jt);
    }else{return null;}
    cache.set(key,json); return json;
  }

  // ------- NUEVO: scrap="memberlist" ----------
  function _t(el){return el?(el.textContent||'').trim():'';}
  function _h(el){return el?(el.innerHTML||'').trim():'';}
  function scrapeMemberlist(){
    const root=document.getElementById('memberlist');
    if(!root) return { title:'', form_html:'', members:[], pagination_html:'' };
    const title=_t(root.querySelector('.titulo'));
    const form =root.querySelector('#buscador form');
    const form_html=form?form.outerHTML:'';
    const members=[...root.querySelectorAll('#members .member')].map(m=>{
      let user_id=null;
      for(const n of m.childNodes){
        if(n.nodeType===3){const v=(n.nodeValue||'').trim(); if(/^\d+$/.test(v)){user_id=parseInt(v,10);break;}}
        if(n.nodeType===1 && n.classList?.contains('user_id')){const v=(n.textContent||'').trim(); if(/^\d+$/.test(v)) user_id=parseInt(v,10);}
      }
      return {
        user_id,
        avatar_html:_h(m.querySelector('.avatar')),
        username:_t(m.querySelector('.username')),
        groups_html:_h(m.querySelector('.group')),
        points:_t(m.querySelector('.points')),
        joined:_t(m.querySelector('.joined')),
        lastvisit:_t(m.querySelector('.lastvisit')),
        posts:_t(m.querySelector('.posts')),
        contact_html:_h(m.querySelector('.contact')),
        profile_url:(m.querySelector('a[href]')||{}).href||''
      };
    });
    const pagination_html=_h(root.querySelector('#members .pagination'));
    return { title, form_html, members, pagination_html };
  }
  // -------------------------------------------

  // Render de hosts
  const hosts=[...document.querySelectorAll('[dot]')];
  await Promise.all(hosts.map(async host=>{
    const id=host.getAttribute('dot'); const scrap=(host.getAttribute('scrap')||'').trim();
    const tpl=document.getElementById(id); if(!tpl) return; const fn=doT.template(tpl.innerHTML);

    if(scrap==='fetch' || scrap==='fetch-html'){
      const url=host.getAttribute('url'); const path=host.getAttribute('path'); const into=host.getAttribute('into');
      const selScr=host.getAttribute('script'); const selAny=host.getAttribute('select');
      if(!url){console.warn('[dot] scrap="'+scrap+'" requiere url'); return;}
      host.innerHTML='<div class="dot-loading">Cargando…</div>';
      try{
        const base=await loadJson({from:scrap,url,selScr,selAny});
        let data=getByPath(base,path); if(into){const pack={}; pack[into]=data; data=pack;}
        host.innerHTML=fn({...(data||{}),user});
      }catch(e){console.warn('[dot] '+scrap+' fallo:',e); host.innerHTML='<div class="dot-error">No se pudo cargar.</div>';}
      return;
    }

    if(scrap==='posts'){
      let extra={}; const from=(host.getAttribute('from')||'').trim();
      if(from){
        const url=host.getAttribute('url'); const path=host.getAttribute('path'); const into=host.getAttribute('into');
        const selScr=host.getAttribute('script'); const selAny=host.getAttribute('select');
        try{const base=await loadJson({from,url,selScr,selAny}); let data=getByPath(base,path);
          if(into){const pack={}; pack[into]=data; data=pack;} extra=data||{};
        }catch(e){console.warn('[dot] enrich posts fallo:',e);}
      }
      host.innerHTML=''; posts.forEach(p=>{ host.innerHTML+=fn({by:p.by,user,postEl:p.el,...extra}); });

    }else if(scrap==='perfil'){
      host.innerHTML=fn({by:perfil.by,user,perfilEl:perfil.el});

    }else if(scrap==='user'){
      host.innerHTML=fn({user});

    }else if(scrap==='custom'){
      let data={}; const raw=host.getAttribute('data')||host.getAttribute('data-json'); const vref=host.getAttribute('var')||host.getAttribute('data-var');
      if(raw){try{data=JSON.parse(raw);}catch(e){console.warn('[dot] JSON inválido en data',e);}}
      if(vref&&window[vref]) data=window[vref];
      host.innerHTML=fn({ ...data, user });

    }else if(scrap==='page'){
      const sel=host.getAttribute('select')||'h1,h2,h3';
      const within=host.getAttribute('within'); const mode=(host.getAttribute('mode')||'text').toLowerCase();
      const into=host.getAttribute('into')||'items'; const title=host.getAttribute('title')||document.title||'Página';
      let root=document; if(within){const r=document.querySelector(within); if(r) root=r;}
      const nodes=[...root.querySelectorAll(sel)];
      const items=nodes.map((el,i)=>{
        const m=(el.tagName||'').match(/^H(\d)$/i); const level=m?parseInt(m[1],10):0;
        if(!el.id){
          const base=((el.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''))||('sec-'+i);
          let id=base,n=1; while(document.getElementById(id)) id=base+'-'+n++;
          el.id=id;
        }
        const val=mode==='html'?(el.innerHTML||'').trim():(el.textContent||'').trim();
        return {id:el.id,text:val,level};
      }).filter(x=>x.text);
      const data={titulo:title}; data[into]=items;
      host.innerHTML=fn({ ...data, user });

    }else if(scrap==='memberlist'){ // <<<<<< NUEVO CASE
      const data = scrapeMemberlist();
      host.innerHTML = fn({ ...data, user });
    }
  }));

  window.dotReady=Promise.resolve({doT,autoRender:()=>{},scrapePost:FA.scrapePost.bind(FA),scrapePerfil:FA.scrapePerfil.bind(FA)});
})();
