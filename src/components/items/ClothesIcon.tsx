import type { ClothesShape } from '../../types';

interface ClothesIconProps {
  shape: ClothesShape;
  color: string;
  size?: number | string;
  className?: string;
}

const SHADOW = 'rgba(0,0,0,0.18)';
const HILITE = 'rgba(255,255,255,0.35)';

function paths(shape: ClothesShape, color: string) {
  switch (shape) {
    case 'bowtie':
      return (
        <>
          <polygon points="16,10 4,4 4,16" fill={color} />
          <polygon points="24,10 36,4 36,16" fill={color} />
          <circle cx="20" cy="10" r="4" fill={color} />
        </>
      );
    case 'scarf':
      return (
        <>
          <path d="M2 6 C10 2 30 2 38 6 L38 12 C30 8 10 8 2 12 Z" fill={color} />
          <rect x="16" y="10" width="8" height="15" rx="3" fill={color} />
          <rect x="16" y="16" width="8" height="3" fill={SHADOW} />
        </>
      );
    case 'sweater':
      return (
        <>
          <path d="M2 26 L2 12 C2 6 8 2 20 2 C32 2 38 6 38 12 L38 26 Z" fill={color} />
          <polygon points="14,3 20,14 26,3" fill={SHADOW} />
        </>
      );
    case 'cloak':
      return (
        <>
          <path d="M14 0 L26 0 L38 26 L2 26 Z" fill={color} />
          <polygon points="14,0 20,8 26,0" fill={SHADOW} />
        </>
      );
    case 'bandana':
      return (
        <>
          <polygon points="20,20 4,4 36,4" fill={color} />
          <rect x="1" y="1" width="11" height="3" fill={color} transform="rotate(-20 6.5 2.5)" />
          <polygon points="20,20 14,10 26,10" fill={HILITE} />
        </>
      );
    case 'vest':
      return (
        <>
          <path d="M4 26 L4 8 L14 2 L20 8 L26 2 L36 8 L36 26 Z" fill={color} />
          <circle cx="20" cy="14" r="1.4" fill={SHADOW} />
          <circle cx="20" cy="19" r="1.4" fill={SHADOW} />
        </>
      );
    case 'coat':
      return (
        <>
          <path d="M2 26 L2 10 L14 2 L20 10 L26 2 L38 10 L38 26 Z" fill={color} />
          <polygon points="14,2 20,10 20,20" fill={SHADOW} />
          <polygon points="26,2 20,10 20,20" fill={HILITE} />
        </>
      );
    case 'overalls':
      return (
        <>
          <path d="M8 26 L8 10 L32 10 L32 26 Z" fill={color} />
          <rect x="10" y="0" width="5" height="12" fill={color} />
          <rect x="25" y="0" width="5" height="12" fill={color} />
          <rect x="16" y="14" width="8" height="8" rx="1" fill={SHADOW} />
        </>
      );
    case 'hoodie':
      return (
        <>
          <path d="M4 26 C4 10 10 2 20 2 C30 2 36 10 36 26 Z" fill={color} />
          <path d="M14 6 C16 12 24 12 26 6" fill="none" stroke={SHADOW} strokeWidth="2" />
          <circle cx="16" cy="20" r="1.4" fill={SHADOW} />
          <circle cx="24" cy="20" r="1.4" fill={SHADOW} />
        </>
      );
    case 'festive':
      return (
        <>
          <path d="M2 26 L2 10 L14 2 L20 8 L26 2 L38 10 L38 26 Z" fill={color} />
          <polygon points="16,10 10,6 10,14" fill={HILITE} />
          <polygon points="24,10 30,6 30,14" fill={HILITE} />
          <circle cx="20" cy="10" r="3" fill={HILITE} />
        </>
      );
    default:
      return <rect x="4" y="4" width="32" height="20" rx="6" fill={color} />;
  }
}

export default function ClothesIcon({ shape, color, size = '100%', className = '' }: ClothesIconProps) {
  const dim = typeof size === 'number' ? `${size}px` : size;
  return (
    <svg
      className={('clothes-icon ' + className).trim()}
      viewBox="0 0 40 26"
      width={dim}
      height={dim}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {paths(shape, color)}
    </svg>
  );
}
