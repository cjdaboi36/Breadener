import { SlashCommandBuilder } from "discord.js";
import breadenerLevels from "$static/breadenerLevels.json" with {
  type: "json",
};
import { SlashCommand } from "$src/customTypes.ts";

const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("breadener-levels")
    .setDescription(
      "Show all available breadener levels and their requirements",
    ),

  execute: async (interaction) => {
    let message = "🍞 **Breadener Levels** 🍞\n\n";

    for (let i = 0; i < breadenerLevels.length; i++) {
      const breadLevel = breadenerLevels[i];

      if (breadLevel.threshold) {
        message += `${breadLevel.emoji} ${breadLevel.level}: ${
          breadLevel.threshold - 12
        } - ${breadLevel.threshold} people Breadened!\n`;
        continue;
      }
      message +=
        `${breadLevel.emoji} ${breadLevel.level}: 48+ people Breadened!\n`;
    }

    message +=
      "\n🎯 Use `/get-breadener-level <username>` to check someone's level!";

    const logMessage =
      `Breadener levels info requested by "${interaction.user.username}"`;

    await interaction
      .reply({
        content: message,
        withResponse: true,
      })
      .then((_response) => console.log(logMessage))
      .catch(console.error);
  },
};

export default slashCommand;
