(function () {
  const SIZE = 6;
  const COLORS = ['brown', 'orange', 'grey', 'black', 'white'];
  const COLOR_HEX = {
    brown: '#8b5e3c',
    orange: '#e08d3c',
    grey: '#9b9b93',
    black: '#3a3a3a',
    white: '#f5f0ec',
  };
  const TOTAL_SCREENS = 5;

  // Animation timings (kept in sync with the CSS transition/animation durations in style.css)
  const MOVE_MS = 220;
  const SHAKE_MS = 300;
  const CLEAR_MS = 200;
  const SPAWN_MS = 240;

  const track = document.getElementById('track');
  const dotsEl = document.getElementById('dots');
  const boardEl = document.getElementById('gameBoard');
  const scoreEl = document.getElementById('score');

  const state = {
    screen: 0,
    selected: null,
  };

  // ---------- Grid helpers ----------

  function randColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  function findMatches(grid, size) {
    const matched = new Array(grid.length).fill(false);
    for (let r = 0; r < size; r++) {
      let runStart = 0;
      for (let c = 1; c <= size; c++) {
        const cur = c < size ? grid[r * size + c] : null;
        const prev = grid[r * size + c - 1];
        if (cur !== prev) {
          if (c - runStart >= 3) for (let k = runStart; k < c; k++) matched[r * size + k] = true;
          runStart = c;
        }
      }
    }
    for (let col = 0; col < size; col++) {
      let runStart = 0;
      for (let r = 1; r <= size; r++) {
        const cur = r < size ? grid[r * size + col] : null;
        const prev = grid[(r - 1) * size + col];
        if (cur !== prev) {
          if (r - runStart >= 3) for (let k = runStart; k < r; k++) matched[k * size + col] = true;
          runStart = r;
        }
      }
    }
    return matched;
  }

  function generateColorGrid(size) {
    const n = size * size;
    let grid;
    do {
      grid = new Array(n).fill(0).map(randColor);
    } while (findMatches(grid, size).some(Boolean));
    return grid;
  }

  function isAdjacent(a, b, size) {
    const ra = Math.floor(a / size), ca = a % size;
    const rb = Math.floor(b / size), cb = b % size;
    return (ra === rb && Math.abs(ca - cb) === 1) || (ca === cb && Math.abs(ra - rb) === 1);
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function nextFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }

  // ---------- Tile model (flat array, index = row * SIZE + col) ----------

  let nextTileId = 0;
  let tiles = [];
  const tileEls = new Map();
  let busy = false;
  let score = 0;

  function makeTile(color) {
    return { id: nextTileId++, color };
  }

  function idxToRowCol(idx) {
    return [Math.floor(idx / SIZE), idx % SIZE];
  }

  function createTileEl(tile) {
    const el = document.createElement('div');
    el.className = 'kitten';
    el.style.background = COLOR_HEX[tile.color];
    el.addEventListener('click', () => handleCellClick(tiles.indexOf(tile)));

    const eyeLeft = document.createElement('div');
    eyeLeft.className = 'eye eye-left';
    const eyeRight = document.createElement('div');
    eyeRight.className = 'eye eye-right';
    const nose = document.createElement('div');
    nose.className = 'nose';

    el.appendChild(eyeLeft);
    el.appendChild(eyeRight);
    el.appendChild(nose);
    return el;
  }

  function setTilePos(tile, idx) {
    const [row, col] = idxToRowCol(idx);
    const el = tileEls.get(tile.id);
    el.style.setProperty('--row', row);
    el.style.setProperty('--col', col);
  }

  function initGame() {
    const colors = generateColorGrid(SIZE);
    tiles = colors.map(makeTile);
    boardEl.innerHTML = '';
    tiles.forEach((tile, idx) => {
      const el = createTileEl(tile);
      const [row, col] = idxToRowCol(idx);
      el.style.setProperty('--row', row);
      el.style.setProperty('--col', col);
      tileEls.set(tile.id, el);
      boardEl.appendChild(el);
    });
  }

  function updateSelectionClasses() {
    tileEls.forEach((el, id) => el.classList.remove('selected'));
    if (state.selected !== null) {
      const tile = tiles[state.selected];
      if (tile) tileEls.get(tile.id).classList.add('selected');
    }
  }

  function addScore(matchedCount, combo) {
    score += matchedCount * 10 * combo;
    scoreEl.textContent = score;
    const badge = scoreEl.parentElement;
    badge.classList.remove('pulse');
    void badge.offsetWidth;
    badge.classList.add('pulse');
  }

  async function animatedSwap(a, b) {
    const tmp = tiles[a];
    tiles[a] = tiles[b];
    tiles[b] = tmp;
    setTilePos(tiles[a], a);
    setTilePos(tiles[b], b);
    await wait(MOVE_MS);
  }

  async function clearMatched(matched) {
    const toRemove = [];
    matched.forEach((m, idx) => {
      if (m) toRemove.push(idx);
    });
    toRemove.forEach((idx) => {
      const tile = tiles[idx];
      tileEls.get(tile.id).classList.add('matched');
    });
    await wait(CLEAR_MS);
    toRemove.forEach((idx) => {
      const tile = tiles[idx];
      tileEls.get(tile.id).remove();
      tileEls.delete(tile.id);
      tiles[idx] = null;
    });
  }

  async function collapseAndRefill() {
    const spawned = [];

    for (let col = 0; col < SIZE; col++) {
      const colTiles = [];
      for (let row = 0; row < SIZE; row++) {
        const idx = row * SIZE + col;
        if (tiles[idx]) colTiles.push(tiles[idx]);
      }
      const emptyCount = SIZE - colTiles.length;

      colTiles.forEach((tile, i) => {
        const newRow = emptyCount + i;
        const idx = newRow * SIZE + col;
        tiles[idx] = tile;
        setTilePos(tile, idx);
      });

      for (let row = 0; row < emptyCount; row++) {
        const idx = row * SIZE + col;
        const tile = makeTile(randColor());
        tiles[idx] = tile;
        const el = createTileEl(tile);
        el.style.setProperty('--row', row - emptyCount);
        el.style.setProperty('--col', col);
        el.classList.add('spawn-enter');
        tileEls.set(tile.id, el);
        boardEl.appendChild(el);
        spawned.push({ tile, idx });
      }
    }

    await nextFrame();
    spawned.forEach(({ tile, idx }) => {
      setTilePos(tile, idx);
      tileEls.get(tile.id).classList.remove('spawn-enter');
    });
    await wait(SPAWN_MS);
  }

  async function handleCellClick(i) {
    if (busy) return;
    const sel = state.selected;

    if (sel === null) {
      state.selected = i;
      updateSelectionClasses();
      return;
    }
    if (sel === i) {
      state.selected = null;
      updateSelectionClasses();
      return;
    }
    if (!isAdjacent(sel, i, SIZE)) {
      state.selected = i;
      updateSelectionClasses();
      return;
    }

    busy = true;
    state.selected = null;
    updateSelectionClasses();

    await animatedSwap(sel, i);

    let matched = findMatches(tiles.map((t) => t.color), SIZE);
    if (!matched.some(Boolean)) {
      const elA = tileEls.get(tiles[sel].id);
      const elB = tileEls.get(tiles[i].id);
      elA.classList.add('invalid');
      elB.classList.add('invalid');
      await wait(SHAKE_MS);
      elA.classList.remove('invalid');
      elB.classList.remove('invalid');
      await animatedSwap(sel, i);
      busy = false;
      return;
    }

    let combo = 1;
    while (matched.some(Boolean)) {
      addScore(matched.filter(Boolean).length, combo);
      await clearMatched(matched);
      await collapseAndRefill();
      matched = findMatches(tiles.map((t) => t.color), SIZE);
      combo++;
    }

    busy = false;
  }

  // ---------- Navigation ----------

  function renderDots() {
    dotsEl.innerHTML = '';
    for (let i = 0; i < TOTAL_SCREENS; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === state.screen ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    }
  }

  function goTo(i) {
    state.screen = Math.max(0, Math.min(TOTAL_SCREENS - 1, i));
    track.style.transform = `translateX(-${state.screen * 20}%)`;
    renderDots();
  }

  let touchX = null;
  const app = document.getElementById('app');
  app.addEventListener('touchstart', (e) => {
    touchX = e.touches[0].clientX;
  });
  app.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (dx < -50) goTo(state.screen + 1);
    else if (dx > 50) goTo(state.screen - 1);
  });

  // ---------- Greeting / countdown / distance ----------

  const greetTitleEl = document.getElementById('greetTitle');
  const greetSubEl = document.getElementById('greetSub');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('mins');
  const secsEl = document.getElementById('secs');
  const distanceRouteEl = document.getElementById('distanceRoute');
  const distanceKmEl = document.getElementById('distanceKm');
  const distanceNoteEl = document.getElementById('distanceNote');

  const TARGET = new Date('2026-08-14T15:40:00').getTime();
  const CUTOFF = new Date('2026-08-01T00:00:00').getTime();

  function tick() {
    const now = Date.now();
    const hour = new Date(now).getHours();

    let greetTitle, greetSub;
    if (hour < 6) {
      greetTitle = 'Доброй ночи!';
      greetSub = 'Такое время , а ты все еще не спишь.';
    } else if (hour < 12) {
      greetTitle = 'Доброе утро, Киця!';
      greetSub = 'Ты уже проснулась, а я еще сплю)';
    } else if (hour < 18) {
      greetTitle = 'Привет!';
      greetSub = 'Надеюсь, день отличный. У меня — точно, ведь есть ты.';
    } else if (hour < 23) {
      greetTitle = 'Добрый вечер!';
      greetSub = 'Вечер — самое время вспомнить про своего Поганца.';
    } else {
      greetTitle = 'Сладких снов, луна моя!';
      greetSub = 'Пора спать — и снова видеть друг друга во сне.';
    }
    greetTitleEl.textContent = greetTitle;
    greetSubEl.textContent = greetSub;

    const diff = Math.max(0, TARGET - now);
    daysEl.textContent = Math.floor(diff / 86400000);
    hoursEl.textContent = Math.floor((diff % 86400000) / 3600000);
    minsEl.textContent = Math.floor((diff % 3600000) / 60000);
    secsEl.textContent = Math.floor((diff % 60000) / 1000);

    const beforeCutoff = now < CUTOFF;
    distanceRouteEl.textContent = beforeCutoff ? 'Одесса → Порту' : 'Одесса → Братислава';
    distanceKmEl.textContent = beforeCutoff ? 3178 : 1042;
    distanceNoteEl.textContent = beforeCutoff
      ? 'Пока ты в Одессе, а я в Порту'
      : 'Уже почти рядом — совсем скоро вместе';
  }

  // ---------- Init ----------

  initGame();
  renderDots();
  tick();
  setInterval(tick, 1000);
})();
