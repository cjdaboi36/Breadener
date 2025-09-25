# Breadener

For all your Breadening purposes! The official discord bot of _The Breadening_ server!

This bot is made with TypeScript, it uses the _GitHub API_, _SQLite3_, and ofcourse _discord.js_. I made this bot originally to keep track of infections, but can also do some other cool stuff.

## Okay very cool and all but how can I try it myself?

Firstly, join the server with [this link](https://discord.gg/rNAatmFGwh). Then, go to `#bot-commands` to try the commands out! Make sure to register the bot itself as an infector to not mess with the infection counts of actual users :).

If the bot is not responding, it may be because it is restarting, that happens every hour at roughly xx:40. It will be down for a few minutes, but it will be back up in no time!

Bread is very cool.

## Okay cool but what is an infection?

The server where the bot lives is the hub for the breadening _infection_. It works like this: Someone has their status as "DM me the word bread". When another someone is foolish enough to DM them the word bread, they are "infected" and required to also change their status to "DM me the word bread". We decided to make a discord server for that, so everyone in it can chat with each other, hang out and also see who infected the most people!

## Slash Commands

The bot supports 9 slashcommands, listed here:

### `/breadener`

Gives stats about the Breadener bot using the _GitHub API with the Octokit library_.

### `/breadener-levels`

Shows all the levels of breadening, including some other data, like the thresholds for every breadener level.

### `/deregister`

Removes the users infection entry from the database, so they can register again. Intended to be used after making a mistake with registering.

### `/get-breadener-level [user]`

Returns the amount of people `user` has infected, alongside some other data. It also assigns / updates a certain role to `user` based on how many they have infected.

### `/get-recipes [bread-type]`

Gives a compact recipe of the requested bread type. Includes ingredient requirements, instructions, as well as a link to the original recipe as source.

### `/help`

Lists all the non-slash commands.

### `/register-infected [infector] [infected_id]`

Adds an entry to the infections database with the user id of `infector` and the `infected_id`. It can be used _only by moderators_ for when someone infects someone else but doesn't join the server, so the infector can still be credited for the infection. It also turned out to be of great use during testing and debugging.

### `/register [infector]`

Adds an entry to the infection databse with the user id of `infector` and the user id of the user as `infected_id`. This command is the core of the Breadener bot, as a lot of other commands depend on it.

## non-slash commands

The Breadener bot also supports some non-slash commands.

### `.help`

Lists all the non-slash commands.

### `.ping`

Replies with `Pong!`, as well as the actual ping of the user.

### `Is @Breadener up?`

Replies with `Yes sir!`. It is supposed to be a fun little way of checking whether the bot is up.
