import { db } from "../db.ts";
import { isInChannel, isModerator, parseDBQuery } from "../utils.ts";
import { Message } from "discord.js";

export function ping(message: Message): boolean {
  if (message.content !== ".ping") return false;
  message.reply("Pong!");
  console.log(`Pinged ${message.author.username} via .-command`);
  return true;
}

export function help(message: Message): boolean {
  if (message.content !== ".help") return false;
  const returnMessage = `\`.help\` | Gives a list of all nonslashcommands!\n` +
    `\`.ping\` | Replies with pong!\n` +
    `\`Is @Breadener up?\` | Replies with affermation!\n`;
  message.reply(returnMessage);
  console.log(`Helped ${message.author.username} via .-command`);
  return true;
}

export function isBotUp(message: Message): boolean {
  if (message.content !== "Is <@1383534555960442880> up?") return false;
  message.reply("Yes sir!");
  console.log(`Reminded ${message.author.username} that the bot is up!`);
  return true;
}

export function hasBread(message: Message): boolean {
  if (!message.content.includes("🍞")) return false;
  message.react("🍞");
  console.log("Reacted with 🍞.");
  return true;
}

export async function runDBQuery(message: Message): Promise<boolean> {
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
