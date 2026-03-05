import breadenerLevels from "$static/breadenerLevels.json" with {
  type: "json"
};
import {
  GuildMemberRoleManager,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { db } from "../db.ts";
import { SlashCommand } from "../types.ts";
import { validGuildGuard } from "../utils.ts";

export const slashRegisterInfector = new SlashCommand({
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
    if (!validGuildGuard(interaction)) {
      await interaction
        .reply({
          content: "You cannot run this command here!",
          withResponse: true,
        })
        .catch((err) => console.error(err));
      return `${interaction.user.username} used /register, but wasn't in the server`;
    }

    const infector = await interaction.guild?.members.fetch(
      interaction.options.getUser("infector", true).id,
    );

    if (!infector) {
      await interaction
        .reply({
          content: "Your infector is not in this server!",
          withResponse: true,
        })
        .catch((err) => console.error(err));
      return `${interaction.user.username} used /register, but the infector wasn't in the server`;
    }

    if (infector.id === interaction.user.id) {
      await interaction
        .reply({
          content: "You can't register yourself as yours infector buddy!",
          withResponse: true,
        })
        .catch((err) => console.error(err));
      return `${interaction.user.username} used /register, but tried to register themselves`;
    }

    const registerCount = (
      db.sql`SELECT COUNT(*) FROM infections WHERE infectedId = ${interaction.user.id}`[
        0
      ]["COUNT(*)"] ?? 0
    ) as number;

    // Check whether infected already has an entry
    if (registerCount !== 0) {
      await interaction
        .reply({
          content: "You can't register an infector twice buddy!",
          flags: MessageFlags.SuppressNotifications,
          withResponse: true,
        })
        .catch((err) => console.error(err));
      return `${interaction.user.username} used /register [${infector.user.username}], but already has an entry`;
    }

    db.sql`INSERT INTO infections (infectorId, infectedId) VALUES (${infector.id}, ${interaction.user.id})`;

    const breadCount = (
      db.sql`SELECT COUNT(*) FROM infections WHERE infectorId = ${infector.id}`[
        0
      ]["COUNT(*)"] ?? 0
    ) as number;

    const index = Math.floor(Math.min(breadCount, 48) / 12);

    try {
      const newRoleId = breadenerLevels[index].id;
      infector.roles.add(
        newRoleId,
        `New breadener level role: ${breadenerLevels[index].level}`,
      );

      // Removes all Breadener Roles except the correct one
      for (let i = 0; i <= 4; i++) {
        if (breadenerLevels[i].id !== newRoleId) {
          infector.roles.remove(breadenerLevels[i].id);
        }
      }
    } catch (err) {
      console.error(err);
      await interaction
        .reply({
          content:
            `Something went wrong while giving you your new roles! The infector count however, has been updated.`,
          flags: MessageFlags.SuppressNotifications,
          withResponse: true,
        })
        .catch((err) => console.error(err));
      return `${interaction.user.username} used /register [${infector.user.username}], but something went wrong while updating roles`;
    }

    await interaction
      .reply({
        content:
          `Registered <@${infector.id}> as the infector of <@${interaction.user.id}>.`,
        flags: MessageFlags.SuppressNotifications,
        withResponse: true,
      })
      .catch((err) => console.error(err));
    return `${interaction.user.username} used /register [${infector.user.username}]`;
  },
});

export const slashRegisterInfected = new SlashCommand({
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
    if (!validGuildGuard(interaction)) {
      await interaction
        .reply({
          content: "You cannot run this command here!",
          withResponse: true,
        })
        .catch((err) => console.error(err));
      return `${interaction.user.username} used /register-non-joiner, but in somewhere invalid`;
    }

    // Collects all role IDs
    const rawRoleData = interaction.member?.roles;
    if (!(rawRoleData instanceof GuildMemberRoleManager)) {
      await interaction
        .reply({
          content: "Something went wrong!",
          withResponse: true,
        })
        .catch((err) => console.error(err));
      return `${interaction.user.username} used /register-non-joiner, but something went wrong while checking their perms`;
    }

    const roleIDs = rawRoleData.cache.map((role) => role.id);

    // Checks whether command is being ran by a mod
    if (
      !(roleIDs.includes("1383472356319559731")
        || roleIDs.includes("1408239632822304900"))
    ) {
      await interaction
        .reply({
          content:
            "You are not permitted to use this command! Perhaps you meant to run `/register` instead?",
          withResponse: true,
        })
        .catch((err) => console.error(err));
      return `${interaction.user.username} used /register-non-joiner, but was not permitted to`;
    }

    const infectedId = interaction.options.getString("infected_id", true);
    const infector = await interaction.guild?.members.fetch(
      interaction.options.getUser("infector", true).id,
    );

    if (!infector) {
      await interaction
        .reply({
          content: "Your infector isn't in the server!",
        })
        .catch((err) => console.error(err));
      return `${interaction.user.username} used /register-non-joiner, but the infector wasn't in the server`;
    }

    if (infectedId === infector.id) {
      await interaction
        .reply({
          content: "You cannot infect yourself!",
          withResponse: true,
        })
        .catch((err) => console.error(err));
      return `${interaction.user.username} used /register-non-joiner, but tried to infect themselves`;
    }

    // Checks whether infected person already has an entry
    const infectedEntry = (
      db.sql`SELECT COUNT(*) FROM infections WHERE infectedId = ${infectedId}`[
        0
      ]["COUNT(*)"] ?? 0
    ) as number;

    if (infectedEntry !== 0) {
      await interaction
        .reply({
          content: "This person already has an entry!",
          withResponse: true,
        })
        .catch((err) => console.error(err));
      return `${interaction.user.username} used /register-non-joiner, but the infected already had an entry`;
    }

    db.sql`INSERT INTO infections (infectorId, infectedId) VALUES (${infector.user.id}, ${infectedId})`;

    const breadCount = (
      db.sql`SELECT COUNT(*) FROM infections WHERE infectorId = ${infector.user.id}`[
        0
      ]["COUNT(*)"] ?? 0
    ) as number;
    const index = Math.floor(Math.min(breadCount, 48) / 12);

    const newRoleId = breadenerLevels[index].id;
    infector.roles.add(
      newRoleId,
      `New breadener level role: ${breadenerLevels[index].level}`,
    );

    console.log(`New breadener level role: ${breadenerLevels[index].level}`);

    for (let i = 0; i <= 4; i++) {
      if (breadenerLevels[i].id !== newRoleId) {
        infector.roles.remove(breadenerLevels[i].id);
      }
    }

    await interaction
      .reply({
        content:
          `Registered <@${infector.id}> as the infector of the user with user_id of "${infectedId}"`,
        flags: MessageFlags.SuppressNotifications,
        withResponse: true,
      })
      .catch((err) => console.error(err));
    return `${interaction.user.username} used /register-non-joiner [${infector.user.username}] [${infectedId}]`;
  },
});

export const slashDeregister = new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("deregister")
    .setDescription(
      "deregister your infector in case you made a mistake or something",
    ),
  execute: async (interaction) => {
    if (!validGuildGuard(interaction)) {
      await interaction
        .reply({
          content: "You cannot run this command here!",
          withResponse: true,
        })
        .catch((err) => console.error(err));
      return `${interaction.user.username} used /register-non-joiner, but in somewhere invalid`;
    }

    const breadCount = (
      db.sql`SELECT COUNT(*) FROM infections WHERE infectedId = ${interaction.user.id}`[
        0
      ]["COUNT(*)"] ?? 0
    ) as number;

    if (breadCount === 0) {
      await interaction
        .reply({
          content: "Your entry cannot be removed if it doesn't exist!",
          flags: MessageFlags.SuppressNotifications,
          withResponse: true,
        })
        .catch((err) => console.error(err));
      return `${interaction.user.username} used /deregister, but doesn't have an infection entry`;
    }

    db.sql`DELETE FROM infections WHERE infectedId = ${interaction.user.id}`;

    await interaction
      .reply({
        content:
          `Entry succesfully removed! You can now reassign your infector.`,
        flags: MessageFlags.SuppressNotifications,
        withResponse: true,
      })
      .catch((err) => console.error(err));
    return `${interaction.user.username} used /register-non-joiner`;
  },
});
