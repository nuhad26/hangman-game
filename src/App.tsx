import React, { useCallback, useEffect, useState } from "react";

// Mock word list - replace with your actual import
const words = [
    "tree",
    "ball",
    "fish",
    "moon",
    "jump",
    "star",
    "book",
    "game",
    "lamp",
    "ship",
    "bread",
    "chair",
    "bottle",
    "garden",
    "rocket",
    "purple",
    "puzzle",
    "camera",
    "planet",
    "dragon",
    "teacher",
    "library",
    "diamond",
    "elephant",
    "adventure",
    "dangerous",
    "crocodile",
    "microwave",
    "astronaut",
    "waterfall",
    "discovery",
    "chocolate",
    "knowledge",
    "volcanoes",
    "butterfly",
    "orchestra",
    "dog",
    "cat",
    "sun",
    "rain",
    "treehouse",
    "car",
    "train",
    "apple",
    "orange",
    "banana",
    "cookie",
    "milk",
    "hat",
    "shoe",
    "door",
    "window",
    "house",
    "road",
    "river",
    "mountain",
    "sand",
    "beach",
    "flower",
    "bird",
    "frog",
    "duck",
    "king",
    "queen",
    "song",
    "story",
    "friend",
    "toy",
    "clock",
    "key",
  "REACT", "JAVASCRIPT", "COMPUTER", "HANGMAN", "PROGRAMMING", 
  "DEVELOPER", "WEBSITE", "FUNCTION", "VARIABLE", "COMPONENT",
  "TYPESCRIPT", "FRONTEND", "BACKEND", "DATABASE", "ALGORITHM"
];

function getWord() {
  return words[Math.floor(Math.random() * words.length)];
}

// Modern HangmanWord Component
function HangmanWord({ wordToGuess, guessedLetters, reveal = false }) {
  return (
    <div style={{
      display: "flex",
      gap: "0.5rem",
      fontSize: "3rem",
      fontWeight: "bold",
      textTransform: "uppercase",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      letterSpacing: "0.2rem",
      justifyContent: "center",
      margin: "2rem 0"
    }}>
      {wordToGuess.split("").map((letter, index) => {
        const isVisible = guessedLetters.includes(letter.toUpperCase()) || reveal;
        return (
          <div
            key={index}
            style={{
              width: "3rem",
              height: "3.5rem",
              borderBottom: "4px solid #374151",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: reveal && !guessedLetters.includes(letter.toUpperCase()) 
                ? "#ef4444" 
                : "#1f2937",
              textShadow: isVisible ? "0 2px 4px rgba(0,0,0,0.2)" : "none",
              transform: isVisible ? "scale(1.05)" : "scale(1)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              animation: isVisible && guessedLetters.includes(letter.toUpperCase()) 
                ? "letterReveal 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)" 
                : "none"
            }}
          >
            <style>
              {`
                @keyframes letterReveal {
                  0% { 
                    opacity: 0; 
                    transform: scale(0.5) rotateY(-90deg); 
                  }
                  100% { 
                    opacity: 1; 
                    transform: scale(1.05) rotateY(0deg); 
                  }
                }
              `}
            </style>
            {isVisible ? letter : ""}
          </div>
        );
      })}
    </div>
  );
}

// Modern Keyboard Component
function Keyboard({ disabled = false, activeLetter = [], inactiveLetters = [], addGuessedLetter }) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  
  const rows = [
    alphabet.slice(0, 9),
    alphabet.slice(9, 18),
    alphabet.slice(18, 26)
  ];

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      alignItems: "center",
      padding: "2rem",
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      borderRadius: "20px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
    }}>
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "center"
          }}
        >
          {row.map((letter) => {
            const isActive = activeLetter.includes(letter);
            const isInactive = inactiveLetters.includes(letter);
            
            return (
              <button
                key={letter}
                disabled={disabled || isActive || isInactive}
                onClick={() => addGuessedLetter(letter)}
                className={`keyboard-btn ${isActive ? 'active' : ''} ${isInactive ? 'inactive' : ''}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "3rem",
                  height: "3rem",
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: disabled || isActive || isInactive ? "not-allowed" : "pointer",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  
                  // Default state
                  background: isActive 
                    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    : isInactive 
                    ? "#e5e7eb"
                    : "#ffffff",
                  color: isActive 
                    ? "white"
                    : isInactive 
                    ? "#9ca3af"
                    : "#374151",
                  boxShadow: isActive
                    ? "0 4px 14px rgba(16, 185, 129, 0.4), 0 2px 4px rgba(0, 0, 0, 0.1)"
                    : isInactive
                    ? "inset 0 2px 4px rgba(0, 0, 0, 0.06)"
                    : "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
                  transform: isActive 
                    ? "translateY(-1px)" 
                    : "translateY(0px)"
                }}
                onMouseEnter={(e) => {
                  if (!disabled && !isActive && !isInactive) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!disabled && !isActive && !isInactive) {
                    e.target.style.transform = "translateY(0px)";
                    e.target.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)";
                  }
                }}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// Modern HangmanDrawing Component (simplified version)
function HangmanDrawing({ numberOfGuesses, isWinner}) {
  const HEAD = (
    <div
      key="head"
      style={{
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)",
        border: "3px solid #2d3436",
        position: "absolute",
        top: "55px",
        right: "-33px",
        boxShadow: "inset -5px -5px 10px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.2)",
        transform: "scale(0)",
        animation: "headAppear 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s forwards",
        overflow: "hidden"
      }}
    >
      {/* Simple face */}
      <div style={{ 
        position: "absolute", 
        top: "18px", left: "12px", 
        width: "6px", height: "6px", 
        background: "#2d3436", 
        borderRadius: "50%" }} />

      <div style={{ 
        position: "absolute", 
        top: "18px", right: "12px", 
        width: "6px", height: "6px", 
        background: "#2d3436", 
        borderRadius: "50%" }} />

      <div style={{ 
  position: "absolute", 
  bottom: "15px", 
  left: "50%", 
  transform: "translateX(-50%)", 
  width: "16px", 
  height: "8px", 
  border: "2px solid #2d3436", 
  borderBottom: isWinner ? "2px solid #2d3436" : "none",
  borderTop: isWinner ? "none" : "2px solid #2d3436",
  borderRadius: isWinner ? "0 0 20px 20px" : "20px 20px 0 0"}} />
    </div>
  );

  const BODY = (
    <div
      key="body"
      style={{
        width: "40px",
        height: "120px",
        background: "linear-gradient(180deg, #74b9ff 0%, #0984e3 100%)",
        border: "2px solid #2d3436",
        borderRadius: "20px 20px 5px 5px",
        position: "absolute",
        top: "118px",
        right: "-22px",
        boxShadow: "inset -3px 0 8px rgba(0,0,0,0.1), 0 3px 10px rgba(0,0,0,0.2)",
        transform: "scaleY(0)",
        transformOrigin: "top center",
        animation: "bodyGrow 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s forwards"
      }}
    />
  );

  const RIGHT_ARM = (
    <div
      key="right-arm"
      style={{
        width: "80px",
        height: "12px",
        background: "linear-gradient(90deg, #ffeaa7 0%, #fab1a0 100%)",
        border: "2px solid #2d3436",
        borderRadius: "6px",
        position: "absolute",
        top: "140px",
        right: "-78px",
        transformOrigin: "left center",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        transform: "rotate(0deg) scaleX(0)",
        animation: "rightArmSwing 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s forwards"
      }}
    />
  );

  const LEFT_ARM = (
    <div
      key="left-arm"
      style={{
        width: "80px",
        height: "12px",
        background: "linear-gradient(90deg, #fab1a0 0%, #ffeaa7 100%)",
        border: "2px solid #2d3436",
        borderRadius: "6px",
        position: "absolute",
        top: "140px",
        right: "2px",
        transformOrigin: "right center",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        transform: "rotate(0deg) scaleX(0)",
        animation: "leftArmSwing 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s forwards"
      }}
    />
  );

  const RIGHT_LEG = (
    <div
      key="right-leg"
      style={{
        width: "90px",
        height: "14px",
        background: "linear-gradient(90deg, #fd79a8 0%, #e84393 100%)",
        border: "2px solid #2d3436",
        borderRadius: "7px",
        position: "absolute",
        top: "230px",
        right: "-88px",
        transformOrigin: "left center",
        boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
        transform: "rotate(0deg) scaleX(0)",
        animation: "rightLegSwing 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s forwards"
      }}
    />
  );

  const LEFT_LEG = (
    <div
      key="left-leg"
      style={{
        width: "90px",
        height: "14px",
        background: "linear-gradient(90deg, #e84393 0%, #fd79a8 100%)",
        border: "2px solid #2d3436",
        borderRadius: "7px",
        position: "absolute",
        top: "230px",
        right: "2px",
        transformOrigin: "right center",
        boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
        transform: "rotate(0deg) scaleX(0)",
        animation: "leftLegSwing 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s forwards"
      }}
    />
  );

  const BODY_PARTS = [HEAD, BODY, RIGHT_ARM, LEFT_ARM, RIGHT_LEG, LEFT_LEG];

  return (
    <div style={{ 
      position: "relative",
      padding: "30px",
      background: "linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #74b9ff 100%)",
      borderRadius: "20px",
      boxShadow: "0 15px 35px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
      margin: "20px",
      
    }}>
      <style>
        {`
          @keyframes headAppear {
            0% { transform: scale(0) rotate(-45deg); opacity: 0; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          @keyframes bodyGrow {
            0% { transform: scaleY(0); opacity: 0; }
            100% { transform: scaleY(1); opacity: 1; }
          }
          @keyframes rightArmSwing {
            0% { transform: rotate(0deg) scaleX(0); opacity: 0; }
            100% { transform: rotate(-35deg) scaleX(1); opacity: 1; }
          }
          @keyframes leftArmSwing {
            0% { transform: rotate(0deg) scaleX(0); opacity: 0; }
            100% { transform: rotate(35deg) scaleX(1); opacity: 1; }
          }
          @keyframes rightLegSwing {
            0% { transform: rotate(0deg) scaleX(0); opacity: 0; }
            100% { transform: rotate(40deg) scaleX(1); opacity: 1; }
          }
          @keyframes leftLegSwing {
            0% { transform: rotate(0deg) scaleX(0); opacity: 0; }
            100% { transform: rotate(-40deg) scaleX(1); opacity: 1; }
          }
        `}
      </style>
      
      <div style={{ position: "relative" }}>
        {isWinner ? [...BODY_PARTS.slice(0, Math.max(1, numberOfGuesses))] :
        BODY_PARTS.slice(0, numberOfGuesses)}
        
        {/* Gallows structure */}
        <div style={{
          height: "50px", width: "6px", background: "repeating-linear-gradient(0deg, #8b4513 0px, #a0522d 2px, #654321 4px)",
          position: "absolute", top: 0, right: "-3px", borderRadius: "3px",
          boxShadow: "2px 0 4px rgba(0,0,0,0.3), inset -1px 0 2px rgba(0,0,0,0.2)"
        }} />
        <div style={{
          height: "12px", width: "180px", background: "linear-gradient(90deg, #8b4513 0%, #daa520 20%, #8b4513 40%, #cd853f 60%, #8b4513 80%, #a0522d 100%)",
          marginLeft: "90px", borderRadius: "6px", boxShadow: "0 4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)",
          border: "1px solid #654321"
        }} />
        <div style={{
          height: "340px", width: "16px", background: "linear-gradient(180deg, #8b4513 0%, #a0522d 25%, #8b4513 50%, #cd853f 75%, #8b4513 100%)",
          marginLeft: "90px", borderRadius: "8px", boxShadow: "4px 0 12px rgba(0,0,0,0.4), inset -2px 0 4px rgba(0,0,0,0.2), inset 2px 0 4px rgba(255,255,255,0.1)",
          border: "1px solid #654321"
        }} />
        <div style={{
          height: "16px", width: "220px", background: "linear-gradient(90deg, #2d3436 0%, #636e72 30%, #2d3436 60%, #636e72 100%)",
          borderRadius: "8px", boxShadow: "0 6px 12px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.1)",
          border: "2px solid #2d3436"
        }} />
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [wordToGuess, setWordToGuess] = useState(getWord);
  const [guessedLetters, setGuessedLetters] = useState([]);

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

  const addGuessedLetter = useCallback((letter) => {
    if (guessedLetters.includes(letter) || isLoser || isWinner) return;
    setGuessedLetters(currentLetters => [...currentLetters, letter]);
  }, [guessedLetters, isLoser, isWinner]);

  useEffect(() => {
    const handler = (e) => {
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
    const handler = (e) => {
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
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      padding: "1rem",
      display: "flex",
      justifyContent: "center"
    }}>
      <div style={{
        maxWidth: "1200px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        alignItems: "center",
      }}>
        
        {/* Game Status */}
        <div style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          textAlign: "center",
          color: "white",
          textShadow: "0 4px 8px rgba(0,0,0,0.3)",
          padding: "1rem 2rem",
          background: isWinner 
            ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
            : isLoser 
            ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
            : "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          animation: isWinner || isLoser ? "statusPulse 2s ease-in-out infinite" : "none"
        }}>
          <style>
            {`
              @keyframes statusPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
              }
            `}
          </style>
          {isWinner && "🎉 You Got It! - Press Enter to Play Again"}
          {isLoser && "💀 Nice Try! - Press Enter to Try Again"}
          {gameStatus === "Playing" && "🎯 Guess the Word!"}
        </div>

        {/* Main Game Layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "400px 1fr",
          gap: "3rem",
          width: "100%",
          alignItems: "start",
          justifyContent: "center"
        }}>
          
          {/* Left Side - Hangman Drawing with Stats */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem"
          }}>
            <h2 style={{
              color: "white",
              fontSize: "1.5rem",
              fontWeight: "600",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              margin: 0
            }}>
              Progress
            </h2>
            <HangmanDrawing numberOfGuesses={incorrectLetters.length} isWinner={isWinner}/>
            
            {/* Game Stats */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "100%",
              maxWidth: "300px"
            }}>
              <div style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "1rem 1.5rem",
                borderRadius: "15px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                textAlign: "center",
                color: "white",
                fontSize: "1.1rem",
                fontWeight: "500",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)"
              }}>
                📝 Letters Guessed: {guessedLetters.length}
              </div>
              <div style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "1rem 1.5rem",
                borderRadius: "15px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                textAlign: "center",
                color: "white",
                fontSize: "1.1rem",
                fontWeight: "500",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)"
              }}>
                ❌ Wrong Guesses: {incorrectLetters.length}/6
              </div>
            </div>
          </div>

          {/* Right Side - Word Display and Keyboard */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
            width: "100%"
          }}>
            
            {/* Word Display */}
            <div style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem"
            }}>
              <h2 style={{
                color: "white",
                fontSize: "1.5rem",
                fontWeight: "600",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                margin: 0
              }}>
                Word to Guess
              </h2>
              <div style={{
                background: "rgba(255, 255, 255, 0.95)",
                padding: "0rem",
                borderRadius: "60px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(10px)",
                width: "80%",
                display: "flex",
                justifyContent: "center"
              }}>
                <HangmanWord
                  reveal={isLoser}
                  guessedLetters={guessedLetters}
                  wordToGuess={wordToGuess}
                />
              </div>
            </div>

            {/* Keyboard */}
            <div style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem"
            }}>
              <h2 style={{
                color: "white",
                fontSize: "1.5rem",
                fontWeight: "600",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                margin: 0
              }}>
                Keyboard
              </h2>
              <Keyboard
                disabled={isLoser || isWinner}
                activeLetter={guessedLetters.filter(letter =>
                  wordToGuess.toUpperCase().includes(letter)
                )}
                inactiveLetters={incorrectLetters}
                addGuessedLetter={addGuessedLetter}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;