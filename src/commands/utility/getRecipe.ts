import { SlashCommandBuilder } from "discord.js";
import { breadRecipe } from "../../customTypes.ts";
import { parseRecipe } from "../../functions.ts";

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
  const requestedBreadType: string =
    interaction.options.getString("bread-type");
  const breadType: breadRecipe = parseRecipe(requestedBreadType);
  const ingredientsLength: number = breadType.ingredients.length;
  const instructionsLength: number = breadType.instructions.length;

  let message: string = `# Recipe for ${breadType.breadName}! \nIngredients: \n`;

  for (let i: number = 0; i <= ingredientsLength - 1; i++) {
    message += `${i + 1}. ${breadType.ingredients[i][1]} of ${breadType.ingredients[i][0]};\n`;
  }

  message += "## Instructions\n";

  for (let i: number = 0; i <= instructionsLength - 1; i++) {
    message += `${i + 1}. ${breadType.instructions[i]};\n`;
  }

  let logMessage: string = `${interaction.user.username} requested the ${requestedBreadType}-recipe.`;

  if (!breadType.breadName) {
    message = `It doesn't seem like we have a recipe for ${requestedBreadType}. Maybe you misspelled it, or we just dont have it yet!\nDon't feel bad, if you can think of a recipe, make a pull request on my repository!`;
    logMessage = `${interaction.user.username} requested a ${requestedBreadType}-recipe, but none were found.`;
  }

  await interaction
    .reply({
      content: message,
      withResponse: true,
    })
    .then((response) => console.log(logMessage))
    .catch(console.error);
}
