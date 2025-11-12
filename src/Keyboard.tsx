import style from "./keyboard.module.css"

const KEYS = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"]
]

type KeyboardProps = {
    disabled?: boolean
    activeLetter: string[]
    inactiveLetters: string[]
    addGuessedLetter: (letter: string) => void
}

export function Keyboard({ disabled = false, activeLetter, inactiveLetters, addGuessedLetter }: KeyboardProps) {
    return (
        <div className="keyboard-container">
            {KEYS.map((row, rowIndex) => (
                <div key={rowIndex} className="keyboard-row">
                    {row.map(key => {
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
            ))}
        </div>
    )
}