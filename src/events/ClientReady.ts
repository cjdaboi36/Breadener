import type { BotEvent } from "../customTypes.ts";
import { type Client, Events } from "discord.js";

export const readyEvent: BotEvent<Events.ClientReady> = {
  type: Events.ClientReady,
  execute: (client: Client<boolean>) => {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
  },
};
