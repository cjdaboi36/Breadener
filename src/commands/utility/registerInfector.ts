import { SlashCommandBuilder } from "discord.js";
import { db } from "../../db.ts";

export const data = new SlashCommandBuilder()
  .setName("register")
  .setDescription("Register your infector!")
  .addUserOption((option) =>
    option
      .setName("username")
      .setDescription("give the preferred username")
      .setRequired(true),
  );

export async function execute(interaction) {
  const person = interaction.options.getUser("username");

  if (person.id === interaction.user.id) {
    await interaction
      .reply({
        content: "You can't register yourself as your own infector buddy!", // sounds like the other sentences so i'll go with it.
        flags: [4096],
        withResponse: true,
      })
      .then((response) => console.log(logMessage))
      .catch(console.error);
  }

  const thing: { "COUNT(*)": number } = db
    .prepare("SELECT COUNT(*) FROM infections WHERE infected_id = ?")
    .get(interaction.user.id) ?? { "COUNT(*)": 0 };

  let message = "You can't register an infector twice buddy!";
  let logMessage = `${interaction.user.username} tried to fool the system, but turned out to be one themself`;

  if (thing["COUNT(*)"] > 1) {
    message = `Registered "${person.username}" as the infector of "${interaction.user.username}".`;
    logMessage = `Registered "${person.username}" as the infector of "${interaction.user.username}".`;

    db.prepare(
      "INSERT INTO infections (infector_id, infected_id) VALUES (?, ?)",
    ).run(person.id, interaction.user.id);
  }

  await interaction
    .reply({
      content: message,
      flags: [4096],
      withResponse: true,
    })
    .then((response) => console.log(logMessage))
    .catch(console.error);
}
