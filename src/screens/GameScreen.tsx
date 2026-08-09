import StatRow from '../components/StatRow';
import GameBoard from '../components/GameBoard';

export default function GameScreen() {
  return (
    <section className="screen screen-game" data-screen-label="Игра">
      <div className="game-title">Котокраш</div>
      <StatRow />
      <div className="game-sub">Собирай трёх и больше котят одного цвета в ряд</div>
      <GameBoard />
    </section>
  );
}
