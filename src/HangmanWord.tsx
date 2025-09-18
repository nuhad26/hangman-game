// type HangmanWordProps = {
//     guessedLetters: string[],
//     wordToGuess: string
//     reveal?: boolean
// }

// export function HangmanWord({guessedLetters,  wordToGuess,reveal = false}: HangmanWordProps){
 
//     return (
//         <div style={{
//             display: "flex",
//             gap: ".25em",
//             fontSize: "6rem",
//             fontWeight: "bold",
//             textTransform: "uppercase",
//             fontFamily: "monospace",
//             letterSpacing: ".25em"
//         }}
//         >
//             {wordToGuess.split("").map((letter, index) => (
//                 <span key={index} style={{borderBottom: ".1em solid black"}}>
//                    <span
//                     style={{
//         visibility: guessedLetters.includes(letter.toUpperCase()) || reveal
//                          ? "visible" 
//                          : "hidden",
//                          color: !guessedLetters.includes(letter.toUpperCase())
//                           && reveal ? "red" : "black"
//                     }}
//                    >{letter}</span> 
//                 </span>
//             ))} 
//         </div>
//     )
    
// }
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
        <div style={{
            display: "flex",
            gap: ".25em",
            fontSize: "6rem",
            fontWeight: "bold",
            textTransform: "uppercase",
            fontFamily: "monospace",
            letterSpacing: ".25em",
            perspective: "1000px"
        }}>
            {wordToGuess.split("").map((letter, index) => {
                const isVisible = guessedLetters.includes(letter.toUpperCase()) || reveal
                const isCorrect = guessedLetters.includes(letter.toUpperCase())
                const shouldAnimate = animatedLetters.has(index)
                
                return (
                    <span 
                        key={index} 
                        style={{
                            borderBottom: ".1em solid #333",
                            position: "relative",
                            minWidth: "1.2em",
                            height: "1.5em",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "0.1em",
                            background: isVisible ? 
                                (isCorrect ? 
                                    "linear-gradient(145deg, #4ade80, #22c55e)" : 
                                    "linear-gradient(145deg, #ef4444, #dc2626)") : 
                                "linear-gradient(145deg, #f1f5f9, #e2e8f0)",
                            boxShadow: isVisible ? 
                                "0 8px 16px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)" : 
                                "0 4px 8px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.1)",
                            transform: shouldAnimate ? 
                                "rotateY(360deg) scale(1.1)" : 
                                isVisible ? "scale(1.05)" : "scale(1)",
                            transition: "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                            animation: isVisible ? "letterGlow 2s ease-in-out infinite alternate" : "none"
                        }}
                    >
                        <span
                            style={{
                                visibility: isVisible ? "visible" : "hidden",
                                color: !isCorrect && reveal ? "#fef2f2" : "#1f2937",
                                textShadow: isVisible ? 
                                    (isCorrect ? 
                                        "0 2px 4px rgba(34, 197, 94, 0.5), 0 0 20px rgba(74, 222, 128, 0.3)" : 
                                        "0 2px 4px rgba(220, 38, 38, 0.5)") : 
                                    "none",
                                transform: isVisible ? "translateY(-2px)" : "translateY(0)",
                                transition: "all 0.3s ease-out",
                                fontSize: reveal && !isCorrect ? "0.9em" : "1em",
                                fontWeight: isVisible ? "900" : "bold"
                            }}
                        >
                            {letter}
                        </span>
                        
                        {/* Sparkle effects for correct letters */}
                        {isCorrect && (
                            <>
                                <div style={{
                                    position: "absolute",
                                    top: "-10px",
                                    right: "-5px",
                                    fontSize: "0.3em",
                                    color: "#fbbf24",
                                    animation: "sparkle 1.5s ease-in-out infinite",
                                    animationDelay: `${index * 0.2}s`
                                }}>✨</div>
                                <div style={{
                                    position: "absolute",
                                    bottom: "-10px",
                                    left: "-5px",
                                    fontSize: "0.25em",
                                    color: "#10b981",
                                    animation: "sparkle 1.5s ease-in-out infinite",
                                    animationDelay: `${index * 0.2 + 0.5}s`
                                }}>⭐</div>
                            </>
                        )}
                        
                        {/* Shake effect for revealed wrong letters */}
                        {reveal && !isCorrect && (
                            <div style={{
                                position: "absolute",
                                top: "-15px",
                                right: "-10px",
                                fontSize: "0.3em",
                                color: "#f87171",
                                animation: "shake 0.5s ease-in-out infinite"
                            }}>💀</div>
                        )}
                        
                        {/* Letter reveal animation */}
                        {isVisible && (
                            <div style={{
                                position: "absolute",
                                inset: 0,
                                background: isCorrect ? 
                                    "radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)" : 
                                    "radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%)",
                                borderRadius: "0.1em",
                                animation: "pulse 2s ease-in-out infinite",
                                pointerEvents: "none"
                            }} />
                        )}
                    </span>
                )
            })}
            
           
        </div>
    )
}