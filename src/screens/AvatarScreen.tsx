import { useEconomy } from '../economy/EconomyContext';
import { getItem } from '../data/shopItems';
import Skin from '../components/avatar/Skin';
import Outfit from '../components/avatar/Outfit';

export default function AvatarScreen() {
  const { equipped } = useEconomy();

  const bgItem = getItem('background', equipped.background);
  const skinItem = getItem('skin', equipped.skin);
  const hatItem = getItem('hat', equipped.hat);
  const glassesItem = getItem('glasses', equipped.glasses);
  const clothesItem = getItem('clothes', equipped.clothes);

  return (
    <section className="screen screen-avatar" data-screen-label="Аватар">
      <div className="game-title">Аватар котика</div>
      <div className="avatar-frame" style={{ background: bgItem ? bgItem.color : '#ede0d4' }}>
        <div className="avatar-cat">
          <Skin color={skinItem ? skinItem.color : '#8b5e3c'} />
          <Outfit hat={hatItem} glasses={glassesItem} clothes={clothesItem} />
        </div>
      </div>
      <div className="avatar-caption">Наряды покупаются в магазине за рыбок</div>
    </section>
  );
}
