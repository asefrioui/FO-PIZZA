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
          <button class="product-add open-order" type="button" aria-label="Commander ${product.name}" title="Commander">↗</button>
        </div>
      </div>
    </article>`;
}

function renderProducts(category: MenuCategory): void {
  const grid = query<HTMLElement>('#product-grid');
  grid.innerHTML = products[category]
    .map((product, index) => createProductCard(product, category, index))
    .join('');
}

export function initMenu(): void {
  const tabs = queryAll<HTMLButtonElement>('[data-category]');
  renderProducts('pizzas');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;
      if (!isMenuCategory(category)) return;

      tabs.forEach((button) => {
        const active = button === tab;
        button.classList.toggle('active', active);
        button.setAttribute('aria-selected', String(active));
      });
      renderProducts(category);
    });
  });
}
