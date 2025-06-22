import { SlashCommandBuilder } from "discord.js";
import { getAllLevels } from "../../levelingSystem.ts";

export const data = new SlashCommandBuilder()
  .setName("breadener-levels")
  .setDescription("Show all available breadener levels and their requirements");

export async function execute(interaction) {
  const levels = getAllLevels();
  
  let message = "🍞 **Breadener Levels** 🍞\n\n";
  
  // Reverse the array to show from lowest to highest
  const reversedLevels = [...levels].reverse();
  
  for (let i = 0; i < reversedLevels.length; i++) {
    const level = reversedLevels[i];
    const nextLevel = i > 0 ? reversedLevels[i - 1] : null;
    
    if (level.threshold === 0) {
      message += `${level.emoji} **${level.level}** - 0 people breaded\n`;
    } else if (!nextLevel || level.threshold === 100) {
      message += `${level.emoji} **${level.level}** - ${level.threshold}+ people breaded\n`;
    } else {
      message += `${level.emoji} **${level.level}** - ${level.threshold}-${nextLevel.threshold - 1} people breaded\n`;
    }
  }
  
  message += "\n🎯 Use `/get-breadener-level <username>` to check someone's level!";
  
  const logMessage = `Breadener levels info requested by "${interaction.user.username}"`;

  await interaction
    .reply({
      content: message,
      withResponse: true,
    })
    .then((_response) => console.log(logMessage))
    .catch(console.error);
}
