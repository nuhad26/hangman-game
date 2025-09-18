import type { Key } from "react"
import style from "./keyboard.module.css"

const KEYS = [
    "A", "B", "C", "D", "E", "F",
    "G", "H", "I", "J", "K", "L", 
    "M", "N", "O", "P", "Q", "R",
    "S", "T", "U", "V", "W", "X",
    "Y", "Z"
]

type KeyboardProps = {
    disabled?: boolean
    activeLetter: string[]
    inactiveLetters: string[]
    addGuessedLetter: (letter: string) => void
}

export function Keyboard({ disabled = false, activeLetter, inactiveLetters, addGuessedLetter }: KeyboardProps) {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(3rem, 1fr))",
            gap: ".5rem",
        }}>
            {KEYS.map(key => {
                const isActive = activeLetter.includes(key)
                const isInactive = inactiveLetters.includes(key)

                return (
                    <button 
                        onClick={() => addGuessedLetter(key)}
                        className={`${style.btn} ${isActive ? style.active : ""} ${isInactive ? style.inactive : ""}`}
                        key={key}
                        disabled={isActive || isInactive || disabled}
                    >
                        {key}
                    </button>
                )
            })}
        </div>
    )
}