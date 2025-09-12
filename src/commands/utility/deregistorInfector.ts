import { SlashCommandBuilder } from "discord.js";
import { db } from "../../db.ts";
import { SlashCommand } from "../../customTypes.ts";

const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("deregister")
    .setDescription(
      "deregister your infector in case you made a mistake or something",
    ),

  execute: async (interaction) => {
    const thing: { "COUNT(*)": number } = db
      .prepare("SELECT COUNT(*) FROM infections WHERE infected_id = ?")
      .get(interaction.user.id) ?? { "COUNT(*)": 0 };

    let message = "Your entry cannot be removed if it doesn't exist!";
    let logMessage =
      `${interaction.user.username} tried to remove their infection entry that did not even exist!`;

    if (thing["COUNT(*)"] !== 0) {
      message =
        `Entry succesfully removed! You can now reassign your infector.`;
      logMessage = `${interaction.user.username}'s Entry succesfully removed.`;
      db.prepare(
        "DELETE FROM infections WHERE infected_id = ?",
      ).run(interaction.user.id);
    }

    await interaction
      .reply({
        content: message,
        flags: [4096],
        withResponse: true,
      })
      .then((_response) => console.log(logMessage))
      .catch(console.error);
  },
};

export default slashCommand;
