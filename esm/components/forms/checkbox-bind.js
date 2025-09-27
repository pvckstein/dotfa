// esm/components/forms/checkbox-bind.js
import { registerComponent } from '../engine.js';

const tpl = /*html*/`
<style>
  :host{display:block;margin:.4rem 0;font:inherit}
  label.cb{display:inline-flex;align-items:center;gap:.5rem;cursor:pointer}
  .help{display:block;color:#6b7280;font-size:.92em;margin-left:1.8rem}
</style>
<div class="wrap" data-name="[[= it.name ]]">
  <label class="cb"><span id="slot"></span><span class="txt">[[= it.label || '' ]]</span></label>
  [[ if (it.help) { ]] <span class="help">[[= it.help ]]</span> [[ } ]]
</div>
<script>
(() => {
  const root = document.currentScript.closest('.wrap');
  const name = root.getAttribute('data-name');
  if (!name) return;

  // Encuentra el checkbox original (puede no estar dentro de .option)
  const orig = document.querySelector('input[type="checkbox"][name="'+name+'"]');
  if (!orig) return;

  // Inserta el input original dentro de nuestra etiqueta
  root.querySelector('#slot').appendChild(orig);

  // Si el texto del label venía a la derecha del input en la plantilla (como {L_...}),
  // ya lo estamos sustituyendo con it.label; si quieres mantenerlo, lee el texto vecino:
  // const neighbor = orig.parentElement?.textContent?.trim();

  // Oculta el contenedor original si es necesario
  const opt = orig.closest('.option'); if (opt) opt.style.display = 'none';
})();
</script>
`;
registerComponent('x-checkbox-bind', tpl, { shadow: true });
