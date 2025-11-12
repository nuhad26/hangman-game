type HangmanDrawingProps = {
  numberOfGuesses: number;
  isWinner?: boolean;
};

export function HangmanDrawing({ numberOfGuesses, isWinner = false }: HangmanDrawingProps) {
  const HEAD = (
    <div key="head" className={`hangman-head ${isWinner ? 'winner' : ''}`}>
      <div className="face-eye left" />
      <div className="face-eye right" />
      <div className="face-mouth" />
    </div>
  );

  const BODY = (
    <div key="body" className="hangman-body" />
  );

  const RIGHT_ARM = (
    <div key="right-arm" className="hangman-arm right" />
  );

  const LEFT_ARM = (
    <div key="left-arm" className="hangman-arm left" />
  );

  const RIGHT_LEG = (
    <div key="right-leg" className="hangman-leg right" />
  );

  const LEFT_LEG = (
    <div key="left-leg" className="hangman-leg left" />
  );

  const BODY_PARTS = [HEAD, BODY, RIGHT_ARM, LEFT_ARM, RIGHT_LEG, LEFT_LEG];

  return (
    <div className="hangman-drawing">
      <div className="hangman-parts">
        {isWinner ? [...BODY_PARTS.slice(0, Math.max(1, numberOfGuesses))] :
        BODY_PARTS.slice(0, numberOfGuesses)}
        
        {/* Gallows structure */}
        <div className="gallows-rope" />
        <div className="gallows-beam" />
        <div className="gallows-pole" />
        <div className="gallows-base" />
      </div>
    </div>
  );
}
