import type { BotEvent } from "../customTypes.ts";
import { db } from "../db.ts";
import { isInChannel, isModerator, parseDBQuery } from "../utils.ts";
import { Events, type Message, TextChannel } from "discord.js";
import { nonSlashCommands } from "../collectCommands.ts";

async function _runDBQuery(message: Message): Promise<boolean> {
  const isAuthorMod = isModerator(message);
  const isProperChannel: boolean = isInChannel(message, "1383807467875733704")
    || isInChannel(message, "1383492917498351667");
  const isApproved: boolean = message.content === ";db Approved";
  const isReply: boolean = message.type === 19;

  if (
    !(isAuthorMod
      && isApproved
      && isProperChannel
      && isReply)
  ) return false;

  // Fetching replied message
  const repliedMessage = await message.fetchReference();

  const validDBQuery = parseDBQuery(repliedMessage.content);
  const isReplyAuthorMod: boolean = isModerator(repliedMessage);
  const isReplyNotSameAuthor: boolean =
    message.author.id !== repliedMessage.author.id;

  if (
    validDBQuery && isReplyAuthorMod
    && isReplyNotSameAuthor
  ) {
    try {
      const thing = db.run(validDBQuery);
      message.reply(
        `Approvement recognized. Will execute query \`${validDBQuery}\`\n`
          + `Returns: ${thing}`,
      );
    } catch (err) {
      console.log(err);
      message.reply(String(err));
    }

    return true;
  }

  const replyText = `Will not execute. Reasons:\n`
    + `\`\`\`ts\n`
    + `isAuthorMod = ${isAuthorMod};\n`
    + `isProperChannel = ${isProperChannel};\n`
    + `isApproved = ${isApproved};\n`
    + `isReply = ${isReply};\n`
    + `validDBQuery = ${validDBQuery};\n`
    + `isReplyAuthorMod = ${isReplyAuthorMod};\n`
    + `isReplyNotSameAuthor = ${isReplyNotSameAuthor};\n`
    + `\`\`\``;

  message.reply(replyText);
  console.log(replyText);

  return false;
}

export const nonSlashCommandEvent: BotEvent = {
  type: Events.MessageCreate,
  execute: (message: Message): void => {
    if (!(message.channel instanceof TextChannel)) return;

    for (const nonSlashCommand of nonSlashCommands) {
      if (nonSlashCommand.match(message)) {
        nonSlashCommand.execute(message);
      }
    }
  },
};
