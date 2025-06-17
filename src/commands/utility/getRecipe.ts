import { SlashCommandBuilder } from "discord.js";
import recipeData from "../../../importantFiles/breadRecipies.json" with { type: "json" };
import { ingredient, breadRecipe } from "../../customTypes";

function parseRecipe(data: JSON, breadType: string): void {
  console.log("Thing");
  let returnValue: breadRecipe;

  for (const focusedData in Object.entries(data)) {
    console.log(focusedData);
  }

  // Grenzgänger
  // Iemand die iemands grenzen opzoekt.
}

export const data = new SlashCommandBuilder()
  .setName("get-recipes")
  .setDescription("Get recipes for the most delicious pieces of bread!")
  .addStringOption((option) =>
    option
      .setName("bread-type")
      .setDescription("give a type of bread")
      .setRequired(true)
      .setAutocomplete(false),
  );

export async function execute(interaction) {
  const breadType: string = interaction.options.getString("bread-type");

  let message: string = `
    # Recipe for ${2 + 2}


  `;
  let logMessage: string;

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
