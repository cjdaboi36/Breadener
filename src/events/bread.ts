import { Events } from "discord.js";
import { BotEvent } from "../customTypes.ts";

const event: BotEvent = {
  type: Events.MessageCreate,
  execute: (message) => {
    // Parse stuff
    if (message.content === ".ping") {
      message.channel.send("Pong!");
    }

    if (message.content === "Is <@1383534555960442880> up?") {
      message.channel.send("Yes sir!");
    }

    if (message.content.includes("🍞")) {
      message.react("🍞");
    }
  },
};

export default event;
