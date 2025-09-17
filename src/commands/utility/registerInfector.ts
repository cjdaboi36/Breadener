import { SlashCommandBuilder } from "discord.js";
import { db } from "../../db.ts";
import { SlashCommand } from "../../customTypes.ts";

const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register your infector!")
    .addUserOption((option) =>
      option
        .setName("infector")
        .setDescription("give the preferred username")
        .setRequired(true)
    ),

  execute: async (interaction) => {
    const infector = interaction.options.getUser("infector", true);

    if (infector.id === interaction.user.id) {
      await interaction
        .reply({
          content: "You can't register yourself as your own infector buddy!", // sounds like the other sentences so i'll go with it.
          withResponse: true,
        })
        .then((_response) =>
          console.log(
            `${interaction.user.username} tried to fool the system, but turned out to be one themselves`,
          )
        )
        .catch(console.error);
      return;
    }

    let message = "You can't register an infector twice buddy!";
    let logMessage =
      `${interaction.user.username} tried to fool the system, but turned out to be one themselves`;

    const thing: { "COUNT(*)": number } = db
      .prepare("SELECT COUNT(*) FROM infections WHERE infected_id = ?")
      .get(interaction.user.id) ?? { "COUNT(*)": 0 }; // Checks whether command runner already has an entry

    if (thing["COUNT(*)"] === 0) {
      message =
        `Registered <@${infector.id}> as the infector of <@${interaction.user.id}>.`;
      logMessage =
        `Registered "${infector.username}" as the infector of "${interaction.user.username}".`;

      db.prepare(
        "INSERT INTO infections (infector_id, infected_id) VALUES (?, ?)",
      ).run(infector.id, interaction.user.id);
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
