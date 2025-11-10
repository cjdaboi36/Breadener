import { env } from "../config.ts";
import type {
  GitHubRepository,
  Language,
  OctokitResponse,
  SlashCommand,
} from "../customTypes.ts";
import { SlashCommandBuilder } from "discord.js";
import { Octokit } from "octokit";

export const slashBreadener: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("breadener")
    .setDescription("Get recipes for the most delicious pieces of bread!"),

  execute: async (interaction) => {
    const octokit: Octokit = new Octokit({
      auth: env.GITHUB_TOKEN,
    });

    const repoData: OctokitResponse<GitHubRepository> = await octokit.request(
      "GET https://api.github.com/repos/The-Breadening/Breadener",
    );

    const rawLanguageData: OctokitResponse<Language> = await octokit.request(
      "GET https://api.github.com/repos/The-Breadening/Breadener/languages",
    );

    console.log(`\x1b[44m > \x1b[0m Fetch Log`);
    console.log(repoData.headers);
    console.log(`\x1b[43m > \x1b[0m Fetch Log Languages`);
    console.log(rawLanguageData.headers);

    const languageData: Language = {};
    let totalChar: number = 0;

    for (const language of Object.entries(rawLanguageData.data)) {
      totalChar += Number(language[1]);
    }
    for (const language of Object.entries(rawLanguageData.data)) {
      const thing: number = Math.floor(Number(language[1]) / totalChar * 1000)
        / 10;
      if (thing === 0) {
        continue; // Equivalent of break as long as github doesn't switch the descending order of languages
      }
      languageData[language[0]] = thing;
    }

    console.log(`\x1b[102m > \x1b[0m Returned Data`);

    let languageMessage: string = "";
    for (const languageEntry of Object.entries(languageData)) {
      languageMessage += `\t\t${languageEntry[0]}: "${languageEntry[1]}"\n`;
    }

    const message: string = "# Breadener-bot!\n"
      + "\`\`\`json\n"
      + "{\n"
      + "\tid: "
      + repoData.data.id
      + ",\n"
      + "\tname: "
      + repoData.data.name
      + ",\n"
      + "\townerLogin: "
      + repoData.data.owner.login
      + ",\n"
      + "\tdescription: "
      + repoData.data.description!
      + ",\n"
      + "\turl: "
      + repoData.data.url
      + ",\n"
      + "\tlanguages: {\n"
      + languageMessage
      + "\t},\n"
      + "\tlicense: {\n"
      + "\t\tname: "
      + repoData.data.license?.name
      + "\n"
      + "\t},\n"
      + "\tstargazers_count: "
      + repoData.data.stargazers_count
      + "\n"
      + "}\n"
      + "\`\`\`";

    await interaction
      .reply({
        content: message,
        withResponse: true,
      })
      .then(() =>
        console.log(
          `\x1b[47m > \x1b[0m Inquired ${interaction.user.username} about the bot`,
        )
      )
      .catch(console.error);
  },
};
