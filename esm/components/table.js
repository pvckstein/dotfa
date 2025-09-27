// esm/components/table.js
import { registerComponent } from './engine.js';

const tpl = /*html*/`
<style>
  :host{display:block;font:inherit}
  .wrap{border:1px solid #e5e7eb;border-radius:.6rem;overflow:auto}
  table{width:100%;border-collapse:separate;border-spacing:0}
  thead th{position:sticky;top:0;background:#f9fafb;text-align:left;font-weight:700;
           border-bottom:1px solid #e5e7eb;padding:.6rem .7rem}
  tbody td{border-bottom:1px solid #f3f4f6;padding:.55rem .7rem;vertical-align:top}
  tbody tr:last-child td{border-bottom:0}
  .striped tbody tr:nth-child(odd){background:#fcfcfd}
  .compact thead th{padding:.45rem .6rem}
  .compact tbody td{padding:.4rem .6rem}
  .num{text-align:right}
  caption{caption-side:top;text-align:left;font-weight:700;padding:.5rem .2rem}
  .th-btn{all:unset;cursor:pointer}
  .th-btn[aria-sort="asc"]::after{content:" \\25B2";font-size:.85em}
  .th-btn[aria-sort="desc"]::after{content:" \\25BC";font-size:.85em}
  .empty{padding:1rem;color:#6b7280}
</style>

[[ 
  // Entrada: it.rows (array de objetos) o it.data (alias), y it.columns:
  // columns puede ser: ["colA","colB"] o [{key:"colA",label:"A",align:"right"}]
  var rows = it.rows || it.data || [];
  var cols = it.columns || null;
  var caption = it.caption || '';
  var striped = (it.striped === '' || it.striped === true || it.striped === 'true');
  var compact = (it.compact === '' || it.compact === true || it.compact === 'true');
  var sticky  = (it.sticky === '' || it.sticky === true || it.sticky === 'true'); // header sticky ya por defecto
  var sortable= (it.sortable === '' || it.sortable === true || it.sortable === 'true');

  function normCols(rows, cols){
    if (cols && cols.length){
      return cols.map(c => (typeof c === 'string') ? {key:c, label:c} : c);
    }
    if (rows && rows.length){
      const keys = Object.keys(rows[0]);
      return keys.map(k => ({ key:k, label:k }));
    }
    return [];
  }
  var C = normCols(rows, cols);
]]

<div class="wrap [[= striped ? 'striped' : '' ]] [[= compact ? 'compact' : '' ]]" part="wrap">
  <table part="table">
    [[ if (caption) { ]] <caption part="caption">[[= caption ]]</caption> [[ } ]]
    <thead part="thead">
      <tr>
        [[~ C :col ]]
          <th scope="col" data-key="[[= col.key ]]" part="th">
            [[ if (sortable) { ]]
              <button class="th-btn" type="button" aria-sort="none" data-key="[[= col.key ]]">
                [[= col.label || col.key ]]
              </button>
            [[ } else { ]]
              [[= col.label || col.key ]]
            [[ } ]]
          </th>
        [[~]]
      </tr>
    </thead>
    <tbody part="tbody">
      [[ if (!(rows && rows.length)) { ]]
        <tr><td class="empty" colspan="[[= C.length ]]">[[= it.emptyText || 'Sin datos' ]]</td></tr>
      [[ } else { ]]
        [[~ rows :r ]]
          <tr>
            [[~ C :col2 ]]
              [[ var v = (r[col2.key] == null ? '' : r[col2.key]); 
                 var isNum = (typeof v === 'number') || (/^\\s*-?\\d[\\d\\s.,]*\\s*$/.test(String(v)));
              ]]
              <td class="[[= (col2.align==='right' || (col2.type==='number' || isNum)) ? 'num' : '' ]]" data-key="[[= col2.key ]]">
                [[= v ]]
              </td>
            [[~]]
          </tr>
        [[~]]
      [[ } ]]
    </tbody>
  </table>
</div>

<script>
(() => {
  const host = document.currentScript.getRootNode().host;
  const root = host.shadowRoot || host;

  // Si hay atributo src, carga JSON y repinta filas de forma simple
  const src = host.getAttribute('src');
  if (src) {
    fetch(src).then(r => r.json()).then(data => {
      const rows = Array.isArray(data) ? data : (data.rows || data.items || []);
      if (!rows || !rows.length) return;
      // Si no hay columnas declaradas, calcúlalas por keys del primero
      let colsAttr = host.getAttribute('columns');
      let cols = null;
      if (colsAttr) {
        try { cols = JSON.parse(colsAttr); } catch(e){}
      }
      if (!cols || !cols.length) cols = Object.keys(rows[0]).map(k => ({key:k,label:k}));

      const tbody = root.querySelector('tbody'); if (!tbody) return;
      tbody.innerHTML = rows.map(r => {
        return '<tr>' + cols.map(c => {
          const val = (r[c.key] == null ? '' : r[c.key]);
          const isNum = (typeof val === 'number') || (/^\\s*-?\\d[\\d\\s.,]*\\s*$/.test(String(val)));
          const cls = (c.align==='right' || c.type==='number' || isNum) ? ' class="num"' : '';
          return '<td data-key="'+c.key+'"'+cls+'>'+String(val)+'</td>';
        }).join('') + '</tr>';
      }).join('');
    }).catch(()=>{ /* ignora errores */ });
  }

  // Ordenación simple si sortable
  const sortable = host.hasAttribute('sortable');
  if (sortable){
    const table = root.querySelector('table');
    const tbody = root.querySelector('tbody');
    const btns  = root.querySelectorAll('.th-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-key');
        const current = btn.getAttribute('aria-sort') || 'none';
        const next = current === 'asc' ? 'desc' : 'asc';
        // reset others
        root.querySelectorAll('.th-btn[aria-sort]').forEach(b => b.setAttribute('aria-sort','none'));
        btn.setAttribute('aria-sort', next);

        const rows = Array.from(tbody.querySelectorAll('tr'));
        const idx  = Array.from(table.querySelectorAll('thead th')).findIndex(th => th.getAttribute('data-key')===key);
        const collator = new Intl.Collator(undefined, {numeric:true, sensitivity:'base'});

        rows.sort((a,b) => {
          const av = a.children[idx]?.textContent?.trim() || '';
          const bv = b.children[idx]?.textContent?.trim() || '';
          const cmp = collator.compare(av, bv);
          return next === 'asc' ? cmp : -cmp;
        });
        tbody.innerHTML = '';
        rows.forEach(r => tbody.appendChild(r));
      });
    });
  }
})();
</script>
`;

registerComponent('x-table', tpl, { shadow: true });
