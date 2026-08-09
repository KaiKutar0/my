import { useEffect, useRef } from 'react';
import { mountOuterDecor, mountInnerDecor } from '../background/decor';

/**
 * Two falling-icon layers:
 *  - outer: position:fixed, sits behind the whole .app card (visible in the page
 *    margins on wide viewports). Must be the first child of <body>'s subtree so it
 *    paints below .app without needing z-index tricks (see App.css stacking notes).
 *  - inner: position:absolute inside .app, z-index:-1, visible through the screens'
 *    padding/gaps on mobile where the outer layer is hidden behind the full-bleed card.
 */
export function BackgroundDecorOuter() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    return mountOuterDecor(ref.current);
  }, []);
  return <div className="bg-decor bg-decor-outer" ref={ref} aria-hidden="true" />;
}

export function BackgroundDecorInner() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    return mountInnerDecor(ref.current);
  }, []);
  return <div className="bg-decor bg-decor-inner" ref={ref} aria-hidden="true" />;
}
