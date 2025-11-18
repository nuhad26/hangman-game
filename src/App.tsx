import { useCallback, useEffect, useRef, useState, lazy, Suspense } from "react";

import { type Difficulty, getRandomWord, getMaxGuesses } from "./gameUtils";

// Lazy load components for better performance
const HangmanDrawing = lazy(() => import("./HangmanDrawing").then(module => ({ default: module.HangmanDrawing })));
const HangmanWord = lazy(() => import("./HangmanWord").then(module => ({ default: module.HangmanWord })));
const Keyboard = lazy(() => import("./Keyboard").then(module => ({ default: module.Keyboard })));
const StartGamePage = lazy(() => import("./StartGamePage").then(module => ({ default: module.StartGamePage })));

type GameState = "start" | "playing" | "finished";

// Main App Component
function App() {
  const [gameState, setGameState] = useState<GameState>("start");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [wordToGuess, setWordToGuess] = useState("");
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [revealedWord, setRevealedWord] = useState<string | null>(null);

  const incorrectLetters = guessedLetters.filter(letter =>
    !wordToGuess.toUpperCase().includes(letter));
  const maxGuesses = getMaxGuesses(difficulty);

  const isLoser = incorrectLetters.length >= maxGuesses;
  const isWinner = wordToGuess.length > 0 && wordToGuess
    .toUpperCase()
    .split("")
    .every(letter => guessedLetters.includes(letter));

  let gameStatus = "Playing";
  if (isWinner) gameStatus = "Winner";
  if (isLoser) gameStatus = "Loser";

  const addGuessedLetter = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isLoser || isWinner) return;
    setGuessedLetters(currentLetters => [...currentLetters, letter]);
  }, [guessedLetters, isLoser, isWinner]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (!key.match(/^[a-z]$/)) return;
      if (isLoser || isWinner) return;
      e.preventDefault();
      addGuessedLetter(key.toUpperCase());
    };

    document.addEventListener("keypress", handler);
    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [addGuessedLetter, isLoser, isWinner]);

  const startNewGame = useCallback((selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setRevealedWord(null);
    setWordToGuess(getRandomWord(selectedDifficulty));
    setGuessedLetters([]);
    setGameState("playing");
  }, []);

  const restartGame = useCallback(() => {
    setRevealedWord(null);
    setWordToGuess(getRandomWord(difficulty));
    setGuessedLetters([]);
    setGameState("playing");
  }, [difficulty]);

  const goToStart = useCallback(() => {
    setGameState("start");
    setGuessedLetters([]);
    setWordToGuess("");
    setRevealedWord(null);
  }, []);

  const wasLoserRef = useRef(false);

  useEffect(() => {
    if (!wasLoserRef.current && isLoser && wordToGuess) {
      setRevealedWord(wordToGuess);
    }

    wasLoserRef.current = isLoser;
  }, [isLoser, wordToGuess]);

  const shouldRevealWord = revealedWord === wordToGuess && Boolean(revealedWord);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (key !== "Enter") return;
      e.preventDefault();
      
      if (gameState === "playing" && (isLoser || isWinner)) {
        restartGame();
      }
    };

    document.addEventListener("keypress", handler);
    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [gameState, isLoser, isWinner, restartGame]);

  if (gameState === "start") {
    return (
      <Suspense fallback={<div style={{ padding: "2rem", color: "white", textAlign: "center", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
        <StartGamePage onStartGame={startNewGame} />
      </Suspense>
    );
  }

  return (
    <div className="app-container">
      <div className="app-content">
        
        {/* Game Status */}
        <div className={`game-status ${isWinner ? 'winner' : isLoser ? 'loser' : 'playing'}`}>
          {isWinner && (
            <>
              <span className="desktop-message">🎉 You Got It! - Press Enter to Play Again</span>
              <span className="mobile-message">🎉 You Got It!</span>
            </>
          )}
          {isLoser && (
            <>
              <span className="desktop-message">💀 Nice Try! - Press Enter to Try Again</span>
              <span className="mobile-message">💀 Nice Try!</span>
            </>
          )}
          {gameStatus === "Playing" && "🎯 Guess the Word!"}
        </div>

        {/* Back to Start Button */}
        <div className="back-to-start">
          <button onClick={goToStart} className="back-button">
            ← Back to Start
          </button>
          <div className="difficulty-indicator">
            Difficulty: <span className="current-difficulty">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
          </div>
        </div>

        {/* Main Game Layout */}
        <div className="main-game-layout">
          
          {/* Left Side - Hangman Drawing with Stats */}
          <div className="left-side">
            <h2 className="section-title">
              Progress
            </h2>
            <Suspense fallback={<div style={{ padding: "2rem", color: "white", textAlign: "center" }}>Loading...</div>}>
              <HangmanDrawing numberOfGuesses={incorrectLetters.length} isWinner={isWinner}/>
            </Suspense>
            
          </div>

          {/* Right Side - Word Display and Keyboard */}
          <div className="right-side">
            
            {/* Word Display */}
            <div className="word-display">
              <h2 className="section-title">
                Word to Guess
              </h2>
              <div className="word-container">
                <Suspense fallback={<div style={{ padding: "2rem", color: "#666", textAlign: "center" }}>Loading...</div>}>
                  <HangmanWord
                    reveal={shouldRevealWord}
                    guessedLetters={guessedLetters}
                    wordToGuess={wordToGuess}
                  />
                </Suspense>
              </div>
            </div>

            {/* Mobile Retry Button */}
            {(isWinner || isLoser) && (
              <div className="mobile-retry-container">
                <button 
                  className="mobile-retry-button"
                  onClick={restartGame}
                  aria-label="Try Again"
                >
                  🔄 Try Again
                </button>
              </div>
            )}

            {/* Keyboard */}
            <div className="keyboard-section">
              <h2 className="section-title">
                Keyboard
              </h2>
              <Suspense fallback={<div style={{ padding: "2rem", color: "white", textAlign: "center" }}>Loading...</div>}>
                <Keyboard
                  disabled={isLoser || isWinner}
                  activeLetter={guessedLetters.filter(letter =>
                    wordToGuess.toUpperCase().includes(letter)
                  )}
                  inactiveLetters={incorrectLetters}
                  addGuessedLetter={addGuessedLetter}
                />
              </Suspense>
              
              {/* Game Stats */}
              <div className="stats-container">
                <div className="stat-card">
                  📝 Letters Guessed: {guessedLetters.length}
                </div>
                <div className="stat-card">
                  ❌ Wrong Guesses: {incorrectLetters.length}/{maxGuesses}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;