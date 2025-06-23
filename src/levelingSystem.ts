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
  const receivedData = breadenerLevels[Math.floor(breadCount / 12)];

  return {
    level: receivedData.level,
    nextLevel: receivedData.nextLevel,
    breadCount: breadCount,
    emoji: receivedData.emoji,
    threshold: receivedData.threshold,
  };
}
