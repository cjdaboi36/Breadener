import { NonSlashCommand } from "../types.ts";

export const hasBread = new NonSlashCommand({
  name: "Bread :)",
  description: "Bread :)",
  command: "🍞",
  showInHelp: false,
  // If it appears like the string is missing, that means your font can't
  // render the bread emoji.
  match: (message) => message.content.includes("🍞"),
  execute: async (message) => {
    await message.react("🍞");
    return `Reacted with bread ${message.author.username}.`;
  },
});
