import { SlashCommandBuilder } from "discord.js";
import jsonData from "../../importantFiles/breadCount.json" with { type: "json" };

export const data = new SlashCommandBuilder()
  .setName("get-bread-count")
  .setDescription("See how many people someone has infected")
  .addStringOption((option) =>
    option
      .setName("username")
      .setDescription("give the preferred username")
      .setRequired(true)
      .setAutocomplete(false),
  );

export async function execute(interaction) {
  const username = interaction.options.getString("username");

  let broodTeller;
  for (const person of Object.entries(jsonData.userObject)) {
    if (person[0] === username) {
      broodTeller = person[1];
      break;
    }
  }

  let message = `${username} infected ${broodTeller} people!`;

  if (broodTeller === undefined) {
    message = `It doesn't seem like ${username} is in the database. If you are sure it should be, leave an issue on my repository!`;
  }

  await interaction
    .reply({
      content: message,
      withResponse: true,
    })
    .then((response) =>
      console.log(
        `${interaction.user.username} breaded ${broodTeller} people.`,
      ),
    )
    .catch(console.error);
}
