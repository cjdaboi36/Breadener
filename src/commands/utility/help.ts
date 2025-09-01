import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Gives a list of the non-slashcommands!");

export async function execute(interaction) {

  const message = `
    .ping | Replies with pong!
    `

  await interaction
    .reply({
      content: message,
      withResponse: true,
    })
    .then((response) => console.log(`Helped "${interaction.user.username}".`))
    .catch(console.error);
}
