import { isLocationKey, orderLocations } from '../data/locations';
import { query, queryAll, setPressed } from '../lib/dom';
import type { LocationKey } from '../types';
import { showToast } from './toast';

const storageKey = 'fo-location';

function readSavedLocation(): LocationKey {
  try {
    const savedLocation = localStorage.getItem(storageKey) ?? undefined;
    return isLocationKey(savedLocation) ? savedLocation : 'paris';
  } catch {
    return 'paris';
  }
}

export function initOrderModal(): void {
  const modal = query<HTMLElement>('#order-modal');
  const closeButton = query<HTMLButtonElement>('.modal-close', modal);
  const headerActions = query<HTMLElement>('.header-actions');
  const locationTrigger = query<HTMLButtonElement>('.location-trigger');
  const pageRegions = queryAll<HTMLElement>('header, main, footer, .mobile-order-cta');
  let selectedLocation: LocationKey = readSavedLocation();
  let lastFocused: HTMLElement | null = null;

  const setLocation = (location: LocationKey, persist = true): void => {
    selectedLocation = location;
    const details = orderLocations[location];
    query<HTMLElement>('.location-label').textContent = details.label;
    query<HTMLElement>('.mobile-order-location').textContent = details.label;
    query<HTMLAnchorElement>('#delivery-link').href = details.delivery;
    query<HTMLAnchorElement>('#pickup-link').href = details.pickup;
    query<HTMLAnchorElement>('#onsite-link').hidden = !details.onsite;

    queryAll<HTMLButtonElement>('[data-order-location]').forEach((button) => {
      setPressed(button, button.dataset.orderLocation === location);
    });

    if (persist) {
      try {
        localStorage.setItem(storageKey, location);
      } catch {
        // The ordering flow remains functional when storage is unavailable.
      }
    }
  };

  const open = (preselectedLocation?: LocationKey): void => {
    if (preselectedLocation !== undefined) setLocation(preselectedLocation);
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    pageRegions.forEach((region) => { region.inert = true; });
    window.requestAnimationFrame(() => closeButton.focus());
  };

  const close = (): void => {
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    pageRegions.forEach((region) => { region.inert = false; });
    lastFocused?.focus();
  };

  const trapFocus = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab' || !modal.classList.contains('open')) return;
    const focusableElements = queryAll<HTMLElement>('button:not([disabled]), a[href]', modal)
      .filter((element) => element.offsetParent !== null);
    const firstElement = focusableElements.at(0);
    const lastElement = focusableElements.at(-1);
    if (firstElement === undefined || lastElement === undefined) return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;

    const openButton = event.target.closest<HTMLElement>('.open-order');
    if (openButton !== null) {
      const preselectedLocation = openButton.dataset.preselect;
      open(isLocationKey(preselectedLocation) ? preselectedLocation : undefined);
    }

    if (event.target.closest('[data-close-modal]') !== null) close();

    const headerLocation = event.target.closest<HTMLElement>('[data-location]');
    if (headerLocation !== null && isLocationKey(headerLocation.dataset.location)) {
      setLocation(headerLocation.dataset.location);
      headerActions.classList.remove('location-open');
      locationTrigger.setAttribute('aria-expanded', 'false');
      showToast(`Restaurant sélectionné : ${orderLocations[selectedLocation].label}`);
    }

    const modalLocation = event.target.closest<HTMLElement>('[data-order-location]');
    if (modalLocation !== null && isLocationKey(modalLocation.dataset.orderLocation)) {
      setLocation(modalLocation.dataset.orderLocation);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
    trapFocus(event);
  });

  setLocation(selectedLocation, false);
}
