import { SlashCommandBuilder } from "discord.js";
import { db } from "../../db.ts";

export const data = new SlashCommandBuilder()
  .setName("get-bread-count")
  .setDescription("See how many people someone has infected")
  .addUserOption((option) =>
    option
      .setName("username")
      .setDescription("give the username of the infector")
      .setRequired(true),
  );

export async function execute(interaction) {
  const username = interaction.options.getUser("username");
  // console.log(`id of person requested ${username.id} ${username.username}`);

  let _broodTeller = -1;

  await new Promise<void>((resolve, reject) => {
    let thing = db
      .prepare("SELECT COUNT(*) FROM infections WHERE infector_id = ?")
      .get(username.id, (err, total: JSON) => {
        if (err) {
          reject(err);
          return;
        }
        _broodTeller = total["COUNT(*)"];
        // console.log(`During the bullshit: ${_broodTeller}`);
        resolve();
      });
  }).catch((err) => console.log(err));

  // console.log(`After the bullshit: ${_broodTeller}`);

  let message: string = `<@${username.id}> infected ${_broodTeller} people!`;
  let logMessage: string = `"${username.username}" breaded ${_broodTeller} people. Requested by "${interaction.user.username}"`;

  await interaction
    .reply({
      content: message,
      flags: [4096], // makes the message silent
      withResponse: true,
    })
    .then((response) => console.log(logMessage))
    .catch(console.error);
}
