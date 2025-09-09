import { SlashCommandBuilder } from "discord.js";
import breadRecipies from "../../../static/breadRecipies.json" with { type: "json" };
import { breadRecipe, SlashCommand } from "../../customTypes.ts";
import { parseRecipe } from "../../utils.ts";

// export async function autocomplete(interaction) {
//   const focusedValue = interaction.options.getFocused();
//   // getPrimaryContent(recipeData) is the array with breadTypes
//   const filtered = getPrimaryContent(breadRecipies).filter((choice) =>
//     choice.startsWith(focusedValue),
//   );
//   await interaction.respond(
//     filtered.map((choice) => ({ name: choice, value: choice })),
//   );
// }

const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("get-recipes")
    .setDescription("Get recipes for the most delicious pieces of bread!")
    .addStringOption(
      (option) =>
        option
          .setName("bread-type")
          .setDescription("give a type of bread")
          .setRequired(true),
      // .setAutocomplete(true), // FIXME: add back once the autocomplete is uncommented.
    ),
  execute: async (interaction) => {
    const requestedBreadType: string = interaction.options.getString(
      "bread-type",
      true,
    );
    const breadType: breadRecipe = parseRecipe(requestedBreadType);
    const ingredientsLength: number = breadType.ingredients.length;
    const instructionsLength: number = breadType.instructions.length;
    const recipeLink: string = breadType.recipeLink;

    let message: string = `# Recipe for ${breadType.breadName}! \nIngredients:\n`;

    for (let i: number = 0; i <= ingredientsLength - 1; i++) {
      message += `${i + 1}. ${breadType.ingredients[i][1]} of ${breadType.ingredients[i][0]}\n`;
    }

    message += "## Instructions\n";

    for (let i: number = 0; i <= instructionsLength - 1; i++) {
      message += `${i + 1}. ${breadType.instructions[i]}\n`;
    }

    message += "## Recipe Link\n";
    message += `${recipeLink}\n`;

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
  },
};

export default slashCommand;
