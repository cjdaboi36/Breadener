import { SlashCommandBuilder } from "discord.js";
import jsonData from "../../../importantFiles/breadCount.json" with { type: "json" };
import { getPrimaryContent } from "../../utils.ts";

export const data = new SlashCommandBuilder()
  .setName("get-bread-count")
  .setDescription("See how many people someone has infected")
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

  let broodTeller: number | undefined;
  for (const person of Object.entries(jsonData.userObject)) {
    if (person[0] === username) {
      broodTeller = person[1];
      break;
    }
  }

  let message: string = `${username} infected ${broodTeller} people!`;
  let logMessage: string = `"${username}" breaded ${broodTeller} people. Requested by "${interaction.user.username}"`;

  if (broodTeller === undefined) {
    message = `It doesn't seem like ${username} is in the database. If you are sure it should be, leave an issue on my repository!`;
    logMessage = `"${username}" isn't in the database. Requested by "${interaction.user.username}"`;
  }

  await interaction
    .reply({
      content: message,
      withResponse: true,
    })
    .then((response) => console.log(logMessage))
    .catch(console.error);
}
