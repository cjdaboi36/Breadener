import { GuildMemberRoleManager, SlashCommandBuilder } from "discord.js";
import { db } from "$src/db.ts";
import type { SlashCommand } from "$src/customTypes.ts";

const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("register-non-joiner")
    .setDescription("Register someone you infected but didn't join!")
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
    const infectedId = interaction.options.getString("infected_id", true);

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
          content: "You are not permitted to use this command! Perhaps you meant to run `/register` instead?",
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
      .prepare("SELECT COUNT(*) FROM infections WHERE infectedId = ?")
      .get(infectedId) ?? { "COUNT(*)": 0 }; // Checks whether infected person already has an entry

    if (_thing["COUNT(*)"] !== 0) {
      await interaction
        .reply({
          content: "This person already has an entry!",
          withResponse: true,
        })
        .then((_response) =>
          console.log(
            `${interaction.user.username} tried to register infectedId ${infectedId}, but was already infected!`,
          )
        )
        .catch(console.error);
      return;
    }

    // If the person is not yet in the db
    db.prepare(
      "INSERT INTO infections (infectorId, infectedId) VALUES (?, ?)",
    ).run(infector.id, infectedId);

    await interaction
      .reply({
        content:
          `Registered <@${infector.id}> as the infector of the user with user_id of "${infectedId}"`,
        flags: [4096], // makes the message silent
        withResponse: true,
      })
      .then((_response) =>
        console.log(
          `${interaction.user.username} approved the infection of user "${infectedId}" by ${infector.username}`,
        )
      )
      .catch(console.error);
  },
};

export default slashCommand;
