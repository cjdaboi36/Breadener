export type breadRecipe = {
  breadName: string | undefined;
  ingredients: string[][];
  expectedTime: number;
  instructions: string[];
  recipeLink: string;
};

export type breadenerLevel = {
  level: string;
  nextLevel?: string;
  emoji: string;
  breadCount: number;
  threshold?: number;
};
