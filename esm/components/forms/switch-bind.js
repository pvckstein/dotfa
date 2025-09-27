// esm/components/forms/switch-bind.js
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
  /* estado checked */
  .track.on{background:#2563eb}
  .track.on .knob{left:20px}
</style>

<div class="wrap" data-name="[[= it.name ]]">
  <label class="switch" style="position:relative;display:inline-block">
    <span class="track" id="track"><span class="knob"></span></span>
    <span id="slot"></span>
  </label>
  [[ if (it.label) { ]] <span class="label">[[= it.label ]]</span> [[ } ]]
</div>
[[ if (it.help) { ]] <span class="help">[[= it.help ]]</span> [[ } ]]

<script>
(() => {
  const root = document.currentScript.closest('.wrap');
  const name = root.getAttribute('data-name');
  if (!name) return;

  // Localiza el checkbox original (no siempre está dentro de .option)
  const orig = document.querySelector('input[type="checkbox"][name="'+name+'"]');
  if (!orig) return;

  // Inserta el input original encima del track para capturar clics/teclado
  const slot = root.querySelector('#slot');
  slot.appendChild(orig);
  orig.style.position='absolute'; orig.style.opacity=0; orig.style.width='42px'; orig.style.height='24px';

  const track = root.querySelector('#track');
  const sync = () => { track.classList.toggle('on', !!orig.checked); };
  sync();

  // Cambios desde teclado/click actualizan la UI
  orig.addEventListener('change', sync);

  // Oculta el contenedor original para no duplicar
  const opt = orig.closest('.option'); if (opt) opt.style.display='none';
})();
</script>
`;
registerComponent('x-switch-bind', tpl, { shadow: true });
