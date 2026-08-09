import type { HatShape } from '../../types';

interface HatIconProps {
  shape: HatShape;
  color: string;
  size?: number | string;
  className?: string;
}

const SHADOW = 'rgba(0,0,0,0.2)';
const HILITE = 'rgba(255,255,255,0.35)';

function paths(shape: HatShape, color: string) {
  switch (shape) {
    case 'bow':
      return (
        <>
          <polygon points="20,15 6,5 6,25" fill={color} />
          <polygon points="20,15 34,5 34,25" fill={color} />
          <circle cx="20" cy="15" r="5" fill={color} />
        </>
      );
    case 'tophat':
      return (
        <>
          <ellipse cx="20" cy="26" rx="16" ry="4" fill={color} />
          <rect x="10" y="2" width="20" height="22" rx="2" fill={color} />
          <rect x="10" y="18" width="20" height="4" fill={SHADOW} />
        </>
      );
    case 'beret':
      return (
        <>
          <ellipse cx="20" cy="18" rx="17" ry="9" fill={color} />
          <circle cx="30" cy="6" r="3" fill={color} />
          <ellipse cx="20" cy="15" rx="17" ry="4" fill={HILITE} />
        </>
      );
    case 'crown':
      return (
        <>
          <polygon points="4,26 4,12 11,20 20,6 29,20 36,12 36,26" fill={color} />
          <circle cx="4" cy="10" r="3" fill={color} />
          <circle cx="20" cy="4" r="3.5" fill={color} />
          <circle cx="36" cy="10" r="3" fill={color} />
        </>
      );
    case 'ushanka':
      return (
        <>
          <ellipse cx="6" cy="24" rx="5" ry="9" fill={color} />
          <ellipse cx="34" cy="24" rx="5" ry="9" fill={color} />
          <path d="M6 28 C6 12 14 4 20 4 C26 4 34 12 34 28 Z" fill={color} />
          <rect x="3" y="19" width="34" height="6" rx="3" fill={HILITE} />
        </>
      );
    case 'strawhat':
      return (
        <>
          <ellipse cx="20" cy="24" rx="18" ry="5" fill={color} />
          <path d="M10 22 C10 10 14 4 20 4 C26 4 30 10 30 22 Z" fill={color} />
          <path d="M12 20 C13 11 16 6 20 5" stroke={SHADOW} strokeWidth="1" fill="none" />
        </>
      );
    case 'cap':
      return (
        <>
          <ellipse cx="9" cy="26" rx="9" ry="3.2" fill={color} />
          <path d="M6 26 C6 12 12 4 20 4 C28 4 34 12 34 26 Z" fill={color} />
        </>
      );
    case 'bucket':
      return (
        <>
          <polygon points="2,24 38,24 30,28 10,28" fill={color} />
          <path d="M8 24 C8 12 13 6 20 6 C27 6 32 12 32 24 Z" fill={color} />
        </>
      );
    case 'partyhat':
      return (
        <>
          <polygon points="20,2 8,28 32,28" fill={color} />
          <circle cx="20" cy="2" r="4" fill={color} />
          <polygon points="20,12 14,22 26,22" fill={HILITE} />
        </>
      );
    case 'pirate':
      return (
        <>
          <path d="M2 22 C10 6 16 18 20 10 C24 18 30 6 38 22 C30 26 10 26 2 22 Z" fill={color} />
          <circle cx="20" cy="16" r="2" fill={HILITE} />
        </>
      );
    default:
      return <rect x="6" y="10" width="28" height="10" rx="4" fill={color} />;
  }
}

export default function HatIcon({ shape, color, size = '100%', className = '' }: HatIconProps) {
  const dim = typeof size === 'number' ? `${size}px` : size;
  return (
    <svg
      className={('hat-icon ' + className).trim()}
      viewBox="0 0 40 30"
      width={dim}
      height={dim}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {paths(shape, color)}
    </svg>
  );
}
