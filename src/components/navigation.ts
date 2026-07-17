import { query, queryAll } from '../lib/dom';

export function initNavigation(): void {
  const header = query<HTMLElement>('.site-header');
  const progress = query<HTMLElement>('.scroll-progress span');
  const menuToggle = query<HTMLButtonElement>('.menu-toggle');
  const navigation = query<HTMLElement>('.main-nav');
  const actions = query<HTMLElement>('.header-actions');
  const locationTrigger = query<HTMLButtonElement>('.location-trigger');
  const locationButtons = queryAll<HTMLButtonElement>('[data-location]', actions);

  const closeLocationMenu = (): void => {
    actions.classList.remove('location-open');
    locationTrigger.setAttribute('aria-expanded', 'false');
  };

  const closeMobileMenu = (): void => {
    navigation.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
  };

  const updateScrollUi = (): void => {
    header.classList.toggle('scrolled', window.scrollY > 24);
    const maximumScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    progress.style.width = `${Math.min((window.scrollY / maximumScroll) * 100, 100)}%`;
  };

  updateScrollUi();
  window.addEventListener('scroll', updateScrollUi, { passive: true });

  menuToggle.addEventListener('click', () => {
    const open = navigation.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });

  queryAll<HTMLAnchorElement>('a', navigation).forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  locationTrigger.addEventListener('click', (event) => {
    event.stopPropagation();
    const open = actions.classList.toggle('location-open');
    locationTrigger.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', (event) => {
    if (event.target instanceof Node && !actions.contains(event.target)) {
      closeLocationMenu();
    }
  });

  locationTrigger.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault();
    actions.classList.add('location-open');
    locationTrigger.setAttribute('aria-expanded', 'true');
    locationButtons.at(0)?.focus();
  });

  locationButtons.forEach((button, index) => {
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeLocationMenu();
        locationTrigger.focus();
        return;
      }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      const target = locationButtons[(index + direction + locationButtons.length) % locationButtons.length];
      target?.focus();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeMobileMenu();
    closeLocationMenu();
  });
}
