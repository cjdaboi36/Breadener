import { SlashCommandBuilder } from "discord.js";
import jsonData from "../../../importantFiles/breadCount.json" with { type: "json" };
import { getPrimaryContent } from "../../utils.ts";
import { _getBreadenerData } from "../../levelingSystem.ts";

export const data = new SlashCommandBuilder()
  .setName("get-breadener-level")
  .setDescription("See the breadener level of someone")
  .addStringOption((option) =>
    option
      .setName("username")
      .setDescription("give the preferred username")
      .setRequired(true)
      .setAutocomplete(true),
  );

export async function autocomplete(interaction) {
  const focusedValue = interaction.options.getFocused();
  const filtered = getPrimaryContent(jsonData.userObject).filter((choice) =>
    choice.startsWith(focusedValue),
  );
  await interaction.respond(
    filtered.map((choice) => ({ name: choice, value: choice })),
  );
}

export async function execute(interaction) {
  const usernameIn: string = interaction.options.getString("username");

  let breadCount: number | undefined;
  for (const person of Object.entries(jsonData.userObject)) {
    if (person[0] === usernameIn) {
      breadCount = person[1];
      break;
    }
  }

  let message: string;
  let logMessage: string;

  if (breadCount) {
    const { level, nextLevel, emoji, threshold } =
      _getBreadenerData(breadCount);

    if (!threshold) {
      await interaction
        .reply({
          content:
            `**${usernameIn}** is a **${level}**!\n` +
            `🍞 Total breaded: **${breadCount}** people`,
          withResponse: true,
        })
        .then((_response) => console.log(logMessage))
        .catch(console.error);
      return;
    }

    const progress: string = `${breadCount}/${threshold}`;
    const actualProcress: number = (breadCount - threshold - 12) / threshold;

    const filledBars = Math.floor(actualProcress * 10);
    const progressBar = "█".repeat(filledBars) + "░".repeat(10 - filledBars);

    message =
      `**${usernameIn}** is a **${emoji} ${level}**!\n` +
      `📊 Progress: ${progress}\n` +
      `📈 ${progressBar} ${actualProcress * 100}%\n` +
      `🍞 Total breaded: **${breadCount}** people`;

    logMessage = `"${usernameIn}" level checked - ${level} (${breadCount} breaded). Requested by "${interaction.user.username}"`;
  } else {
    message = `It doesn't seem like ${usernameIn} is in the database. If you are sure it should be, leave an issue on my repository!`;
    logMessage = `"${usernameIn}" isn't in the database. Requested by "${interaction.user.username}"`;
  }

  await interaction
    .reply({
      content: message,
      withResponse: true,
    })
    .then((_response) => console.log(logMessage))
    .catch(console.error);
}
