// esm/index.js — punto de entrada ESM

// Núcleo / runtime (si ambos existen y no colisionan, puedes mantener los dos)
import './dotfa-core.js';
import './dotfa-runtime.js';

// MODES
import './modes/custom.js';
import './modes/fetch.js';
import './modes/page.js';

// SCRAPERS
import './scrapers/form.js';
import './scrapers/memberlist.js';
import './scrapers/perfil.js';
import './scrapers/posts.js';
import './scrapers/user.js';

// COMPONENTS
import './components/card.js';
import './components/colapsable.js';   // ojo: aquí es 'colapsable.js' (en español)
import './components/engine.js';
import './components/popover.js';
import './components/table.js';

// FORMS
import './forms/checkbox-bind.js';
import './forms/checkbox.js';
import './forms/field.js';
import './forms/input.js';
import './forms/radio-group-bind.js';
import './forms/radio-group.js';
import './forms/select-bind.js';
import './forms/select.js';
import './forms/switch-bind.js';
import './forms/switch.js';
import './forms/textarea.js';

// API mínima para “arrancar” desde el foro si quieres
export function init() {
  // aquí puedes hacer el bootstrap que necesites
  console.log('DotFA (ESM) listo – cargado desde esm/index.js');
}
