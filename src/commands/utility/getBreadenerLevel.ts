import { SlashCommandBuilder } from "discord.js";
import jsonData from "../../../importantFiles/breadCount.json" with { type: "json" };
import { getPrimaryContent } from "../../utils.ts";
import { getBreadenerLevel, getProgressPercentage } from "../../levelingSystem.ts";

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
  const username: string = interaction.options.getString("username");

  let breadCount: number | undefined;
  for (const person of Object.entries(jsonData.userObject)) {
    if (person[0] === username) {
      breadCount = person[1];
      break;
    }
  }

  let message: string;
  let logMessage: string;

  if (breadCount !== undefined) {
    const { level, progress } = getBreadenerLevel(breadCount);
    const progressPercentage = getProgressPercentage(breadCount);
    
    // Create a progress bar
    const progressBarLength = 10;
    const filledBars = Math.round((progressPercentage / 100) * progressBarLength);
    const emptyBars = progressBarLength - filledBars;
    const progressBar = "█".repeat(filledBars) + "░".repeat(emptyBars);
    
    message = `**${username}** is a **${level}**!\n` +
              `📊 Progress: ${progress}\n` +
              `📈 ${progressBar} ${progressPercentage}%\n` +
              `🍞 Total breaded: **${breadCount}** people`;
    
    logMessage = `"${username}" level checked - ${level} (${breadCount} breaded). Requested by "${interaction.user.username}"`;
  } else {
    message = `It doesn't seem like ${username} is in the database. If you are sure it should be, leave an issue on my repository!`;
    logMessage = `"${username}" isn't in the database. Requested by "${interaction.user.username}"`;
  }

  await interaction
    .reply({
      content: message,
      withResponse: true,
    })
    .then((_response) => console.log(logMessage))
    .catch(console.error);
}