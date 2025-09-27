// esm/components/forms/select-bind.js
import { registerComponent } from '../engine.js';

const tpl = /*html*/`
<style>
  :host{display:block;margin:.6rem 0;font:inherit}
  .label{display:block;font-weight:600;margin-bottom:.3rem}
  .help{color:#6b7280;font-size:.92em}
  .error{color:#b91c1c;font-size:.92em}
</style>
<div class="field" data-name="[[= it.name ]]">
  [[ if (it.label) { ]] <label class="label">[[= it.label ]]</label> [[ } ]]
  <div id="ctl"></div>
  [[ if (it.help)  { ]] <div class="help">[[= it.help ]]</div> [[ } ]]
  [[ if (it.error) { ]] <div class="error">[[= it.error ]]</div> [[ } ]]
</div>

<script>
(() => {
  const root = document.currentScript.closest('[data-name]');
  const name = root.getAttribute('data-name');
  const opt  = document.querySelector('.option :where(select[name="'+name+'"])')?.closest('.option')
           || document.querySelector(':where(select[name="'+name+'"])')?.closest('.option');
  const sel  = opt?.querySelector('select[name="'+name+'"]')
           || document.querySelector('select[name="'+name+'"]');
  if (!sel) return;
  root.querySelector('#ctl').appendChild(sel);
  if (opt) opt.style.display = 'none';
})();
</script>
`;
registerComponent('x-select-bind', tpl, { shadow: true });
