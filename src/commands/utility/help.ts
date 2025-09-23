import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "$src/customTypes.ts";
import { helpText } from "$src/utils.ts";

const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Gives a list of the non-slashcommands!"),

  execute: async (interaction) => {
    await interaction
      .reply({
        content: helpText,
        withResponse: true,
      })
      .then((response) => {
        console.log(`Helped "${interaction.user.username}".`);
      })
      .catch(console.error);
  },
};

export default slashCommand;
