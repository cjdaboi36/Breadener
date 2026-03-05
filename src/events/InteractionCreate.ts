import { Events, type Interaction, MessageFlags } from "discord.js";
import { slashCommands } from "../collectCommands.ts";
import { BotEvent, type SlashCommand } from "../types.ts";

const slashCommandsRecord: Record<string, SlashCommand> = {};
for (const slashCommand of slashCommands) {
  slashCommandsRecord[slashCommand.data.name] = slashCommand;
}

export const slashCommandEvent = new BotEvent<Events.InteractionCreate>({
  type: Events.InteractionCreate,
  once: false,
  execute: async (interaction: Interaction) => {
    if (!(interaction.isChatInputCommand() || interaction.isAutocomplete())) {
      return;
    }

    const slashCommand = slashCommandsRecord[interaction.commandName] as
      | SlashCommand
      | undefined;

    if (!slashCommand) {
      console.error(
        `No command matching ${interaction.commandName} was found.`,
      );
      return;
    }

    if (interaction.isChatInputCommand()) {
      try {
        const returnMessage = await slashCommand.execute(interaction);
        console.log(`\x1b[36m > \x1b[0m ${returnMessage}`);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      }
      return;
    }

    if (!interaction.isAutocomplete()) return;

    if (!slashCommand.autocomplete) {
      console.error(
        `This command ('${slashCommand.data.name}) hasn't implemented autocomplete!`,
      );
      return;
    }

    try {
      slashCommand.autocomplete(interaction);
    } catch (error) {
      console.error(error);
    }
  },
});
