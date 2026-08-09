const BG_ICON_TYPES = [
  'heart',
  'flower',
  'teddy',
  'candy',
  'lollipop',
  'chocolate',
  'cat',
  'coffee',
  'stripes',
  'geometric',
] as const;

const TONE_PAIRS_INNER: [string, string][] = [
  ['#7f5539', '#9c6644'],
  ['#9c6644', '#7f5539'],
  ['#b08968', '#7f5539'],
  ['#ddb892', '#9c6644'],
];
const TONE_PAIRS_OUTER: [string, string][] = [
  ['#ede0d4', '#e6ccb2'],
  ['#e6ccb2', '#ddb892'],
  ['#ddb892', '#e6ccb2'],
];

function bgIconMarkup(type: string, main: string, accent: string): string {
  switch (type) {
    case 'heart':
      return `<path d="M20 34C20 34 6 23 6 13.5C6 7 11.5 4 16 7.5C18 9 20 12 20 12C20 12 22 9 24 7.5C28.5 4 34 7 34 13.5C34 23 20 34 20 34Z" fill="${main}"/>`;
    case 'flower':
      return `<circle cx="20" cy="10" r="7" fill="${main}"/><circle cx="27.6" cy="15.5" r="7" fill="${main}"/><circle cx="24.7" cy="24.4" r="7" fill="${main}"/><circle cx="15.3" cy="24.4" r="7" fill="${main}"/><circle cx="12.4" cy="15.5" r="7" fill="${main}"/><circle cx="20" cy="18" r="4" fill="${accent}"/>`;
    case 'teddy':
      return `<circle cx="12" cy="10" r="5" fill="${main}"/><circle cx="28" cy="10" r="5" fill="${main}"/><circle cx="20" cy="22" r="14" fill="${main}"/><circle cx="20" cy="26" r="5" fill="${accent}"/>`;
    case 'candy':
      return `<circle cx="20" cy="20" r="9" fill="${main}"/><polygon points="9,12 2,6 2,34 9,28" fill="${main}"/><polygon points="31,12 38,6 38,34 31,28" fill="${main}"/>`;
    case 'lollipop':
      return `<circle cx="20" cy="14" r="12" fill="${main}"/><path d="M20 14 m0 -7 a7 7 0 1 1 -7 7 a4 4 0 1 0 4 -4" fill="none" stroke="${accent}" stroke-width="1.6" stroke-linecap="round"/><line x1="20" y1="26" x2="20" y2="38" stroke="${accent}" stroke-width="2.4" stroke-linecap="round"/>`;
    case 'chocolate':
      return `<rect x="6" y="12" width="28" height="18" rx="3" fill="${main}"/><line x1="20" y1="12" x2="20" y2="30" stroke="${accent}" stroke-width="1.6"/><line x1="6" y1="21" x2="34" y2="21" stroke="${accent}" stroke-width="1.6"/><line x1="13" y1="12" x2="13" y2="30" stroke="${accent}" stroke-width="1.2"/><line x1="27" y1="12" x2="27" y2="30" stroke="${accent}" stroke-width="1.2"/>`;
    case 'cat':
      return `<polygon points="9,14 4,4 15,10" fill="${main}"/><polygon points="31,14 36,4 25,10" fill="${main}"/><circle cx="20" cy="22" r="13" fill="${main}"/><polygon points="20,23 17,26 23,26" fill="${accent}"/>`;
    case 'coffee':
      return `<path d="M8 16h20v10a10 10 0 0 1 -20 0z" fill="${main}"/><path d="M28 18h3a5 5 0 0 1 0 10h-3" fill="none" stroke="${main}" stroke-width="3"/><path d="M13 13c0-2 2-2 2-4s-2-2-2-4" fill="none" stroke="${accent}" stroke-width="1.6" stroke-linecap="round"/><path d="M20 13c0-2 2-2 2-4s-2-2-2-4" fill="none" stroke="${accent}" stroke-width="1.6" stroke-linecap="round"/>`;
    case 'stripes':
      return `<g stroke="${main}" stroke-width="3.4" stroke-linecap="round"><line x1="4" y1="14" x2="14" y2="4"/><line x1="4" y1="24" x2="24" y2="4"/><line x1="4" y1="34" x2="34" y2="4"/><line x1="14" y1="34" x2="34" y2="14"/><line x1="24" y1="34" x2="34" y2="24"/></g>`;
    default:
      return `<polygon points="10,26 18,10 26,26" fill="${main}"/><circle cx="31" cy="14" r="3" fill="${main}"/>`;
  }
}

function spawnFallingIcons(
  container: HTMLElement,
  count: number,
  tonePairs: [string, string][],
  opacityRange: [number, number],
  sizeRange: [number, number],
  durRange: [number, number],
) {
  for (let i = 0; i < count; i++) {
    const type = BG_ICON_TYPES[Math.floor(Math.random() * BG_ICON_TYPES.length)];
    const [main, accent] = tonePairs[Math.floor(Math.random() * tonePairs.length)];
    const size = Math.round(sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]));
    const left = Math.random() * 100;
    const rot = Math.round(Math.random() * 360);
    const dur = durRange[0] + Math.random() * (durRange[1] - durRange[0]);
    const delay = -Math.random() * dur;
    const opacity = (opacityRange[0] + Math.random() * (opacityRange[1] - opacityRange[0])).toFixed(2);

    const wrap = document.createElement('div');
    wrap.className = 'bg-icon';
    wrap.style.left = left + '%';
    wrap.style.width = size + 'px';
    wrap.style.height = size + 'px';
    wrap.style.opacity = opacity;
    wrap.style.setProperty('--rot', rot + 'deg');
    wrap.style.animationDuration = dur + 's';
    wrap.style.animationDelay = delay + 's';
    wrap.innerHTML = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">${bgIconMarkup(type, main, accent)}</svg>`;
    container.appendChild(wrap);
  }
}

export function mountOuterDecor(el: HTMLElement) {
  spawnFallingIcons(el, 16, TONE_PAIRS_OUTER, [0.22, 0.4], [22, 40], [22, 42]);
  return () => {
    el.innerHTML = '';
  };
}

export function mountInnerDecor(el: HTMLElement) {
  spawnFallingIcons(el, 18, TONE_PAIRS_INNER, [0.1, 0.2], [20, 36], [20, 40]);
  return () => {
    el.innerHTML = '';
  };
}
