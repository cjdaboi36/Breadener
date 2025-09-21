import { Events, type Message, TextChannel } from "discord.js";
import type { BotEvent } from "$src/customTypes.ts";
import { db } from "$src/db.ts";
import { isInChannel, isModerator, parseDBQuery, helpText } from "$src/utils.ts";

function ping(message: Message): boolean {
  if (message.content !== ".ping") return false;
  message.reply("Pong!");
  console.log(`Pinged ${message.author.username} via .-command`);
  return true;
}

function help(message: Message): boolean {
  if (message.content !== ".help") return false;
  message.reply(helpText);
  console.log(`Helped ${message.author.username} via .-command`);
  return true;
}

function isBotUp(message: Message): boolean {
  if (message.content !== "Is <@1383534555960442880> up?") return false;
  message.reply("Yes sir!");
  console.log(`Reminded ${message.author.username} that the bot is up!`);
  return true;
}

function hasBread(message: Message): boolean {
  if (!message.content.includes("🍞")) return false;
  message.react("🍞");
  console.log("Reacted with 🍞.");
  return true;
}

async function runDBQuery(message: Message): Promise<boolean> {
  const isAuthorMod = isModerator(message);
  const isProperChannel: boolean =
    isInChannel(message, "1383807467875733704") ||
    isInChannel(message, "1383492917498351667");
  const isApproved: boolean = message.content === ";db Approved";
  const isReply: boolean = message.type === 19;

  if (
    !(isAuthorMod &&
      isApproved &&
      isProperChannel &&
      isReply)
  ) return false;

  // Fetching replied message
  const repliedMessage = await message.fetchReference();

  const validDBQuery = parseDBQuery(repliedMessage.content);
  const isReplyAuthorMod: boolean = isModerator(repliedMessage);
  const isReplyNotSameAuthor: boolean =
    message.author.id !== repliedMessage.author.id;

  if (
    validDBQuery && isReplyAuthorMod &&
    isReplyNotSameAuthor
  ) {
    try {
      const thing = db.run(validDBQuery);
      message.reply(
        `Approvement recognized. Will execute query \`${validDBQuery}\`\n` +
          `Returns: ${thing}`,
      );
    } catch (err) {
      console.log(err);
      message.reply(String(err));
    }

    return true;
  }

  const replyText = `Will not execute. Reasons:\n` +
    `\`\`\`ts\n` +
    `isAuthorMod = ${isAuthorMod};\n` +
    `isProperChannel = ${isProperChannel};\n` +
    `isApproved = ${isApproved};\n` +
    `isReply = ${isReply};\n` +
    `validDBQuery = ${validDBQuery};\n` +
    `isReplyAuthorMod = ${isReplyAuthorMod};\n` +
    `isReplyNotSameAuthor = ${isReplyNotSameAuthor};\n` +
    `\`\`\``;

  message.reply(replyText);
  console.log(replyText);

  return false;
}

const event: BotEvent = {
  type: Events.MessageCreate,
  execute: async (message: Message) => {
    if (!(message.channel instanceof TextChannel)) return;

    // Parse stuff
    if (ping(message)) return;

    if (help(message)) return;

    // Is the bot up?
    if (isBotUp(message)) return;

    // React with bread
    if (hasBread(message)) return;

    if (!message.member) return; // If message is not sent in a guild, return

    if (await runDBQuery(message)) return;
  },
};

export default event;
