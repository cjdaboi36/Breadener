import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "$src/customTypes.ts";

const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Gives a list of the non-slashcommands!"),
  execute: async (interaction) => {
    const message = `\`.ping\` | Replies with pong!\n` +
      `\`Is @Breadener up?\` | Replies with affermation!\n`;

    await interaction
      .reply({
        content: message,
        withResponse: true,
      })
      .then((_response) =>
        console.log(`Helped "${interaction.user.username}".`)
      )
      .catch(console.error);
  },
};

export default slashCommand;
