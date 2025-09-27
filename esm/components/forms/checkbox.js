// esm/components/forms/checkbox.js
import { registerComponent } from '../engine.js';

const tpl = /*html*/`
<style>
  :host{display:block;margin:.4rem 0;font:inherit}
  label.cb{display:inline-flex;align-items:center;gap:.5rem;cursor:pointer}
  input[type=checkbox]{accent-color:#2563eb}
  .help{display:block;color:#6b7280;font-size:.92em;margin-left:1.8rem}
</style>
[[ var name = it.name || ''; ]]
[[ var id   = it.id || ('cb_'+name); ]]
<label class="cb" for="[[= id ]]">
  <input type="checkbox" id="[[= id ]]" name="[[= name ]]" [[= it.checked ? 'checked' : '' ]] />
  <span class="txt">[[= it.label || '' ]]</span>
</label>
[[ if (it.help) { ]] <span class="help">[[= it.help ]]</span> [[ } ]]

<script>
(() => {
  const host = document.currentScript.getRootNode().host;
  const name = host.getAttribute('name') || '';
  if (!name) return;
  const orig = document.querySelector('input[type="checkbox"][name="'+name+'"]');
  if (orig){
    const dest = (host.shadowRoot||host).querySelector('input[type="checkbox"][name="'+name+'"]');
    if (dest && !dest.checked) dest.checked = orig.checked;
    const opt = orig.closest('.option'); if (opt) opt.style.display = 'none';
  }
})();
</script>
`;
registerComponent('x-checkbox', tpl, { shadow: true });
