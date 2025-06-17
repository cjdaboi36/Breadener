import { breadRecipe } from "./customTypes.ts";
import recipeData from "../importantFiles/breadRecipies.json" with { type: "json" };

function parseRecipe(data: any, breadType: string): void {
  let returnValue: breadRecipe;

  for (const focusedData of Object.entries(data)) {
    if (focusedData[0] === breadType) {
      console.log("The name is " + focusedData[0]);
      console.log("The time is " + focusedData[1].expectedTime);

      const instructionsArray: string[] = focusedData[1].instructions;
      const ingredientsArray: string[][] = focusedData[1].ingredients;

      for (let i = 0; i <= instructionsArray.length - 1; i++) {
        console.log(instructionsArray[i]);
      }

      for (let i = 0; i <= ingredientsArray.length - 1; i++) {
        console.log(ingredientsArray[i][0]);
        console.log(ingredientsArray[i][1]);
      }

      /*
      returnValue = {
        _breadName: breadType,
        _expectedTime: focusedData[1].ExpectedTime,
      };
      break;
      */
    }
  }

  // Bitch im 21 but still walk around with fake id
}

parseRecipe(recipeData, "Baguette");
