import type { NonSlashCommand } from "../customTypes.ts";

export const botUp: NonSlashCommand = {
  name: "Is the bot up?",
  description: "check whether the bot is up",
  command: /^is (the bot|<@1383534555960442880>) up\??$/i,
  showInHelp: true,
  match: (message) => Boolean(message.content.match(botUp.command)),
  execute: async (message) => {
    await message.reply("Yezzir!");
    return `Reminded ${message.author.username} that the bot is up.`;
  },
};
