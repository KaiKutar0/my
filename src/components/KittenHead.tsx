import { COLOR_HEX, type KittenColor } from '../types';

export interface KittenHeadProps {
  /** One of the 5 named game colors, or any raw CSS color/gradient (used by the Avatar's
   *  shop-selected skins, which aren't limited to the 5 game colors). */
  variant: KittenColor | string;
  /** Side length. Number = px, string is used as-is (e.g. '100%'). */
  size?: number | string;
  className?: string;
}

function resolveColor(variant: KittenColor | string): string {
  return (COLOR_HEX as Record<string, string | undefined>)[variant] ?? variant;
}

/**
 * The kitten face: rounded-square head, two triangular ears, two eyes, a nose.
 * Purely presentational — shared by the match-3 board, the casino reels, and (via
 * the Avatar's Skin component) the cat avatar.
 */
export default function KittenHead({ variant, size = '100%', className = '' }: KittenHeadProps) {
  const color = resolveColor(variant);
  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      className={('kitten-head ' + className).trim()}
      style={{ width: dimension, height: dimension, background: color }}
    >
      <div className="kitten-head-ear kitten-head-ear-left" style={{ background: color }} />
      <div className="kitten-head-ear kitten-head-ear-right" style={{ background: color }} />
      <div className="kitten-head-eye kitten-head-eye-left" />
      <div className="kitten-head-eye kitten-head-eye-right" />
      <div className="kitten-head-nose" />
    </div>
  );
}
