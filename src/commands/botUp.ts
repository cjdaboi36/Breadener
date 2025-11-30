import type { Message } from "discord.js";
import type { NonSlashCommand } from "../customTypes.ts";

export const botUp: NonSlashCommand = {
  name: "Is the bot up?",
  description: "check whether the bot is up",
  command: /is the bot up\??/i,
  showInHelp: true,
  match: (message: Message) => message.content.match(botUp.command) !== null,
  execute: async (message) => {
    await message.reply("Yezzir!");
    console.log(
      `\x1b[46m > \x1b[0m Reminded ${message.author.username} that the bot is up.`,
    );
  },
};
