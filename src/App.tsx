import { useCallback, useEffect, useState, lazy, Suspense } from "react";
import wordList from "./wordList.json";

// Lazy load components for better performance
const HangmanDrawing = lazy(() => import("./HangmanDrawing").then(module => ({ default: module.HangmanDrawing })));
const HangmanWord = lazy(() => import("./HangmanWord").then(module => ({ default: module.HangmanWord })));
const Keyboard = lazy(() => import("./Keyboard").then(module => ({ default: module.Keyboard })));

function getWord(): string {
  return wordList[Math.floor(Math.random() * wordList.length)];
}


// Main App Component
function App() {
  const [wordToGuess, setWordToGuess] = useState(getWord);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const incorrectLetters = guessedLetters.filter(letter =>
    !wordToGuess.toUpperCase().includes(letter));

  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess
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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (key !== "Enter") return;
      e.preventDefault();
      setGuessedLetters([]);
      setWordToGuess(getWord());
    };

    document.addEventListener("keypress", handler);
    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, []);

  return (
    <div className="app-container">
      <div className="app-content">
        
        {/* Game Status */}
        <div className={`game-status ${isWinner ? 'winner' : isLoser ? 'loser' : 'playing'}`}>
          {isWinner && "🎉 You Got It! - Press Enter to Play Again"}
          {isLoser && "💀 Nice Try! - Press Enter to Try Again"}
          {gameStatus === "Playing" && "🎯 Guess the Word!"}
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
            
            {/* Game Stats */}
            <div className="stats-container">
              <div className="stat-card">
                📝 Letters Guessed: {guessedLetters.length}
              </div>
              <div className="stat-card">
                ❌ Wrong Guesses: {incorrectLetters.length}/6
              </div>
            </div>
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
                    reveal={isLoser}
                    guessedLetters={guessedLetters}
                    wordToGuess={wordToGuess}
                  />
                </Suspense>
              </div>
            </div>

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
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;