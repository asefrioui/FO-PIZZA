import { prefersReducedMotion, queryAll } from '../lib/dom';

export function initRevealAnimations(): void {
  const elements = queryAll<HTMLElement>('.reveal');
  elements.forEach((element) => {
    const delay = element.dataset.delay;
    if (delay !== undefined) element.style.setProperty('--delay', `${delay}ms`);
  });

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.13, rootMargin: '0px 0px -45px' });

  elements.forEach((element) => observer.observe(element));
}

function animateCounter(element: HTMLElement): void {
  const target = Number(element.dataset.count);
  if (!Number.isFinite(target)) return;
  if (prefersReducedMotion) {
    element.textContent = String(target);
    return;
  }

  const startTime = performance.now();
  const updateCounter = (currentTime: number): void => {
    const progress = Math.min((currentTime - startTime) / 1100, 1);
    element.textContent = String(Math.round(target * (1 - Math.pow(1 - progress, 3))));
    if (progress < 1) window.requestAnimationFrame(updateCounter);
  };
  window.requestAnimationFrame(updateCounter);
}

export function initCounters(): void {
  const counters = queryAll<HTMLElement>('[data-count]');
  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.7 });

  counters.forEach((counter) => observer.observe(counter));
}
