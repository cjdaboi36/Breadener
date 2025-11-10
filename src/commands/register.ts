import breadenerLevels from "$static/breadenerLevels.json" with {
  type: "json",
};
import {
  type CacheType,
  type ChatInputCommandInteraction,
  GuildMember,
  type GuildMemberRoleManager,
  MessageFlags,
  type Role,
  SlashCommandBuilder,
  type User,
} from "discord.js";
import type { SlashCommand } from "../customTypes.ts";
import { db } from "../db.ts";
import { guildChecker } from "../utils.ts";

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

  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    if (
      !(interaction.guild && interaction.guild.id === "1383472184416272507")
    ) {
      await interaction
        .reply({
          content: "You cannot run this command here!",
          withResponse: true,
        })
        .then(() =>
          console.log(
            `\x1b[47m > \x1b[0m ${interaction.user.username} tried to fool the system, but turned out to be one themselves`,
          )
        )
        .catch(console.error);
      return;
    }

    const infector_: User = interaction.options.getUser("infector", true);
    // Get infector as GuildMember
    const infector: GuildMember = await interaction.guild.members.fetch(
      infector_.id,
    );

    // check whether infector is in the server:
    if (!infector) {
      await interaction
        .reply({
          content: "Your infector is not in this server!", // sounds like the other sentences so i'll go with it.
          withResponse: true,
        })
        .then(() =>
          console.log(
            `\x1b[47m > \x1b[0m ${interaction.user.username}'s isn't in the server`,
          )
        )
        .catch(console.error);
      return;
    }

    // Checks whether infector is the same is infected
    if (infector.id === interaction.user.id) {
      await interaction
        .reply({
          content: "You can't register yourself as your own infector buddy!", // sounds like the other sentences so i'll go with it.
          withResponse: true,
        })
        .then(() =>
          console.log(
            `\x1b[47m > \x1b[0m ${interaction.user.username} tried to fool the system, but turned out to be one themselves`,
          )
        )
        .catch(console.error);
      return;
    }

    const registerCount: { "COUNT(*)": number } = db
      .prepare("SELECT COUNT(*) FROM infections WHERE infectedId = ?")
      .get(interaction.user.id) ?? { "COUNT(*)": 0 }; // Checks whether command runner already has an entry

    if (registerCount["COUNT(*)"] !== 0) {
      await interaction
        .reply({
          content: "You can't register an infector twice buddy!",
          flags: MessageFlags.SuppressNotifications, // makes the message silent
          withResponse: true,
        })
        .then(() =>
          console.log(
            `\x1b[47m > \x1b[0m ${interaction.user.username} tried to fool the system, but turned out to be one themselves`,
          )
        )
        .catch(console.error);
      return;
    }

    db.prepare(
      "INSERT INTO infections (infectorId, infectedId) VALUES (?, ?)",
    ).run(infector.id, interaction.user.id);

    // Assign roles n stuff
    const breadCount: { "COUNT(*)": number } = db
      .prepare("SELECT COUNT(*) FROM infections WHERE infectorId = ?")
      .get(infector.id) ?? { "COUNT(*)": 0 }; // if it can't find anything, use 0

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
          `Registered <@${infector.id}> as the infector of <@${interaction.user.id}>.`,
        flags: MessageFlags.SuppressNotifications, // makes the message silent
        withResponse: true,
      })
      .then(() =>
        console.log(
          `\x1b[47m > \x1b[0m Registered "${infector.user.username}" as the infector of "${interaction.user.username}".`,
        )
      )
      .catch(console.error);
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

  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    if (
      !(interaction.guild && interaction.guild.id === "1383472184416272507"
        && interaction.member instanceof GuildMember)
    ) {
      await interaction
        .reply({
          content: "You cannot run this command here!",
          withResponse: true,
        })
        .then(() =>
          console.log(
            `\x1b[47m > \x1b[0m ${interaction.user.username} tried to fool the system, but turned out to be one themselves`,
          )
        )
        .catch(console.error);
      return;
    }

    // Collects all role IDs
    const rawRoleData: GuildMemberRoleManager = interaction.member.roles;
    const roleIDs: string[] = [];
    rawRoleData.cache.each(
      (value: Role) => {
        roleIDs.push(value.id);
      },
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
        .then(() =>
          console.log(
            `\x1b[47m > \x1b[0m ${interaction.user.username} was not permitted to use /register-non-joiner`,
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
          content: "You cannot infect yourself!",
          withResponse: true,
        })
        .then(() =>
          console.log(
            `\x1b[47m > \x1b[0m ${interaction.user.username} tried to infect themselves with /register-non-joiner`,
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
        .then(() =>
          console.log(
            `\x1b[47m > \x1b[0m ${interaction.user.username} tried to register infectedId ${infectedId}, but was already infected!`,
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
        flags: MessageFlags.SuppressNotifications,
        withResponse: true,
      })
      .then(() =>
        console.log(
          `\x1b[47m > \x1b[0m ${interaction.user.username} approved the infection of user "${infectedId}" by ${infector.user.username}`,
        )
      )
      .catch(console.error);
  },
};

export const slashDeregisterInfector: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("deregister")
    .setDescription(
      "deregister your infector in case you made a mistake or something",
    ),

  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    if (await guildChecker(interaction)) return;

    const breadCount: { "COUNT(*)": number } = db
      .prepare("SELECT COUNT(*) FROM infections WHERE infectedId = ?")
      .get(interaction.user.id) ?? { "COUNT(*)": 0 };

    let message: string = "Your entry cannot be removed if it doesn't exist!";
    let logMessage: string =
      `\x1b[47m > \x1b[0m ${interaction.user.username} tried to remove their infection entry that did not even exist!`;

    if (breadCount["COUNT(*)"] !== 0) {
      message =
        `Entry succesfully removed! You can now reassign your infector.`;
      logMessage =
        `\x1b[47m > \x1b[0m ${interaction.user.username}'s Entry succesfully removed.`;
      db.prepare(
        "DELETE FROM infections WHERE infectedId = ?",
      ).run(interaction.user.id);
    }

    await interaction
      .reply({
        content: message,
        flags: MessageFlags.SuppressNotifications,
        withResponse: true,
      })
      .then(() => console.log(logMessage))
      .catch(console.error);
  },
};
