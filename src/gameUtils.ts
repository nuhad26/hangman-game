import wordList from "./wordList.json";

export type Difficulty = "easy" | "medium" | "hard";

export interface DifficultyConfig {
  name: string;
  description: string;
  minLength: number;
  maxLength: number;
  color: string;
  icon: string;
}

export const difficultyConfigs: Record<Difficulty, DifficultyConfig> = {
  easy: {
    name: "Easy",
    description: "9+ letters",
    minLength: 9,
    maxLength: Infinity,
    color: "#10B981", // green
    icon: "🟢"
  },
  medium: {
    name: "Medium", 
    description: "6-8 letters",
    minLength: 6,
    maxLength: 8,
    color: "#F59E0B", // yellow
    icon: "🟡"
  },
  hard: {
    name: "Hard",
    description: "3-5 letters", 
    minLength: 3,
    maxLength: 5,
    color: "#EF4444", // red
    icon: "🔴"
  }
};

export function getWordsByDifficulty(difficulty: Difficulty): string[] {
  const config = difficultyConfigs[difficulty];
  return wordList.filter(word => 
    word.length >= config.minLength && word.length <= config.maxLength
  );
}

export function getRandomWord(difficulty: Difficulty): string {
  const words = getWordsByDifficulty(difficulty);
  if (words.length === 0) {
    // Fallback to any word if no words match the difficulty
    return wordList[Math.floor(Math.random() * wordList.length)];
  }
  return words[Math.floor(Math.random() * words.length)];
}
