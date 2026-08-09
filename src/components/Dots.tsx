interface DotsProps {
  total: number;
  screen: number;
  goTo: (i: number) => void;
}

export default function Dots({ total, screen, goTo }: DotsProps) {
  return (
    <div className="dots">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={'dot' + (i === screen ? ' active' : '')}
          onClick={() => goTo(i)}
        />
      ))}
    </div>
  );
}
