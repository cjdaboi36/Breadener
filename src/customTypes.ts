export type ingredient = {
  ingredient: string;
  amount: number;
};

export type breadRecipe = {
  breadName: string;
  ingredients: string[][];
  expectedTime: number;
  instructions: string[];
};
