const LETTER_TEXT = `Настенька,

Пока ты читаешь это где-то тикает таймер до 14 августа - дня, когда мы наконец окажемся в у себя дома

Спасибо что дождалась, cпасибо, что дожидаешься, oсталось совсем немного.

Твой навсегда, Юра`;

export default function LetterScreen() {
  return (
    <section className="screen screen-letter" data-screen-label="Письмо">
      <div className="letter-card">{LETTER_TEXT}</div>
    </section>
  );
}
