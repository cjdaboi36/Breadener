import { Events, Message, TextChannel } from "discord.js";
import { BotEvent } from "../customTypes.ts";
import { hasBread, isBotUp, ping, runDBQuery } from "./nonSlashCommands.ts";

const event: BotEvent = {
  type: Events.MessageCreate,
  execute: async (message: Message) => {
    if (!(message.channel instanceof TextChannel)) return;

    // Parse stuff
    if (ping(message)) return;

    // Is the bot up?
    if (isBotUp(message)) return;

    // React with bread
    if (hasBread(message)) return;

    if (!message.member) return; // If message is not sent in a guild, return

    if (await runDBQuery(message)) return;
  },
};

export default event;
