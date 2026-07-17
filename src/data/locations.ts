import type { LocationKey, OrderLocation } from '../types';

export const orderLocations: Readonly<Record<LocationKey, OrderLocation>> = {
  paris: {
    label: 'Paris 13',
    delivery: 'https://www.order.store/store/fo-pizza/dnIDQ776TtK9eCv7G2-1cg',
    pickup: 'https://fo-pizza.com/paris/',
    onsite: true
  },
  saclay: {
    label: 'Saclay',
    delivery: 'https://www.ubereats.com/store/fo-pizza-saclay/E5agnlCiSvWlUIG9jkOuZg',
    pickup: 'https://fo-pizza.com/saclay/',
    onsite: false
  }
};

export function isLocationKey(value: string | undefined): value is LocationKey {
  return value === 'paris' || value === 'saclay';
}
