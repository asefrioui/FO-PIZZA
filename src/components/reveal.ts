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
