import "../node_modules/dotenv/config.d.ts";
import { breadenerLevel, breadRecipe } from "./customTypes.ts";
import recipeData from "../static/breadRecipies.json" with { type: "json" };
import breadenerLevels from "../static/breadenerLevels.json" with { type: "json" };

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

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = "https://discord.com/api/v10/" + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      "Content-Type": "application/json; charset=UTF-8",
      "User-Agent":
        "DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)",
    },
    ...options,
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: "PUT", body: commands });
  } catch (err) {
    console.error(err);
  }
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

export function getPrimaryContent(data: object): string[] {
  let array: string[] = [];
  for (const i of Object.entries(data)) {
    array.push(i[0]);
  }

  return array;
}

export function getBreadenerData(breadCount: number): breadenerLevel {
  let index: number = Math.floor(breadCount / 12);

  if (49 <= breadCount) {
    index = 4;
  }

  const receivedData = breadenerLevels[index];

  return {
    level: receivedData.level,
    nextLevel: receivedData.nextLevel,
    breadCount: breadCount,
    emoji: receivedData.emoji,
    threshold: receivedData.threshold,
  };
}
