import { Events, Message, TextChannel } from "discord.js";
import { BotEvent } from "../customTypes.ts";

const event: BotEvent = {
  type: Events.MessageCreate,
  execute: (message: Message) => {
    if (!(message.channel instanceof TextChannel)) return;

    // Parse stuff
    if (message.content === ".ping") {
      message.channel.send("Pong!");
    }

    // Is the bot up?
    if (message.content === "Is <@1383534555960442880> up?") {
      message.channel.send("Yes sir!");
    }

    // React with bread
    if (message.content.includes("🍞")) {
      message.react("🍞");
    }
  },
};

export default event;
