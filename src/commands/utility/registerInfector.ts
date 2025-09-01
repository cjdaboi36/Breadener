import { SlashCommandBuilder } from "discord.js";
import { db } from "../../db.ts";

export const data = new SlashCommandBuilder()
  .setName("register")
  .setDescription("Register your infector!")
  .addUserOption((option) =>
    option
      .setName("username")
      .setDescription("give the preferred username")
      .setRequired(true),
  );

export async function execute(interaction) {
  const person = interaction.options.getUser("username");

  let a: boolean = true;

  await new Promise<void>((resolve, reject) => {
    let thing = db
      .prepare("SELECT COUNT(*) FROM infections WHERE infected_id = ?")
      .get(interaction.user.id, (err, total: JSON) => {
        if (err) {
          reject(err);
          return;
        }
        // console.log(`During the bullshit: ${total["COUNT(*)"]}`);
        if (total["COUNT(*)"] !== 0) {
          a = false;
        }
        resolve();
      });
  }).catch((err) => console.log(err));

  let message = "You can't register an infector twice buddy!";
  let logMessage = `${interaction.user.username} tried to fool the system, but turned out to be one themself`;

  if (a) {
    message = `Registered "${person.username}" as the infector of "${interaction.user.username}".`;
    logMessage = `Registered "${person.username}" as the infector of "${interaction.user.username}".`;

    const TheresreallynohardlimittohowlongtheseachievementnamescanbeandtobequitehonestImrathercurioustoseehowfarwecangoAdolphusWGreen18441917startedasthePrincipaloftheGrotonSchoolin1864By1865hebecamesecondassistantlibrarianattheNewYorkMercantileLibraryfrom1867to1869hewaspromotedtofulllibrarianFrom1869to1873heworkedforEvartsSouthmaydChoatealawfirmcofoundedbyWilliamMEvartsCharlesFerdinandSouthmaydandJosephHodgesChoateHewasadmittedtotheNewYorkStateBarAssociationin1873 =
      db
        .prepare(
          "INSERT INTO infections (infector_id, infected_id) VALUES (?, ?)",
        )
        .run(person.id, interaction.user.id);

    db.all("SELECT * FROM infections", (err, row) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(row);
    });
  }

  await interaction
    .reply({
      content: message,
      flags: [4096],
      withResponse: true,
    })
    .then((response) => console.log(logMessage))
    .catch(console.error);
}
