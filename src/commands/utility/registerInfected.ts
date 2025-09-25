import {
  GuildMember,
  type GuildMemberRoleManager,
  SlashCommandBuilder,
  type User,
} from "discord.js";
import { db } from "$src/db.ts";
import type { SlashCommand } from "$src/customTypes.ts";
import { breadenerLevels } from "./getBreadenerLevel.ts";

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
    if (
      !(interaction.guild && interaction.guild.id === "1383472184416272507" &&
        interaction.member instanceof GuildMember)
    ) {
      await interaction
        .reply({
          content: "You cannot run this command here!",
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

    // Collects all role IDs
    const rawRoleData: GuildMemberRoleManager = interaction.member.roles;
    const roleIDs: string[] = [];
    rawRoleData.cache.each(
      (value) => {
        roleIDs.push(value.id);
      },
    );

    // Checks whether command is being ran by a mod
    if (
      !(roleIDs.includes("1383472356319559731") ||
        roleIDs.includes("1408239632822304900"))
    ) {
      await interaction
        .reply({
          content:
            "You are not permitted to use this command! Perhaps you meant to run `/register` instead?",
          withResponse: true,
        })
        .then((_response) =>
          console.log(
            `${interaction.user.username} was not permitted to use /register-non-joiner`,
          )
        )
        .catch(console.error);
      return;
    }

    const infector_: User = interaction.options.getUser("infector", true);
    const infectedId: string = interaction.options.getString(
      "infected_id",
      true,
    );
    const infector: GuildMember = await interaction.guild?.members.fetch(
      infector_.id,
    );

    if (
      infectedId === infector.id
    ) {
      await interaction
        .reply({
          content:
            "You cannot infect yourself!",
          withResponse: true,
        })
        .then((_response) =>
          console.log(
            `${interaction.user.username} tried to infect themselves with /register-non-joiner`,
          )
        )
        .catch(console.error);
      return;
    }

    // Checks whether infected person already has an entry
    const infectedEntry: { "COUNT(*)": number } = db
      .prepare("SELECT COUNT(*) FROM infections WHERE infectedId = ?")
      .get(infectedId) ?? { "COUNT(*)": 0 };

    if (infectedEntry["COUNT(*)"] !== 0) {
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
    ).run(infector.user.id, infectedId);

    // Assign roles n stuff
    const breadCount: { "COUNT(*)": number } = db
      .prepare("SELECT COUNT(*) FROM infections WHERE infectorId = ?")
      .get(infector.user.id) ?? { "COUNT(*)": 0 }; // if it can't find anything, use 0

    const index: number = Math.floor(Math.min(breadCount["COUNT(*)"], 48) / 12);

    // Adds the correct role (back)
    const newRoleId: string = breadenerLevels[index].id;
    infector.roles.add(
      newRoleId,
      `New breadener level role: ${breadenerLevels[index].level}`,
    );
    console.log(`New breadener level role: ${breadenerLevels[index].level}`);

    // Removes all Breadener Roles except the correct one
    for (let i: number = 0; i <= 4; i++) {
      if (breadenerLevels[i].id === newRoleId) continue;
      infector.roles.remove(breadenerLevels[i].id);
    }

    await interaction
      .reply({
        content:
          `Registered <@${infector.id}> as the infector of the user with user_id of "${infectedId}"`,
        flags: [4096], // makes the message silent
        withResponse: true,
      })
      .then((_response) =>
        console.log(
          `${interaction.user.username} approved the infection of user "${infectedId}" by ${infector.user.username}`,
        )
      )
      .catch(console.error);
  },
};

export default slashCommand;
