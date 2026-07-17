import { query, queryAll } from '../lib/dom';

export function initNavigation(): void {
  const header = query<HTMLElement>('.site-header');
  const progress = query<HTMLElement>('.scroll-progress span');
  const menuToggle = query<HTMLButtonElement>('.menu-toggle');
  const navigation = query<HTMLElement>('.main-nav');
  const actions = query<HTMLElement>('.header-actions');
  const locationTrigger = query<HTMLButtonElement>('.location-trigger');

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
      actions.classList.remove('location-open');
      locationTrigger.setAttribute('aria-expanded', 'false');
    }
  });
}
