import breadenerLevels from "$static/breadenerLevels.json" with {
  type: "json"
};
import { MessageFlags, SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../customTypes.ts";
import { db } from "../db.ts";
import { validGuildGuard } from "../utils.ts";

export const slashGetBreadenerLevel: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("get-breadener-level")
    .setDescription("See the breadener level of someone")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("give the username of the infector")
        .setRequired(true)
    ),
  execute: async (interaction) => {
    if (!validGuildGuard(interaction)) {
      await interaction
        .reply({
          content: "You cannot run this command here.",
          withResponse: true,
        })
        .catch((err) => console.error(err));
      return `${interaction.user.username} used /get-breadener-level, but ran it somewhere invalid`;
    }

    const user = interaction.options.getUser("user", true);

    const breadCount = db
      .sql`SELECT COUNT(*) FROM infections WHERE infectorId = ${user.id}`[0][
        "COUNT(*)"
      ] as number ?? 0;
    const index = Math.floor(Math.min(breadCount, 48) / 12);
    const levelProgress = breadCount % 12;
    const progressBar = "█".repeat(levelProgress)
      + "░".repeat(12 - levelProgress);

    let progressText =
      `📊 Progress: ${breadCount}/${breadenerLevels[index].threshold} until ${
        breadenerLevels[index].nextLevel
      }\n`
      + `📈 ${progressBar} ${Math.floor((levelProgress / 12) * 100)}%\n`;

    if (!("nextLevel" in breadenerLevels[index])) {
      progressText = `📊 You are at the maximum level!\n📈 ${
        "█".repeat(12)
      } 100%\n`;
    }

    await interaction
      .reply({
        content:
          `**${user}** is a **${breadenerLevels[index].emoji} ${
            breadenerLevels[index].level
          }**!\n`
          + `${progressText}`
          + `🍞 Total breaded: **${breadCount}** people`,
        flags: MessageFlags.SuppressNotifications, // makes the message silent
        withResponse: true,
      })
      .catch((err) => console.error(err));
    return `${interaction.user.username} used /get-breadener-level`;
  },
};

export const slashGetBreadenerLevels: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("breadener-levels")
    .setDescription(
      "Show all available breadener levels and their requirements",
    ),
  execute: async (interaction) => {
    let message = "🍞 **Breadener Levels** 🍞\n\n";

    for (let i = 0; i < breadenerLevels.length; i++) {
      const breadLevel = breadenerLevels[i];

      if (!breadLevel.threshold) {
        message +=
          `${breadLevel.emoji} ${breadLevel.level}: 48+ people Breadened!\n`;
        continue;
      }
      message += `${breadLevel.emoji} ${breadLevel.level}: ${
        breadLevel.threshold - 12
      } - ${breadLevel.threshold} people Breadened!\n`;
    }

    message +=
      "\n🎯 Use `/get-breadener-level <username>` to check someone's level!";

    await interaction
      .reply({
        content: message,
        withResponse: true,
      })
      .catch((err) => console.error(err));
    return `${interaction.user.username} used /breadener-levels`;
  },
};
