import { prefersReducedMotion, query, supportsFinePointer } from '../lib/dom';

export function initHeroDepth(): void {
  if (prefersReducedMotion || !supportsFinePointer) return;

  const hero = query<HTMLElement>('.hero');
  const media = query<HTMLElement>('#hero-media');

  hero.addEventListener('pointermove', (event) => {
    const bounds = hero.getBoundingClientRect();
    const horizontalPosition = (event.clientX - bounds.left) / bounds.width - 0.5;
    const verticalPosition = (event.clientY - bounds.top) / bounds.height - 0.5;
    media.style.setProperty('--ry', `${horizontalPosition * 2.8}deg`);
    media.style.setProperty('--rx', `${verticalPosition * -2.2}deg`);
    media.style.setProperty('--mx', `${horizontalPosition * -9}px`);
    media.style.setProperty('--my', `${verticalPosition * -7}px`);
  });

  hero.addEventListener('pointerleave', () => {
    media.style.setProperty('--ry', '0deg');
    media.style.setProperty('--rx', '0deg');
    media.style.setProperty('--mx', '0px');
    media.style.setProperty('--my', '0px');
  });
}
