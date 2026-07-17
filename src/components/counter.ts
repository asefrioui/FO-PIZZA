import { ingredientKeys, ingredientLabels, isIngredientKey } from '../data/toppings';
import { query, queryAll, setPressed } from '../lib/dom';
import type { IngredientKey, PizzaBase } from '../types';
import { showToast } from './toast';

function isPizzaBase(value: string | undefined): value is PizzaBase {
  return value === 'tomate' || value === 'creme';
}

export function initCounter(): void {
  const selectionLabel = query<HTMLElement>('#selection-label');
  const selectionChips = query<HTMLElement>('#selection-chips');
  const selectedIngredients = new Set<IngredientKey>(['pepperoni', 'basil']);
  let selectedBase: PizzaBase = 'tomate';

  const updateSelection = (): void => {
    const baseLabel = selectedBase === 'tomate' ? 'Tomate' : 'Crème';
    const ingredientNames = ingredientKeys
      .filter((ingredient) => selectedIngredients.has(ingredient))
      .map((ingredient) => ingredientLabels[ingredient]);

    selectionLabel.textContent = [baseLabel, ...ingredientNames].join(' · ');
    selectionChips.replaceChildren();
    [`Base ${baseLabel.toLocaleLowerCase('fr')}`, ...ingredientNames].forEach((label) => {
      const chip = document.createElement('span');
      chip.textContent = label;
      selectionChips.append(chip);
    });

    queryAll<HTMLButtonElement>('[data-base]').forEach((button) => {
      setPressed(button, button.dataset.base === selectedBase);
    });
    queryAll<HTMLButtonElement>('[data-ingredient]').forEach((button) => {
      const ingredient = button.dataset.ingredient;
      setPressed(button, isIngredientKey(ingredient) && selectedIngredients.has(ingredient));
    });
  };

  queryAll<HTMLButtonElement>('[data-base]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!isPizzaBase(button.dataset.base)) return;
      selectedBase = button.dataset.base;
      updateSelection();
    });
  });

  queryAll<HTMLButtonElement>('[data-ingredient]').forEach((button) => {
    button.addEventListener('click', () => {
      const ingredient = button.dataset.ingredient;
      if (!isIngredientKey(ingredient)) return;
      if (selectedIngredients.has(ingredient)) selectedIngredients.delete(ingredient);
      else selectedIngredients.add(ingredient);
      updateSelection();
    });
  });

  query<HTMLButtonElement>('#randomize').addEventListener('click', () => {
    selectedBase = Math.random() > 0.5 ? 'tomate' : 'creme';
    selectedIngredients.clear();
    const shuffledIngredients = [...ingredientKeys].sort(() => Math.random() - 0.5);
    const ingredientCount = 2 + Math.floor(Math.random() * 3);
    shuffledIngredients.slice(0, ingredientCount).forEach((ingredient) => selectedIngredients.add(ingredient));
    updateSelection();
    showToast('Nouvelle inspiration prête !');
  });

  updateSelection();
}
