import { SlashCommandBuilder } from "discord.js";
import { db } from "$src/db.ts";
import { SlashCommand } from "$src/customTypes.ts";

const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("get-bread-count")
    .setDescription("See how many people someone has infected")
    .addUserOption((option) =>
      option
        .setName("username")
        .setDescription("give the username of the infector")
        .setRequired(true)
    ),

  execute: async (interaction) => {
    const username = interaction.options.getUser("username", true);

    const thing: { "COUNT(*)": number } = db
      .prepare("SELECT COUNT(*) FROM infections WHERE infector_id = ?")
      .get(username.id) ?? { "COUNT(*)": 0 };

    const broodTeller = thing["COUNT(*)"];

    let message: string = `<@${username.id}> infected ${broodTeller} people!`;
    let logMessage: string =
      `"${username.username}" breaded ${broodTeller} people. Requested by "${interaction.user.username}"`;

    if (broodTeller === 1) {
      message = `<@${username.id}> infected 1 person!`;
      logMessage =
        `"${username.username}" breaded 1 person. Requested by "${interaction.user.username}"`;
    }

    await interaction
      .reply({
        content: message,
        flags: [4096], // makes the message silent
        withResponse: true,
      })
      .then((_response) => console.log(logMessage))
      .catch(console.error);
  },
};

export default slashCommand;
