// esm/components/forms/input.js
// 4) <x-input> (REPLACE) — esm/components/forms/input.js
// Crea input nuevo, copia valor del original si existe y oculta el viejo.

import { registerComponent } from '../engine.js';

const tpl = /*html*/`
<style>
  :host{display:block;margin:.6rem 0;font:inherit}
  .label{display:block;font-weight:600;margin-bottom:.3rem}
  .input{width:100%;padding:.5rem .6rem;border:1px solid #d1d5db;border-radius:.5rem}
  .error{color:#b91c1c;font-size:.92em}
  .help{color:#6b7280;font-size:.92em}
</style>
[[ var type = it.type || 'text'; ]]
[[ var name = it.name || ''; ]]
[[ var id   = it.id || ('in_'+name); ]]
[[ var val  = it.value || ''; ]]
[[ if (it.label) { ]] <label class="label" for="[[= id ]]">[[= it.label ]]</label> [[ } ]]
<input class="input" id="[[= id ]]" type="[[= type ]]" name="[[= name ]]" value="[[= val ]]" placeholder="[[= it.placeholder||'' ]]" autocomplete="[[= it.autocomplete||'' ]]" [[= (it.required?'required':'') ]] />
[[ if (it.help)  { ]] <div class="help">[[= it.help ]]</div> [[ } ]]
[[ if (it.error) { ]] <div class="error">[[= it.error ]]</div> [[ } ]]

<script>
(() => {
  const host = document.currentScript.getRootNode().host;
  const name = host.getAttribute('name') || '';
  if (!name) return;
  const orig = document.querySelector('.option :where([name="'+name+'"])');
  if (orig){
    const dest = (host.shadowRoot||host).querySelector('input[name="'+name+'"]');
    if (dest && !dest.value) dest.value = orig.value || '';
    const opt = orig.closest('.option'); if (opt) opt.style.display = 'none';
  }
})();
</script>
`;
registerComponent('x-input', tpl, { shadow: true });
