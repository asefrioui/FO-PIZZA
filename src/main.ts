import { initHeroDepth } from './components/heroDepth';
import { initMenu } from './components/menu';
import { initNavigation } from './components/navigation';
import { initOrderModal } from './components/orderModal';
import { initRevealAnimations } from './components/reveal';
import { query } from './lib/dom';

function initLazyFeature(selector: string, loadFeature: () => Promise<void>): void {
  const feature = query<HTMLElement>(selector);
  let loaded = false;

  const load = async (): Promise<void> => {
    if (loaded) return;
    loaded = true;
    await loadFeature();
  };

  if (!('IntersectionObserver' in window)) {
    void load();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    void load();
  }, { rootMargin: '600px 0px' });
  observer.observe(feature);
}

function init(): void {
  query<HTMLElement>('#year').textContent = String(new Date().getFullYear());
  initNavigation();
  initOrderModal();
  initMenu();
  initRevealAnimations();
  initHeroDepth();
  initLazyFeature('#concept', async () => {
    const { initRitual } = await import('./components/ritual');
    initRitual();
  });
  initLazyFeature('#studio', async () => {
    const { initPizzaStudio } = await import('./components/pizzaStudio');
    initPizzaStudio();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
