import { useRef, useState } from 'react';
import { EconomyProvider } from './economy/EconomyContext';
import { BackgroundDecorOuter, BackgroundDecorInner } from './components/BackgroundDecor';
import Dots from './components/Dots';
import GreetingScreen from './screens/GreetingScreen';
import TimerScreen from './screens/TimerScreen';
import GameScreen from './screens/GameScreen';
import CasinoScreen from './screens/CasinoScreen';
import ShopScreen from './screens/ShopScreen';
import AvatarScreen from './screens/AvatarScreen';
import LetterScreen from './screens/LetterScreen';
import GalleryScreen from './screens/GalleryScreen';

const TOTAL_SCREENS = 8;
const SCREEN_PCT = 100 / TOTAL_SCREENS;

export default function App() {
  const [screen, setScreen] = useState(0);
  const touchXRef = useRef<number | null>(null);

  function goTo(i: number) {
    setScreen(Math.max(0, Math.min(TOTAL_SCREENS - 1, i)));
  }

  function onTouchStart(e: React.TouchEvent) {
    touchXRef.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchXRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchXRef.current;
    touchXRef.current = null;
    if (dx < -50) goTo(screen + 1);
    else if (dx > 50) goTo(screen - 1);
  }

  return (
    <EconomyProvider>
      <BackgroundDecorOuter />
      <div className="app" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <BackgroundDecorInner />
        <div className="track" style={{ transform: `translateX(-${screen * SCREEN_PCT}%)` }}>
          <GreetingScreen />
          <TimerScreen />
          <GameScreen />
          <CasinoScreen />
          <ShopScreen />
          <AvatarScreen />
          <LetterScreen />
          <GalleryScreen />
        </div>
        <Dots total={TOTAL_SCREENS} screen={screen} goTo={goTo} />
      </div>
    </EconomyProvider>
  );
}
