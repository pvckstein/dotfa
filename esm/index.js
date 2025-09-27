// Núcleo / runtime
import './dotfa-core.js';
import './dotfa-runtime.js';

// Modes
import './modes/custom.js';
import './modes/fetch.js';
import './modes/page.js';

// Scrapers
import './scrapers/form.js';
import './scrapers/memberlist.js';
import './scrapers/perfil.js';
import './scrapers/posts.js';
import './scrapers/user.js';

// Components
import './components/card.js';
import './components/colapsable.js';
import './components/engine.js';
import './components/popover.js';
import './components/table.js';

// Forms (¡ojo a la ruta!)
import './components/forms/checkbox-bind.js';
import './components/forms/checkbox.js';
import './components/forms/field.js';
import './components/forms/index.js';     // si existe
import './components/forms/input.js';
import './components/forms/radio-group-bind.js';
import './components/forms/radio-group.js';
import './components/forms/select-bind.js';
import './components/forms/select.js';
import './components/forms/switch-bind.js';
import './components/forms/switch.js';
import './components/forms/textarea.js';

export function init() {
  console.log('DotFA (ESM) listo — esm/index.js');
}
