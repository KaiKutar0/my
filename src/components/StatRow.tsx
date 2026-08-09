import { useEffect, useRef, useState } from 'react';
import { useEconomy } from '../economy/EconomyContext';

function StatValue({ value }: { value: number }) {
  const [pulsing, setPulsing] = useState(false);
  const isFirst = useRef(true);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    setPulsing(false);
    const raf = requestAnimationFrame(() => setPulsing(true));
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setPulsing(false), 350);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <div className={'stat-value' + (pulsing ? ' pulse' : '')}>{value}</div>;
}

export default function StatRow() {
  const { score, fish } = useEconomy();
  return (
    <div className="stat-row">
      <div className="stat-tile">
        <div className="stat-label">Очки</div>
        <StatValue value={score} />
      </div>
      <div className="stat-tile">
        <div className="stat-label">Рыбки</div>
        <StatValue value={fish} />
      </div>
    </div>
  );
}
