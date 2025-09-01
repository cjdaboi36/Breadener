import { SlashCommandBuilder } from "discord.js";
import type { breadenerLevel } from "../../customTypes.ts";
import { db } from "../../db.ts";

export const data = new SlashCommandBuilder()
  .setName("get-breadener-level")
  .setDescription("See the breadener level of someone")
  .addUserOption((option) =>
    option
      .setName("username")
      .setDescription("give the username of the infector")
      .setRequired(true),
  );

const breadenerLevels = [
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

export async function execute(interaction) {
  const username = interaction.options.getUser("username");

  let thing: { "COUNT(*)": number } | undefined = db
    .prepare("SELECT COUNT(*) FROM infections WHERE infector_id = ?")
    .get(username.id);
  thing = thing ?? { "COUNT(*)": 0 }; // if it can't find anything, use 0

  const breadCount = thing["COUNT(*)"];
  let index: number = Math.floor(breadCount / 12);

  if (49 <= breadCount) {
    index = 4;
  }

  const levelProgress: number = breadCount % 12;
  const progressBar =
    "█".repeat(levelProgress) + "░".repeat(12 - levelProgress);

  let progressText: string =
    `📊 Progress: ${breadCount}/${breadenerLevels[index].threshold} until ${breadenerLevels[index].nextLevel}\n` +
    `📈 ${progressBar} ${Math.floor((levelProgress / 12) * 100)}%\n`;

  const message =
    `**${username}** is a **${breadenerLevels[index].emoji} ${breadenerLevels[index].level}**!\n` +
    `${progressText}` +
    `🍞 Total breaded: **${breadCount}** people`;

  const logMessage = `"${username}" level checked - ${breadenerLevels[index].level} (${breadCount} breaded). Requested by "${interaction.user.username}"`;

  if (!breadenerLevels[index].nextLevel) {
    progressText =
      `📊 You are at the maximum level!\n` + `📈 ${"█".repeat(12)} 100%\n`;
  }

  await interaction
    .reply({
      content: message,
      withResponse: true,
    })
    .then((response) => console.log(logMessage))
    .catch(console.error);
}
