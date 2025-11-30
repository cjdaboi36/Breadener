import type { NonSlashCommand } from "../customTypes.ts";

export const hasBread: NonSlashCommand = {
  name: "Bread :)",
  description: "Bread :)",
  command: "🍞",
  showInHelp: false,
  match: (message) => message.content.includes("🍞"),
  execute: async (message) => {
    await message.react("🍞");
    return `Reacted with bread ${message.author.username}.`;
  },
};
