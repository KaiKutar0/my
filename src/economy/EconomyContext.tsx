import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ShopCategory, ShopItem } from '../types';
import { SHOP_CATS } from '../data/shopItems';
import { getCookie, setCookie } from '../lib/cookies';

type OwnedItems = Record<ShopCategory, string[]>;
type Equipped = Record<ShopCategory, string | null>;

// Only the fish wallet, purchased items, and equipped items are persisted (score/points
// are per-session game currency and intentionally reset on reload).
const WALLET_COOKIE = 'bratislava_wallet';

interface WalletData {
  fish: number;
  ownedItems: OwnedItems;
  equipped: Equipped;
}

function emptyOwned(): OwnedItems {
  const result = {} as OwnedItems;
  for (const cat of SHOP_CATS) result[cat] = [];
  return result;
}

function emptyEquipped(): Equipped {
  const result = {} as Equipped;
  for (const cat of SHOP_CATS) result[cat] = null;
  return result;
}

function loadWallet(): WalletData {
  const fallback: WalletData = { fish: 0, ownedItems: emptyOwned(), equipped: emptyEquipped() };
  try {
    const raw = getCookie(WALLET_COOKIE);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<WalletData> | null;
    if (!parsed || typeof parsed !== 'object') return fallback;

    const fish = typeof parsed.fish === 'number' && Number.isFinite(parsed.fish) ? parsed.fish : 0;
    const ownedItems = emptyOwned();
    const equipped = emptyEquipped();
    for (const cat of SHOP_CATS) {
      const savedOwned = parsed.ownedItems?.[cat];
      if (Array.isArray(savedOwned)) {
        ownedItems[cat] = savedOwned.filter((id): id is string => typeof id === 'string');
      }
      const savedEquipped = parsed.equipped?.[cat];
      if (typeof savedEquipped === 'string') {
        equipped[cat] = savedEquipped;
      }
    }
    return { fish, ownedItems, equipped };
  } catch {
    return fallback;
  }
}

interface EconomyContextValue {
  score: number;
  fish: number;
  ownedItems: OwnedItems;
  equipped: Equipped;
  addScore: (amount: number) => void;
  addFish: (amount: number) => void;
  buyItem: (cat: ShopCategory, item: ShopItem) => void;
  equipItem: (cat: ShopCategory, id: string) => void;
}

const EconomyContext = createContext<EconomyContextValue | null>(null);

export function EconomyProvider({ children }: { children: ReactNode }) {
  const [score, setScore] = useState(0);
  const [fish, setFish] = useState<number>(() => loadWallet().fish);
  const [ownedItems, setOwnedItems] = useState<OwnedItems>(() => loadWallet().ownedItems);
  const [equipped, setEquipped] = useState<Equipped>(() => loadWallet().equipped);

  // Persist the wallet (fish, purchased items, equipped items) to a cookie whenever it
  // changes. Score is intentionally excluded — it's per-session game currency.
  useEffect(() => {
    setCookie(WALLET_COOKIE, JSON.stringify({ fish, ownedItems, equipped }));
  }, [fish, ownedItems, equipped]);

  const addScore = useCallback((amount: number) => setScore((s) => s + amount), []);
  const addFish = useCallback((amount: number) => setFish((f) => f + amount), []);

  const buyItem = useCallback(
    (cat: ShopCategory, item: ShopItem) => {
      setFish((currentFish) => {
        let bought = false;
        setOwnedItems((owned) => {
          if (currentFish < item.price || owned[cat].includes(item.id)) return owned;
          bought = true;
          return { ...owned, [cat]: [...owned[cat], item.id] };
        });
        if (!bought) return currentFish;
        setEquipped((eq) => ({ ...eq, [cat]: item.id }));
        return currentFish - item.price;
      });
    },
    [],
  );

  const equipItem = useCallback((cat: ShopCategory, id: string) => {
    setEquipped((eq) => ({ ...eq, [cat]: id }));
  }, []);

  const value = useMemo(
    () => ({ score, fish, ownedItems, equipped, addScore, addFish, buyItem, equipItem }),
    [score, fish, ownedItems, equipped, addScore, addFish, buyItem, equipItem],
  );

  return <EconomyContext.Provider value={value}>{children}</EconomyContext.Provider>;
}

export function useEconomy(): EconomyContextValue {
  const ctx = useContext(EconomyContext);
  if (!ctx) throw new Error('useEconomy must be used within EconomyProvider');
  return ctx;
}
