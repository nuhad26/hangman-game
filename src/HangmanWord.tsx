type HangmanWordProps = {
    guessedLetters: string[],
    wordToGuess: string
    reveal?: boolean
}

export function HangmanWord({guessedLetters, wordToGuess, reveal = false}: HangmanWordProps) {
    return (
        <div className="hangman-word">
            {wordToGuess.split("").map((letter, index) => {
                const isVisible = guessedLetters.includes(letter.toUpperCase()) || reveal
                const isCorrect = guessedLetters.includes(letter.toUpperCase())
                
                let letterBoxClass = "letter-box"
                if (!isVisible) letterBoxClass += " hidden"
                else if (isCorrect) letterBoxClass += " correct"
                else letterBoxClass += " incorrect"
                
                let letterTextClass = "letter-text"
                if (isVisible) letterTextClass += " visible"
                else letterTextClass += " hidden"
                if (reveal && !isCorrect) letterTextClass += " incorrect"
                
                return (
                    <span 
                        key={index} 
                        className={letterBoxClass}
                    >
                        <span className={letterTextClass}>
                            {letter}
                        </span>
                    </span>
                )
            })}
        </div>
    )
}