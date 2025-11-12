import { useEffect, useState } from "react"

type HangmanWordProps = {
    guessedLetters: string[],
    wordToGuess: string
    reveal?: boolean
}

export function HangmanWord({guessedLetters, wordToGuess, reveal = false}: HangmanWordProps) {
    const [animatedLetters, setAnimatedLetters] = useState<Set<number>>(new Set())
    
    useEffect(() => {
        // Animate letters when they're revealed
        wordToGuess.split("").forEach((letter, index) => {
            if (guessedLetters.includes(letter.toUpperCase()) && !animatedLetters.has(index)) {
                setTimeout(() => {
                    setAnimatedLetters(prev => new Set([...prev, index]))
                }, index * 100) // Stagger the animations
            }
        })
    }, [guessedLetters, wordToGuess, animatedLetters])

    // Reset animations when new game starts
    useEffect(() => {
        setAnimatedLetters(new Set())
    }, [wordToGuess])

    return (
        <div className="hangman-word">
            {wordToGuess.split("").map((letter, index) => {
                const isVisible = guessedLetters.includes(letter.toUpperCase()) || reveal
                const isCorrect = guessedLetters.includes(letter.toUpperCase())
                const shouldAnimate = animatedLetters.has(index)
                
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
                        style={{
                            transform: shouldAnimate ? "rotateY(360deg) scale(1.1)" : undefined
                        }}
                    >
                        <span className={letterTextClass}>
                            {letter}
                        </span>
                        
                        {/* Sparkle effects for correct letters */}
                        {isCorrect && (
                            <>
                                <div 
                                    className="letter-sparkle top-right"
                                    style={{ animationDelay: `${index * 0.2}s` }}
                                >✨</div>
                                <div 
                                    className="letter-sparkle bottom-left"
                                    style={{ animationDelay: `${index * 0.2 + 0.5}s` }}
                                >⭐</div>
                            </>
                        )}
                        
                        {/* Shake effect for revealed wrong letters */}
                        {reveal && !isCorrect && (
                            <div className="letter-skull">💀</div>
                        )}
                        
                        {/* Letter reveal animation */}
                        {isVisible && (
                            <div className={`letter-glow ${isCorrect ? 'correct' : 'incorrect'}`} />
                        )}
                    </span>
                )
            })}
            
           
        </div>
    )
}