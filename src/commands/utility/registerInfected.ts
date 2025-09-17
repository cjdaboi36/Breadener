import { GuildMemberRoleManager, SlashCommandBuilder } from "discord.js";
import { db } from "../../db.ts";
import { SlashCommand } from "../../customTypes.ts";

const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("register-infected")
    .setDescription("Register your infector!")
    .addUserOption((option) =>
      option
        .setName("infector")
        .setDescription("give the infector user")
        .setRequired(true)
    ).addStringOption((option) =>
      option
        .setName("infected_id")
        .setDescription("give the user id")
        .setRequired(true)
    ),

  execute: async (interaction) => {
    const infector = interaction.options.getUser("infector", true);
    const infected_id = interaction.options.getString("infected_id", true);

    const rawRoleData = interaction.member?.roles;

    if (!(rawRoleData instanceof GuildMemberRoleManager)) {
      await interaction
        .reply({
          content: "You cannot run this command here.",
          withResponse: true,
        })
        .then((_response) => console.log("Nuh uh uh"))
        .catch(console.error);
      return;
    }

    const roleIDs: string[] = [];
    rawRoleData.cache.each(
      (value) => {
        roleIDs.push(value.id);
      },
    );

    if (
      !(roleIDs.includes("1383472356319559731") ||
        roleIDs.includes("1408239632822304900"))
    ) {
      await interaction
        .reply({
          content: "You are not permitted to use this command!",
          withResponse: true,
        })
        .then((_response) =>
          console.log(
            `${interaction.user.username} was not permitted to use /register-infector`,
          )
        )
        .catch(console.error);
      return;
    }

    const _thing: { "COUNT(*)": number } = db
      .prepare("SELECT COUNT(*) FROM infections WHERE infected_id = ?")
      .get(infected_id) ?? { "COUNT(*)": 0 }; // Checks whether infected person already has an entry

    if (_thing["COUNT(*)"] !== 0) {
      await interaction
        .reply({
          content: "This person already has an entry!",
          withResponse: true,
        })
        .then((_response) =>
          console.log(
            `${interaction.user.username} tried to register infected_id ${infected_id}, but was already infected!`,
          )
        )
        .catch(console.error);
      return;
    }

    // If the person is not yet in the db
    db.prepare(
      "INSERT INTO infections (infector_id, infected_id) VALUES (?, ?)",
    ).run(infector.id, infected_id);

    await interaction
      .reply({
        content:
          `Registered <@${infector.id}> as the infector of the user with user_id of "${infected_id}"`,
        flags: [4096], // makes the message silent
        withResponse: true,
      })
      .then((_response) =>
        console.log(
          `${interaction.user.username} approved the infection of user "${infected_id}" by ${infector.username}`,
        )
      )
      .catch(console.error);
  },
};

export default slashCommand;
