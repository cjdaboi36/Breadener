import { type Client, Events } from "discord.js";
import { BotEvent } from "../types.ts";

export const readyEvent = new BotEvent<Events.ClientReady>({
  type: Events.ClientReady,
  once: true,
  execute: (client: Client<true>) => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
});
