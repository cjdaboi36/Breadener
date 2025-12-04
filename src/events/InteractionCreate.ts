import { Events, type Interaction, MessageFlags } from "discord.js";
import { slashCommands } from "../collectCommands.ts";
import type { BotEvent, SlashCommand } from "../customTypes.ts";

const slashCommandsRecord: Record<string, SlashCommand> = {};
for (const slashCommand of slashCommands) {
  slashCommandsRecord[slashCommand.data.name] = slashCommand;
}

export const slashCommandEvent: BotEvent<Events.InteractionCreate> = {
  type: Events.InteractionCreate,
  execute: async (interaction: Interaction) => {
    if (
      !(interaction.isChatInputCommand()
        || interaction.isAutocomplete())
    ) return;

    const slashCommand: SlashCommand | undefined =
      slashCommandsRecord[interaction.commandName];

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

    if (interaction.isAutocomplete()) {
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
    }
  },
};
