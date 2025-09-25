import {
  Guild,
  type GuildMemberRoleManager,
  SlashCommandBuilder,
  type User,
} from "discord.js";
import type { SlashCommand } from "$src/customTypes.ts";
import { guildChecker } from "$src/utils.ts";
import { db } from "$src/db.ts";

type LevelBase = {
  level: string;
  id: string;
  emoji: string;
};

type Level =
  | (LevelBase & {
    threshold?: never;
    nextLevel?: never;
  })
  | (LevelBase & {
    threshold: number;
    nextLevel: string;
  });

export const breadenerLevels: Level[] = [
  {
    level: "Breadener I",
    id: "1383476387742224414",
    emoji: "🌾",
    threshold: 12,
    nextLevel: "Breadener II",
  },
  {
    level: "Breadener II",
    id: "1388880579612639364",
    emoji: "🍚",
    threshold: 24,
    nextLevel: "Breadener III",
  },
  {
    level: "Breadener III",
    id: "1388880622151405630",
    emoji: "🥐",
    threshold: 36,
    nextLevel: "Breadener IV",
  },
  {
    level: "Breadener VI",
    id: "1388880671480610876",
    emoji: "🍞",
    threshold: 48,
    nextLevel: "Breadener V",
  },
  {
    level: "Breadener V",
    id: "1388880705081311312",
    emoji: "🥖",
  },
] as const;

const slashCommand: SlashCommand = {
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
    if (await guildChecker(interaction)) return;

    const user: User = interaction.options.getUser("user", true);

    if (
      !(interaction.guild instanceof Guild &&
        interaction.guild.id === "1383472184416272507")
    ) {
      await interaction
        .reply({
          content: "You cannot run this command here.",
          withResponse: true,
        })
        .then((_response) => console.log("Nuh uh uh"))
        .catch(console.error);
      return;
    }

    const breadCount: { "COUNT(*)": number } = db
      .prepare("SELECT COUNT(*) FROM infections WHERE infectedId = ?")
      .get(interaction.user.id) ?? { "COUNT(*)": 0 };

    const index: number = Math.floor(Math.min(breadCount["COUNT(*)"], 48) / 12);

    const levelProgress: number = breadCount["COUNT(*)"] % 12;
    const progressBar = "█".repeat(levelProgress) +
      "░".repeat(12 - levelProgress);

    let progressText: string =
      `📊 Progress: ${breadCount}/${breadenerLevels[index].threshold} until ${
        breadenerLevels[index].nextLevel
      }\n` +
      `📈 ${progressBar} ${Math.floor((levelProgress / 12) * 100)}%\n`;

    if (!("nextLevel" in breadenerLevels[index])) {
      progressText = `📊 You are at the maximum level!\n` +
        `📈 ${"█".repeat(12)} 100%\n`;
    }

    await interaction
      .reply({
        content:
          `**${user}** is a **${breadenerLevels[index].emoji} ${
            breadenerLevels[index].level
          }**!\n` +
          `${progressText}` +
          `🍞 Total breaded: **${breadCount}** people`,
        flags: [4096], // makes the message silent
        withResponse: true,
      })
      .then((_response) =>
        console.log(
          `"${user.username}" level checked - ${
            breadenerLevels[index].level
          } (${breadCount} breaded). Requested by "${interaction.user.username}"`,
        )
      )
      .catch(console.error);
  },
};
export default slashCommand;
