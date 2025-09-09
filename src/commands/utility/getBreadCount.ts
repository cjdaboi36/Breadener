import { SlashCommandBuilder } from "discord.js";
import { db } from "../../db.ts";
import { SlashCommand } from "../../customTypes.ts";

const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("get-bread-count")
    .setDescription("See how many people someone has infected")
    .addUserOption((option) =>
      option
        .setName("username")
        .setDescription("give the username of the infector")
        .setRequired(true),
    ),

  execute: async (interaction) => {
    const username = interaction.options.getUser("username", true);
    // console.log(`id of person requested ${username.id} ${username.username}`);

    const thing: { "COUNT(*)": number } = db
      .prepare("SELECT COUNT(*) FROM infections WHERE infector_id = ?")
      .get(username.id) ?? { "COUNT(*)": 0 };

    const broodTeller = thing["COUNT(*)"];

    const message: string = `<@${username.id}> infected ${broodTeller} people!`;
    const logMessage: string = `"${username.username}" breaded ${broodTeller} people. Requested by "${interaction.user.username}"`;

    await interaction
      .reply({
        content: message,
        flags: [4096], // makes the message silent
        withResponse: true,
      })
      .then((response) => console.log(logMessage))
      .catch(console.error);
  },
};

export default slashCommand;
