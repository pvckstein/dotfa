// esm/components/forms/radio-group.js
import { registerComponent } from '../engine.js';

const tpl = /*html*/`
<style>
  :host{display:block;margin:.6rem 0;font:inherit}
  .field{display:flex;flex-direction:column;gap:.4rem}
  .label{font-weight:600}
  .group{display:flex;flex-wrap:wrap;gap:.6rem .9rem}
  .opt{display:flex;align-items:center;gap:.4rem;cursor:pointer}
  input[type=radio]{accent-color:#2563eb}
  .help{color:#6b7280;font-size:.92em}
  .error{color:#b91c1c;font-size:.92em}
</style>
[[ 
  var options = it.options || [
    {label: it.lang?.L_YES || 'Sí', value:'1'},
    {label: it.lang?.L_NO  || 'No', value:'0'}
  ];
  var name = it.name || 'field';
  var current = it.value || '';
]]
<div class="field" data-name="[[= name ]]">
  [[ if (it.label) { ]] <div class="label">[[= it.label ]]</div> [[ } ]]
  <div class="group">
    [[~ options :op ]]
      <label class="opt">
        <input type="radio" name="[[= name ]]" value="[[= op.value ]]" [[= (String(op.value)===String(current)) ? 'checked' : '' ]] />
        <span>[[= op.label ]]</span>
      </label>
    [[~]]
  </div>
  [[ if (it.help)  { ]] <div class="help">[[= it.help ]]</div> [[ } ]]
  [[ if (it.error) { ]] <div class="error">[[= it.error ]]</div> [[ } ]]
</div>
<script>
(() => {
  const host = document.currentScript.getRootNode().host;
  const name = host.getAttribute('name') || 'field';
  const orig = Array.from(document.querySelectorAll('.option input[type="radio"][name="'+name+'"]'));
  if (orig.length){
    const checked = orig.find(r=>r.checked);
    const val = checked ? checked.value : null;
    if (val != null){
      const mine = (host.shadowRoot||host).querySelector('input[type="radio"][name="'+name+'"][value="'+val+'"]');
      if (mine) mine.checked = true;
    }
    const opt = orig[0].closest('.option'); if (opt) opt.style.display = 'none';
  }
})();
</script>
`;
registerComponent('x-radio-group', tpl, { shadow: true });
