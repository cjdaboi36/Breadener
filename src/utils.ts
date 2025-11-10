import type { breadRecipe } from "$src/customTypes.ts";
import recipeData from "$static/breadRecipies.json" with { type: "json" };
import type { ChatInputCommandInteraction, Message } from "discord.js";

// For all your exportation and header functional purposes

export const helpText: string =
  `\`.help\` | Gives a list of all non-slash commands!\n`
  + `\`.ping\` | Replies with pong and your ping!\n`
  + `\`Is @Breadener up?\` | Replies with affermation!\n`;

export function coolBanner(): void {
  console.log(
    "  ____                     _                      \n"
      + " |  _ \\                   | |                     \n"
      + " | |_) |_ __ ___  __ _  __| | ___ _ __   ___ _ __\n"
      + " |  _ <| '__/ _ \\\/ _` |/ _` |/ _ \ '_ \\ / _ \\ '__|\n"
      + " | |_) | | |  __/ (_| | (_| |  __/ | | |  __/ |   \n"
      + " |____/|_|  \\\___|\\\__,_|\\\__,_|\\\___|_| |_|\\\___|_|🍞",
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

export async function guildChecker(
  interaction: ChatInputCommandInteraction,
): Promise<boolean> {
  if (interaction.guild && interaction.guild.id === "1383472184416272507") {
    return false;
  }
  await interaction
    .reply({
      content: "You cannot run this command here!",
      withResponse: true,
    })
    .then((_response) =>
      console.log(
        `${interaction.user.username} tried to fool the system, but turned out to be one themselves`,
      )
    )
    .catch(console.error);
  return true;
}

// Simple method that returns a random emoji from list
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * max - min) + min;
}

export function capitalize(input: string): string {
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

export function parseDBQuery(message: string): false | string {
  const start = message.slice(0, 5);
  const end = message.slice(-2, message.length);
  if (start !== ";db[\`") {
    return false;
  }

  if (end !== "\`]") {
    return false;
  }

  console.log(`${message} is a valid query`);
  message = message.slice(5);
  message = message.slice(0, -2);

  return message;
}

export function isModerator(message: Message): boolean {
  if (!message.member) return false;
  let returnValue: boolean = false;
  message.member.roles.cache.each(
    (value) => {
      if (
        value.id === "1383472356319559731" || value.id === "1408239632822304900"
      ) {
        returnValue = true;
        return;
      }
    },
  );
  return returnValue;
}

export function isInChannel(message: Message, channelId: string): boolean {
  if (message.channelId === channelId) {
    return true;
  }
  return false;
}
