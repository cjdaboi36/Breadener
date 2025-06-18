import { breadRecipe } from "./customTypes.ts";
import recipeData from "../importantFiles/breadRecipies.json" with { type: "json" };

export function parseRecipe(data: JSON, breadType: string): breadRecipe {
  let returnData: breadRecipe;

  for (const focusedData of Object.entries(data)) {
    if (focusedData[0] === breadType) {
      returnData = {
        breadName: breadType,
        ingredients: focusedData[1].ingredients,
        expectedTime: focusedData[1].expectedTime,
        instructions: focusedData[1].instructions,
      };
      return returnData;
    }
  }

  // Bitch im 21 but still walk around with fake id

  returnData = {
    breadName: "NOT FOUND",
    ingredients: [["NOT FOUND", "NOT FOUND"]],
    expectedTime: 0,
    instructions: ["NOT FOUND"],
  };

  return returnData;
}
