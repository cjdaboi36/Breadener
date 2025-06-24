import { breadenerLevel } from "./customTypes.ts";

export const breadenerLevels = [
  {
    level: "Breadener I",
    emoji: "🌾",
    threshold: 12,
    nextLevel: "Breadener II",
  },
  {
    level: "Breadener II",
    emoji: "🍚",
    threshold: 24,
    nextLevel: "Breadener III",
  },
  {
    level: "Breadener III",
    emoji: "🥐",
    threshold: 36,
    nextLevel: "Breadener IV",
  },
  {
    level: "Breadener VI",
    emoji: "🍞",
    threshold: 48,
    nextLevel: "Breadener V",
  },
  {
    level: "Breadener V",
    emoji: "🥖",
  },
];

export function _getBreadenerData(breadCount: number): breadenerLevel {
  let index: number = Math.floor(breadCount / 12);

  if (49 <= breadCount) {
    index = 4;
  }

  const receivedData = breadenerLevels[index];

  return {
    level: receivedData.level,
    nextLevel: receivedData.nextLevel,
    breadCount: breadCount,
    emoji: receivedData.emoji,
    threshold: receivedData.threshold,
  };
}
