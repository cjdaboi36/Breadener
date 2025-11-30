import type { BreadRecipe } from "$src/customTypes.ts";
import recipeData from "$static/breadRecipies.json" with { type: "json" };
import {
  type ChatInputCommandInteraction,
  Guild,
  type Message,
} from "discord.js";

// For all your exportation and header functional purposes

export const coolBanner = () => {
  console.log(
    "  ____                     _                      \n"
      + " |  _ \\                   | |                     \n"
      + " | |_) |_ __ ___  __ _  __| | ___ _ __   ___ _ __\n"
      + " |  _ <| '__/ _ \\\/ _` |/ _` |/ _ \ '_ \\ / _ \\ '__|\n"
      + " | |_) | | |  __/ (_| | (_| |  __/ | | |  __/ |   \n"
      + " |____/|_|  \\\___|\\\__,_|\\\__,_|\\\___|_| |_|\\\___|_|🍞",
  );
};

export const validGuildGuard = (
  interaction: ChatInputCommandInteraction,
) =>
  interaction.guild instanceof Guild
  && interaction.guild.id === "1383472184416272507";

// Simple method that returns a random emoji from list
export const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * max - min + 1) + min;

export const capitalize = (input: string) =>
  input.charAt(0).toUpperCase() + input.slice(1);

export function getRandomEmoji(): string {
  const smileys: string[] = [":)", ":D", ":3", ":P"];
  return smileys[randomNumber(0, smileys.length - 1)];
}

export function parseRecipe(breadType: string): BreadRecipe {
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

export function isModerator(message: Message): boolean {
  if (!message.member) return false;
  let returnValue = false;
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

export const isInChannel = (message: Message, channelId: string) =>
  message.channelId === channelId;
