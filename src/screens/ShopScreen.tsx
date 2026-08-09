import { useState, type ReactNode } from 'react';
import { useEconomy } from '../economy/EconomyContext';
import { CAT_LABELS, ITEMS, SHOP_CATS } from '../data/shopItems';
import type { ClothesShape, GlassesShape, HatShape, ShopCategory, ShopItem } from '../types';
import HatIcon from '../components/items/HatIcon';
import GlassesIcon from '../components/items/GlassesIcon';
import ClothesIcon from '../components/items/ClothesIcon';

export default function ShopScreen() {
  const { fish, ownedItems, equipped, buyItem, equipItem } = useEconomy();
  const [tab, setTab] = useState<ShopCategory>('background');

  const owned = ownedItems[tab];
  const equippedId = equipped[tab];

  return (
    <section className="screen screen-shop" data-screen-label="Магазин">
      <div className="game-title" style={{ textAlign: 'center' }}>
        Магазин для котика
      </div>
      <div className="shop-balance">
        Рыбки: <b>{fish}</b>
      </div>
      <div className="shop-tabs">
        {SHOP_CATS.map((cat) => (
          <button
            key={cat}
            className={'shop-tab' + (tab === cat ? ' active' : '')}
            onClick={() => setTab(cat)}
          >
            {CAT_LABELS[cat]}
          </button>
        ))}
      </div>
      <div className="shop-grid">
        {ITEMS[tab].map((item) => (
          <ShopItemCard
            key={item.id}
            cat={tab}
            item={item}
            isOwned={owned.includes(item.id)}
            isEquipped={equippedId === item.id}
            canAfford={fish >= item.price}
            onBuy={() => buyItem(tab, item)}
            onEquip={() => equipItem(tab, item.id)}
          />
        ))}
      </div>
    </section>
  );
}

interface ShopItemCardProps {
  cat: ShopCategory;
  item: ShopItem;
  isOwned: boolean;
  isEquipped: boolean;
  canAfford: boolean;
  onBuy: () => void;
  onEquip: () => void;
}

function ItemPreview({ cat, item }: { cat: ShopCategory; item: ShopItem }) {
  // Background/skin items ARE just a color/gradient, so the swatch shows that directly.
  // Hat/glasses/clothes items are actual drawn shapes — show the real icon on a neutral card.
  if (cat === 'hat' || cat === 'glasses' || cat === 'clothes') {
    return (
      <div className="shop-item-swatch shop-item-swatch-icon">
        {cat === 'hat' && <HatIcon shape={item.shape as HatShape} color={item.color} size={36} />}
        {cat === 'glasses' && <GlassesIcon shape={item.shape as GlassesShape} color={item.color} size={30} />}
        {cat === 'clothes' && <ClothesIcon shape={item.shape as ClothesShape} color={item.color} size={34} />}
      </div>
    );
  }
  return <div className="shop-item-swatch" style={{ background: item.color }} />;
}

function ShopItemCard({ cat, item, isOwned, isEquipped, canAfford, onBuy, onEquip }: ShopItemCardProps) {
  const priceLabel = isEquipped ? 'Надето' : isOwned ? 'Куплено' : `${item.price} рыб.`;

  let action: ReactNode;
  if (isEquipped) {
    action = (
      <button className="shop-item-action equipped" disabled>
        Надето
      </button>
    );
  } else if (isOwned) {
    action = (
      <button className="shop-item-action owned" onClick={onEquip}>
        Надеть
      </button>
    );
  } else {
    action = (
      <button className={'shop-item-action' + (canAfford ? '' : ' locked')} disabled={!canAfford} onClick={onBuy}>
        Купить
      </button>
    );
  }

  return (
    <div className="shop-item">
      <ItemPreview cat={cat} item={item} />
      <div className="shop-item-name">{item.name}</div>
      <div className="shop-item-price">{priceLabel}</div>
      {action}
    </div>
  );
}
