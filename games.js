/* ============================================================
   NUTRIBOX - VIDEOJUEGOS EDUCATIVOS
   ============================================================ */

let currentGame = null;
let gameInterval = null;
let gameScore = 0;
let gameTimer = 0;
let gameTimerInterval = null;

function stopCurrentGame() {
  if (gameInterval) { clearInterval(gameInterval); gameInterval = null; }
  if (gameTimerInterval) { clearInterval(gameTimerInterval); gameTimerInterval = null; }
  currentGame = null;
}

function playGame(gameId) {
  const n = state.kidsInsignias;
  const locks = { memoria: 15, rompecabezas: 20, cocina: 25, alimenta: 30 };
  if (locks[gameId] && n < locks[gameId]) {
    showToast('🔒', 'Juego bloqueado', `Necesitas ${locks[gameId]} insignias para desbloquear`);
    return;
  }
  stopCurrentGame();
  currentGame = gameId;
  gameScore = 0;

  const modal = document.getElementById('game-modal');
  const content = document.getElementById('game-modal-content');
  modal.classList.add('open');

  switch (gameId) {
    case 'frutas': renderFruitGame(content); break;
    case 'carrera': renderRunGame(content); break;
    case 'memoria': renderMemoryGame(content); break;
    case 'rompecabezas': renderPuzzleGame(content); break;
    case 'cocina': renderCookGame(content); break;
    case 'alimenta': renderFeedGame(content); break;
  }
}

// ============================================================ JUEGO 1: ATRAPA LAS FRUTAS
function renderFruitGame(container) {
  container.innerHTML = `
    <button class="modal-close" onclick="closeGameModal()">✕</button>
    <h2 style="color:var(--yellow);font-family:'Fredoka One',cursive;text-align:center">🍎 Atrapa las Frutas</h2>
    <p style="text-align:center;color:rgba(255,255,255,0.7);font-size:13px">¡Toca las frutas! Evita la comida chatarra</p>
    <div class="game-score" id="fruit-score">Puntos: 0</div>
    <div class="game-score" id="fruit-timer" style="font-size:16px;color:rgba(255,255,255,0.7)">⏱ 30s</div>
    <div class="game-canvas-area" id="fruit-canvas"></div>
    <div class="game-controls">
      <button class="btn-game-ctrl" onclick="startFruitGame()">▶ Iniciar</button>
      <button class="btn-game-ctrl" style="background:rgba(255,255,255,0.2);color:white" onclick="closeGameModal()">Salir</button>
    </div>`;
}

function startFruitGame() {
  const canvas = document.getElementById('fruit-canvas');
  if (!canvas) return;
  canvas.innerHTML = '';
  gameScore = 0;
  gameTimer = 30;
  updateFruitScore();

  gameTimerInterval = setInterval(() => {
    gameTimer--;
    const te = document.getElementById('fruit-timer');
    if (te) te.textContent = `⏱ ${gameTimer}s`;
    if (gameTimer <= 0) {
      clearInterval(gameTimerInterval);
      clearInterval(gameInterval);
      endFruitGame();
    }
  }, 1000);

  gameInterval = setInterval(() => {
    if (!document.getElementById('fruit-canvas')) { clearInterval(gameInterval); return; }
    spawnFruitItem();
  }, 800);
}

function spawnFruitItem() {
  const canvas = document.getElementById('fruit-canvas');
  if (!canvas) return;
  const all = [...GAME_FOODS.healthy, ...GAME_FOODS.unhealthy];
  const isHealthy = Math.random() > 0.3;
  const emoji = isHealthy
    ? GAME_FOODS.healthy[Math.floor(Math.random() * GAME_FOODS.healthy.length)]
    : GAME_FOODS.unhealthy[Math.floor(Math.random() * GAME_FOODS.unhealthy.length)];

  const item = document.createElement('span');
  item.className = 'fall-item';
  item.textContent = emoji;
  item.style.left = (5 + Math.random() * 85) + '%';
  item.style.animationDuration = (1.5 + Math.random() * 2) + 's';

  item.addEventListener('click', () => {
    if (isHealthy) {
      gameScore += 10;
      showScorePopup(item, '+10');
    } else {
      gameScore = Math.max(0, gameScore - 5);
      showScorePopup(item, '-5', '#f44336');
      item.style.animation = 'shakeNo 0.3s ease';
    }
    updateFruitScore();
    item.remove();
  });

  canvas.appendChild(item);
  setTimeout(() => { if (item.parentNode) item.remove(); }, 4000);
}

function updateFruitScore() {
  const el = document.getElementById('fruit-score');
  if (el) el.textContent = `Puntos: ${gameScore}`;
}

function showScorePopup(el, text, color = '#4CAF50') {
  const pop = document.createElement('span');
  pop.textContent = text;
  pop.style.cssText = `position:absolute;color:${color};font-weight:900;font-size:20px;pointer-events:none;animation:scoreUp 1s ease forwards;left:${el.style.left};top:${el.style.top || '20%'}`;
  el.parentNode && el.parentNode.appendChild(pop);
  setTimeout(() => pop.remove(), 1000);
}

function endFruitGame() {
  const canvas = document.getElementById('fruit-canvas');
  if (canvas) canvas.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px">
      <div style="font-size:48px">🏆</div>
      <div style="font-size:28px;color:var(--yellow);font-weight:900">¡Juego terminado!</div>
      <div style="font-size:22px;color:white">Puntos: <strong style="color:var(--yellow)">${gameScore}</strong></div>
    </div>`;
  if (gameScore >= 50) {
    setTimeout(() => {
      earnBadge('🍎', '¡Maestro de las Frutas!', `Puntuaste ${gameScore} puntos. +3 insignias`);
      state.kidsInsignias += 2;
      updateKidsCounters();
    }, 1000);
  }
}

// ============================================================ JUEGO 2: CARRERA
function renderRunGame(container) {
  container.innerHTML = `
    <button class="modal-close" onclick="closeGameModal()">✕</button>
    <h2 style="color:var(--yellow);font-family:'Fredoka One',cursive;text-align:center">🏃 Carrera de Alimentos</h2>
    <p style="text-align:center;color:rgba(255,255,255,0.7);font-size:13px">¡Salta los obstáculos! Presiona ESPACIO o toca</p>
    <div class="game-score" id="run-score">Distancia: 0m</div>
    <div class="game-canvas-area" id="run-canvas" style="background:linear-gradient(180deg,#1a0a4b 60%,#2d5a27 60%)">
      <span class="runner" id="runner">🏃</span>
    </div>
    <div class="game-controls">
      <button class="btn-game-ctrl" onclick="startRunGame()" id="run-start-btn">▶ Iniciar</button>
      <button class="btn-game-ctrl" style="background:rgba(255,255,255,0.2);color:white" onclick="jump()" id="jump-btn" disabled>⬆ Saltar</button>
      <button class="btn-game-ctrl" style="background:rgba(255,255,255,0.2);color:white" onclick="closeGameModal()">Salir</button>
    </div>`;
}

let runnerJumping = false;
let runDistance = 0;
let runActive = false;

function startRunGame() {
  runActive = true; runDistance = 0; runnerJumping = false;
  const startBtn = document.getElementById('run-start-btn');
  const jumpBtn = document.getElementById('jump-btn');
  if (startBtn) startBtn.disabled = true;
  if (jumpBtn) jumpBtn.disabled = false;

  document.addEventListener('keydown', (e) => { if (e.code === 'Space' && runActive) jump(); });
  const canvas = document.getElementById('run-canvas');
  if (canvas) canvas.addEventListener('click', () => { if (runActive) jump(); });

  gameInterval = setInterval(() => {
    runDistance += 5;
    const el = document.getElementById('run-score');
    if (el) el.textContent = `Distancia: ${runDistance}m`;
    spawnObstacle();
    checkRunCollision();
  }, 100);
}

function jump() {
  if (runnerJumping) return;
  runnerJumping = true;
  const runner = document.getElementById('runner');
  if (!runner) return;
  runner.style.bottom = '120px';
  setTimeout(() => {
    if (runner) runner.style.bottom = '30px';
    runnerJumping = false;
  }, 500);
}

function spawnObstacle() {
  if (Math.random() > 0.05) return;
  const canvas = document.getElementById('run-canvas');
  if (!canvas) return;
  const obs = document.createElement('span');
  obs.className = 'obstacle';
  obs.textContent = GAME_FOODS.unhealthy[Math.floor(Math.random() * GAME_FOODS.unhealthy.length)];
  obs.style.animationDuration = (2 + Math.random()) + 's';
  canvas.appendChild(obs);
  setTimeout(() => obs.remove(), 3500);
}

function checkRunCollision() {
  const runner = document.getElementById('runner');
  const obstacles = document.querySelectorAll('.obstacle');
  if (!runner) return;
  const runRect = runner.getBoundingClientRect();
  obstacles.forEach(obs => {
    const obsRect = obs.getBoundingClientRect();
    if (Math.abs(runRect.left - obsRect.left) < 30 && runRect.bottom > obsRect.top + 10) {
      endRunGame();
    }
  });
}

function endRunGame() {
  if (!runActive) return;
  runActive = false;
  clearInterval(gameInterval);
  const canvas = document.getElementById('run-canvas');
  if (canvas) canvas.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px">
      <div style="font-size:48px">💨</div>
      <div style="font-size:24px;color:var(--yellow);font-weight:900">¡Juego terminado!</div>
      <div style="color:white">Distancia: <strong style="color:var(--yellow)">${runDistance}m</strong></div>
    </div>`;
  if (runDistance >= 200) {
    setTimeout(() => earnBadge('🏃', '¡Gran Corredor!', `Corriste ${runDistance}m. +3 insignias`), 800);
  }
}

// ============================================================ JUEGO 3: MEMORIA
function renderMemoryGame(container) {
  const foods = [...GAME_FOODS.healthy.slice(0, 6), ...GAME_FOODS.healthy.slice(0, 6)];
  const shuffled = foods.sort(() => Math.random() - 0.5);
  let flipped = [];
  let matched = 0;
  let moves = 0;

  container.innerHTML = `
    <button class="modal-close" onclick="closeGameModal()">✕</button>
    <h2 style="color:var(--yellow);font-family:'Fredoka One',cursive;text-align:center">🧠 Memoria Nutricional</h2>
    <p style="text-align:center;color:rgba(255,255,255,0.7);font-size:13px">Encuentra todos los pares</p>
    <div class="game-score" id="mem-score">Movimientos: 0</div>
    <div style="display:grid;grid-template-columns:repeat(4,70px);gap:8px;justify-content:center;margin:16px 0" id="mem-grid">
      ${shuffled.map((emoji, i) => `
        <div class="mem-card" data-emoji="${emoji}" data-idx="${i}" onclick="flipMemCard(this)">
          <span class="mem-front">❓</span>
          <span class="mem-back">${emoji}</span>
        </div>`).join('')}
    </div>
    <div class="game-controls">
      <button class="btn-game-ctrl" onclick="renderMemoryGame(document.getElementById('game-modal-content'))">🔄 Nueva partida</button>
      <button class="btn-game-ctrl" style="background:rgba(255,255,255,0.2);color:white" onclick="closeGameModal()">Salir</button>
    </div>`;

  window._memState = { flipped: [], matched: 0, moves: 0, locked: false };
}

function flipMemCard(card) {
  const s = window._memState;
  if (!s || s.locked || card.classList.contains('flipped') || card.classList.contains('matched')) return;

  card.classList.add('flipped');
  card.querySelector('.mem-front').style.display = 'none';
  card.querySelector('.mem-back').style.display = 'block';
  s.flipped.push(card);

  if (s.flipped.length === 2) {
    s.moves++;
    const el = document.getElementById('mem-score');
    if (el) el.textContent = `Movimientos: ${s.moves}`;
    s.locked = true;

    const [a, b] = s.flipped;
    if (a.dataset.emoji === b.dataset.emoji) {
      a.classList.add('matched'); b.classList.add('matched');
      s.matched++;
      s.flipped = []; s.locked = false;
      if (s.matched === 6) {
        setTimeout(() => earnBadge('🧠', '¡Memoria Perfecta!', `Completaste en ${s.moves} movimientos! +2 insignias`), 500);
      }
    } else {
      setTimeout(() => {
        [a, b].forEach(c => {
          c.classList.remove('flipped');
          c.querySelector('.mem-front').style.display = 'block';
          c.querySelector('.mem-back').style.display = 'none';
        });
        s.flipped = []; s.locked = false;
      }, 800);
    }
  }
}

// ============================================================ JUEGO 4: ROMPECABEZAS
function renderPuzzleGame(container) {
  const pieces = ['🍎','🥕','🍌','🥦','🍓','🍊','🥑','🫐','🍇'];
  const shuffled = [...pieces].sort(() => Math.random() - 0.5);
  let placed = new Array(9).fill(null);
  let score = 0;

  container.innerHTML = `
    <button class="modal-close" onclick="closeGameModal()">✕</button>
    <h2 style="color:var(--yellow);font-family:'Fredoka One',cursive;text-align:center">🧩 Rompecabezas de Frutas</h2>
    <p style="text-align:center;color:rgba(255,255,255,0.7);font-size:13px">Arrastra las piezas a la posición correcta</p>
    <div style="display:flex;gap:24px;justify-content:center;flex-wrap:wrap;margin:16px 0">
      <div>
        <p style="color:var(--yellow);text-align:center;font-size:12px;margin-bottom:8px">Piezas disponibles</p>
        <div id="puzzle-pieces" style="display:flex;flex-wrap:wrap;gap:6px;max-width:200px">
          ${shuffled.map((e, i) => `
            <span draggable="true" data-piece="${e}" id="piece-${i}" 
              style="font-size:32px;cursor:grab;padding:4px;border:2px solid rgba(255,255,255,0.2);border-radius:8px"
              ondragstart="dragPiece(event)">${e}</span>`).join('')}
        </div>
      </div>
      <div>
        <p style="color:var(--yellow);text-align:center;font-size:12px;margin-bottom:8px">Tablero</p>
        <div id="puzzle-board" style="display:grid;grid-template-columns:repeat(3,56px);gap:4px">
          ${pieces.map((e, i) => `
            <div data-target="${e}" style="width:56px;height:56px;background:rgba(255,255,255,0.05);border:2px dashed rgba(255,255,255,0.2);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:28px"
              ondragover="event.preventDefault()" ondrop="dropPiece(event, this)"></div>`).join('')}
        </div>
      </div>
    </div>
    <div class="game-score" id="puzzle-score">Piezas colocadas: 0/9</div>
    <div class="game-controls">
      <button class="btn-game-ctrl" onclick="renderPuzzleGame(document.getElementById('game-modal-content'))">🔄 Nuevo</button>
      <button class="btn-game-ctrl" style="background:rgba(255,255,255,0.2);color:white" onclick="closeGameModal()">Salir</button>
    </div>`;

  window._puzzleScore = 0;
}

function dragPiece(e) { e.dataTransfer.setData('piece', e.target.dataset.piece); e.dataTransfer.setData('id', e.target.id); }

function dropPiece(e, cell) {
  const piece = e.dataTransfer.getData('piece');
  const id = e.dataTransfer.getData('id');
  if (!cell.textContent && piece === cell.dataset.target) {
    cell.textContent = piece;
    cell.style.borderColor = 'var(--green)';
    cell.style.background = 'rgba(76,175,80,0.2)';
    const el = document.getElementById(id);
    if (el) el.remove();
    window._puzzleScore = (window._puzzleScore || 0) + 1;
    const sc = document.getElementById('puzzle-score');
    if (sc) sc.textContent = `Piezas colocadas: ${window._puzzleScore}/9`;
    if (window._puzzleScore === 9) {
      setTimeout(() => earnBadge('🧩', '¡Rompecabezas Completo!', 'Armaste todas las frutas! +2 insignias'), 500);
    }
  } else if (piece !== cell.dataset.target) {
    cell.style.animation = 'shakeNo 0.4s ease';
    setTimeout(() => cell.style.animation = '', 400);
  }
}

// ============================================================ JUEGO 5: COCINA CONTRA RELOJ
function renderCookGame(container) {
  const recipes = ['Wrap Power 🌯', 'Brochetas 🍢', 'Pizza 🍕'];
  const target = recipes[Math.floor(Math.random() * recipes.length)];
  const ingredients = ['🥩','🧀','🍅','🥬','🫓','🥚','🧅','🍋','🌽','🫑'];
  const correct = ingredients.slice(0, 4);
  const wrong = ingredients.slice(4);
  const all = [...correct, ...wrong].sort(() => Math.random() - 0.5);
  let cookScore = 0;
  let cookTime = 20;

  container.innerHTML = `
    <button class="modal-close" onclick="closeGameModal()">✕</button>
    <h2 style="color:var(--yellow);font-family:'Fredoka One',cursive;text-align:center">⏰ Cocina Contra Reloj</h2>
    <p style="text-align:center;color:rgba(255,255,255,0.8)">Preparando: <strong>${target}</strong></p>
    <div style="display:flex;justify-content:space-between;padding:0 20px;margin:12px 0">
      <div class="game-score" id="cook-score" style="margin:0">✅ ${cookScore}</div>
      <div class="game-score" id="cook-timer" style="margin:0;color:rgba(255,255,255,0.7)">⏱ ${cookTime}s</div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:16px 0" id="cook-items">
      ${all.map((e, i) => `
        <span data-correct="${correct.includes(e)}" onclick="pickIngredient(this)"
          style="font-size:36px;cursor:pointer;padding:8px;background:rgba(255,255,255,0.1);border-radius:12px;border:2px solid rgba(255,255,255,0.2);transition:all 0.2s">${e}</span>`).join('')}
    </div>
    <div class="game-controls">
      <button class="btn-game-ctrl" onclick="startCookTimer()">▶ Iniciar</button>
      <button class="btn-game-ctrl" style="background:rgba(255,255,255,0.2);color:white" onclick="closeGameModal()">Salir</button>
    </div>`;
  window._cookScore = 0; window._cookTime = 20;
}

function startCookTimer() {
  window._cookTime = 20;
  if (gameTimerInterval) clearInterval(gameTimerInterval);
  gameTimerInterval = setInterval(() => {
    window._cookTime--;
    const te = document.getElementById('cook-timer');
    if (te) te.textContent = `⏱ ${window._cookTime}s`;
    if (window._cookTime <= 0) {
      clearInterval(gameTimerInterval);
      const sc = window._cookScore || 0;
      const area = document.getElementById('cook-items');
      if (area) area.innerHTML = `<div style="font-size:28px;color:var(--yellow);font-weight:900;text-align:center;width:100%">¡Tiempo! Puntuación: ${sc}/4</div>`;
      if (sc >= 3) setTimeout(() => earnBadge('⏰', '¡Chef Rápido!', `Obtuviste ${sc} ingredientes correctos! +4 insignias`), 600);
    }
  }, 1000);
}

function pickIngredient(el) {
  if (el.style.opacity === '0.3') return;
  if (el.dataset.correct === 'true') {
    el.style.background = 'rgba(76,175,80,0.4)';
    el.style.borderColor = 'var(--green)';
    window._cookScore = (window._cookScore || 0) + 1;
    const sc = document.getElementById('cook-score');
    if (sc) sc.textContent = `✅ ${window._cookScore}`;
  } else {
    el.style.background = 'rgba(244,67,54,0.3)';
    el.style.borderColor = '#f44336';
    el.style.animation = 'shakeNo 0.4s ease';
    setTimeout(() => el.style.animation = '', 400);
  }
  el.style.opacity = '0.3';
  el.style.pointerEvents = 'none';
}

// ============================================================ JUEGO 6: ALIMENTA AL HÉROE
function renderFeedGame(container) {
  const foods = [...GAME_FOODS.healthy, ...GAME_FOODS.unhealthy].sort(() => Math.random() - 0.5).slice(0, 8);
  let feedScore = 0;

  container.innerHTML = `
    <button class="modal-close" onclick="closeGameModal()">✕</button>
    <h2 style="color:var(--yellow);font-family:'Fredoka One',cursive;text-align:center">🦸 Alimenta al Héroe</h2>
    <p style="text-align:center;color:rgba(255,255,255,0.7)">¡Dale solo comida saludable al superhéroe!</p>
    <div style="text-align:center;font-size:64px;margin:12px 0" id="hero-char">🦸</div>
    <div class="game-score" id="feed-score">Puntos: 0</div>
    <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:16px 0" id="feed-items">
      ${foods.map(e => {
        const isH = GAME_FOODS.healthy.includes(e);
        return `<span data-healthy="${isH}" onclick="feedHero(this)"
          style="font-size:36px;cursor:pointer;padding:8px;background:rgba(255,255,255,0.1);border-radius:12px;border:2px solid rgba(255,255,255,0.2)">${e}</span>`;
      }).join('')}
    </div>
    <div class="game-controls">
      <button class="btn-game-ctrl" onclick="renderFeedGame(document.getElementById('game-modal-content'))">🔄 Nuevo juego</button>
      <button class="btn-game-ctrl" style="background:rgba(255,255,255,0.2);color:white" onclick="closeGameModal()">Salir</button>
    </div>`;
  window._feedScore = 0;
}

function feedHero(el) {
  if (el.style.opacity === '0.3') return;
  const isHealthy = el.dataset.healthy === 'true';
  const hero = document.getElementById('hero-char');

  if (isHealthy) {
    window._feedScore = (window._feedScore || 0) + 15;
    el.style.background = 'rgba(76,175,80,0.4)';
    if (hero) hero.style.animation = 'sparkle 0.5s ease';
  } else {
    window._feedScore = Math.max(0, (window._feedScore || 0) - 5);
    el.style.background = 'rgba(244,67,54,0.3)';
    if (hero) { hero.style.animation = 'shakeNo 0.4s ease'; hero.textContent = '🤢'; setTimeout(() => hero.textContent = '🦸', 600); }
  }
  el.style.opacity = '0.3'; el.style.pointerEvents = 'none';
  const sc = document.getElementById('feed-score');
  if (sc) sc.textContent = `Puntos: ${window._feedScore}`;
  setTimeout(() => hero && (hero.style.animation = ''), 500);

  const remaining = document.querySelectorAll('#feed-items span[style*="opacity: 1"]').length;
  const allDone = document.querySelectorAll('#feed-items span:not([style*="0.3"])').length === 0;
  if (allDone || document.querySelectorAll('#feed-items span').length === document.querySelectorAll('#feed-items span[style*="0.3"]').length) {
    const total = document.querySelectorAll('#feed-items span').length;
    const done = document.querySelectorAll('#feed-items span[style*="0.3"]').length;
    if (done >= total * 0.8) {
      setTimeout(() => earnBadge('🦸', '¡Nutricionista Héroe!', `${window._feedScore} puntos! El héroe está saludable! +5 insignias`), 600);
    }
  }
}
