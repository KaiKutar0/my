import { useRef, useState, type CSSProperties } from 'react';
import StatRow from '../components/StatRow';
import KittenHead from '../components/KittenHead';
import { useEconomy } from '../economy/EconomyContext';
import { COLOR_NAMES, randColor, type KittenColor } from '../types';

const SPIN_COST = 15;
const REEL_COUNT = 5;
const DECOY_COUNT = 7;
const STRIP_LEN = DECOY_COUNT + 1;
// Staggered per-reel spin durations (left reel stops first, like a classic slot machine),
// with an ease-out curve for the settle — quick and snappy rather than a long wind-down.
const DURATIONS_MS = [420, 500, 580, 660, 740];

type Strip = KittenColor[];

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function buildStrip(final: KittenColor): Strip {
  const decoys = Array.from({ length: DECOY_COUNT }, () => randColor());
  return [final, ...decoys];
}

interface WinResult {
  fishWon: number;
  matchCount: number;
  color: KittenColor | null;
}

function evaluateWin(results: KittenColor[]): WinResult {
  const counts = new Map<KittenColor, number>();
  for (const c of results) counts.set(c, (counts.get(c) ?? 0) + 1);

  let bestColor: KittenColor | null = null;
  let bestCount = 0;
  for (const [color, count] of counts) {
    if (count > bestCount) {
      bestCount = count;
      bestColor = color;
    }
  }

  if (bestCount >= 5) return { fishWon: 10, matchCount: 5, color: bestColor };
  if (bestCount >= 4) return { fishWon: 6, matchCount: 4, color: bestColor };
  if (bestCount >= 3) return { fishWon: 4, matchCount: 3, color: bestColor };
  return { fishWon: 0, matchCount: bestCount, color: null };
}

function messageFor({ matchCount, fishWon, color }: WinResult): string {
  if (!color) return 'Не повезло, попробуй ещё раз';
  if (matchCount >= 5) return `Джекпот! Пять ${COLOR_NAMES[color]} котят! +${fishWon} рыб.`;
  if (matchCount === 4) return `Четыре ${COLOR_NAMES[color]} котёнка! +${fishWon} рыб.`;
  return `Три ${COLOR_NAMES[color]} котёнка! +${fishWon} рыб.`;
}

export default function CasinoScreen() {
  const { score, addScore, addFish } = useEconomy();
  const [strips, setStrips] = useState<Strip[] | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [spinToken, setSpinToken] = useState(0);
  const [resultText, setResultText] = useState('Крути барабан и выигрывай рыбок!');
  const busyRef = useRef(false);

  async function spin() {
    if (busyRef.current || score < SPIN_COST) return;
    busyRef.current = true;
    addScore(-SPIN_COST);

    const finals = Array.from({ length: REEL_COUNT }, () => randColor());
    setStrips(finals.map(buildStrip));
    setSpinToken((t) => t + 1);
    setSpinning(true);

    await wait(Math.max(...DURATIONS_MS) + 120);

    setSpinning(false);
    const result = evaluateWin(finals);
    setResultText(messageFor(result));
    if (result.fishWon > 0) addFish(result.fishWon);
    busyRef.current = false;
  }

  const disabled = spinning || score < SPIN_COST;

  return (
    <section className="screen screen-casino" data-screen-label="Казино">
      <div className="game-title">Кошачье казино</div>
      <div className="casino-sub">Крути барабан за очки и выигрывай рыбок</div>
      <StatRow />
      <div className="reels">
        {Array.from({ length: REEL_COUNT }, (_, i) => (
          <div className="reel-window" key={i}>
            {strips ? (
              <div
                key={spinToken}
                className={'reel-strip' + (spinning ? ' spinning' : '')}
                style={
                  {
                    '--start-y': `-${((STRIP_LEN - 1) / STRIP_LEN) * 100}%`,
                    '--spin-duration': `${DURATIONS_MS[i]}ms`,
                    transform: spinning ? undefined : 'translateY(0)',
                  } as CSSProperties
                }
              >
                {strips[i].map((color, j) => (
                  <div className="reel-symbol" key={j}>
                    <KittenHead variant={color} size="100%" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="reel-idle" />
            )}
          </div>
        ))}
      </div>
      <div className="spin-result">{resultText}</div>
      <button className="spin-btn" onClick={spin} disabled={disabled}>
        Крутить (−15 очков)
      </button>
    </section>
  );
}
