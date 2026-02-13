import recipeData from "$static/breadRecipies.json" with { type: "json" };
import { type ChatInputCommandInteraction, Guild } from "discord.js";
import type { BreadRecipe } from "./customTypes.ts";

export const coolBanner = "  ____                     _                      \n"
  + " |  _ \\                   | |                     \n"
  + " | |_) |_ __ ___  __ _  __| | ___ _ __   ___ _ __\n"
  + " |  _ <| '__/ _ \\\/ _` |/ _` |/ _ \ '_ \\ / _ \\ '__|\n"
  + " | |_) | | |  __/ (_| | (_| |  __/ | | |  __/ |   \n"
  + " |____/|_|  \\\___|\\\__,_|\\\__,_|\\\___|_| |_|\\\___|_|🍞";

export const validGuildGuard = (
  interaction: ChatInputCommandInteraction,
) =>
  interaction.guild instanceof Guild
  && interaction.guild.id === "1383472184416272507";

export function parseRecipe(breadType: string): BreadRecipe | undefined {
  const recipe = Object.entries(recipeData)
    .find(([name, _]) => name === breadType) as
      | [string, BreadRecipe]
      | undefined;

  return recipe ? recipe[1] : undefined;
}
