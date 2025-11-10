import type { Message } from "discord.js";
import type { NonSlashCommand } from "../customTypes.ts";

export const ping: NonSlashCommand = {
  name: "Is the bot up?",
  match: (message: Message) =>
    /(I|i)s the bot up\??/g.exec(message.content) !== null,
  execute: (message: Message): void => {
    message.reply("Yezzir!");
    console.log(
      `\x1b[46m > \x1b[0m Reminded ${message.author.username} that the bot is up.`,
    );
  },
};
