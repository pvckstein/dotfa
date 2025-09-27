// esm/components/forms/textarea.js
// 5) <x-textarea> (REPLACE) — esm/components/forms/textarea.js

import { registerComponent } from '../engine.js';

const tpl = /*html*/`
<style>
  :host{display:block;margin:.6rem 0;font:inherit}
  .label{display:block;font-weight:600;margin-bottom:.3rem}
  textarea{width:100%;min-height:120px;padding:.5rem .6rem;border:1px solid #d1d5db;border-radius:.5rem}
  .error{color:#b91c1c;font-size:.92em}
  .help{color:#6b7280;font-size:.92em}
</style>
[[ var name = it.name || ''; ]]
[[ var id   = it.id || ('ta_'+name); ]]
[[ if (it.label) { ]] <label class="label" for="[[= id ]]">[[= it.label ]]</label> [[ } ]]
<textarea id="[[= id ]]" name="[[= name ]]" placeholder="[[= it.placeholder||'' ]]">[[= it.value || '' ]]</textarea>
[[ if (it.help)  { ]] <div class="help">[[= it.help ]]</div> [[ } ]]
[[ if (it.error) { ]] <div class="error">[[= it.error ]]</div> [[ } ]]

<script>
(() => {
  const host = document.currentScript.getRootNode().host;
  const name = host.getAttribute('name') || '';
  if (!name) return;
  const orig = document.querySelector('.option :where(textarea[name="'+name+'"])');
  if (orig){
    const dest = (host.shadowRoot||host).querySelector('textarea[name="'+name+'"]');
    if (dest && !dest.value) dest.value = orig.value || '';
    const opt = orig.closest('.option'); if (opt) opt.style.display = 'none';
  }
})();
</script>
`;
registerComponent('x-textarea', tpl, { shadow: true });
