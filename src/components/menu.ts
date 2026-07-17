import { products, isMenuCategory } from '../data/products';
import { query, queryAll } from '../lib/dom';
import { formatPrice } from '../lib/format';
import type { MenuCategory, Product } from '../types';

function createProductMedia(product: Product, category: MenuCategory, index: number): string {
  if (category === 'desserts') {
    return '<div class="product-media"><div class="dessert-art" aria-hidden="true"></div></div>';
  }

  return `
    <div class="product-media">
      <img src="${product.image ?? ''}" alt="${product.name}" loading="lazy">
      <span class="product-index">${String(index + 1).padStart(2, '0')}</span>
    </div>`;
}

function createProductCard(product: Product, category: MenuCategory, index: number): string {
  return `
    <article class="product-card ${category === 'desserts' ? 'product-card-dessert' : ''}" style="animation-delay:${index * 55}ms">
      ${createProductMedia(product, category, index)}
      <div class="product-body">
        <div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
        </div>
        <div class="product-action">
          <strong class="product-price">${formatPrice(product.price)}</strong>
          <button class="product-add open-order" type="button" aria-label="Choisir ${product.name}">Choisir</button>
        </div>
      </div>
    </article>`;
}

function renderProducts(category: MenuCategory): void {
  const grid = query<HTMLElement>('#product-grid');
  grid.setAttribute('aria-label', category === 'pizzas' ? 'Liste des pizzas' : 'Liste des desserts');
  grid.innerHTML = products[category]
    .map((product, index) => createProductCard(product, category, index))
    .join('');
}

export function initMenu(): void {
  const tabs = queryAll<HTMLButtonElement>('[data-category]');
  renderProducts('pizzas');

  const activateTab = (tab: HTMLButtonElement): void => {
    const category = tab.dataset.category;
    if (!isMenuCategory(category)) return;

    tabs.forEach((button) => {
      const active = button === tab;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    renderProducts(category);
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const targetIndex = event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? tabs.length - 1
          : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      const target = tabs[targetIndex];
      if (target === undefined) return;
      activateTab(target);
      target.focus();
    });
  });
}
