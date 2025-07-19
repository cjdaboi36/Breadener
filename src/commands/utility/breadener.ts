import { SlashCommandBuilder } from "discord.js";
import type { OctokitData } from "../../customTypes.ts";
import secretData from "../../../secretData.json" with { type: "json" };
import { Octokit } from "octokit";

export const data = new SlashCommandBuilder()
  .setName("breadener")
  .setDescription("Get recipes for the most delicious pieces of bread!");

export async function execute(interaction) {
  const octokit = new Octokit({
    auth: secretData.octokitToken,
  });

  const repoData: OctokitData = await octokit.request(
    "GET https://api.github.com/repos/The-Breadening/Breadener",
  );

  const rawLanguageData = await octokit.request(
    "GET https://api.github.com/repos/The-Breadening/Breadener/languages",
  );

  console.log(`\x1b[44m > \x1b[0m Fetch Log`);
  console.log(repoData.headers);
  console.log(`\x1b[43m > \x1b[0m Fetch Log Languages`);
  console.log(rawLanguageData.headers);

  let languageData: { [language: string]: string } = {};
  let langTotalChar: number = 0;

  for (const language of Object.entries(rawLanguageData.data)) {
    langTotalChar += Number(language[1]);
  }
  for (const language of Object.entries(rawLanguageData.data)) {
    languageData[language[0]] = ((Number(language[1]) / langTotalChar) * 100)
      .toFixed(1)
      .toString();
  }

  console.log(`\x1b[102m > \x1b[0m Returned Data`);

  let languagemessage: string = "";
  for (const languageEntry of Object.entries(languageData)) {
    languagemessage += `\t\t${languageEntry[0]}: "${languageEntry[1]}"\n`;
  }

  let message: string =
    "# Breadener-bot!\n" +
    "\`\`\`json\n" +
    "{\n" +
    "\tid: " +
    repoData.data.id +
    ",\n" +
    "\tname: " +
    repoData.data.name +
    ",\n" +
    "\townerLogin: " +
    repoData.data.owner.login +
    ",\n" +
    "\tdescription: " +
    repoData.data.description! +
    ",\n" +
    "\turl: " +
    repoData.data.url +
    ",\n" +
    "\tlanguages: {\n" +
    languagemessage +
    "\t},\n" +
    "\tlicense: {\n" +
    "\t\tname: " +
    repoData.data.license?.name +
    "\n" +
    "\t},\n" +
    "\tstargazers_count: " +
    repoData.data.stargazers_count +
    "\n" +
    "}\n" +
    "\`\`\`";

  let logMessage: string = `Inquired ${interaction.user.username} about the bot`;

  await interaction
    .reply({
      content: message,
      withResponse: true,
    })
    .then((response) => console.log(logMessage))
    .catch(console.error);
}
