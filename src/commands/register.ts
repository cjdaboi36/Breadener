import breadenerLevels from "$static/breadenerLevels.json" with {
  type: "json",
};
import {
  GuildMemberRoleManager,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import type { SlashCommand } from "../customTypes.ts";
import { db } from "../db.ts";
import { validGuildGuard } from "../utils.ts";

export const slashRegisterInfector: SlashCommand = {
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
    if (validGuildGuard(interaction)) {
      await interaction
        .reply({
          content: "You cannot run this command here!",
          withResponse: true,
        })
        .catch(console.error);
      return `${interaction.user.username} tried to fool the system, but turned out to be one themselves`;
    }

    // Get infector as GuildMember
    const infector = await interaction.guild?.members.fetch(
      interaction.options.getUser("infector", true).id,
    );

    // check whether infector is in the server:
    if (!infector) {
      await interaction
        .reply({
          content: "Your infector is not in this server!", // sounds like the other sentences so i'll go with it.
          withResponse: true,
        })
        .catch(console.error);
      return `${interaction.user.username}'s isn't in the server`;
    }

    // Checks whether infector is the same is infected
    if (infector.id === interaction.user.id) {
      await interaction
        .reply({
          content: "You can't register yourself as your own infector buddy!", // sounds like the other sentences so i'll go with it.
          withResponse: true,
        })
        .catch(console.error);
      return `${interaction.user.username} tried to fool the system, but turned out to be one themselves`;
    }

    const registerCount = db
      .sql`SELECT COUNT(*) FROM infections WHERE infectedId = ${interaction.user.id}`[
        0
      ]["COUNT(*)"] as number; // Checks whether command runner already has an entry

    if (registerCount !== 0) {
      await interaction
        .reply({
          content: "You can't register an infector twice buddy!",
          flags: MessageFlags.SuppressNotifications, // makes the message silent
          withResponse: true,
        })
        .catch(console.error);
      return `${interaction.user.username} tried to fool the system, but turned out to be one themselves`;
    }

    db.sql`INSERT INTO infections (infectorId, infectedId) VALUES (${infector.id}, ${interaction.user.id})`;

    // Assign roles to infector
    const breadCount = db
      .sql`SELECT COUNT(*) FROM infections WHERE infectorId = ${infector.id}`[
        0
      ]["COUNT(*)"] as number;

    const index = Math.floor(Math.min(breadCount, 48) / 12);

    // Adds the correct role (back)
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

    await interaction
      .reply({
        content:
          `Registered <@${infector.id}> as the infector of <@${interaction.user.id}>.`,
        flags: MessageFlags.SuppressNotifications, // makes the message silent
        withResponse: true,
      })
      .catch(console.error);
    return `Registered "${infector.user.username}" as the infector of "${interaction.user.username}".`;
  },
};

export const slashRegisterInfected: SlashCommand = {
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
      return `${interaction.user.username} tried to fool the system, but turned out to be one themselves`;
    }

    // Collects all role IDs
    const rawRoleData = interaction.member?.roles;
    if (!(rawRoleData instanceof GuildMemberRoleManager)) {
      // This will never happen
      return `How did this run this should never run?!`;
    }

    const roleIDs: string[] = [];
    rawRoleData.cache.each(
      (role) => roleIDs.push(role.id),
    );

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
      return `${interaction.user.username} was not permitted to use /register-non-joiner`;
    }

    const infectedId = interaction.options.getString(
      "infected_id",
      true,
    );
    const infector = await interaction.guild?.members.fetch(
      interaction.options.getUser("infector", true).id,
    );

    if (!infector) {
      // This will never happen
      return `How did this run this should never run?!`;
    }

    if (infectedId === infector.id) {
      await interaction
        .reply({
          content: "You cannot infect yourself!",
          withResponse: true,
        })
        .catch((err) => console.error(err));
      return `${interaction.user.username} tried to infect themselves with /register-non-joiner`;
    }

    // Checks whether infected person already has an entry
    const infectedEntry: number = db
      .sql`SELECT COUNT(*) FROM infections WHERE infectedId = ${infectedId}`[0][
        "COUNT(*)"
      ] ?? 0;

    if (infectedEntry !== 0) {
      await interaction
        .reply({
          content: "This person already has an entry!",
          withResponse: true,
        })
        .catch((err) => console.error(err));
      return `${interaction.user.username} tried to register infectedId ${infectedId}, but was already infected!`;
    }

    // If the person is not yet in the db
    db.sql`INSERT INTO infections (infectorId, infectedId) VALUES (${infector.user.id}, ${infectedId})`;

    // Assign roles n stuff
    const breadCount: number = db
      .sql`SELECT COUNT(*) FROM infections WHERE infectorId = ${infector.user.id}`[
        0
      ]["COUNT(*)"] ?? 0; // if it can't find anything, use 0
    const index = Math.floor(Math.min(breadCount, 48) / 12);

    // Adds the correct role (back)
    const newRoleId = breadenerLevels[index].id;
    infector.roles.add(
      newRoleId,
      `New breadener level role: ${breadenerLevels[index].level}`,
    );
    console.log(`New breadener level role: ${breadenerLevels[index].level}`);

    // Removes all Breadener Roles except the correct one
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
    return `${interaction.user.username} approved the infection of user "${infectedId}" by ${infector.user.username}`;
  },
};

export const slashDeregisterInfector: SlashCommand = {
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
      return `${interaction.user.username} tried to fool the system, but turned out to be one themselves`;
    }

    const breadCount: number = db
      .sql`SELECT COUNT(*) FROM infections WHERE infectedId = ${interaction.user.id}`[
        0
      ]["COUNT(*)"] ?? 0;

    if (breadCount === 0) {
      await interaction
        .reply({
          content: "Your entry cannot be removed if it doesn't exist!",
          flags: MessageFlags.SuppressNotifications,
          withResponse: true,
        })
        .catch((err) => console.error(err));
      return `${interaction.user.username} tried to remove their infection entry that did not even exist`;
    }

    db.sql`DELETE FROM infections WHERE infectedId = ${interaction.user.id}`;

    await interaction
      .reply({
        content:
          `Entry succesfully removed! You can now reassign your infector.`,
        flags: MessageFlags.SuppressNotifications,
        withResponse: true,
      })
      .catch(console.error);
    return `${interaction.user.username}'s Entry succesfully removed.`;
  },
};
