// esm/components/forms/field.js
// <x-field> (BIND genérico)
// Mueve el control original (input/select/textarea) por name dentro del componente y oculta .option.

import { registerComponent } from '../engine.js';

const tpl = /*html*/`
<style>
  :host{display:block;margin:.6rem 0;font:inherit}
  .field{display:flex;flex-direction:column;gap:.4rem}
  .label{font-weight:600}
  .help{color:#6b7280;font-size:.92em}
  .error{color:#b91c1c;font-size:.92em}
</style>

<div class="field" data-name="[[= it.name ]]">
  [[ if (it.label) { ]] <div class="label">[[= it.label ]]</div> [[ } ]]
  <div class="control" id="ctl"></div>
  [[ if (it.help)  { ]] <div class="help">[[= it.help ]]</div> [[ } ]]
  [[ if (it.error) { ]] <div class="error">[[= it.error ]]</div> [[ } ]]
</div>

<script>
(() => {
  const root = document.currentScript.closest('[data-name]');
  const name = root.getAttribute('data-name');
  if (!name) return;
  const opt  = document.querySelector('.option :where([name="'+name+'"])')?.closest('.option');
  const ctrl = opt?.querySelector(':is(input,select,textarea)[name="'+name+'"]');
  if (!ctrl) return;
  // mueve el control original (se mantiene name/value/checked/selected)
  root.querySelector('#ctl').appendChild(ctrl);
  // oculta el bloque original para no duplicar
  if (opt) opt.style.display = 'none';
})();
</script>
`;

registerComponent('x-field', tpl, { shadow: true });
