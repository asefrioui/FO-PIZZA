import type { IngredientKey } from '../types';

export const ingredientLabels: Readonly<Record<IngredientKey, string>> = {
  pepperoni: 'Pepperoni',
  basil: 'Basilic',
  mushroom: 'Champignon',
  olive: 'Olives'
};

export const ingredientKeys = ['pepperoni', 'basil', 'mushroom', 'olive'] as const satisfies readonly IngredientKey[];

export const toppingLayout: Readonly<Record<IngredientKey, readonly (readonly [number, number])[]>> = {
  pepperoni: [[25, 28], [54, 22], [72, 39], [38, 54], [64, 68], [28, 76], [78, 76]],
  basil: [[43, 29], [68, 25], [26, 47], [56, 51], [43, 74], [75, 58]],
  mushroom: [[35, 19], [78, 30], [24, 63], [57, 78], [67, 48], [42, 42]],
  olive: [[48, 18], [60, 34], [33, 37], [77, 55], [52, 64], [22, 72], [71, 79]]
};

export function isIngredientKey(value: string | undefined): value is IngredientKey {
  return value === 'pepperoni' || value === 'basil' || value === 'mushroom' || value === 'olive';
}
