import type { BreadRecipe } from "./customTypes.ts";
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

export function getRandomEmoji(): string {
  const smileys = [":)", ":D", ":3", ":P"] as const;
  return smileys[randomNumber(0, smileys.length - 1)];
}

export function parseRecipe(breadType: string): BreadRecipe | undefined {
  const recipe = Object.entries(recipeData).find(([name, _]) =>
    name === breadType
  ) as [string, BreadRecipe] | undefined;

  return recipe
    ? {
      breadName: breadType,
      ingredients: recipe[1].ingredients,
      expectedTime: recipe[1].expectedTime,
      instructions: recipe[1].instructions,
      recipeLink: recipe[1].recipeLink,
    }
    : undefined;
}

export function isModerator(message: Message): boolean {
  if (!message.member) return false;
  return Boolean(
    message.member.roles.cache.find((value) =>
      value.id === "1383472356319559731" || value.id === "1408239632822304900"
    ),
  );
}

export const isInChannel = (message: Message, channelId: string) =>
  message.channelId === channelId;
