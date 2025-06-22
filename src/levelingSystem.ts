export interface BreadenerLevel {
  level: string;
  progress: string;
  emoji: string;
  threshold: number;
}

export const BREADENER_LEVELS: BreadenerLevel[] = [
  { level: "Breadener V", emoji: "🥖", threshold: 48, progress: "MAX LEVEL!" },
  { level: "Breadener VI", emoji: "🍞", threshold: 36, progress: "" },
  { level: "Breadener III", emoji: "🥐", threshold: 24, progress: "" },
  { level: "Breadener II", emoji: "🍚", threshold: 12, progress: "" },
  { level: "Breadener I", emoji: "🌾", threshold: 1, progress: "" },
  { level: "Not a Breadener", emoji: "⚠️👎", threshold: 0, progress: "" },
];

export function getBreadenerLevel(breadCount: number): { level: string; progress: string; emoji: string } {
  for (let i = 0; i < BREADENER_LEVELS.length; i++) {
    const currentLevel = BREADENER_LEVELS[i];
    if (breadCount >= currentLevel.threshold) {
      let progress: string;
      if (i === 0) {
        progress = "MAX LEVEL!";
      } else {
        const nextLevel = BREADENER_LEVELS[i - 1];
        progress = `${breadCount}/${nextLevel.threshold} to ${nextLevel.level}`;
      }
      return {
        level: `${currentLevel.emoji} ${currentLevel.level}`,
        progress,
        emoji: currentLevel.emoji
      };
    }
  }
  return {
    level: "🌾 No Breadening Yet",
    progress: "0/1 to Novice Breadener",
    emoji: "🌾"
  };
}

export function getAllLevels(): BreadenerLevel[] {
  return BREADENER_LEVELS;
}

export function getNextLevel(breadCount: number): BreadenerLevel | null {
  for (let i = BREADENER_LEVELS.length - 1; i >= 0; i--) {
    if (breadCount < BREADENER_LEVELS[i].threshold) {
      return BREADENER_LEVELS[i];
    }
  }
  return null;
}

export function getProgressPercentage(breadCount: number): number {
  const nextLevel = getNextLevel(breadCount);
  if (!nextLevel) return 100;
  let currentThreshold = 0;
  for (const level of BREADENER_LEVELS) {
    if (breadCount >= level.threshold) {
      currentThreshold = level.threshold;
      break;
    }
  }
  const progressRange = nextLevel.threshold - currentThreshold;
  const currentProgress = breadCount - currentThreshold;
  return Math.round((currentProgress / progressRange) * 100);
}
