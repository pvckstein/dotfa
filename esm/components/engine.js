// esm/components/engine.js
import { loadDoT } from '../dotfa-core.js';

// Registro de plantillas: key => { source, fn, shadowDefault }
const REG = new Map();

// Utilidades
const toBool = v => v === '' || v === 'true' || v === true;
const parseMaybeJSON = (s) => { try { return s ? JSON.parse(s) : null; } catch { return null; } };

// Compila on-demand
async function compileIfNeeded(key){
  const rec = REG.get(key);
  if (!rec) return null;
  if (rec.fn) return rec.fn;
  const doT = await loadDoT();
  rec.fn = doT.template(rec.source);
  return rec.fn;
}

// API para registrar componentes
export function registerComponent(key, templateString, { shadow = false } = {}){
  REG.set(key, { source: templateString, fn: null, shadowDefault: !!shadow });
  // define el custom element si aún no existe
  const tag = key.startsWith('x-') ? key : `x-${key}`;
  if (!customElements.get(tag)) customElements.define(tag, XDotElement);
}

// Convierte atributos → props (incluye data-*)
function attrsToProps(el){
  const props = {};
  for (const a of el.attributes) {
    const k = a.name, v = a.value;
    if (k === 'use' || k === 'shadow' || k === 'data') continue;
    if (k.startsWith('data-')) {
      const key = k.slice(5).replace(/-([a-z])/g, (_,c)=>c.toUpperCase());
      props[key] = v;
    } else {
      props[k] = v;
    }
  }
  const inline = parseMaybeJSON(el.getAttribute('data'));
  if (inline && typeof inline === 'object') Object.assign(props, inline);
  return props;
}

// Custom Element genérico para todas las etiquetas x-*
class XDotElement extends HTMLElement {
  static get observedAttributes(){ return ['data']; } // re-render simple cuando cambia data
  #shadowUsed = false;
  async connectedCallback(){ await this.render(); }
  async attributeChangedCallback(){ await this.render(); }

  async render(){
    // key por defecto: nombre del tag (x-media → x-media). Puedes sobreescribir con use="otro"
    const key = (this.getAttribute('use') || this.tagName.toLowerCase());
    if (!REG.has(key)) { console.warn('[x-dot] plantilla no registrada:', key); return; }

    const rec = REG.get(key);
    const fn  = await compileIfNeeded(key); if (!fn) return;

    // Shadow DOM: atributo shadow > default del registro
    const wantsShadow = toBool(this.getAttribute('shadow')) || rec.shadowDefault;
    if (wantsShadow && !this.shadowRoot) { this.attachShadow({ mode: 'open' }); this.#shadowUsed = true; }

    const props = attrsToProps(this);
    const slotDefault = this.innerHTML.trim();
    const $ = { slot: { default: slotDefault } };

    const user  = window._userdata || null;
    const lang  = window._lang || null;
    const board = window._board || null;

    const html = fn({ ...props, user, lang, board, $ });

    if (this.#shadowUsed) this.shadowRoot.innerHTML = html;
    else this.innerHTML = html;
  }
}
