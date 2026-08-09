import type { CSSProperties } from 'react';
import { useMatchGame } from '../game/useMatchGame';
import { useEconomy } from '../economy/EconomyContext';
import KittenHead from './KittenHead';

export default function GameBoard() {
  const { addScore } = useEconomy();
  const { tiles, handleCellClick } = useMatchGame(addScore);

  return (
    <div className="game-board">
      {tiles.map((tile) => {
        const classes = ['kitten'];
        if (tile.selected) classes.push('selected');
        if (tile.matched) classes.push('matched');
        if (tile.spawning) classes.push('spawn-enter');
        if (tile.invalid) classes.push('invalid');

        return (
          <div
            key={tile.id}
            className={classes.join(' ')}
            style={{ '--row': tile.row, '--col': tile.col } as CSSProperties}
            onClick={() => handleCellClick(tile.index)}
          >
            <KittenHead variant={tile.color} size="100%" />
          </div>
        );
      })}
    </div>
  );
}
