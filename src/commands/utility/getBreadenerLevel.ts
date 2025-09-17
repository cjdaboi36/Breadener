import { GuildMemberRoleManager, SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../../customTypes.ts";
import { db } from "../../db.ts";
import { Guild } from "discord.js";

type LevelBase = {
  level: string;
  id: string;
  emoji: string;
};

type Level =
  | (LevelBase & {
    threshold?: never;
    nextLevel?: never;
  })
  | (LevelBase & {
    threshold: number;
    nextLevel: string;
  });

const breadenerLevels: Level[] = [
  {
    level: "Breadener I",
    id: "1383476387742224414",
    emoji: "🌾",
    threshold: 12,
    nextLevel: "Breadener II",
  },
  {
    level: "Breadener II",
    id: "1388880579612639364",
    emoji: "🍚",
    threshold: 24,
    nextLevel: "Breadener III",
  },
  {
    level: "Breadener III",
    id: "1388880622151405630",
    emoji: "🥐",
    threshold: 36,
    nextLevel: "Breadener IV",
  },
  {
    level: "Breadener VI",
    id: "1388880671480610876",
    emoji: "🍞",
    threshold: 48,
    nextLevel: "Breadener V",
  },
  {
    level: "Breadener V",
    id: "1388880705081311312",
    emoji: "🥖",
  },
] as const;

const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("get-breadener-level")
    .setDescription("See the breadener level of someone")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("give the username of the infector")
        .setRequired(true)
    ),
  execute: async (interaction) => {
    const user = interaction.options.getUser("user", true);

    if (
      !(interaction.guild instanceof Guild &&
        interaction.member?.roles instanceof GuildMemberRoleManager)
    ) {
      await interaction
        .reply({
          content: "You cannot run this command here.",
          withResponse: true,
        })
        .then((_response) => console.log("Nuh uh uh"))
        .catch(console.error);
      return;
    }

    const userMember = await interaction.guild.members.fetch(user.id);

    // Get the roles of the person
    const roleIDs: string[] = [];
    userMember.roles.cache.each(
      (value) => {
        roleIDs.push(value.id);
      },
    );

    let thing: { "COUNT(*)": number } | undefined = db
      .prepare("SELECT COUNT(*) FROM infections WHERE infector_id = ?")
      .get(user.id);
    thing = thing ?? { "COUNT(*)": 0 }; // if it can't find anything, use 0

    const breadCount = thing["COUNT(*)"];
    let index: number = Math.floor(breadCount / 12);

    if (49 <= breadCount) index = 4;

    const levelProgress: number = breadCount % 12;
    const progressBar = "█".repeat(levelProgress) +
      "░".repeat(12 - levelProgress);

    let progressText: string;

    if (!("nextLevel" in breadenerLevels[index])) {
      progressText = `📊 You are at the maximum level!\n` +
        `📈 ${"█".repeat(12)} 100%\n`;
    } else {
      progressText =
        `📊 Progress: ${breadCount}/${breadenerLevels[index].threshold} until ${
          breadenerLevels[index].nextLevel
        }\n` +
        `📈 ${progressBar} ${Math.floor((levelProgress / 12) * 100)}%\n`;
    }

    const message =
      `**${user}** is a **${breadenerLevels[index].emoji} ${
        breadenerLevels[index].level
      }**!\n` +
      `${progressText}` +
      `🍞 Total breaded: **${breadCount}** people`;

    const logMessage = `"${user.username}" level checked - ${
      breadenerLevels[index].level
    } (${breadCount} breaded). Requested by "${interaction.user.username}"`;

    // Adds the correct role (back)
    const newRoleId = breadenerLevels[index].id;
    userMember.roles.add(
      newRoleId,
      `New breadener level role: ${breadenerLevels[index].level}`,
    );
    console.log(`New breadener level role: ${breadenerLevels[index].level}`);

    // Removes all Breadener Roles except the correct one
    for (let i = 0; i <= 4; i++) {
      if (breadenerLevels[i].id === newRoleId) continue;
      userMember.roles.remove(breadenerLevels[i].id);
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
