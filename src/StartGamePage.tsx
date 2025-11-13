import { type Difficulty, difficultyConfigs } from "./gameUtils";
import styles from "./startGame.module.css";

interface StartGamePageProps {
  onStartGame: (difficulty: Difficulty) => void;
}

export function StartGamePage({ onStartGame }: StartGamePageProps) {
  return (
    <div className={styles.startGameContainer}>
      <div className={styles.startGameContent}>
        {/* Header */}
        <div className={styles.startGameHeader}>
          <h1 className={styles.gameTitle}>
            🎯 Hangman Game
          </h1>
          <p className={styles.gameSubtitle}>
            Choose your difficulty level and start guessing!
          </p>
        </div>

        {/* Difficulty Selection */}
        <div className={styles.difficultySelection}>
          <h2 className={styles.difficultyTitle}>Select Difficulty</h2>
          
          <div className={styles.difficultyCards}>
            {(Object.keys(difficultyConfigs) as Difficulty[]).map((difficulty) => {
              const config = difficultyConfigs[difficulty];
              
              return (
                <div
                  key={difficulty}
                  className={styles.difficultyCard}
                  onClick={() => onStartGame(difficulty)}
                  style={{ borderColor: config.color }}
                >
                  <div className={styles.difficultyIcon}>
                    {config.icon}
                  </div>
                  
                  <div className={styles.difficultyInfo}>
                    <h3 className={styles.difficultyName} style={{ color: config.color }}>
                      {config.name}
                    </h3>
                    <p className={styles.difficultyDescription}>
                      {config.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Game Instructions */}
        <div className={styles.gameInstructions}>
          <h3 className={styles.instructionsTitle}>How to Play</h3>
          <div className={styles.instructionsGrid}>
            <div className={styles.instructionItem}>
              <span className={styles.instructionIcon}>⌨️</span>
              <span className={styles.instructionText}>Use keyboard or click letters</span>
            </div>
            <div className={styles.instructionItem}>
              <span className={styles.instructionIcon}>🎯</span>
              <span className={styles.instructionText}>Guess the word before hangman is complete</span>
            </div>
            <div className={styles.instructionItem}>
              <span className={styles.instructionIcon}>⏎</span>
              <span className={styles.instructionText}>Press Enter to restart after game ends</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
