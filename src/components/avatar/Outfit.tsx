import type { ClothesShape, GlassesShape, HatShape, ShopItem } from '../../types';
import HatIcon from '../items/HatIcon';
import GlassesIcon from '../items/GlassesIcon';
import ClothesIcon from '../items/ClothesIcon';

interface OutfitProps {
  hat: ShopItem | null;
  glasses: ShopItem | null;
  clothes: ShopItem | null;
}

/** Hat / glasses / clothes overlays, layered above the Skin inside the avatar frame —
 *  each one an actually-drawn icon (see components/items), not a plain color block. */
export default function Outfit({ hat, glasses, clothes }: OutfitProps) {
  return (
    <>
      {hat && (
        <div className="avatar-hat">
          <HatIcon shape={hat.shape as HatShape} color={hat.color} size="100%" />
        </div>
      )}
      {glasses && (
        <div className="avatar-glasses">
          <GlassesIcon shape={glasses.shape as GlassesShape} color={glasses.color} size="100%" />
        </div>
      )}
      {clothes && (
        <div className="avatar-clothes">
          <ClothesIcon shape={clothes.shape as ClothesShape} color={clothes.color} size="100%" />
        </div>
      )}
    </>
  );
}
