import type { ShopCategory, ShopItem } from '../types';

export const SHOP_CATS: ShopCategory[] = ['background', 'skin', 'hat', 'glasses', 'clothes'];

export const CAT_LABELS: Record<ShopCategory, string> = {
  background: 'Фон',
  skin: 'Окрас',
  hat: 'Шляпа',
  glasses: 'Очки',
  clothes: 'Одежда',
};

export const ITEMS: Record<ShopCategory, ShopItem[]> = {
  background: [
    { id: 'bg1', name: 'Кофейный туман', price: 10, color: 'linear-gradient(135deg,#c9a889,#8b6b4a)' },
    { id: 'bg2', name: 'Шоколадный закат', price: 25, color: 'linear-gradient(135deg,#7f5539,#3e2723)' },
    { id: 'bg3', name: 'Ванильное облако', price: 8, color: 'linear-gradient(135deg,#fff8ee,#ede0d4)' },
    { id: 'bg4', name: 'Карамельный рассвет', price: 20, color: 'linear-gradient(135deg,#ffcb8e,#b08968)' },
    { id: 'bg5', name: 'Мокко ночь', price: 35, color: 'linear-gradient(135deg,#4a332a,#1c1210)' },
    { id: 'bg6', name: 'Тоффи звёзды', price: 30, color: 'linear-gradient(135deg,#9c6644,#5c3d28)' },
    { id: 'bg7', name: 'Ореховая роща', price: 15, color: 'linear-gradient(135deg,#a9825c,#6e4b32)' },
    { id: 'bg8', name: 'Капучино пена', price: 12, color: 'linear-gradient(135deg,#e6ccb2,#c9a06c)' },
    { id: 'bg9', name: 'Пряничный вечер', price: 40, color: 'linear-gradient(135deg,#7a4a2b,#c98a4b)' },
    { id: 'bg10', name: 'Молочная дымка', price: 18, color: 'linear-gradient(135deg,#f5ece2,#ddb892)' },
  ],
  skin: [
    { id: 'sk1', name: 'Шоколадный', price: 15, color: '#8b5e3c' },
    { id: 'sk2', name: 'Рыжий', price: 12, color: '#e08d3c' },
    { id: 'sk3', name: 'Серый дымчатый', price: 10, color: '#9b9b93' },
    { id: 'sk4', name: 'Чёрный', price: 10, color: '#3a3a3a' },
    { id: 'sk5', name: 'Белоснежный', price: 10, color: '#f5f0ec' },
    { id: 'sk6', name: 'Кремовый', price: 14, color: '#ecd9b0' },
    { id: 'sk7', name: 'Мраморный', price: 22, color: 'linear-gradient(135deg,#3a3a3a 50%,#f5f0ec 50%)' },
    { id: 'sk8', name: 'Каштановый', price: 18, color: '#7a4a2b' },
    { id: 'sk9', name: 'Песочный', price: 16, color: '#d8b078' },
    { id: 'sk10', name: 'Дымчато-голубой', price: 25, color: '#8fa3ad' },
  ],
  hat: [
    { id: 'ht1', name: 'Бант', price: 8, color: '#d16a8c', shape: 'bow' },
    { id: 'ht2', name: 'Цилиндр', price: 20, color: '#2b2320', shape: 'tophat' },
    { id: 'ht3', name: 'Берет', price: 12, color: '#6e4b32', shape: 'beret' },
    { id: 'ht4', name: 'Корона', price: 45, color: '#d4af37', shape: 'crown' },
    { id: 'ht5', name: 'Ушанка', price: 18, color: '#ece3d6', shape: 'ushanka' },
    { id: 'ht6', name: 'Соломенная шляпа', price: 10, color: '#d9b872', shape: 'strawhat' },
    { id: 'ht7', name: 'Кепка', price: 9, color: '#4a6a7d', shape: 'cap' },
    { id: 'ht8', name: 'Панамка', price: 11, color: '#ede0d4', shape: 'bucket' },
    { id: 'ht9', name: 'Праздничный колпак', price: 14, color: '#c9457a', shape: 'partyhat' },
    { id: 'ht10', name: 'Пиратская шляпа', price: 28, color: '#1c1210', shape: 'pirate' },
  ],
  glasses: [
    { id: 'gl1', name: 'Круглые очки', price: 8, color: '#cfe8ef', shape: 'round' },
    { id: 'gl2', name: 'Солнечные очки', price: 14, color: '#1c1210', shape: 'sunglasses' },
    { id: 'gl3', name: 'Очки-кошечки', price: 16, color: '#d16a8c', shape: 'cateye' },
    { id: 'gl4', name: 'Монокль', price: 20, color: '#d4af37', shape: 'monocle' },
    { id: 'gl5', name: 'Авиаторы', price: 18, color: '#a8c9d6', shape: 'aviator' },
    { id: 'gl6', name: 'Ретро-очки', price: 12, color: '#7f5539', shape: 'retro' },
    { id: 'gl7', name: 'Жёлтая оправа', price: 10, color: '#e0b83c', shape: 'yellowframe' },
    { id: 'gl8', name: 'Спортивные очки', price: 15, color: '#3a3a3a', shape: 'sport' },
    { id: 'gl9', name: 'Очки со стразами', price: 30, color: '#f0d9e8', shape: 'rhinestone' },
    { id: 'gl10', name: 'Компьютерные очки', price: 9, color: '#cfae7b', shape: 'computer' },
  ],
  clothes: [
    { id: 'cl1', name: 'Бабочка', price: 8, color: '#c9457a', shape: 'bowtie' },
    { id: 'cl2', name: 'Шарф', price: 12, color: '#9c6644', shape: 'scarf' },
    { id: 'cl3', name: 'Свитер', price: 18, color: '#7f5539', shape: 'sweater' },
    { id: 'cl4', name: 'Плащ', price: 25, color: '#3e2723', shape: 'cloak' },
    { id: 'cl5', name: 'Бандана', price: 10, color: '#d16a8c', shape: 'bandana' },
    { id: 'cl6', name: 'Жилет', price: 16, color: '#6e4b32', shape: 'vest' },
    { id: 'cl7', name: 'Пальто', price: 30, color: '#4a332a', shape: 'coat' },
    { id: 'cl8', name: 'Комбинезон', price: 20, color: '#b08968', shape: 'overalls' },
    { id: 'cl9', name: 'Худи', price: 22, color: '#5c3d28', shape: 'hoodie' },
    { id: 'cl10', name: 'Праздничный костюм', price: 40, color: '#2b2320', shape: 'festive' },
  ],
};

export function getItem(cat: ShopCategory, id: string | null): ShopItem | null {
  if (!id) return null;
  return ITEMS[cat].find((it) => it.id === id) ?? null;
}
