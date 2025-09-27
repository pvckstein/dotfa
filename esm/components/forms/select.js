// esm/components/forms/select.js
import { registerComponent } from '../engine.js';

const tpl = /*html*/`
<style>
  :host{display:block;margin:.6rem 0;font:inherit}
  .label{display:block;font-weight:600;margin-bottom:.3rem}
  select{width:100%;padding:.5rem .6rem;border:1px solid #d1d5db;border-radius:.5rem}
  .help{color:#6b7280;font-size:.92em}
  .error{color:#b91c1c;font-size:.92em}
</style>
[[ var name = it.name || ''; ]]
[[ var id   = it.id || ('sel_'+name); ]]
[[ var options = it.options || []; ]]
[[ var value = it.value || '' ]]
[[ if (it.label) { ]] <label class="label" for="[[= id ]]">[[= it.label ]]</label> [[ } ]]
<select id="[[= id ]]" name="[[= name ]]">
  [[~ options :op ]]
    <option value="[[= op.value ]]" [[= (String(op.value)===String(value))?'selected':'' ]]>[[= op.label ]]</option>
  [[~]]
</select>
[[ if (it.help)  { ]] <div class="help">[[= it.help ]]</div> [[ } ]]
[[ if (it.error) { ]] <div class="error">[[= it.error ]]</div> [[ } ]]

<script>
(() => {
  const host = document.currentScript.getRootNode().host;
  const name = host.getAttribute('name') || '';
  if (!name) return;
  const orig = document.querySelector('.option :where(select[name="'+name+'"])')
           || document.querySelector('select[name="'+name+'"]');
  if (orig){
    const current = orig.value;
    const dest = (host.shadowRoot||host).querySelector('select[name="'+name+'"]');
    if (dest && !dest.value) dest.value = current;
    const opt = orig.closest('.option'); if (opt) opt.style.display = 'none';
  }
})();
</script>
`;
registerComponent('x-select', tpl, { shadow: true });
