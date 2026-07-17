import { ingredientKeys, ingredientLabels, isIngredientKey, toppingLayout } from '../data/toppings';
import { prefersReducedMotion, query, queryAll, setPressed, supportsFinePointer } from '../lib/dom';
import type { IngredientKey, PizzaBase } from '../types';
import { showToast } from './toast';

function isPizzaBase(value: string | undefined): value is PizzaBase {
  return value === 'tomate' || value === 'creme';
}

export function initPizzaStudio(): void {
  const toppingContainer = query<HTMLElement>('#pizza-toppings');
  const pizza = query<HTMLElement>('#pizza-3d');
  const stage = query<HTMLElement>('#pizza-stage');
  const selectionLabel = query<HTMLElement>('#selection-label');
  const selectedIngredients = new Set<IngredientKey>(['pepperoni', 'basil']);
  let selectedBase: PizzaBase = 'tomate';

  const buildToppings = (): void => {
    toppingContainer.innerHTML = ingredientKeys.flatMap((ingredient) =>
      toppingLayout[ingredient].map(([left, top]) => {
        const hiddenClass = selectedIngredients.has(ingredient) ? '' : ' is-hidden';
        return `<span class="topping ${ingredient}${hiddenClass}" data-topping="${ingredient}" style="left:${left}%;top:${top}%"></span>`;
      })
    ).join('');

    queryAll<HTMLElement>('.topping.basil, .topping.mushroom', toppingContainer).forEach((element, index) => {
      element.style.rotate = `${(index * 41) % 120 - 60}deg`;
    });
  };

  const updatePizza = (): void => {
    pizza.classList.toggle('base-creme', selectedBase === 'creme');
    queryAll<HTMLElement>('[data-topping]', toppingContainer).forEach((topping) => {
      const ingredient = topping.dataset.topping;
      topping.classList.toggle('is-hidden', !isIngredientKey(ingredient) || !selectedIngredients.has(ingredient));
    });

    queryAll<HTMLButtonElement>('[data-base]').forEach((button) => {
      setPressed(button, button.dataset.base === selectedBase);
    });
    queryAll<HTMLButtonElement>('[data-ingredient]').forEach((button) => {
      const ingredient = button.dataset.ingredient;
      setPressed(button, isIngredientKey(ingredient) && selectedIngredients.has(ingredient));
    });

    const ingredients = ingredientKeys
      .filter((ingredient) => selectedIngredients.has(ingredient))
      .map((ingredient) => ingredientLabels[ingredient]);
    selectionLabel.textContent = [selectedBase === 'tomate' ? 'Tomate' : 'Crème', ...ingredients].join(' · ');
  };

  const randomizePizza = (): void => {
    selectedBase = Math.random() > 0.5 ? 'tomate' : 'creme';
    selectedIngredients.clear();
    const shuffledIngredients = [...ingredientKeys].sort(() => Math.random() - 0.5);
    const ingredientCount = 2 + Math.floor(Math.random() * 3);
    shuffledIngredients.slice(0, ingredientCount).forEach((ingredient) => selectedIngredients.add(ingredient));
    updatePizza();
    showToast('Composition surprise prête !');

    if (!prefersReducedMotion) {
      pizza.animate([
        { transform: 'translate(-50%,-50%) rotateX(57deg) rotateZ(-18deg) scale(1)' },
        { transform: 'translate(-50%,-50%) rotateX(57deg) rotateZ(342deg) scale(1.04)' }
      ], { duration: 850, easing: 'cubic-bezier(.2,.75,.25,1)' });
    }
  };

  queryAll<HTMLButtonElement>('[data-base]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!isPizzaBase(button.dataset.base)) return;
      selectedBase = button.dataset.base;
      updatePizza();
    });
  });

  queryAll<HTMLButtonElement>('[data-ingredient]').forEach((button) => {
    button.addEventListener('click', () => {
      const ingredient = button.dataset.ingredient;
      if (!isIngredientKey(ingredient)) return;
      if (selectedIngredients.has(ingredient)) selectedIngredients.delete(ingredient);
      else selectedIngredients.add(ingredient);
      updatePizza();
    });
  });

  query<HTMLButtonElement>('#randomize').addEventListener('click', randomizePizza);

  if (supportsFinePointer && !prefersReducedMotion) {
    stage.addEventListener('pointermove', (event) => {
      const bounds = stage.getBoundingClientRect();
      const horizontalPosition = (event.clientX - bounds.left) / bounds.width - 0.5;
      const verticalPosition = (event.clientY - bounds.top) / bounds.height - 0.5;
      pizza.style.setProperty('--pizza-rx', `${57 + verticalPosition * -10}deg`);
      pizza.style.setProperty('--pizza-rz', `${-18 + horizontalPosition * 14}deg`);
    });
    stage.addEventListener('pointerleave', () => {
      pizza.style.setProperty('--pizza-rx', '57deg');
      pizza.style.setProperty('--pizza-rz', '-18deg');
    });
  }

  buildToppings();
  updatePizza();
}
