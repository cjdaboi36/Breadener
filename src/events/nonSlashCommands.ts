import { db } from "../db.ts";
import { isInChannel, isModerator, parseDBQuery } from "../utils.ts";
import { Message } from "discord.js";

export function ping(message: Message): boolean {
  if (message.content === ".ping") {
    message.reply("Pong!");
    return true;
  }
  return false;
}

export function isBotUp(message: Message): boolean {
  if (message.content === "Is <@1383534555960442880> up?") {
    message.reply("Yes sir!");
    return true;
  }
  return false;
}

export function hasBread(message: Message): boolean {
  if (message.content.includes("🍞")) {
    message.react("🍞");
    return true;
  }
  return false;
}

export async function runDBQuery(message: Message): Promise<boolean> {
  const isAuthorMod = isModerator(message);
  const isProperChannel: boolean = isInChannel(message, "1383807467875733704");
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

  message.reply(
    `Will not execute. Reasons:\n` +
      `\`\`\`ts\n` +
      `isAuthorMod = ${isAuthorMod};\n` +
      `isProperChannel = ${isProperChannel};\n` +
      `isApproved = ${isApproved};\n` +
      `isReply = ${isReply};\n` +
      `validDBQuery = ${validDBQuery};\n` +
      `isReplyAuthorMod = ${isReplyAuthorMod};\n` +
      `isReplyNotSameAuthor = ${isReplyNotSameAuthor};\n` +
      `\`\`\``,
  );
  return false;
}
