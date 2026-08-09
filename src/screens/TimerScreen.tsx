import { useNow } from '../hooks/useNow';

const TARGET = new Date('2026-08-14T15:40:00').getTime();
const CUTOFF = new Date('2026-08-01T00:00:00').getTime();

export default function TimerScreen() {
  const now = useNow();

  const diff = Math.max(0, TARGET - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  const beforeCutoff = now < CUTOFF;
  const distanceRoute = beforeCutoff ? 'Одесса → Порту' : 'Одесса → Братислава';
  const distanceKm = beforeCutoff ? 3178 : 1042;
  const distanceNote = beforeCutoff ? 'Пока ты в Одессе, а я в Порту' : 'Уже почти рядом — совсем скоро вместе';

  return (
    <section className="screen screen-timer" data-screen-label="Таймер">
      <img className="couple-photo" src={`${import.meta.env.BASE_URL}assets/couple.jpg`} alt="Мы вместе" />
      <div className="timer-title">До встречи</div>
      <div className="countdown-grid">
        <div className="countdown-tile">
          <div className="countdown-num">{days}</div>
          <div className="countdown-label">дней</div>
        </div>
        <div className="countdown-tile">
          <div className="countdown-num">{hours}</div>
          <div className="countdown-label">часов</div>
        </div>
        <div className="countdown-tile">
          <div className="countdown-num">{mins}</div>
          <div className="countdown-label">минут</div>
        </div>
        <div className="countdown-tile">
          <div className="countdown-num">{secs}</div>
          <div className="countdown-label">секунд</div>
        </div>
      </div>
      <div className="distance-card">
        <div className="distance-route">{distanceRoute}</div>
        <div className="distance-km">{distanceKm} км</div>
        <div className="distance-note">{distanceNote}</div>
      </div>
    </section>
  );
}
