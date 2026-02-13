import { type Client, Events } from "discord.js";
import type { BotEvent } from "../customTypes.ts";

export const readyEvent: BotEvent<Events.ClientReady> = {
  type: Events.ClientReady,
  execute: (client: Client<true>) => {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
  },
};
