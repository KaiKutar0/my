import { useNow } from '../hooks/useNow';

function greetingFor(hour: number): { title: string; sub: string } {
  if (hour < 6) {
    return { title: 'Доброй ночи!', sub: 'Такое время , а ты все еще не спишь.' };
  }
  if (hour < 12) {
    return { title: 'Доброе утро, Киця!', sub: 'Ты уже проснулась, а я еще сплю)' };
  }
  if (hour < 18) {
    return { title: 'Привет!', sub: 'Надеюсь, день отличный. У меня — точно, ведь есть ты.' };
  }
  if (hour < 23) {
    return { title: 'Добрый вечер!', sub: 'Вечер — самое время вспомнить про своего Поганца.' };
  }
  return { title: 'Сладких снов, луна моя!', sub: 'Пора спать — и снова видеть друг друга во сне.' };
}

export default function GreetingScreen() {
  const now = useNow();
  const { title, sub } = greetingFor(new Date(now).getHours());

  return (
    <section className="screen screen-greet" data-screen-label="Приветствие">
      <div className="greet-title">{title}</div>
      <div className="greet-sub">{sub}</div>
      <div className="greet-caption">Скоро мы будем жить вместе! Наконец-то!</div>
    </section>
  );
}
