// esm/components/forms/switch.js
import { registerComponent } from '../engine.js';

const tpl = /*html*/`
<style>
  :host{display:block;margin:.4rem 0;font:inherit}
  .wrap{display:flex;align-items:center;gap:.6rem}
  .track{position:relative;width:42px;height:24px;border-radius:999px;background:#e5e7eb;transition:background .2s}
  .knob{position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.15);transition:left .2s}
  .label{font-weight:600}
  .help{display:block;color:#6b7280;font-size:.92em;margin-left:48px}
  input{position:absolute;opacity:0;width:42px;height:24px;margin:0}
  .track.on{background:#2563eb}
  .track.on .knob{left:20px}
</style>

[[ var name = it.name || ''; ]]
[[ var id   = it.id || ('sw_'+name); ]]
[[ var checked = !!it.checked; ]]

<div class="wrap">
  <label class="switch" style="position:relative;display:inline-block">
    <span class="track" id="track"><span class="knob"></span></span>
    <input type="checkbox" id="[[= id ]]" name="[[= name ]]" [[= checked ? 'checked' : '' ]] />
  </label>
  [[ if (it.label) { ]] <span class="label">[[= it.label ]]</span> [[ } ]]
</div>
[[ if (it.help) { ]] <span class="help">[[= it.help ]]</span> [[ } ]]

<script>
(() => {
  const host = document.currentScript.getRootNode().host;
  const input = (host.shadowRoot||host).querySelector('input[type="checkbox"]');
  const track = (host.shadowRoot||host).querySelector('#track');
  const sync = ()=> track.classList.toggle('on', !!input.checked);
  sync();
  input.addEventListener('change', sync);

  // Si existe un checkbox original con el mismo name, copia su estado y ocúltalo
  const name = input.getAttribute('name');
  if (name){
    const orig = document.querySelector('input[type="checkbox"][name="'+name+'"]');
    if (orig){
      if (!input.checked) input.checked = !!orig.checked;
      sync();
      const opt = orig.closest('.option'); if (opt) opt.style.display='none';
    }
  }
})();
</script>
`;
registerComponent('x-switch', tpl, { shadow: true });
