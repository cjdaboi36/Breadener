import { NonSlashCommand } from "../types.ts";
import { logError } from "../utils.ts";

export const botUp = new NonSlashCommand({
  name: "Is the bot up?",
  description: "check whether the bot is up",
  command: /^is (the bot|<@1383534555960442880>) up\??$/i,
  showInHelp: true,
  match(message): boolean {
    return Boolean(message.content.match(botUp.command));
  },
  execute: async (message) => {
    await message.reply({ content: "Yezzir!" }).catch(logError);
    return `${message.author.username} used Is the bot up?: Command succesful.`;
  },
});
