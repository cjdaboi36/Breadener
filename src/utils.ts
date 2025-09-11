import "../node_modules/dotenv/config.d.ts";
import { breadRecipe } from "./customTypes.ts";
import recipeData from "../static/breadRecipies.json" with { type: "json" };

// For all your exportation and header functional purposes

export function coolBanner(): void {
  console.log(
    "  ____                     _                      \n" +
      " |  _ \\                   | |                     \n" +
      " | |_) |_ __ ___  __ _  __| | ___ _ __   ___ _ __\n" +
      " |  _ <| '__/ _ \\\/ _` |/ _` |/ _ \ '_ \\ / _ \\ '__|\n" +
      " | |_) | | |  __/ (_| | (_| |  __/ | | |  __/ |   \n" +
      " |____/|_|  \\\___|\\\__,_|\\\__,_|\\\___|_| |_|\\\___|_|🍞",
  );
}

export function removeWhiteSpace(str: string): string {
  while (str[0] === " " || str[0] === "\n") {
    str = str.slice();
  }

  while (str[str.length - 1] === " " || str[str.length - 1] === "\n") {
    str = str.substring(0, str.length - 1);
  }

  return str;
}

// Simple method that returns a random emoji from list
export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * max - min) + min;
}

export function capitalize(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function getRandomEmoji(): string {
  const smileys: string[] = [":)", ":D", ":3", ":P"];
  return smileys[randomNumber(0, smileys.length)];
}

export function parseRecipe(breadType: string): breadRecipe {
  for (const focusedData of Object.entries(recipeData)) {
    if (focusedData[0] === breadType) {
      return {
        breadName: breadType,
        ingredients: focusedData[1].ingredients,
        expectedTime: focusedData[1].expectedTime,
        instructions: focusedData[1].instructions,
        recipeLink: focusedData[1].recipeLink,
      };
    }
  }

  // Bitch im 21 but still walk around with fake id

  return {
    breadName: undefined,
    ingredients: [["", ""]],
    expectedTime: 0,
    instructions: [""],
    recipeLink: "",
  };
}
