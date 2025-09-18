import { useCallback, useEffect, useState } from "react"
import words from "./wordList.json"
import { Keyboard } from "./Keyboard"
import { HangmanWord } from "./HangmanWord"
import { HangmanDrawing } from "./HangmanDrawing"


function getWord() {
  return words[Math.floor(Math.random() * words.length)]
}

  function App() {
    const [wordToGuess, setWordToGuess] = useState(getWord)
    const [guessedLetters, setGuessedLetters] = useState<string[]>([])

    const incorrectLetters = guessedLetters.filter(letter => 
      !wordToGuess.toUpperCase().includes(letter))

      const isLoser = incorrectLetters.length >= 6
      const isWinner = wordToGuess
      .toUpperCase()
      .split("")
      .every(letter => guessedLetters.includes(letter))

      let gameStatus = "Playing"
      if(isWinner) gameStatus = "Winner"
      if(isLoser) gameStatus = "Loser"

      const addGuessedLetter = useCallback((letter: string) => {
        if(guessedLetters.includes(letter)) return
        setGuessedLetters(currentLetters => [...currentLetters, letter])
      }, [guessedLetters, isLoser, isWinner])
      
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    const key = e.key
    if(!key.match(/^[a-z]$/))
       return

    if(isLoser || isWinner) return

    e.preventDefault()
    addGuessedLetter(key.toUpperCase())
  }
    document.addEventListener("keypress", handler)
    return () => {
      document.removeEventListener("keypress", handler)
    }
  },[addGuessedLetter, isLoser, isWinner])

  useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    const key = e.key
    if(key !== "Enter")
       return
    e.preventDefault()
    setGuessedLetters([])
    setWordToGuess(getWord())

  }
    document.addEventListener("keypress", handler)
    return () => {
      document.removeEventListener("keypress", handler)
    }
  },[])

    return (
        <div
        style={{
          maxWidth: "800px",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          margin: "0 auto",
          alignItems: "center",
        }}>
          <div style={ {fontSize: "2.2rem", textAlign:"center"}}>
            {isWinner && "You Got It! - Press Enter to Play again"}
            {isLoser && "Nice Try! - Press Enter to try again"}
            {gameStatus === "Playing" && "Guess the word!"}
          </div>
          <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
          <HangmanWord 
          reveal={isLoser}
          guessedLetters={guessedLetters} 
          wordToGuess={wordToGuess} />
          <div style={{alignSelf: "stretch"}}>
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
    )
  }
export default App
