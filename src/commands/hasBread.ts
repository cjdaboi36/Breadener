import type { Message } from "discord.js";
import type { NonSlashCommand } from "../customTypes.ts";

export const ping: NonSlashCommand = {
  name: "Is the bot up?",
  match: (message: Message) => message.content.includes("🍞"),
  execute: (message: Message): void => {
    message.react("🍞");
    console.log(
      `\x1b[46m > \x1b[0m Reacted with bread ${message.author.username}.`,
    );
  },
};
