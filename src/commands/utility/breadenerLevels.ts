import { SlashCommandBuilder } from "discord.js";
import { breadenerLevels } from "../../levelingSystem.ts";

export const data = new SlashCommandBuilder()
  .setName("breadener-levels")
  .setDescription("Show all available breadener levels and their requirements");

export async function execute(interaction) {
  let message = "🍞 **Breadener Levels** 🍞\n\n";

  for (let i = 0; i < breadenerLevels.length; i++) {
    const level = breadenerLevels[i];

    if (level.threshold) {
      message += `${level.emoji} ${level}: ${level.threshold - 12} - ${level.threshold} people Breadened!\n`;
      continue;
    }
    message += `${level.emoji} ${level}: Max Level!\n`;
  }

  message +=
    "\n🎯 Use `/get-breadener-level <username>` to check someone's level!";

  const logMessage = `Breadener levels info requested by "${interaction.user.username}"`;

  await interaction
    .reply({
      content: message,
      withResponse: true,
    })
    .then((_response) => console.log(logMessage))
    .catch(console.error);
}
