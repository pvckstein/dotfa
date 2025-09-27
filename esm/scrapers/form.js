// esm/scrapers/form.js
import { registerScraper } from '../dotfa-core.js';

registerScraper('form', () => {
  const form = document.querySelector('#ucp') || document.querySelector('form[name="post"]');
  if (!form) return { fields: {}, form: null };

  const fields = {};
  form.querySelectorAll('.option').forEach(opt => {
    const ctrl = opt.querySelector('input, select, textarea');
    if (!ctrl) return;
    const name = ctrl.getAttribute('name'); if (!name) return;
    const label = opt.querySelector(':scope > label')?.textContent?.trim()
               || opt.querySelector('label')?.textContent?.trim()
               || name;
    // Texto suelto dentro de .option puede ser errores/ayudas del server
    const textNodes = [...opt.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim().length);
    const helper = textNodes.map(n => n.textContent.trim()).join(' ');
    fields[name] = { name, label, helper, optEl: opt, ctrlEl: ctrl };
  });

  return { fields, form };
});
