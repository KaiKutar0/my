import KittenHead from '../KittenHead';

interface SkinProps {
  color: string;
  size?: number | string;
}

/** The cat's base face — just the shared KittenHead, sized to fill the avatar frame. */
export default function Skin({ color, size = '100%' }: SkinProps) {
  return <KittenHead variant={color} size={size} />;
}
