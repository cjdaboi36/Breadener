import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../customTypes.ts";

const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Gives a list of the non-slashcommands!"),
  execute: async (interaction) => {
    const message = `
    .ping | Replies with pong!
    `;

    await interaction
      .reply({
        content: message,
        withResponse: true,
      })
      .then((response) => console.log(`Helped "${interaction.user.username}".`))
      .catch(console.error);
  },
};

export default slashCommand;
