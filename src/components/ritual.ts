import { query, queryAll } from '../lib/dom';

type RitualState = {
  kicker: string;
  value: string;
  unit: string;
  heading: string;
};

const ritualStates: readonly RitualState[] = [
  {
    kicker: 'LIBERTÉ',
    value: '65+',
    unit: 'ingrédients',
    heading: 'Choisissez votre direction.'
  },
  {
    kicker: 'SUR MESURE',
    value: '100%',
    unit: 'votre composition',
    heading: 'Regardez-la prendre forme.'
  },
  {
    kicker: 'FEU DE BOIS',
    value: '450°',
    unit: 'cuisson vive',
    heading: 'La flamme fait le reste.'
  }
];

export function initRitual(): void {
  const stage = query<HTMLElement>('[data-ritual-stage]');
  const steps = queryAll<HTMLElement>('[data-ritual-step]');
  const kicker = query<HTMLElement>('[data-ritual-kicker]', stage);
  const value = query<HTMLElement>('[data-ritual-value]', stage);
  const unit = query<HTMLElement>('[data-ritual-unit]', stage);
  const progress = query<HTMLElement>('[data-ritual-progress]', stage);
  const heading = query<HTMLElement>('[data-ritual-heading]', stage);
  let activeIndex = 0;

  const activate = (index: number): void => {
    const state = ritualStates[index];
    if (state === undefined || index === activeIndex && stage.dataset.state === String(index)) return;

    activeIndex = index;
    stage.dataset.state = String(index);
    kicker.textContent = state.kicker;
    value.textContent = state.value;
    unit.textContent = state.unit;
    progress.textContent = `${String(index + 1).padStart(2, '0')} / ${String(ritualStates.length).padStart(2, '0')}`;
    heading.textContent = state.heading;

    steps.forEach((step, stepIndex) => {
      const isActive = stepIndex === index;
      step.classList.toggle('is-active', isActive);
      step.setAttribute('aria-pressed', String(isActive));
      if (isActive) {
        step.setAttribute('aria-current', 'step');
      } else {
        step.removeAttribute('aria-current');
      }
    });
  };

  steps.forEach((step, index) => {
    step.addEventListener('click', () => activate(index));
    step.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      activate(index);
    });
  });

  if (!('IntersectionObserver' in window)) return;

  const compactViewport = window.matchMedia('(max-width: 720px)').matches;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) return;
      const index = Number(entry.target.dataset.ritualStep);
      if (Number.isInteger(index)) activate(index);
    });
  }, {
    rootMargin: compactViewport ? '-58% 0px -27% 0px' : '-36% 0px -48% 0px',
    threshold: 0
  });

  steps.forEach((step) => observer.observe(step));
}
