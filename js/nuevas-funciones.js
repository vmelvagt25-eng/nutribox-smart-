/* ============================================================
   NUTRIBOX — JS: Encuestas, Registro, Docente, Calificaciones
   ============================================================ */

// ── Estado global nuevas funciones ──────────────────────────
state.encuestas = [
  { mes: 'Mayo 2026', score: 4.2, completadas: 5, respuestas: { q1:5, q2:4, q3:'si', q4:'si' } },
  { mes: 'Abril 2026', score: 3.8, completadas: 4, respuestas: { q1:4, q2:3, q3:'una', q4:'poco' } }
];
state.encStar = 5;
state.registros = [
  { fecha: '2026-06-25', receta: 'Wrap Power',       termino: 'si',    stars: 5, obs: 'Le encantó todo' },
  { fecha: '2026-06-24', receta: 'Brochetas Superhéroe', termino: 'si', stars: 4, obs: '' },
  { fecha: '2026-06-23', receta: 'Pizza Escolar',    termino: 'mitad', stars: 3, obs: 'Dejó el tomate' },
  { fecha: '2026-06-20', receta: 'Rollitos Campeones', termino: 'si',  stars: 5, obs: '' },
  { fecha: '2026-06-19', receta: 'Mini Hamburguesitas', termino: 'no', stars: 1, obs: 'No tenía hambre' }
];
state.regStar   = 0;
state.terminoVal = 'si';
state.docCat    = 'alimentacion';
state.docVal    = 'bueno';
state.observaciones = [
  { docente:'Prof. Ana Torres', fecha:'2026-06-24', grado:'3° A', cat:'energia',   obs:'El alumno mostró excelente energía durante toda la mañana. Terminó actividades con entusiasmo.', val:'excelente' },
  { docente:'Prof. Carlos Ríos', fecha:'2026-06-20', grado:'3° A', cat:'concentracion', obs:'Buena concentración en matemáticas. Se nota que desayuna bien.', val:'bueno' }
];
state.calificaciones = [
  { materia:'Matemáticas',  b1:14, b2:15, b3:16, b4:null, lonch:[18,20,22] },
  { materia:'Comunicación', b1:13, b2:14, b3:15, b4:null, lonch:[18,20,22] },
  { materia:'Ciencias',     b1:15, b2:16, b3:17, b4:null, lonch:[18,20,22] }
];

// ══════════════════════════════════════════════════════════════
// INIT: enganchamos al showParentTab existente
// ══════════════════════════════════════════════════════════════
const _origShowParentTab = showParentTab;
showParentTab = function(tab) {
  _origShowParentTab(tab);
  if (tab === 'encuestas')      initEncuestas();
  if (tab === 'registro')       initRegistro();
  if (tab === 'docente')        initDocente();
  if (tab === 'calificaciones') initCalificaciones();
};

// ══════════════════════════════════════════════════════════════
// ENCUESTAS MENSUALES
// ══════════════════════════════════════════════════════════════
function initEncuestas() {
  setEncStar(5);
  renderEncHistorial();
  renderTendencias();
  // Poner fecha actual
  const today = new Date().toISOString().split('T')[0];
}

function setEncStar(n) {
  state.encStar = n;
  const stars = document.querySelectorAll('.enc-star');
  stars.forEach((s, i) => {
    s.classList.toggle('active', i < n);
    s.textContent = i < n ? '⭐' : '☆';
  });
}

function submitEncuesta() {
  const q1 = document.querySelector('input[name="q1"]:checked');
  const q2 = document.querySelector('input[name="q2"]:checked');
  if (!q1 || !q2) {
    showToast('⚠️', 'Incompleta', 'Responde al menos las primeras 2 preguntas');
    return;
  }
  const score = ((parseInt(q1.value) + parseInt(q2.value)) / 2 + state.encStar) / 2;
  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const now = new Date();
  state.encuestas.unshift({
    mes: `${meses[now.getMonth()]} ${now.getFullYear()}`,
    score: Math.round(score * 10) / 10,
    completadas: state.registros.filter(r => r.termino === 'si').length,
    respuestas: { q1: q1.value, q2: q2.value, star: state.encStar }
  });
  renderEncHistorial();
  renderTendencias();
  showToast('📋', '¡Encuesta enviada!', `Puntuación: ${Math.round(score * 10) / 10}/5`);
  // Reset form
  document.querySelectorAll('.enc-options input[type="radio"]').forEach(r => r.checked = false);
  if (document.getElementById('enc-comentario')) document.getElementById('enc-comentario').value = '';
  setEncStar(5);
}

function renderEncHistorial() {
  const list = document.getElementById('encuestas-list');
  if (!list) return;
  list.innerHTML = state.encuestas.map(e => `
    <div class="enc-hist-item">
      <div class="enc-hist-left">
        <h4>📋 ${e.mes}</h4>
        <p>${e.completadas} loncheras completadas ese mes</p>
      </div>
      <div class="enc-hist-score">${e.score}/5 ⭐</div>
    </div>`).join('');
}

function renderTendencias() {
  const grid = document.getElementById('tendencias-grid');
  if (!grid) return;
  const total = state.registros.length;
  const completas = state.registros.filter(r => r.termino === 'si').length;
  const pct = total ? Math.round((completas / total) * 100) : 0;
  const avgEnc = state.encuestas.length
    ? (state.encuestas.reduce((a, e) => a + e.score, 0) / state.encuestas.length).toFixed(1)
    : '—';
  const trend = state.encuestas.length >= 2
    ? (state.encuestas[0].score > state.encuestas[1].score ? '📈' : '📉')
    : '➡️';
  grid.innerHTML = `
    <div class="tendencia-item">
      <div class="t-trend">📋</div>
      <div class="t-val">${state.encuestas.length}</div>
      <div class="t-label">Encuestas completadas</div>
    </div>
    <div class="tendencia-item">
      <div class="t-trend">${trend}</div>
      <div class="t-val">${avgEnc}/5</div>
      <div class="t-label">Puntuación promedio</div>
    </div>
    <div class="tendencia-item">
      <div class="t-trend">✅</div>
      <div class="t-val">${pct}%</div>
      <div class="t-label">Loncheras terminadas</div>
    </div>
    <div class="tendencia-item">
      <div class="t-trend">🏅</div>
      <div class="t-val">${state.kidsInsignias}</div>
      <div class="t-label">Insignias totales</div>
    </div>`;
}

// ══════════════════════════════════════════════════════════════
// REGISTRO DE LONCHERAS TERMINADAS
// ══════════════════════════════════════════════════════════════
function initRegistro() {
  const f = document.getElementById('reg-fecha');
  if (f) f.value = new Date().toISOString().split('T')[0];
  state.regStar = 0;
  state.terminoVal = 'si';
  updateTerminoBtns();
  renderRegistroStats();
  renderRegistroCalendario();
  renderRegistroList();
}

function setTermino(val, btn) {
  state.terminoVal = val;
  updateTerminoBtns();
}

function updateTerminoBtns() {
  ['si', 'mitad', 'no'].forEach(v => {
    const btn = document.getElementById('termino-' + v);
    if (!btn) return;
    btn.classList.toggle('active', state.terminoVal === v);
    btn.setAttribute('data-val', v);
  });
}

function setRegStar(n) {
  state.regStar = n;
  document.querySelectorAll('.reg-star').forEach((s, i) => {
    s.classList.toggle('active', i < n);
    s.textContent = i < n ? '⭐' : '☆';
  });
}

function saveRegistro() {
  const fecha  = document.getElementById('reg-fecha').value;
  const receta = document.getElementById('reg-receta').value;
  const obs    = document.getElementById('reg-obs').value;
  if (!fecha) { showToast('⚠️', 'Falta fecha', 'Selecciona la fecha'); return; }
  state.registros.unshift({ fecha, receta, termino: state.terminoVal, stars: state.regStar, obs });
  renderRegistroStats();
  renderRegistroCalendario();
  renderRegistroList();
  showToast('✅', '¡Registro guardado!', `${receta} — ${state.terminoVal === 'si' ? 'Terminada 😄' : state.terminoVal === 'mitad' ? 'A la mitad 😐' : 'No comió 😞'}`);
  document.getElementById('reg-obs').value = '';
  state.regStar = 0;
  setRegStar(0);
  state.terminoVal = 'si';
  updateTerminoBtns();
}

function renderRegistroStats() {
  const completas = state.registros.filter(r => r.termino === 'si').length;
  const mitad     = state.registros.filter(r => r.termino === 'mitad').length;
  const no        = state.registros.filter(r => r.termino === 'no').length;
  const total     = state.registros.length;
  const pct       = total ? Math.round((completas / total) * 100) : 0;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('rs-completas', completas);
  set('rs-mitad', mitad);
  set('rs-no', no);
  set('rs-pct', pct + '%');
}

function renderRegistroCalendario() {
  const cal = document.getElementById('registro-calendario');
  if (!cal) return;
  const now   = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth();
  const dias  = new Date(year, month + 1, 0).getDate();
  const inicio = new Date(year, month, 1).getDay(); // 0=dom

  const byDate = {};
  state.registros.forEach(r => {
    const d = new Date(r.fecha);
    if (d.getFullYear() === year && d.getMonth() === month) {
      byDate[d.getDate()] = r.termino;
    }
  });

  const dias_sem = ['D','L','M','X','J','V','S'];
  let html = dias_sem.map(d => `<div class="cal-day-header">${d}</div>`).join('');
  // Espacios vacíos al inicio
  for (let i = 0; i < inicio; i++) html += `<div class="cal-day vacio"></div>`;
  for (let d = 1; d <= dias; d++) {
    const cls = byDate[d]
      ? byDate[d] === 'si' ? 'completa' : byDate[d] === 'mitad' ? 'mitad' : 'no-comio'
      : (d <= now.getDate() ? 'sin-registro' : 'vacio');
    const emoji = byDate[d] ? (byDate[d] === 'si' ? '😄' : byDate[d] === 'mitad' ? '😐' : '😞') : d;
    html += `<div class="cal-day ${cls}" title="Día ${d}">${emoji}</div>`;
  }
  cal.innerHTML = html;
}

function renderRegistroList() {
  const list = document.getElementById('registro-list');
  if (!list) return;
  const emojis = { 'Wrap Power':'🌯','Brochetas Superhéroe':'🍢','Pizza Escolar Nutritiva':'🍕','Mini Hamburguesitas':'🍔','Rollitos Campeones':'🥙','Otra receta':'🍱' };
  list.innerHTML = state.registros.slice(0, 10).map(r => {
    const emoji = emojis[r.receta] || '🍱';
    const stsCls = r.termino === 'si' ? 'status-completa' : r.termino === 'mitad' ? 'status-mitad' : 'status-no';
    const stsLabel = r.termino === 'si' ? '😄 Terminada' : r.termino === 'mitad' ? '😐 A la mitad' : '😞 No comió';
    const stars = '⭐'.repeat(r.stars) + '☆'.repeat(5 - r.stars);
    return `
      <div class="reg-item">
        <div class="reg-item-emoji">${emoji}</div>
        <div class="reg-item-info">
          <h4>${r.receta}</h4>
          <p>📅 ${r.fecha} ${r.obs ? '· ' + r.obs : ''}</p>
          <p>${stars}</p>
        </div>
        <span class="reg-item-status ${stsCls}">${stsLabel}</span>
      </div>`;
  }).join('');
}

// ══════════════════════════════════════════════════════════════
// OBSERVACIÓN DOCENTE
// ══════════════════════════════════════════════════════════════
function initDocente() {
  const f = document.getElementById('doc-fecha');
  if (f) f.value = new Date().toISOString().split('T')[0];
  renderDocenteList();
  renderDocenteResumen();
}

function setDocCat(btn, val) {
  state.docCat = val;
  document.querySelectorAll('.doc-cat').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function setValoracion(btn, val) {
  state.docVal = val;
  document.querySelectorAll('.val-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function saveDocente() {
  const nombre = document.getElementById('doc-nombre').value.trim();
  const fecha  = document.getElementById('doc-fecha').value;
  const grado  = document.getElementById('doc-grado').value;
  const obs    = document.getElementById('doc-obs').value.trim();
  if (!nombre || !obs) { showToast('⚠️', 'Incompleto', 'Ingresa nombre del docente y observación'); return; }
  state.observaciones.unshift({ docente: nombre, fecha, grado, cat: state.docCat, obs, val: state.docVal });
  renderDocenteList();
  renderDocenteResumen();
  showToast('👩‍🏫', '¡Observación guardada!', `${nombre} — ${grado}`);
  document.getElementById('doc-nombre').value = '';
  document.getElementById('doc-obs').value = '';
}

function renderDocenteList() {
  const list = document.getElementById('docente-list');
  if (!list) return;
  const catLabels = { alimentacion:'🥗 Alimentación', conducta:'😊 Conducta', energia:'⚡ Energía', concentracion:'🧠 Concentración', general:'📝 General' };
  const valClass  = { excelente:'val-excelente', bueno:'val-bueno', regular:'val-regular', 'necesita-mejora':'val-necesita-mejora' };
  const valLabel  = { excelente:'🌟 Excelente', bueno:'👍 Bueno', regular:'😐 Regular', 'necesita-mejora':'📌 Necesita mejora' };
  list.innerHTML = state.observaciones.map(o => `
    <div class="doc-item">
      <div class="doc-item-header">
        <span class="doc-item-teacher">👩‍🏫 ${o.docente}</span>
        <span class="doc-item-date">📅 ${o.fecha} · ${o.grado}</span>
        <span class="doc-item-cat">${catLabels[o.cat] || o.cat}</span>
      </div>
      <p class="doc-item-text">${o.obs}</p>
      <span class="doc-item-val ${valClass[o.val] || 'val-bueno'}">${valLabel[o.val] || o.val}</span>
    </div>`).join('');
}

function renderDocenteResumen() {
  const el = document.getElementById('docente-resumen');
  if (!el) return;
  const cats = { alimentacion:'🥗', conducta:'😊', energia:'⚡', concentracion:'🧠', general:'📝' };
  const labels = { alimentacion:'Alimentación', conducta:'Conducta', energia:'Energía', concentracion:'Concentración', general:'General' };
  el.innerHTML = Object.entries(cats).map(([k, emoji]) => {
    const count = state.observaciones.filter(o => o.cat === k).length;
    return `
      <div class="doc-res-item">
        <div class="doc-res-emoji">${emoji}</div>
        <div class="doc-res-count">${count}</div>
        <div class="doc-res-label">${labels[k]}</div>
      </div>`;
  }).join('');
}

// ══════════════════════════════════════════════════════════════
// COMPARACIÓN DE CALIFICACIONES
// ══════════════════════════════════════════════════════════════
function initCalificaciones() {
  renderCalChart();
  renderCalTable();
  renderIAAnalysis();
}

function saveCalificacion() {
  const materia   = document.getElementById('cal-materia').value;
  const periodo   = document.getElementById('cal-periodo').value;
  const nota      = parseInt(document.getElementById('cal-nota').value);
  const loncheras = parseInt(document.getElementById('cal-loncheras').value) || 0;
  if (!nota || nota < 0 || nota > 20) { showToast('⚠️', 'Nota inválida', 'Ingresa una nota entre 0 y 20'); return; }

  const bMap = { 'Bimestre 1':'b1', 'Bimestre 2':'b2', 'Bimestre 3':'b3', 'Bimestre 4':'b4' };
  const bKey = bMap[periodo];
  let existing = state.calificaciones.find(c => c.materia === materia);
  if (!existing) {
    existing = { materia, b1: null, b2: null, b3: null, b4: null, lonch: [] };
    state.calificaciones.push(existing);
  }
  existing[bKey] = nota;
  existing.lonch = existing.lonch || [];
  if (loncheras) existing.lonch.push(loncheras);

  renderCalChart();
  renderCalTable();
  renderIAAnalysis();
  showToast('📈', '¡Calificación guardada!', `${materia} — ${periodo}: ${nota}/20`);
  document.getElementById('cal-nota').value = '';
  document.getElementById('cal-loncheras').value = '';
}

function renderCalChart() {
  const chart = document.getElementById('cal-chart');
  if (!chart) return;

  const legendHTML = `
    <div class="cal-legend" style="width:100%;margin-bottom:8px">
      <div class="cal-legend-item"><div class="legend-dot legend-nota"></div> Nota (0-20)</div>
      <div class="cal-legend-item"><div class="legend-dot legend-lonch"></div> Loncheras completadas</div>
    </div>`;

  const barsHTML = state.calificaciones.map(c => {
    const notas = [c.b1, c.b2, c.b3, c.b4].filter(n => n !== null);
    const avgNota = notas.length ? notas.reduce((a, b) => a + b, 0) / notas.length : 0;
    const avgLonch = c.lonch && c.lonch.length ? c.lonch.reduce((a, b) => a + b, 0) / c.lonch.length : 0;
    const hNota  = Math.round((avgNota / 20) * 130);
    const hLonch = Math.round((avgLonch / 25) * 130);
    return `
      <div class="cal-bar-group">
        <div class="cal-bars">
          <div class="cal-bar-nota" style="height:${hNota}px" data-val="${avgNota.toFixed(1)}/20"></div>
          <div class="cal-bar-lonch" style="height:${hLonch}px" data-val="${avgLonch.toFixed(0)} lonch."></div>
        </div>
        <div class="cal-bar-label">${c.materia.slice(0,4)}.</div>
      </div>`;
  }).join('');

  chart.innerHTML = legendHTML + `<div style="display:flex;align-items:flex-end;gap:16px;height:140px">${barsHTML}</div>`;
}

function renderCalTable() {
  const tbody = document.getElementById('cal-tbody');
  if (!tbody) return;
  tbody.innerHTML = state.calificaciones.map(c => {
    const notas = [c.b1, c.b2, c.b3, c.b4];
    const getCls = n => n === null ? '' : n >= 17 ? 'nota-alta' : n >= 13 ? 'nota-media' : 'nota-baja';
    const fmt = n => n === null ? '—' : `<span class="${getCls(n)}">${n}</span>`;
    const filled = notas.filter(n => n !== null);
    let trend = '➡️';
    if (filled.length >= 2) {
      const last = filled[filled.length - 1];
      const prev = filled[filled.length - 2];
      trend = last > prev ? '<span class="tendencia-up">📈</span>' : last < prev ? '<span class="tendencia-down">📉</span>' : '<span class="tendencia-igual">➡️</span>';
    }
    return `<tr>
      <td>${c.materia}</td>
      <td>${fmt(c.b1)}</td>
      <td>${fmt(c.b2)}</td>
      <td>${fmt(c.b3)}</td>
      <td>${fmt(c.b4)}</td>
      <td>${trend}</td>
    </tr>`;
  }).join('');
}

function renderIAAnalysis() {
  const el = document.getElementById('ia-cal-text');
  if (!el) return;
  const total = state.calificaciones.length;
  if (total < 1) { el.textContent = 'Registra al menos una calificación para ver el análisis.'; return; }

  const todasNotas = state.calificaciones.flatMap(c => [c.b1,c.b2,c.b3,c.b4].filter(n=>n!==null));
  const avg = todasNotas.length ? (todasNotas.reduce((a,b)=>a+b,0)/todasNotas.length).toFixed(1) : 0;
  const mejorMateria = state.calificaciones.reduce((best, c) => {
    const notas = [c.b1,c.b2,c.b3,c.b4].filter(n=>n!==null);
    const avg2 = notas.length ? notas.reduce((a,b)=>a+b,0)/notas.length : 0;
    return avg2 > (best.avg||0) ? {materia:c.materia, avg:avg2} : best;
  }, {});
  const pctLonch = state.registros.length
    ? Math.round((state.registros.filter(r=>r.termino==='si').length / state.registros.length)*100)
    : 0;
  const correlacion = pctLonch > 70 ? 'positiva' : pctLonch > 40 ? 'moderada' : 'baja';

  el.innerHTML = `
    🤖 <strong>Análisis NutriBox:</strong><br><br>
    📊 Promedio general de notas: <strong>${avg}/20</strong><br>
    🏆 Mejor rendimiento en: <strong>${mejorMateria.materia || '—'}</strong> (${(mejorMateria.avg||0).toFixed(1)}/20)<br>
    ✅ Loncheras completadas: <strong>${pctLonch}%</strong><br>
    🔗 Correlación alimentación-rendimiento: <strong>${correlacion}</strong><br><br>
    ${pctLonch > 70
      ? '💚 ¡Excelente! Los datos muestran que cuando tu hijo come bien, su rendimiento académico mejora notablemente. Continúa con las loncheras nutritivas.'
      : pctLonch > 40
      ? '🟡 Hay una correlación moderada. Aumentar las loncheras completadas al 75%+ podría mejorar aún más las calificaciones.'
      : '🔴 Se observa baja consistencia en alimentación. Considera recetas más atractivas para motivar a tu hijo a terminar su lonchera.'}`;
}

// Init al cargar si ya está en la sección padres
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar fecha en registro
  const regF = document.getElementById('reg-fecha');
  if (regF) regF.value = new Date().toISOString().split('T')[0];
});
