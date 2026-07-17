import type { MenuCategory, Product } from '../types';
import heroUrl from '../../assets/hero.jpg';
import pizza1Url from '../../assets/pizza1.jpg';
import pizza2Url from '../../assets/pizza2.jpg';
import pizza3Url from '../../assets/pizza3.jpg';
import pizza4Url from '../../assets/pizza4.jpg';
import pizza5Url from '../../assets/pizza5.jpg';

export const products: Readonly<Record<MenuCategory, readonly Product[]>> = {
  pizzas: [
    { name: 'Margherita', price: 9.5, description: 'Sauce tomate, mozzarella, basilic.', image: pizza1Url },
    { name: 'Reggina', price: 12.5, description: 'Tomate, mozzarella, jambon, champignons.', image: pizza2Url },
    { name: 'Pepperoni', price: 12.5, description: 'Tomate, mozzarella et pepperoni.', image: pizza3Url },
    { name: 'Végétarienne', price: 12.5, description: 'Une composition colorée et généreuse.', image: pizza4Url },
    { name: 'Chèvre Miel', price: 12.5, description: 'Le contraste du chèvre et du miel.', image: pizza5Url },
    { name: 'Raclette Truffe', price: 13.5, description: 'Raclette et huile aromatisée à la truffe.', image: heroUrl }
  ],
  desserts: [
    { name: 'Panna Cotta', price: 3, description: 'Le dessert frais et délicat de la maison.' },
    { name: 'Tiramisu', price: 3, description: 'Un classique italien tout en douceur.' },
    { name: 'Pizza Banane Nutella', price: 4, description: 'La pizza dessert à partager — ou pas.' },
    { name: 'Pizza Poire Chocolat', price: 4, description: 'Poire fondante et chocolat gourmand.' }
  ]
};

export function isMenuCategory(value: string | undefined): value is MenuCategory {
  return value === 'pizzas' || value === 'desserts';
}
