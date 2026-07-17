import { initHeroDepth } from './components/heroDepth';
import { initMenu } from './components/menu';
import { initNavigation } from './components/navigation';
import { initOrderModal } from './components/orderModal';
import { initCounters, initRevealAnimations } from './components/reveal';
import { query } from './lib/dom';

function initLazyPizzaStudio(): void {
  const studio = query<HTMLElement>('#studio');
  let loaded = false;

  const loadStudio = async (): Promise<void> => {
    if (loaded) return;
    loaded = true;
    const { initPizzaStudio } = await import('./components/pizzaStudio');
    initPizzaStudio();
  };

  if (!('IntersectionObserver' in window)) {
    void loadStudio();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    void loadStudio();
  }, { rootMargin: '600px 0px' });
  observer.observe(studio);
}

function init(): void {
  query<HTMLElement>('#year').textContent = String(new Date().getFullYear());
  initNavigation();
  initOrderModal();
  initMenu();
  initRevealAnimations();
  initCounters();
  initHeroDepth();
  initLazyPizzaStudio();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
