export type LocationKey = 'paris' | 'saclay';

export type MenuCategory = 'pizzas' | 'desserts';

export type Product = {
  readonly name: string;
  readonly price: number;
  readonly description: string;
  readonly image?: string;
};

export type OrderLocation = {
  readonly label: string;
  readonly delivery: string;
  readonly pickup: string;
};

export type IngredientKey = 'pepperoni' | 'basil' | 'mushroom' | 'olive';

export type PizzaBase = 'tomate' | 'creme';
