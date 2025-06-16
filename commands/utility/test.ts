import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("test")
  .setDescription("Replies with Boom!");

export async function execute(interaction) {
  // inside a command, event listener, etc.
  const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle("Some title")
    .setURL("https://discord.js.org/")
    .setAuthor({
      name: "Some name",
      iconURL: "https://i.imgur.com/AfFp7pu.png",
      url: "https://discord.js.org",
    })
    .setDescription("Some description here")
    .setThumbnail("https://i.imgur.com/AfFp7pu.png")
    .addFields(
      { name: "Regular field title", value: "Some value here 1" },
      { name: "\u200B", value: "\u200B" },
      {
        name: "Inline field title 1",
        value: "Some value here 1",
        inline: true,
      },
      {
        name: "Inline field title 2",
        value: "Some value here 2",
        inline: true,
      },
    )
    .addFields({
      name: "Inline field title 3",
      value: "Some value here 3",
      inline: true,
    })
    .setImage("https://i.imgur.com/AfFp7pu.png")
    .setTimestamp()
    .setFooter({
      text: "Some footer text here",
      iconURL: "https://i.imgur.com/AfFp7pu.png",
    });

  await interaction.reply({ embeds: [exampleEmbed] });
}
