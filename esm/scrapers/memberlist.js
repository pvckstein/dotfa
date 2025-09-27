import { registerScraper } from '../dotfa-core.js';

function t(el){ return el ? (el.textContent||'').trim() : ''; }
function h(el){ return el ? (el.innerHTML||'').trim() : ''; }

function scrapeMemberlist(){
  const root=document.getElementById('memberlist');
  if(!root) return { title:'', form_html:'', members:[], pagination_html:'' };

  const title=t(root.querySelector('.titulo'));
  const form =root.querySelector('#buscador form');
  const form_html=form?form.outerHTML:'';

  const members=[...root.querySelectorAll('#members .member')].map(m=>{
    let user_id=null;
    for(const n of m.childNodes){
      if(n.nodeType===3){const v=(n.nodeValue||'').trim(); if(/^\d+$/.test(v)){user_id=parseInt(v,10);break;}}
      if(n.nodeType===1 && n.classList?.contains('user_id')){
        const v=(n.textContent||'').trim(); if(/^\d+$/.test(v)) user_id=parseInt(v,10);
      }
    }
    return {
      user_id,
      avatar_html:h(m.querySelector('.avatar')),
      username:t(m.querySelector('.username')),
      groups_html:h(m.querySelector('.group')),
      points:t(m.querySelector('.points')),
      joined:t(m.querySelector('.joined')),
      lastvisit:t(m.querySelector('.lastvisit')),
      posts:t(m.querySelector('.posts')),
      contact_html:h(m.querySelector('.contact')),
      profile_url:(m.querySelector('a[href]')||{}).href||''
    };
  });

  const pagination_html=h(root.querySelector('#members .pagination'));
  return { title, form_html, members, pagination_html };
}

registerScraper('memberlist', scrapeMemberlist);
export default scrapeMemberlist;
