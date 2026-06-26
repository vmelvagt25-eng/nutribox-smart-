/* ============================================================
   NUTRIBOX - LÓGICA PRINCIPAL
   ============================================================ */

// Estado global
let state = {
  user: null,
  currentSection: null,
  kidsInsignias: 12,
  kidsCoins: 150,
  kidsXP: 320,
  kidsName: "Campeón",
  parentName: "Mamá",
  favorites: [1, 2],
  preparedRecipes: [3],
  gastos: [
    { fecha: "2026-06-24", receta: "Wrap Power", total: 8.50, ingredientes: [{ n:"Pollo",p:4.00},{ n:"Tortilla",p:1.50},{ n:"Tomate",p:0.50},{ n:"Lechuga",p:1.50},{ n:"Palta",p:1.00}] },
    { fecha: "2026-06-25", receta: "Brochetas Superhéroe", total: 7.20, ingredientes: [{ n:"Queso",p:3.00},{ n:"Tomate cherry",p:1.50},{ n:"Pepino",p:0.70},{ n:"Jamón pavo",p:2.00}] }
  ],
  foroPosts: [...FORO_POSTS_INIT],
  salonLikes: {},
  avatar: { skin: "🧒", acc: "" },
  lunchHistory: [
    { id: 1, emoji: "🌯", name: "Wrap Power", date: "25 Jun", liked: "😊", disliked: "", repeat: "😋" },
    { id: 2, emoji: "🍢", name: "Brochetas", date: "24 Jun", liked: "😊", disliked: "", repeat: "😋" }
  ]
};

// ============================================================ NAVEGACIÓN
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function doLogin() {
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-pass').value;
  if (!email) { shakeInput('login-email'); return; }
  state.user = { email, name: email.split('@')[0] };
  state.parentName = state.user.name.charAt(0).toUpperCase() + state.user.name.slice(1);
  showScreen('screen-role');
}

function doRegister() {
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const pass = document.getElementById('reg-pass').value;
  if (!name || !email) { return; }
  state.user = { email, name };
  state.parentName = name;
  showScreen('screen-role');
}

function enterSection(section) {
  if (section === 'parents') {
    document.getElementById('parent-name').textContent = state.parentName;
    showScreen('section-parents');
    initParentsSection();
    scheduleNotification();
  } else {
    showScreen('section-kids');
    initKidsSection();
  }
}

function shakeInput(id) {
  const el = document.getElementById(id);
  el.style.animation = 'shakeNo 0.5s ease';
  setTimeout(() => el.style.animation = '', 600);
  el.style.borderColor = '#f44336';
  setTimeout(() => el.style.borderColor = '', 1500);
}

// ============================================================ PARENTS
function showParentTab(tab) {
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('ptab-' + tab).classList.add('active');
  document.getElementById('pnav-' + tab).classList.add('active');

  if (tab === 'recetas') renderRecipes(RECIPES);
  if (tab === 'gastos') renderGastosChart();
  if (tab === 'salon') renderSalon();
  if (tab === 'foro') renderForo();
  if (tab === 'home') updateParentTree();
}

function initParentsSection() {
  updateParentTree();
  renderRecipes(RECIPES);
  renderGastosChart();
  renderSalon();
  renderForo();
  renderGastosList();
}

function updateParentTree() {
  const stage = getTreeStage(state.kidsInsignias);
  const el = document.getElementById('parent-tree-display');
  if (el) el.textContent = stage.emoji;
  const lv = document.getElementById('parent-tree-level');
  if (lv) {
    const badge = BADGES.find(b => state.kidsInsignias >= b.req) || BADGES[0];
    lv.textContent = badge ? badge.emoji + ' ' + badge.name : '🌱 Semilla Nutri';
  }
  const ct = document.getElementById('parent-tree-count');
  if (ct) ct.textContent = state.kidsInsignias;
  const si = document.getElementById('stat-insignias');
  if (si) si.textContent = state.kidsInsignias;
}

// ============================================================ RECETAS
function renderRecipes(list) {
  const grid = document.getElementById('recipes-grid');
  if (!grid) return;
  grid.innerHTML = '';
  list.forEach(r => {
    const isFav = state.favorites.includes(r.id);
    const isPrepared = state.preparedRecipes.includes(r.id);
    const stars = '⭐'.repeat(r.difficultyNum) + '☆'.repeat(5 - r.difficultyNum);
    const card = document.createElement('div');
    card.className = 'recipe-card animate-slide';
    card.innerHTML = `
      <div class="recipe-emoji" onclick="openRecipe(${r.id})">${r.emoji}</div>
      <div class="recipe-info" onclick="openRecipe(${r.id})">
        <h3>${r.name}</h3>
        <div class="recipe-meta">
          <span>⏱ ${r.time} min</span>
          <span>${stars}</span>
          <span>💰 ${r.cost}</span>
        </div>
        <div class="recipe-tags">
          ${r.tags.map(t => `<span class="recipe-tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="recipe-actions">
        <button class="btn-fav ${isFav ? 'active' : ''}" onclick="toggleFav(${r.id}, this)">
          ${isFav ? '❤️ Favorita' : '🤍 Favorita'}
        </button>
        <button class="btn-prepared" onclick="markPrepared(${r.id})">
          ${isPrepared ? '✅ Preparada' : '✅ Preparé esta'}
        </button>
      </div>`;
    grid.appendChild(card);
  });

  // Sugerencia de IA
  const sug = document.getElementById('ai-suggestion');
  const txt = document.getElementById('ai-suggestion-text');
  if (sug && txt) {
    const rnd = AI_SUGGESTIONS[Math.floor(Math.random() * AI_SUGGESTIONS.length)];
    txt.textContent = rnd;
    sug.style.display = 'flex';
  }
}

function filterRecipes() {
  const q = document.getElementById('recipe-search').value.toLowerCase();
  const filtered = RECIPES.filter(r =>
    r.name.toLowerCase().includes(q) ||
    r.tags.some(t => t.includes(q)) ||
    r.ingredients.some(i => i.toLowerCase().includes(q))
  );
  renderRecipes(filtered);
}

function filterByTag(tag, btn) {
  document.querySelectorAll('.filter-tags .tag').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  if (tag === 'todos') { renderRecipes(RECIPES); return; }
  renderRecipes(RECIPES.filter(r => r.tags.includes(tag)));
}

function toggleFav(id, btn) {
  const idx = state.favorites.indexOf(id);
  if (idx > -1) { state.favorites.splice(idx, 1); btn.className = 'btn-fav'; btn.textContent = '🤍 Favorita'; }
  else { state.favorites.push(id); btn.className = 'btn-fav active'; btn.textContent = '❤️ Favorita'; }
}

function markPrepared(id) {
  if (!state.preparedRecipes.includes(id)) {
    state.preparedRecipes.push(id);
    const recipe = RECIPES.find(r => r.id === id);
    addLunchToHistory(recipe);
    showToast('✅', '¡Receta preparada!', 'La lonchera fue registrada');
    renderRecipes(RECIPES);
    updateParentTree();
  }
}

function openRecipe(id) {
  const r = RECIPES.find(rec => rec.id === id);
  if (!r) return;
  const stars = '⭐'.repeat(r.difficultyNum) + '☆'.repeat(5 - r.difficultyNum);
  const modal = document.getElementById('recipe-modal');
  const content = document.getElementById('recipe-modal-content');
  content.innerHTML = `
    <button class="modal-close" onclick="closeRecipeModal()">✕</button>
    <div class="modal-recipe-emoji">${r.emoji}<h2>${r.name}</h2></div>
    <div class="modal-section">
      <h3>📋 Información</h3>
      <p>⏱ Tiempo: ${r.time} minutos &nbsp; | &nbsp; 💰 Costo: ${r.cost}</p>
      <p>Dificultad: <span class="diff-stars">${stars}</span> ${r.difficulty}</p>
    </div>
    <div class="modal-section">
      <h3>🛒 Ingredientes</h3>
      <ul>${r.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>
    <div class="modal-section">
      <h3>👩‍🍳 Preparación</h3>
      <ol class="steps-list" style="list-style:none;counter-reset:step">
        ${r.steps.map(s => `<li>${s}</li>`).join('')}
      </ol>
    </div>
    <div class="modal-section">
      <h3>💚 Información Nutricional</h3>
      <div class="nutri-grid">
        <div class="nutri-item"><div class="val">${r.nutrition.calorias}</div><div class="label">Calorías</div></div>
        <div class="nutri-item"><div class="val">${r.nutrition.proteinas}g</div><div class="label">Proteínas</div></div>
        <div class="nutri-item"><div class="val">${r.nutrition.carbos}g</div><div class="label">Carbohidratos</div></div>
        <div class="nutri-item"><div class="val">${r.nutrition.grasas}g</div><div class="label">Grasas</div></div>
        <div class="nutri-item"><div class="val">⭐${r.community_rating}</div><div class="label">Comunidad</div></div>
        <div class="nutri-item"><div class="val">🤖</div><div class="label">IA Aprobada</div></div>
      </div>
    </div>
    <div class="modal-section">
      <h3>🤖 Sustituciones IA</h3>
      <p style="font-size:13px;color:#666">La palta puede sustituirse por huevo cocido (igual proteína, menor costo). El pollo puede reemplazarse por atún en agua.</p>
    </div>`;
  modal.classList.add('open');
}

function closeRecipeModal(e) {
  if (!e || e.target.id === 'recipe-modal' || e.target.classList.contains('modal-close')) {
    document.getElementById('recipe-modal').classList.remove('open');
  }
}

// ============================================================ GASTOS
function addIngredientRow() {
  const container = document.getElementById('gasto-ingredientes');
  const row = document.createElement('div');
  row.className = 'ingredient-row';
  row.innerHTML = `
    <input type="text" placeholder="Ingrediente" class="input-field small">
    <input type="number" placeholder="S/" class="input-field tiny">`;
  container.appendChild(row);
}

function saveGasto() {
  const fecha = document.getElementById('gasto-fecha').value;
  const receta = document.getElementById('gasto-receta').value;
  const rows = document.querySelectorAll('#gasto-ingredientes .ingredient-row');
  const ingredientes = [];
  let total = 0;
  rows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    const n = inputs[0].value;
    const p = parseFloat(inputs[1].value) || 0;
    if (n) { ingredientes.push({ n, p }); total += p; }
  });
  if (!fecha || !receta) { showToast('⚠️', 'Completa los campos', 'Fecha y receta son requeridas'); return; }
  state.gastos.unshift({ fecha, receta, total, ingredientes });
  renderGastosChart();
  renderGastosList();
  showToast('💾', '¡Gasto guardado!', `Total: S/${total.toFixed(2)}`);
}

function renderGastosChart() {
  const container = document.getElementById('gastos-chart');
  if (!container) return;
  const last7 = state.gastos.slice(0, 7).reverse();
  const max = Math.max(...last7.map(g => g.total), 10);
  container.innerHTML = last7.map(g => `
    <div class="chart-bar-wrap">
      <div class="chart-bar-val">S/${g.total.toFixed(0)}</div>
      <div class="chart-bar" style="height:${(g.total / max * 120)}px"></div>
      <div class="chart-bar-label">${g.fecha ? g.fecha.slice(5) : 'N/A'}</div>
    </div>`).join('');
  renderGastosList();
}

function renderGastosList() {
  const list = document.getElementById('gastos-list');
  if (!list) return;
  list.innerHTML = state.gastos.map(g => `
    <div class="gasto-item animate-slide">
      <div class="gasto-left">
        <div class="gasto-recipe">🍽️ ${g.receta}</div>
        <div class="gasto-date">📅 ${g.fecha}</div>
        <div style="font-size:12px;color:#888">${g.ingredientes.map(i => `${i.n}: S/${i.p.toFixed(2)}`).join(' · ')}</div>
      </div>
      <div class="gasto-total">S/${g.total.toFixed(2)}</div>
    </div>`).join('');
}

// ============================================================ SALÓN
function renderSalon() {
  const grid = document.getElementById('salon-posts');
  if (!grid) return;
  grid.innerHTML = SALON_POSTS.map(p => `
    <div class="salon-post animate-slide">
      <div class="salon-post-img">${p.emoji}</div>
      <div class="salon-post-body">
        <div class="salon-post-author">
          <span class="salon-post-name">👨‍👩‍👧 ${p.author}</span>
          <span class="salon-post-date">${p.date}</span>
        </div>
        <p class="salon-post-text">${p.text}</p>
        <div class="salon-post-actions">
          <button class="btn-like ${state.salonLikes[p.id] ? 'liked' : ''}" onclick="toggleLike(${p.id}, this)">
            ❤️ ${(p.likes + (state.salonLikes[p.id] ? 1 : 0))}
          </button>
          <button class="btn-comment-link">💬 Comentar</button>
        </div>
      </div>
    </div>`).join('');
}

function toggleLike(postId, btn) {
  state.salonLikes[postId] = !state.salonLikes[postId];
  const post = SALON_POSTS.find(p => p.id === postId);
  const count = post.likes + (state.salonLikes[postId] ? 1 : 0);
  btn.className = `btn-like ${state.salonLikes[postId] ? 'liked' : ''}`;
  btn.innerHTML = `❤️ ${count}`;
}

// ============================================================ FORO
function renderForo() {
  const list = document.getElementById('foro-posts');
  if (!list) return;
  list.innerHTML = state.foroPosts.map(p => `
    <div class="foro-post animate-slide">
      <div class="foro-post-header">
        <div class="foro-avatar">${p.avatar}</div>
        <div class="foro-author-info">
          <h4>${p.author}</h4>
          <span>${p.date}</span>
        </div>
      </div>
      <p class="foro-post-text">${p.text}</p>
      <div class="foro-post-actions">
        <button class="btn-react" onclick="this.innerHTML='👍 '+(parseInt(this.innerHTML.match(/\\d+/)?.[0]||0)+1)">👍 ${p.likes}</button>
        <button class="btn-react">💬 Responder</button>
        <button class="btn-react">🔗 Compartir</button>
      </div>
    </div>`).join('');
}

function postForo() {
  const text = document.getElementById('foro-text').value.trim();
  if (!text) return;
  const newPost = {
    id: Date.now(), author: state.parentName, avatar: "👤",
    text, date: "ahora", likes: 0
  };
  state.foroPosts.unshift(newPost);
  document.getElementById('foro-text').value = '';
  renderForo();
  showToast('✅', '¡Publicado!', 'Tu consejo fue compartido');
}

// ============================================================ KIDS SECTION
function showKidsTab(tab) {
  document.querySelectorAll('.ktab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.kids-nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('ktab-' + tab).classList.add('active');
  document.getElementById('knav-' + tab).classList.add('active');

  if (tab === 'kinsignias') renderBadges();
  if (tab === 'karbol') updateKidsTree();
  if (tab === 'khistorial') renderLunchHistory();
  if (tab === 'kjuegos') updateGameLocks();
}

function initKidsSection() {
  document.getElementById('kids-name').textContent = state.kidsName;
  document.getElementById('kids-coins').textContent = state.kidsCoins;
  document.getElementById('kids-xp').textContent = state.kidsXP;
  document.getElementById('kids-badges-count').textContent = state.kidsInsignias;
  document.getElementById('kids-lunches-count').textContent = state.lunchHistory.length;
  updateAvatarDisplay();
  renderBadges();
  updateKidsTree();
  renderLunchHistory();
  updateGameLocks();
  scheduleNotification(true);
}

function updateAvatarDisplay() {
  const el = document.getElementById('main-avatar');
  if (el) {
    el.querySelector('.avatar-body').textContent = state.avatar.skin;
    el.querySelector('.avatar-items').textContent = state.avatar.acc;
  }
}

// ============================================================ INSIGNIAS
function renderBadges() {
  const grid = document.getElementById('badges-grid');
  if (!grid) return;
  grid.innerHTML = BADGES.map(b => {
    const unlocked = state.kidsInsignias >= b.req;
    return `
      <div class="badge-item ${unlocked ? 'unlocked' : ''}">
        <div class="badge-emoji ${unlocked ? '' : 'badge-lock'}">${unlocked ? b.emoji : '🔒'}</div>
        <h4>${b.name}</h4>
        <p>${b.desc}</p>
        <div class="badge-req">${unlocked ? '✅ Desbloqueado' : `🔒 ${b.req} insignias`}</div>
        ${unlocked ? `<div style="font-size:11px;color:var(--green2);margin-top:4px">🎁 ${b.reward}</div>` : ''}
      </div>`;
  }).join('');

  const total = document.getElementById('badges-total');
  if (total) total.textContent = state.kidsInsignias;
  const bar = document.getElementById('badges-progress-bar');
  if (bar) bar.style.width = Math.min((state.kidsInsignias / 50) * 100, 100) + '%';
  const lvl = document.getElementById('current-level-label');
  if (lvl) {
    const current = [...BADGES].reverse().find(b => state.kidsInsignias >= b.req);
    if (current) lvl.textContent = current.emoji + ' ' + current.name;
  }
}

function getTreeStage(count) {
  return TREE_STAGES.find(s => count >= s.min && count <= s.max) || TREE_STAGES[0];
}

function updateKidsTree() {
  const stage = getTreeStage(state.kidsInsignias);
  const tv = document.getElementById('tree-visual');
  const tl = document.getElementById('tree-stage-label');
  if (tv) { tv.textContent = stage.emoji; tv.style.animation = 'growTree 0.5s ease'; }
  if (tl) tl.textContent = stage.label;

  document.querySelectorAll('.milestone').forEach(m => {
    const req = parseInt(m.querySelector('span').textContent);
    if (state.kidsInsignias >= req) m.classList.add('done');
  });
}

// ============================================================ CAMERA / LUNCH
function uploadLunchPhoto() {
  document.getElementById('lunch-photo').click();
}

function handlePhotoUpload(input) {
  if (input.files && input.files[0]) {
    const area = document.getElementById('camera-area');
    area.innerHTML = `
      <div class="camera-icon">✅</div>
      <p style="color:var(--yellow);font-weight:800">¡Foto cargada!</p>
      <p style="font-size:12px;opacity:0.7">${input.files[0].name}</p>`;
    setTimeout(() => {
      earnBadge('📸', '¡Lonchera fotografiada!', 'Has ganado 1 insignia por subir tu lonchera');
    }, 500);
  }
}

function saveKidsForm() {
  const fav = document.getElementById('kids-fav').value;
  showToast('💾', '¡Preferencias guardadas!', 'El papá/mamá verá tus gustos', true);
  setTimeout(() => earnBadge('📝', '¡Formulario completado!', 'Ganaste una insignia por contarnos tus gustos'), 1000);
}

function addLunchToHistory(recipe) {
  state.lunchHistory.unshift({
    id: Date.now(),
    emoji: recipe.emoji,
    name: recipe.name,
    date: new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'short' }),
    liked: "😊", disliked: "", repeat: "😋"
  });
  state.kidsInsignias++;
  state.kidsCoins += 5;
  state.kidsXP += 20;
  updateKidsCounters();
}

function renderLunchHistory() {
  const grid = document.getElementById('kids-lunches-grid');
  if (!grid) return;
  grid.innerHTML = state.lunchHistory.map(l => `
    <div class="lunch-card animate-pop">
      <div class="lunch-img">${l.emoji}</div>
      <div class="lunch-body">
        <h4>${l.name}</h4>
        <div class="lunch-date">📅 ${l.date}</div>
        <div class="lunch-reactions">
          <span class="lunch-reaction">😊 Me gustó</span>
          <span class="lunch-reaction">😋 Repetiría</span>
        </div>
      </div>
    </div>`).join('');
}

function updateKidsCounters() {
  const kbc = document.getElementById('kids-badges-count');
  if (kbc) kbc.textContent = state.kidsInsignias;
  // Coins — nav principal + topbar móvil
  ['kids-coins', 'kids-coins-top'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = state.kidsCoins;
  });
  // XP — nav principal + topbar móvil
  ['kids-xp', 'kids-xp-top'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = state.kidsXP;
  });
  const klc = document.getElementById('kids-lunches-count');
  if (klc) klc.textContent = state.lunchHistory.length;
}

// ============================================================ JUEGOS
function updateGameLocks() {
  const locks = [
    { id: 'game-memoria', lockId: 'lock-memoria', req: 15 },
    { id: 'game-rompecabezas', lockId: 'lock-rompecabezas', req: 20 },
    { id: 'game-cocina', lockId: 'lock-cocina', req: 25 },
    { id: 'game-alimenta', lockId: 'lock-alimenta', req: 30 }
  ];
  locks.forEach(({ id, lockId, req }) => {
    const card = document.getElementById(id);
    const lock = document.getElementById(lockId);
    if (state.kidsInsignias >= req) {
      if (card) card.classList.add('unlocked');
      if (lock) lock.style.display = 'none';
    }
  });
}

// ============================================================ RECOMPENSAS
function earnBadge(emoji, title, text) {
  state.kidsInsignias++;
  state.kidsCoins += 10;
  state.kidsXP += 50;
  updateKidsCounters();
  renderBadges();
  updateKidsTree();
  showReward(emoji, title, text);
}

function showReward(icon, title, text) {
  const modal = document.getElementById('reward-modal');
  modal.classList.add('open');
  document.getElementById('reward-icon').textContent = icon;
  document.getElementById('reward-title').textContent = title;
  document.getElementById('reward-text').textContent = text;
  createConfetti();
  playSound();
}

function closeReward() {
  document.getElementById('reward-modal').classList.remove('open');
  document.getElementById('confetti-area').innerHTML = '';
}

function createConfetti() {
  const area = document.getElementById('confetti-area');
  area.innerHTML = '';
  const items = ['🎉', '⭐', '🏅', '🎊', '✨', '🌟', '💫', '🥳'];
  for (let i = 0; i < 20; i++) {
    const c = document.createElement('span');
    c.className = 'confetti-piece';
    c.textContent = items[Math.floor(Math.random() * items.length)];
    c.style.left = Math.random() * 100 + '%';
    c.style.animationDelay = Math.random() * 1.5 + 's';
    c.style.fontSize = (16 + Math.random() * 16) + 'px';
    area.appendChild(c);
  }
}

function playSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.3);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.3);
    });
  } catch(e) {}
}

// ============================================================ AVATAR
function customizeAvatar() {
  document.getElementById('avatar-modal').classList.add('open');
}

function setAvatarPart(part, val) {
  state.avatar[part] = val;
  updateAvatarDisplay();
}

function closeAvatarModal(e) {
  if (!e || e.target.id === 'avatar-modal') {
    document.getElementById('avatar-modal').classList.remove('open');
  }
}

// ============================================================ MODALS
function closeGameModal(e) {
  if (!e || e.target.id === 'game-modal') {
    document.getElementById('game-modal').classList.remove('open');
    stopCurrentGame();
  }
}

// ============================================================ TOAST
function showToast(icon, title, text, isKids = false) {
  const old = document.querySelector('.notification-toast');
  if (old) old.remove();
  const toast = document.createElement('div');
  toast.className = `notification-toast ${isKids ? 'kids' : ''}`;
  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-body"><h4>${title}</h4><p>${text}</p></div>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function scheduleNotification(isKids = false) {
  const notifs = NOTIFICATIONS;
  let i = 0;
  const showNext = () => {
    if (i < notifs.length) {
      const n = notifs[i++];
      showToast(n.icon, n.title, n.text, isKids);
      setTimeout(showNext, 8000);
    }
  };
  setTimeout(showNext, 3000);
}

// ============================================================ INIT
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('gasto-fecha').value = new Date().toISOString().split('T')[0];
});
