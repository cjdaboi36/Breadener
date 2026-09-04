import breadenerLevels from "$static/breadenerLevels.json" with {
  type: "json",
};
import {
  GuildMember,
  GuildMemberRoleManager,
  type InteractionReplyOptions,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../types.ts";
import { validGuildGuard } from "../utils.ts";

// Todo: assign role function
// Todo: register function for /register and /register-non-joiner

async function registerInfection(
  db: Deno.Kv,
  infector: GuildMember,
  infected: { username: string; id: string },
): Promise<{ logMessage: string; options: InteractionReplyOptions }> {
  if (infector.user.id === infected.id) {
    return {
      logMessage:
        `${infected.username} used /register, but tried to register themselves`,
      options: {
        content: "You can't register yourself as yours infector buddy!",
        withResponse: true,
      },
    };
  }

  // Unless someone with infectedId 0 shows up this will work
  const isRegistered = await db.get<number>([
    "infections",
    infected.id,
  ]);

  // Check whether infected already has an entry
  if (!isRegistered.versionstamp) {
    return {
      logMessage:
        `${infected.username} used /register [${infector.user.username}], but already has an entry`,
      options: {
        content: "Error: something went wrong checking infections",
        flags: MessageFlags.SuppressNotifications,
        withResponse: true,
      },
    };
  }

  // Check whether infected already has an entry
  if (isRegistered.value) {
    return {
      logMessage:
        `${infected.username} used /register [${infector.user.username}], but already has an entry`,
      options: {
        content: "You can't register an infector twice buddy!",
        flags: MessageFlags.SuppressNotifications,
        withResponse: true,
      },
    };
  }

  const insertInfection = await db.set(
    ["infections", infected.id],
    infector.id,
  );

  if (!insertInfection.ok) {
    return {
      logMessage:
        `${infected.username} used /register [${infector.user.username}], but something went wrong while writing infection data`,
      options: {
        content:
          `Something went wrong while writing to database values: infections ${infected.id} ${infector.id}`,
        withResponse: true,
      },
    };
  }

  const getAllInfections = await db.get<number>([
    "infectionCount",
    infector.id,
  ]);

  const newInfectionsCount = getAllInfections.value ?? 0 + 1;
  const updateInfectionCount = await db.set(
    ["infectionsCount", infector.id],
    newInfectionsCount,
  );

  if (!updateInfectionCount.ok) {
    return {
      options: {
        content: "Something went wrong while updating infection count",
        withResponse: true,
      },
      logMessage:
        `${infected.username} used /register [${infector.user.username}], but something went wrong while writing infection count data`,
    };
  }

  const index = Math.floor(Math.min(newInfectionsCount, 48) / 12);

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
    return {
      logMessage:
        `${infected.username} used /register [${infector.user.username}], but something went wrong while updating roles`,
      options: {
        content:
          `Something went wrong while giving you your new roles! The infector count however, has been updated.`,
        flags: MessageFlags.SuppressNotifications,
        withResponse: true,
      },
    };
  }

  return {
    logMessage: `${infected.username} used /register [${infector.user.username}]`,
    options: {
      content:
        `Registered <@${infector.id}> as the infector of <@${infected.id}>.`,
      flags: MessageFlags.SuppressNotifications,
      withResponse: true,
    },
  };
}

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
      await interaction.reply({
        content: "You cannot run this command here!",
        withResponse: true,
      }).catch((err) => console.error(err));
      return `${interaction.user.username} used /register, but wasn't in the server`;
    }

    const infector = await interaction.guild?.members.fetch(
      interaction.options.getUser("infector", true).id,
    );

    if (!infector) {
      await interaction.reply({
        content: "Your infector is not in this server!",
        withResponse: true,
      }).catch((err) => console.error(err));
      return `${interaction.user.username} used /register, but the infector wasn't in the server`;
    }

    if (infector.id === interaction.user.id) {
      await interaction.reply({
        content: "You can't register yourself as yours infector buddy!",
        withResponse: true,
      }).catch((err) => console.error(err));
      return `${interaction.user.username} used /register, but tried to register themselves`;
    }

    const db = await Deno.openKv(Deno.env.get("DATABASE_PATH")!);

    // Unless someone with infectedId 0 shows up this will work
    const isRegistered = await db.get<number>([
      "infections",
      interaction.user.id,
    ]);

    // Check whether infected already has an entry
    if (!isRegistered.versionstamp) {
      db.close();
      await interaction.reply({
        content: "Error: something went wrong checking infections",
        flags: MessageFlags.SuppressNotifications,
        withResponse: true,
      }).catch((err) => console.error(err));
      return `${interaction.user.username} used /register [${infector.user.username}], but already has an entry`;
    }

    // Check whether infected already has an entry
    if (isRegistered.value) {
      db.close();
      await interaction.reply({
        content: "You can't register an infector twice buddy!",
        flags: MessageFlags.SuppressNotifications,
        withResponse: true,
      }).catch((err) => console.error(err));
      return `${interaction.user.username} used /register [${infector.user.username}], but already has an entry`;
    }

    const insertInfection = await db.set(
      ["infections", interaction.user.id],
      infector.id,
    );

    if (!insertInfection.ok) {
      db.close();
      await interaction.reply({
        content:
          `Something went wrong while writing to database values: infections ${interaction.user.id} ${infector.id}`,
        withResponse: true,
      }).catch((err) => console.error(err));
      return `${interaction.user.username} used /register [${infector.user.username}], but something went wrong while writing infection data`;
    }

    const getAllInfections = await db.get<number>([
      "infectionCount",
      infector.id,
    ]);

    const newInfectionsCount = getAllInfections.value ?? 0 + 1;
    const updateInfectionCount = await db.set(
      ["infectionsCount", infector.id],
      newInfectionsCount,
    );

    db.close();

    if (!updateInfectionCount.ok) {
      await interaction.reply({
        content: "Something went wrong while updating infection count",
        withResponse: true,
      }).catch((err) => console.error(err));
      return `${interaction.user.username} used /register [${infector.user.username}], but something went wrong while writing infection count data`;
    }

    const index = Math.floor(Math.min(newInfectionsCount, 48) / 12);

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

    await interaction.reply({
      content:
        `Registered <@${infector.id}> as the infector of <@${interaction.user.id}>.`,
      flags: MessageFlags.SuppressNotifications,
      withResponse: true,
    }).catch((err) => console.error(err));
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
      await interaction.reply({
        content:
          "You are not permitted to use this command! Perhaps you meant to run `/register` instead?",
        withResponse: true,
      }).catch((err) => console.error(err));
      return `${interaction.user.username} used /register-non-joiner, but was not permitted to`;
    }

    const infectedId = interaction.options.getString("infected_id", true);
    const infector = await interaction.guild?.members.fetch(
      interaction.options.getUser("infector", true).id,
    );

    if (!infector) {
      await interaction.reply({
        content: "Your infector isn't in the server!",
      }).catch((err) => console.error(err));
      return `${interaction.user.username} used /register-non-joiner, but the infector wasn't in the server`;
    }

    if (infectedId === infector.id) {
      await interaction.reply({
        content: "You cannot infect yourself!",
        withResponse: true,
      }).catch((err) => console.error(err));
      return `${interaction.user.username} used /register-non-joiner, but tried to infect themselves`;
    }

    const db = await Deno.openKv(Deno.env.get("DATABASE_PATH"));

    // Checks whether infected person already has an entry
    const infectedEntry = await db.get(["infections", infectedId]);

    if (!infectedEntry.versionstamp) {
      await interaction.reply({
        content: "This person already has an entry!",
        withResponse: true,
      }).catch((err) => console.error(err));
      return `${interaction.user.username} used /register-non-joiner, but the infected already had an entry`;
    }

    const insertInfection = await db.set(
      ["infections", interaction.user.id],
      infector.id,
    );

    if (!insertInfection.ok) {
      db.close();
      await interaction.reply({
        content:
          `Something went wrong while writing to database values: infections ${interaction.user.id} ${infector.id}`,
        withResponse: true,
      }).catch((err) => console.error(err));
      return `${interaction.user.username} used /register [${infector.user.username}], but something went wrong while writing infection data`;
    }

    const getAllInfections = await db.get<number>([
      "infectionCount",
      infector.id,
    ]);

    const newInfectionsCount = getAllInfections.value ?? 0 + 1;
    const updateInfectionCount = await db.set(
      ["infectionsCount", infector.id],
      newInfectionsCount,
    );

    db.close();

    if (!updateInfectionCount.ok) {
      await interaction.reply({
        content: "Something went wrong while updating infection count",
        withResponse: true,
      }).catch((err) => console.error(err));
      return;
    }

    const index = Math.floor(Math.min(newInfectionsCount, 48) / 12);

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

    await interaction.reply({
      content:
        `Registered <@${infector.id}> as the infector of the user with user_id of "${infectedId}"`,
      flags: MessageFlags.SuppressNotifications,
      withResponse: true,
    }).catch((err) => console.error(err));
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
      await interaction.reply({
        content: "You cannot run this command here!",
        withResponse: true,
      }).catch((err) => console.error(err));
      return `${interaction.user.username} used /register-non-joiner, but in somewhere invalid`;
    }

    const db = await Deno.openKv(Deno.env.get("DATABASE_PATH"));
    const infectionEntry = await db.get<number>([
      "infections",
      interaction.user.id,
    ]);

    if (!infectionEntry.versionstamp) {
      db.close();
      await interaction.reply({
        content: "Your entry cannot be removed if it doesn't exist!",
        flags: MessageFlags.SuppressNotifications,
        withResponse: true,
      }).catch((err) => console.error(err));
      return `${interaction.user.username} used /deregister, but doesn't have an infection entry`;
    }

    await db.delete(["infections", interaction.user.id]);

    const getInfectionsCount = await db.get<number>([
      "infectionCount",
      infectionEntry.value,
    ]);

    if (!getInfectionsCount.versionstamp) {
      db.close();
      await interaction.reply({
        content: "What the fuck this shouldn't ever happen",
        flags: MessageFlags.SuppressNotifications,
        withResponse: true,
      }).catch((err) => console.error(err));
      return `${interaction.user.username} used /deregister, but shit happens`;
    }

    const newInfectionsCount = getInfectionsCount.value + 1;
    const updateInfectionCount = await db.set(
      ["infectionsCount", infectionEntry.value],
      newInfectionsCount,
    );

    await interaction.reply({
      content: `Entry succesfully removed! You can now reassign your infector.`,
      flags: MessageFlags.SuppressNotifications,
      withResponse: true,
    }).catch((err) => console.error(err));
    return `${interaction.user.username} used /register-non-joiner`;
  },
});
