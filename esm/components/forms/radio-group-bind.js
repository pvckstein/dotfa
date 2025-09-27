// esm/components/forms/radio-group-bind.js
import { registerComponent } from '../engine.js';

const tpl = /*html*/`
<style>
  :host{display:block;margin:.6rem 0;font:inherit}
  .field{display:flex;flex-direction:column;gap:.4rem}
  .label{font-weight:600}
  .group{display:flex;flex-wrap:wrap;gap:.6rem .9rem}
  .opt{display:flex;align-items:center;gap:.4rem}
  .help{color:#6b7280;font-size:.92em}
  .error{color:#b91c1c;font-size:.92em}
</style>
<div class="field" data-name="[[= it.name ]]">
  [[ if (it.label) { ]] <div class="label">[[= it.label ]]</div> [[ } ]]
  <div class="group" id="rg"></div>
  [[ if (it.help)  { ]] <div class="help">[[= it.help ]]</div> [[ } ]]
  [[ if (it.error) { ]] <div class="error">[[= it.error ]]</div> [[ } ]]
</div>
<script>
(() => {
  const root = document.currentScript.closest('[data-name]');
  const name = root.getAttribute('data-name');
  const group = root.querySelector('#rg');
  const radios = Array.from(document.querySelectorAll('.option input[type="radio"][name="'+name+'"]'));
  if (!radios.length) return;
  radios.forEach(r => {
    const lblText = (r.parentElement && r.parentElement.tagName === 'LABEL')
      ? (r.parentElement.textContent || '').trim()
      : r.getAttribute('data-label') || r.value;
    const wrap = document.createElement('label');
    wrap.className = 'opt';
    wrap.appendChild(r);
    const span = document.createElement('span'); span.textContent = lblText;
    wrap.appendChild(span);
    group.appendChild(wrap);
  });
  const opt = radios[0].closest('.option'); if (opt) opt.style.display = 'none';
})();
</script>
`;
registerComponent('x-radio-group-bind', tpl, { shadow: true });
