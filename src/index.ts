import { load } from "@std/dotenv";
import {
  Client,
  GatewayIntentBits,
  REST,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import { slashCommands } from "./collectCommands.ts";
import { BotEvent } from "./types.ts";
import { coolBanner } from "./utils.ts";

const requiredKeys = [
  "DATABASE_PATH",
  "CLIENTID",
  "GUILDID",
  "TOKEN",
  "GITHUB_TOKEN",
] as const;

const env = await load();

for (const key of requiredKeys) {
  if (!env[key]) throw new Error(`\x1b[34mMissing .env variable ${key}\x1b[0m`);
}

// Ensures the database exists
(await Deno.openKv(Deno.env.get("DATABASE_PATH")!)).close();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// This type name is fucking brilliant
const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
for (const slashCommand of slashCommands) {
  commands.push(slashCommand.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(Deno.env.get("TOKEN")!);

console.log(`Started refreshing ${commands.length} application (/) commands`);

await rest
  .put(Routes.applicationCommands(Deno.env.get("CLIENTID")!), {
    body: commands,
  })
  .catch((err) => console.error(err));

console.log(`Successfully reloaded application (/) commands.`);

const eventFiles = Deno
  .readDirSync("src/events")
  .filter((file) => file.name.endsWith(".ts"));

for (const eventFile of eventFiles) {
  const module = await import(`./events/${eventFile.name}`) as object;

  for (const [name, entry] of Object.entries(module)) {
    if (!(entry instanceof BotEvent)) {
      console.warn(
        `[WARNING] The export ${name} in module ${eventFile.name} doesn't really look like an event..`,
      );

      continue;
    }

    const event = entry as BotEvent<typeof entry.type>;

    if (event.once) {
      client.once(event.type as string, (...args) => event.execute(...args));
    } else {
      client.on(event.type as string, (...args) => event.execute(...args));
    }
  }
}

client.login(Deno.env.get("TOKEN"));
console.log(coolBanner);
