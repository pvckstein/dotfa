import { registerComponent } from './engine.js';

const tpl = /*html*/`
<style>
  :host{display:block;max-width:400px;font:inherit}
  .card{display:flex;gap:1rem;padding:1rem;border:1px solid #e5e7eb;border-radius:.5rem;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.08)}
  .img img{width:80px;height:80px;object-fit:cover;border-radius:.25rem;display:block}
  .body{flex:1}
  .title{margin:0 0 .25rem;font-weight:700}
  .desc{margin:0;font-size:.9rem;color:#374151;line-height:1.4}
</style>

<div class="card">
  [[ if(it.img){ ]]<div class="img"><img src="[[=it.img]]" alt="[[=it.title||'' ]]"></div>[[ } ]]
  <div class="body">
    [[ if(it.title){ ]]<h3 class="title">[[=it.title]]</h3>[[ } ]]
    [[ if(it.desc){ ]]<p class="desc">[[=it.desc]]</p>[[ } ]]
  </div>
</div>
`;

registerComponent('x-card', tpl, { shadow:true });
