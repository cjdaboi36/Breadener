import { type Message, SlashCommandBuilder } from "discord.js";
import type { NonSlashCommand, SlashCommand } from "../customTypes.ts";
import { helpText } from "../utils.ts";

export const help: NonSlashCommand = {
  name: ".help",
  match: (message: Message) => message.content === ".help",
  execute: (message: Message): void => {
    console.log(
      `\x1b[46m > \x1b[0m Helped ${message.author.username}.`,
    );
    message.reply(helpText);
  },
};

export const slashHelp: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Gives a list of the non-slashcommands!"),

  execute: async (interaction) => {
    await interaction
      .reply({
        content: helpText,
        withResponse: true,
      })
      .then(() => {
        console.log(
          `\x1b[47m > \x1b[0m Helped "${interaction.user.username}".`,
        );
      })
      .catch(console.error);
  },
};
