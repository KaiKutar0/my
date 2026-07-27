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

  // ---------- Falling background decor ----------

  const BG_ICON_TYPES = ['heart', 'flower', 'teddy', 'candy', 'lollipop', 'chocolate', 'cat', 'coffee', 'stripes', 'geometric'];

  const TONE_PAIRS_INNER = [
    ['#7f5539', '#9c6644'],
    ['#9c6644', '#7f5539'],
    ['#b08968', '#7f5539'],
    ['#ddb892', '#9c6644'],
  ];
  const TONE_PAIRS_OUTER = [
    ['#ede0d4', '#e6ccb2'],
    ['#e6ccb2', '#ddb892'],
    ['#ddb892', '#e6ccb2'],
  ];

  function bgIconMarkup(type, main, accent) {
    switch (type) {
      case 'heart':
        return `<path d="M20 34C20 34 6 23 6 13.5C6 7 11.5 4 16 7.5C18 9 20 12 20 12C20 12 22 9 24 7.5C28.5 4 34 7 34 13.5C34 23 20 34 20 34Z" fill="${main}"/>`;
      case 'flower':
        return `<circle cx="20" cy="10" r="7" fill="${main}"/><circle cx="27.6" cy="15.5" r="7" fill="${main}"/><circle cx="24.7" cy="24.4" r="7" fill="${main}"/><circle cx="15.3" cy="24.4" r="7" fill="${main}"/><circle cx="12.4" cy="15.5" r="7" fill="${main}"/><circle cx="20" cy="18" r="4" fill="${accent}"/>`;
      case 'teddy':
        return `<circle cx="12" cy="10" r="5" fill="${main}"/><circle cx="28" cy="10" r="5" fill="${main}"/><circle cx="20" cy="22" r="14" fill="${main}"/><circle cx="20" cy="26" r="5" fill="${accent}"/>`;
      case 'candy':
        return `<circle cx="20" cy="20" r="9" fill="${main}"/><polygon points="9,12 2,6 2,34 9,28" fill="${main}"/><polygon points="31,12 38,6 38,34 31,28" fill="${main}"/>`;
      case 'lollipop':
        return `<circle cx="20" cy="14" r="12" fill="${main}"/><path d="M20 14 m0 -7 a7 7 0 1 1 -7 7 a4 4 0 1 0 4 -4" fill="none" stroke="${accent}" stroke-width="1.6" stroke-linecap="round"/><line x1="20" y1="26" x2="20" y2="38" stroke="${accent}" stroke-width="2.4" stroke-linecap="round"/>`;
      case 'chocolate':
        return `<rect x="6" y="12" width="28" height="18" rx="3" fill="${main}"/><line x1="20" y1="12" x2="20" y2="30" stroke="${accent}" stroke-width="1.6"/><line x1="6" y1="21" x2="34" y2="21" stroke="${accent}" stroke-width="1.6"/><line x1="13" y1="12" x2="13" y2="30" stroke="${accent}" stroke-width="1.2"/><line x1="27" y1="12" x2="27" y2="30" stroke="${accent}" stroke-width="1.2"/>`;
      case 'cat':
        return `<polygon points="9,14 4,4 15,10" fill="${main}"/><polygon points="31,14 36,4 25,10" fill="${main}"/><circle cx="20" cy="22" r="13" fill="${main}"/><polygon points="20,23 17,26 23,26" fill="${accent}"/>`;
      case 'coffee':
        return `<path d="M8 16h20v10a10 10 0 0 1 -20 0z" fill="${main}"/><path d="M28 18h3a5 5 0 0 1 0 10h-3" fill="none" stroke="${main}" stroke-width="3"/><path d="M13 13c0-2 2-2 2-4s-2-2-2-4" fill="none" stroke="${accent}" stroke-width="1.6" stroke-linecap="round"/><path d="M20 13c0-2 2-2 2-4s-2-2-2-4" fill="none" stroke="${accent}" stroke-width="1.6" stroke-linecap="round"/>`;
      case 'stripes':
        return `<g stroke="${main}" stroke-width="3.4" stroke-linecap="round"><line x1="4" y1="14" x2="14" y2="4"/><line x1="4" y1="24" x2="24" y2="4"/><line x1="4" y1="34" x2="34" y2="4"/><line x1="14" y1="34" x2="34" y2="14"/><line x1="24" y1="34" x2="34" y2="24"/></g>`;
      default:
        return `<polygon points="10,26 18,10 26,26" fill="${main}"/><circle cx="31" cy="14" r="3" fill="${main}"/>`;
    }
  }

  function spawnFallingIcons(container, count, tonePairs, opacityRange, sizeRange, durRange) {
    for (let i = 0; i < count; i++) {
      const type = BG_ICON_TYPES[Math.floor(Math.random() * BG_ICON_TYPES.length)];
      const [main, accent] = tonePairs[Math.floor(Math.random() * tonePairs.length)];
      const size = Math.round(sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]));
      const left = Math.random() * 100;
      const rot = Math.round(Math.random() * 360);
      const dur = durRange[0] + Math.random() * (durRange[1] - durRange[0]);
      const delay = -Math.random() * dur;
      const opacity = (opacityRange[0] + Math.random() * (opacityRange[1] - opacityRange[0])).toFixed(2);

      const wrap = document.createElement('div');
      wrap.className = 'bg-icon';
      wrap.style.left = left + '%';
      wrap.style.width = size + 'px';
      wrap.style.height = size + 'px';
      wrap.style.opacity = opacity;
      wrap.style.setProperty('--rot', rot + 'deg');
      wrap.style.animationDuration = dur + 's';
      wrap.style.animationDelay = delay + 's';
      wrap.innerHTML = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">${bgIconMarkup(type, main, accent)}</svg>`;
      container.appendChild(wrap);
    }
  }

  function initBackgroundDecor() {
    const outerLayer = document.createElement('div');
    outerLayer.className = 'bg-decor bg-decor-outer';
    outerLayer.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(outerLayer, document.body.firstChild);
    spawnFallingIcons(outerLayer, 16, TONE_PAIRS_OUTER, [0.22, 0.4], [22, 40], [22, 42]);

    const innerLayer = document.createElement('div');
    innerLayer.className = 'bg-decor bg-decor-inner';
    innerLayer.setAttribute('aria-hidden', 'true');
    app.insertBefore(innerLayer, app.firstChild);
    spawnFallingIcons(innerLayer, 18, TONE_PAIRS_INNER, [0.1, 0.2], [20, 36], [20, 40]);
  }

  // ---------- Init ----------

  initGame();
  renderDots();
  initBackgroundDecor();
  tick();
  setInterval(tick, 1000);
})();
