import { Events } from "discord.js";
import { BotEvent } from "../customTypes.ts";

const event: BotEvent = {
  type: Events.ClientReady,
  execute: (client) => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
export default event;
