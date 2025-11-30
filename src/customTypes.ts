import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Events,
  Message,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export type SlashCommand = {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<string>;
  autocomplete?: (interaction: AutocompleteInteraction) => void;
};

export const slashCommandGuard = (object: object) =>
  "data" in object && "execute" in object;

export type NonSlashCommand = {
  name: string;
  command: string | RegExp;
  description: string;
  showInHelp: boolean;
  match: (message: Message) => boolean;
  execute: (message: Message) => Promise<string>;
};

export const nonSlashCommandGuard = (object: object) =>
  "match" in object && "execute" in object;

export type BotEvent = {
  type: Events;
  once?: boolean;
  // deno-lint-ignore no-explicit-any
  execute: (...args: any[]) => void;
};

export const botEventGuard = (object: object) =>
  "type" in object && "execute" in object;

export type MaybePromiseVoid = void | Promise<void>;

export type BreadRecipe = {
  breadName?: string;
  ingredients: string[][];
  expectedTime: number;
  instructions: string[];
  recipeLink: string;
};

export type BreadenerLevel = {
  level: string;
  id: string;
  nextLevel?: string;
  emoji: string;
  breadCount: number;
  threshold?: number;
};
