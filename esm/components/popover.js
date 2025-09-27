// esm/components/popover.js
import { registerComponent } from './engine.js';

const tpl = /*html*/`
<style>
  :host{display:inline-block;font:inherit}

  .trigger{all:unset;cursor:pointer;padding:.45rem .6rem;border:1px solid #e5e7eb;border-radius:.5rem;
           background:#f9fafb}
  .trigger:hover{background:#f3f4f6}

  /* panel base (usa Popover API) */
  .panel{
    padding:.8rem 1rem; border:1px solid #e5e7eb; border-radius:.6rem; background:#fff;
    box-shadow:0 10px 25px rgba(0,0,0,.10);
    max-inline-size: min(90vw, 520px);
  }
  .head{display:flex;align-items:center;justify-content:space-between;gap:.75rem;margin-bottom:.5rem}
  .title{font-weight:700}
  .close{all:unset;cursor:pointer;border-radius:.4rem;padding:.2rem .4rem}
  .close:hover{background:#f3f4f6}
  .content{line-height:1.45}

  /* estado abierto (selector nativo) */
  .panel:popover-open{animation:popIn .12s ease-out}
  @keyframes popIn{from{opacity:0; transform:translateY(-2px)} to{opacity:1; transform:translateY(0)}}

  /* mini backdrops opcionales hechos a mano (no estándar en popover) */
  .backdrop{
    position:fixed; inset:0; background:rgba(0,0,0,.35); display:none; z-index:2147483638;
  }
  .backdrop[open]{display:block}
</style>

[[ 
  var pid = it.id || ('pop_'+Math.random().toString(36).slice(2));
  var hasTrigger = !(it.trigger === 'false' || it.trigger === false);
  var manual = (it.manual === '' || it.manual === true || it.manual === 'true'); // popover="manual" → no se cierra solo
  var withBackdrop = (it.backdrop === '' || it.backdrop === true || it.backdrop === 'true');
]]

[[ if (withBackdrop) { ]] <div class="backdrop" id="bd-[[= pid ]]"></div> [[ } ]]

[[ if (hasTrigger) { ]]
  <button class="trigger"
          type="button"
          popovertarget="[[= pid ]]"
          popovertargetaction="toggle">
    [[= it.label || 'Abrir' ]]
  </button>
[[ } ]]

<div id="[[= pid ]]" class="panel" popover="[[= manual ? 'manual' : 'auto' ]]">
  <div class="head">
    <div class="title">[[= it.title || '' ]]</div>
    <button class="close" type="button"
            popovertarget="[[= pid ]]"
            popovertargetaction="hide"
            aria-label="Cerrar">✕</button>
  </div>
  <div class="content">
    [[= it.html || (it.$ && it.$.slot && it.$.slot.default) || '' ]]
  </div>
</div>

<script>
(() => {
  const host = document.currentScript.getRootNode().host;
  const root = host.shadowRoot || host;

  // panel y backdrop
  const panel = root.querySelector('.panel');
  const pid   = panel?.id;
  const bd    = root.getElementById('bd-'+pid);

  // (opcional) vincular un disparador externo con atributo for="#selector|id"
  const forSel = host.getAttribute('for');
  if (forSel && pid){
    const trg = (forSel.startsWith('#') ? document.querySelector(forSel) : document.getElementById(forSel));
    if (trg){
      trg.setAttribute('popovertarget', pid);
      if (!trg.hasAttribute('popovertargetaction')) trg.setAttribute('popovertargetaction','toggle');
    }
  }

  // backdrop manual para popover (se cierra al hacer click)
  if (bd){
    bd.addEventListener('click', () => {
      try{ panel.hidePopover?.(); }catch(e){}
      bd.removeAttribute('open');
    });
  }

  // sincroniza backdrop al abrir/cerrar (escucha eventos nativos)
  panel?.addEventListener('toggle', () => {
    const open = panel.matches(':popover-open');
    if (bd){
      if (open) bd.setAttribute('open','');
      else bd.removeAttribute('open');
    }
  });

  // Posicionamiento simple: center (por defecto), o data-pos="top|bottom|left|right"
  const pos = host.getAttribute('pos') || host.getAttribute('position');
  if (pos){
    // Este posicionamiento es básico; para anclaje real, usar Anchor Positioning cuando esté disponible.
    const style = panel.style;
    style.position='fixed';
    const pad=16;
    const w=520; const h=240;
    if (pos==='top'){ style.top = pad+'px'; style.left='50%'; style.transform='translateX(-50%)'; }
    else if (pos==='bottom'){ style.bottom = pad+'px'; style.left='50%'; style.transform='translateX(-50%)'; }
    else if (pos==='left'){ style.left = pad+'px'; style.top='50%'; style.transform='translateY(-50%)'; }
    else if (pos==='right'){ style.right = pad+'px'; style.top='50%'; style.transform='translateY(-50%)'; }
    else { /* center */
      style.top='50%'; style.left='50%'; style.transform='translate(-50%,-50%)';
    }
  }
})();
</script>
`;

registerComponent('x-popover', tpl, { shadow: true });
