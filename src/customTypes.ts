export type ingredient = {
  ingredient: string;
  amount: number;
};

export type breadRecipe = {
  _breadName: string;
  _ingredients: ingredient[];
  _expectedTime: number;
  _instructions: string[];
};
