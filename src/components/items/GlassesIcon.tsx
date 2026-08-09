import type { GlassesShape } from '../../types';

interface GlassesIconProps {
  shape: GlassesShape;
  color: string;
  size?: number | string;
  className?: string;
}

const HILITE = 'rgba(255,255,255,0.4)';

function paths(shape: GlassesShape, color: string) {
  switch (shape) {
    case 'round':
      return (
        <>
          <circle cx="12" cy="10" r="7" fill="none" stroke={color} strokeWidth="3" />
          <circle cx="28" cy="10" r="7" fill="none" stroke={color} strokeWidth="3" />
          <line x1="19" y1="10" x2="21" y2="10" stroke={color} strokeWidth="3" />
        </>
      );
    case 'sunglasses':
      return (
        <>
          <rect x="3" y="4" width="15" height="11" rx="4" fill={color} />
          <rect x="22" y="4" width="15" height="11" rx="4" fill={color} />
          <rect x="18" y="7" width="4" height="3" fill={color} />
          <ellipse cx="8" cy="8" rx="3" ry="1.6" fill={HILITE} />
          <ellipse cx="27" cy="8" rx="3" ry="1.6" fill={HILITE} />
        </>
      );
    case 'cateye':
      return (
        <>
          <path d="M2 12 C2 6 8 4 14 6 C18 7 18 13 14 14 C8 16 2 18 2 12Z" fill={color} />
          <path d="M38 12 C38 6 32 4 26 6 C22 7 22 13 26 14 C32 16 38 18 38 12Z" fill={color} />
          <line x1="18" y1="9" x2="22" y2="9" stroke={color} strokeWidth="2" />
        </>
      );
    case 'monocle':
      return (
        <>
          <circle cx="26" cy="10" r="8" fill="none" stroke={color} strokeWidth="3" />
          <path d="M26 18 C24 22 24 25 22 27" fill="none" stroke={color} strokeWidth="2" />
        </>
      );
    case 'aviator':
      return (
        <>
          <path d="M4 8 C4 4 10 3 14 5 C18 7 18 15 12 16 C6 17 4 12 4 8Z" fill={color} />
          <path d="M36 8 C36 4 30 3 26 5 C22 7 22 15 28 16 C34 17 36 12 36 8Z" fill={color} />
          <line x1="2" y1="4" x2="38" y2="4" stroke={color} strokeWidth="2" />
        </>
      );
    case 'retro':
      return (
        <>
          <polygon points="4,10 7,4 17,4 20,10 17,16 7,16" fill="none" stroke={color} strokeWidth="3" />
          <polygon points="20,10 23,4 33,4 36,10 33,16 23,16" fill="none" stroke={color} strokeWidth="3" />
        </>
      );
    case 'yellowframe':
      return (
        <>
          <circle cx="12" cy="10" r="8" fill="none" stroke={color} strokeWidth="5" />
          <circle cx="28" cy="10" r="8" fill="none" stroke={color} strokeWidth="5" />
          <line x1="19" y1="10" x2="21" y2="10" stroke={color} strokeWidth="5" />
        </>
      );
    case 'sport':
      return (
        <>
          <path
            d="M2 10 C2 4 10 2 20 2 C30 2 38 4 38 10 C38 14 30 16 20 16 C10 16 2 14 2 10Z"
            fill={color}
          />
          <ellipse cx="12" cy="9" rx="4" ry="3" fill={HILITE} />
          <ellipse cx="28" cy="9" rx="4" ry="3" fill={HILITE} />
        </>
      );
    case 'rhinestone':
      return (
        <>
          <circle cx="12" cy="10" r="7" fill="none" stroke={color} strokeWidth="3" />
          <circle cx="28" cy="10" r="7" fill="none" stroke={color} strokeWidth="3" />
          <line x1="19" y1="10" x2="21" y2="10" stroke={color} strokeWidth="3" />
          <circle cx="6" cy="4" r="1.4" fill={color} />
          <circle cx="18" cy="2.5" r="1.2" fill={color} />
          <circle cx="34" cy="4" r="1.4" fill={color} />
        </>
      );
    case 'computer':
      return (
        <>
          <rect x="3" y="4" width="14" height="10" rx="3" fill="none" stroke={color} strokeWidth="2" />
          <rect x="23" y="4" width="14" height="10" rx="3" fill="none" stroke={color} strokeWidth="2" />
          <line x1="17" y1="9" x2="23" y2="9" stroke={color} strokeWidth="2" />
        </>
      );
    default:
      return <rect x="4" y="6" width="32" height="8" rx="4" fill={color} />;
  }
}

export default function GlassesIcon({ shape, color, size = '100%', className = '' }: GlassesIconProps) {
  const dim = typeof size === 'number' ? `${size}px` : size;
  return (
    <svg
      className={('glasses-icon ' + className).trim()}
      viewBox="0 0 40 20"
      width={dim}
      height={dim}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {paths(shape, color)}
    </svg>
  );
}
