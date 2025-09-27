// esm/modes/custom.js
// Renderiza scrap="custom" (JSON inline via atributo data / variable global)

export function renderCustom(host, doT, user){
  const tplId = host.getAttribute('dot');
  const tpl   = document.getElementById(tplId);
  if (!tpl) return;

  let data = {};
  const raw = host.getAttribute('data') || host.getAttribute('data-json');
  const vref= host.getAttribute('var')  || host.getAttribute('data-var');

  if (raw){
    try { data = JSON.parse(raw); }
    catch (e){ console.warn('[dot] JSON inválido en data:', e, raw); }
  }
  if (vref && window[vref]) data = window[vref];

  const fn = doT.template(tpl.innerHTML);
  host.innerHTML = fn({ ...data, user });
}
