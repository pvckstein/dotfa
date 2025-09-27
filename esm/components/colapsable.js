// esm/components/collapse.js
import { registerComponent } from './engine.js';

const tpl = /*html*/`
[[ if (it.shadow) { ]]
<style>
  :host{display:block;font:inherit}
  .btn{all:unset;display:flex;align-items:center;gap:.5rem;cursor:pointer;width:100%;padding:.6rem .8rem;border-radius:.6rem;background:#f3f4f6}
  .btn:hover{background:#e5e7eb}
  .icon{display:inline-block;transition:transform .2s}
  .panel{display:none;margin-top:.5rem}
  .panel[open]{display:block}
  .title{font-weight:600}
</style>
[[ } ]]
<button class="btn" onclick="
  const p=this.nextElementSibling; const i=this.querySelector('.icon');
  p.toggleAttribute('open'); i.style.transform=p.hasAttribute('open')?'rotate(90deg)':'rotate(0deg)';
" aria-expanded="false">
  <span class="icon">▶</span> <span class="title">[[= it.title || 'Detalle' ]]</span>
</button>
<div class="panel" [[= it.open? 'open' : '' ]] role="region">
  [[= it.$?.slot?.default || '' ]]
</div>
`;

registerComponent('x-collapse', tpl, { shadow: true });
