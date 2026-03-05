import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  ClientEvents,
  Message,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export class SlashCommand {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<string>;
  autocomplete?: (interaction: AutocompleteInteraction) => void;

  constructor(obj: SlashCommand) {
    this.data = obj.data;
    this.execute = obj.execute;
    this.autocomplete = obj.autocomplete;
  }
}

export class NonSlashCommand {
  name: string;
  command: string | RegExp;
  description: string;
  showInHelp: boolean;
  match: (message: Message) => boolean;
  execute: (message: Message) => Promise<string>;

  constructor(obj: NonSlashCommand) {
    this.name = obj.name;
    this.command = obj.command;
    this.description = obj.description;
    this.showInHelp = obj.showInHelp;
    this.match = obj.match;
    this.execute = obj.execute;
  }
}

export class BotEvent<T extends keyof ClientEvents> {
  type: T;
  once: boolean;
  execute: (...args: ClientEvents[T]) => void;

  constructor(obj: BotEvent<T>) {
    this.type = obj.type;
    this.once = obj.once;
    this.execute = obj.execute;
  }
}

export type MaybePromiseVoid = void | Promise<void>;

export interface BreadRecipe {
  breadName?: string;
  ingredients: string[][];
  expectedTime: number;
  instructions: string[];
  recipeLink: string;
}

export interface BreadenerLevel {
  level: string;
  id: string;
  nextLevel?: string;
  emoji: string;
  breadCount: number;
  threshold?: number;
}
