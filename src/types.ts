export type KittenColor = 'brown' | 'orange' | 'grey' | 'black' | 'white';

export const COLORS: KittenColor[] = ['brown', 'orange', 'grey', 'black', 'white'];

export const COLOR_HEX: Record<KittenColor, string> = {
  brown: '#8b5e3c',
  orange: '#e08d3c',
  grey: '#9b9b93',
  black: '#3a3a3a',
  white: '#f5f0ec',
};

export const COLOR_NAMES: Record<KittenColor, string> = {
  brown: 'коричневых',
  orange: 'рыжих',
  grey: 'серых',
  black: 'чёрных',
  white: 'белых',
};

export function randColor(): KittenColor {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export type ShopCategory = 'background' | 'skin' | 'hat' | 'glasses' | 'clothes';

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  color: string;
  /** Only present on hat/glasses/clothes items — selects which icon to draw. */
  shape?: string;
}

export type HatShape =
  | 'bow'
  | 'tophat'
  | 'beret'
  | 'crown'
  | 'ushanka'
  | 'strawhat'
  | 'cap'
  | 'bucket'
  | 'partyhat'
  | 'pirate';

export type GlassesShape =
  | 'round'
  | 'sunglasses'
  | 'cateye'
  | 'monocle'
  | 'aviator'
  | 'retro'
  | 'yellowframe'
  | 'sport'
  | 'rhinestone'
  | 'computer';

export type ClothesShape =
  | 'bowtie'
  | 'scarf'
  | 'sweater'
  | 'cloak'
  | 'bandana'
  | 'vest'
  | 'coat'
  | 'overalls'
  | 'hoodie'
  | 'festive';
