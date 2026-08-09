import { useCallback, useEffect, useRef, useState } from 'react';
import { randColor, type KittenColor } from '../types';

const SIZE = 6;

// Animation timings (kept in sync with the CSS transition/animation durations in App.css)
const MOVE_MS = 220;
const SHAKE_MS = 300;
const CLEAR_MS = 200;
const SPAWN_MS = 240;

interface Tile {
  id: number;
  color: KittenColor;
}

export interface RenderTile {
  id: number;
  color: KittenColor;
  /** True logical board index (row*SIZE+col) — always accurate, even mid-animation. */
  index: number;
  /** Visual row: temporarily overridden above the board while a spawned tile animates in. */
  row: number;
  col: number;
  selected: boolean;
  matched: boolean;
  spawning: boolean;
  invalid: boolean;
}

function findMatches(grid: (KittenColor | null)[], size: number): boolean[] {
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

function generateColorGrid(size: number): KittenColor[] {
  const n = size * size;
  let grid: KittenColor[];
  do {
    grid = new Array(n).fill(0).map(randColor);
  } while (findMatches(grid, size).some(Boolean));
  return grid;
}

function isAdjacent(a: number, b: number, size: number): boolean {
  const ra = Math.floor(a / size);
  const ca = a % size;
  const rb = Math.floor(b / size);
  const cb = b % size;
  return (ra === rb && Math.abs(ca - cb) === 1) || (ca === cb && Math.abs(ra - rb) === 1);
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

/**
 * Drives the match-3 board as plain React state, so tiles render via normal JSX
 * (sharing the exact same <KittenHead> component as the casino/avatar) while still
 * getting the smooth CSS-transition-driven swap/clear/collapse animation: each step
 * mutates a logic-only ref array, then "sync()" snapshots it into render state.
 * React's key-based reconciliation keeps each tile's DOM node stable across
 * re-renders, which is what lets the CSS transitions on top/left animate at all.
 */
export function useMatchGame(onScore: (amount: number) => void) {
  const tilesRef = useRef<(Tile | null)[]>([]);
  const nextIdRef = useRef(0);
  const busyRef = useRef(false);
  const selectedRef = useRef<number | null>(null);
  const aliveRef = useRef(true);

  const matchedIdsRef = useRef<Set<number>>(new Set());
  const spawningIdsRef = useRef<Set<number>>(new Set());
  const invalidIdsRef = useRef<Set<number>>(new Set());
  // Newly spawned tiles render at this off-screen row until the entrance animation's
  // first frame has painted, then get cleared so they render at their real row.
  const spawnStartRowRef = useRef<Map<number, number>>(new Map());

  const [tiles, setTiles] = useState<RenderTile[]>([]);

  const makeTile = useCallback((color: KittenColor): Tile => ({ id: nextIdRef.current++, color }), []);

  const sync = useCallback(() => {
    const rendered: RenderTile[] = [];
    tilesRef.current.forEach((tile, idx) => {
      if (!tile) return;
      const overrideRow = spawnStartRowRef.current.get(tile.id);
      rendered.push({
        id: tile.id,
        color: tile.color,
        index: idx,
        row: overrideRow ?? Math.floor(idx / SIZE),
        col: idx % SIZE,
        selected: selectedRef.current === idx,
        matched: matchedIdsRef.current.has(tile.id),
        spawning: spawningIdsRef.current.has(tile.id),
        invalid: invalidIdsRef.current.has(tile.id),
      });
    });
    setTiles(rendered);
  }, []);

  useEffect(() => {
    aliveRef.current = true;
    tilesRef.current = generateColorGrid(SIZE).map(makeTile);
    sync();
    return () => {
      aliveRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedSwap = useCallback(
    async (a: number, b: number) => {
      const tmp = tilesRef.current[a];
      tilesRef.current[a] = tilesRef.current[b];
      tilesRef.current[b] = tmp;
      sync();
      await wait(MOVE_MS);
    },
    [sync],
  );

  const clearMatchedTiles = useCallback(
    async (matched: boolean[]) => {
      const toRemove: number[] = [];
      matched.forEach((m, idx) => {
        if (m) toRemove.push(idx);
      });
      toRemove.forEach((idx) => {
        const tile = tilesRef.current[idx];
        if (tile) matchedIdsRef.current.add(tile.id);
      });
      sync();
      await wait(CLEAR_MS);
      if (!aliveRef.current) return;
      toRemove.forEach((idx) => {
        const tile = tilesRef.current[idx];
        if (tile) matchedIdsRef.current.delete(tile.id);
        tilesRef.current[idx] = null;
      });
      sync();
    },
    [sync],
  );

  const collapseAndRefill = useCallback(async () => {
    for (let col = 0; col < SIZE; col++) {
      const colTiles: Tile[] = [];
      for (let row = 0; row < SIZE; row++) {
        const idx = row * SIZE + col;
        const t = tilesRef.current[idx];
        if (t) colTiles.push(t);
      }
      const emptyCount = SIZE - colTiles.length;

      colTiles.forEach((tile, i) => {
        const newRow = emptyCount + i;
        tilesRef.current[newRow * SIZE + col] = tile;
      });

      for (let row = 0; row < emptyCount; row++) {
        const idx = row * SIZE + col;
        const tile = makeTile(randColor());
        tilesRef.current[idx] = tile;
        spawningIdsRef.current.add(tile.id);
        spawnStartRowRef.current.set(tile.id, row - emptyCount);
      }
    }

    sync();
    await nextFrame();
    if (!aliveRef.current) return;
    spawnStartRowRef.current.clear();
    spawningIdsRef.current.clear();
    sync();
    await wait(SPAWN_MS);
  }, [makeTile, sync]);

  const handleCellClick = useCallback(
    async (i: number) => {
      if (busyRef.current) return;
      const sel = selectedRef.current;

      if (sel === null) {
        selectedRef.current = i;
        sync();
        return;
      }
      if (sel === i) {
        selectedRef.current = null;
        sync();
        return;
      }
      if (!isAdjacent(sel, i, SIZE)) {
        selectedRef.current = i;
        sync();
        return;
      }

      busyRef.current = true;
      selectedRef.current = null;
      sync();

      await animatedSwap(sel, i);
      if (!aliveRef.current) return;

      let matched = findMatches(
        tilesRef.current.map((t) => t?.color ?? null),
        SIZE,
      );
      if (!matched.some(Boolean)) {
        const tileA = tilesRef.current[sel];
        const tileB = tilesRef.current[i];
        if (tileA) invalidIdsRef.current.add(tileA.id);
        if (tileB) invalidIdsRef.current.add(tileB.id);
        sync();
        await wait(SHAKE_MS);
        if (!aliveRef.current) return;
        if (tileA) invalidIdsRef.current.delete(tileA.id);
        if (tileB) invalidIdsRef.current.delete(tileB.id);
        await animatedSwap(sel, i);
        busyRef.current = false;
        return;
      }

      while (matched.some(Boolean)) {
        onScore(matched.filter(Boolean).length * 5);
        await clearMatchedTiles(matched);
        if (!aliveRef.current) return;
        await collapseAndRefill();
        if (!aliveRef.current) return;
        matched = findMatches(
          tilesRef.current.map((t) => t?.color ?? null),
          SIZE,
        );
      }

      busyRef.current = false;
    },
    [animatedSwap, clearMatchedTiles, collapseAndRefill, onScore, sync],
  );

  return { tiles, handleCellClick };
}
