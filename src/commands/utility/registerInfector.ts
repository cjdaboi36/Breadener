import { type GuildMember, SlashCommandBuilder } from "discord.js";
import { db } from "$src/db.ts";
import type { SlashCommand } from "$src/customTypes.ts";
import { breadenerLevels } from "./getBreadenerLevel.ts";
import type { User } from "discord.js";

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
    if (
      !(interaction.guild && interaction.guild.id === "1383472184416272507")
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
        .then((_response) =>
          console.log(
            `${interaction.user.username}'s isn't in the server`,
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
        .then((_response) =>
          console.log(
            `${interaction.user.username} tried to fool the system, but turned out to be one themselves`,
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
          flags: [4096], // makes the message silent
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

    db.prepare(
      "INSERT INTO infections (infectorId, infectedId) VALUES (?, ?)",
    ).run(infector.id, interaction.user.id);

    // Assign roles n stuff
    const breadCount: { "COUNT(*)": number } = db
      .prepare("SELECT COUNT(*) FROM infections WHERE infectorId = ?")
      .get(infector.id) ?? { "COUNT(*)": 0 }; // if it can't find anything, use 0

    const index: number = Math.floor(Math.min(breadCount["COUNT(*)"], 48) / 12);

    // Adds the correct role (back)
    const newRoleId = breadenerLevels[index].id;
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
        flags: [4096], // makes the message silent
        withResponse: true,
      })
      .then((_response) =>
        console.log(
          `Registered "${infector.user.username}" as the infector of "${interaction.user.username}".`,
        )
      )
      .catch(console.error);
  },
};

export default slashCommand;
