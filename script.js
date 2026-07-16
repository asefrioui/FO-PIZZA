const orderLinks = {
  paris: {
    label: 'Paris 13',
    delivery: 'https://www.order.store/store/fo-pizza/dnIDQ776TtK9eCv7G2-1cg',
    pickup: 'https://fo-pizza.com/paris/'
  },
  saclay: {
    label: 'Saclay',
    delivery: 'https://www.ubereats.com/store/fo-pizza-saclay/E5agnlCiSvWlUIG9jkOuZg',
    pickup: 'https://fo-pizza.com/saclay/'
  }
};

const products = {
  pizzas: [
    { name: 'Margherita', price: 9.5, description: 'Sauce tomate, mozzarella, basilic.', image: 'assets/pizza1.jpg' },
    { name: 'Reggina', price: 12.5, description: 'Tomate, mozzarella, jambon, champignons.', image: 'assets/pizza2.jpg' },
    { name: 'Pepperoni', price: 12.5, description: 'Tomate, mozzarella et pepperoni.', image: 'assets/pizza3.jpg' },
    { name: 'Végétarienne', price: 12.5, description: 'Une composition colorée et généreuse.', image: 'assets/pizza4.jpg' },
    { name: 'Chèvre Miel', price: 12.5, description: 'Le contraste du chèvre et du miel.', image: 'assets/pizza5.jpg' },
    { name: 'Raclette Truffe', price: 13.5, description: 'Raclette et huile aromatisée à la truffe.', image: 'assets/hero.jpg' }
  ],
  desserts: [
    { name: 'Panna Cotta', price: 3, description: 'Le dessert frais et délicat de la maison.' },
    { name: 'Tiramisu', price: 3, description: 'Un classique italien tout en douceur.' },
    { name: 'Pizza Banane Nutella', price: 4, description: 'La pizza dessert à partager — ou pas.' },
    { name: 'Pizza Poire Chocolat', price: 4, description: 'Poire fondante et chocolat gourmand.' }
  ]
};

const toppingLayout = {
  pepperoni: [[25,28],[54,22],[72,39],[38,54],[64,68],[28,76],[78,76]],
  basil: [[43,29],[68,25],[26,47],[56,51],[43,74],[75,58]],
  mushroom: [[35,19],[78,30],[24,63],[57,78],[67,48],[42,42]],
  olive: [[48,18],[60,34],[33,37],[77,55],[52,64],[22,72],[71,79]]
};

const ingredientLabels = {
  pepperoni: 'Pepperoni',
  basil: 'Basilic',
  mushroom: 'Champignon',
  olive: 'Olives'
};

const state = {
  location: 'paris',
  category: 'pizzas',
  base: 'tomate',
  ingredients: new Set(['pepperoni', 'basil']),
  lastFocused: null
};

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function formatPrice(value) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
}

function renderProducts(category = state.category) {
  const grid = qs('#product-grid');
  if (!grid) return;

  grid.innerHTML = products[category].map((product, index) => {
    const media = category === 'desserts'
      ? '<div class="product-media"><div class="dessert-art" aria-hidden="true"></div></div>'
      : `<div class="product-media"><img src="${product.image}" alt="${product.name}" loading="lazy"><span class="product-index">${String(index + 1).padStart(2, '0')}</span></div>`;

    return `
      <article class="product-card ${category === 'desserts' ? 'product-card-dessert' : ''}" style="animation-delay:${index * 55}ms">
        ${media}
        <div class="product-body">
          <div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
          </div>
          <div class="product-action">
            <strong class="product-price">${formatPrice(product.price)}</strong>
            <button class="product-add open-order" type="button" aria-label="Commander ${product.name}" title="Commander">↗</button>
          </div>
        </div>
      </article>`;
  }).join('');
}

function buildPizzaToppings() {
  const container = qs('#pizza-toppings');
  if (!container) return;

  container.innerHTML = Object.entries(toppingLayout).flatMap(([type, positions]) =>
    positions.map(([left, top], index) => {
      const rotation = (index * 37 + left) % 120 - 60;
      const hidden = state.ingredients.has(type) ? '' : ' is-hidden';
      return `<span class="topping ${type}${hidden}" data-topping="${type}" style="left:${left}%;top:${top}%;--rotation:${rotation}deg"></span>`;
    })
  ).join('');

  qsa('.topping.basil, .topping.mushroom', container).forEach((element, index) => {
    element.style.rotate = `${(index * 41) % 120 - 60}deg`;
  });
}

function updatePizza() {
  const pizza = qs('#pizza-3d');
  if (!pizza) return;
  pizza.classList.toggle('base-creme', state.base === 'creme');

  qsa('[data-topping]').forEach(topping => {
    topping.classList.toggle('is-hidden', !state.ingredients.has(topping.dataset.topping));
  });

  qsa('[data-base]').forEach(button => {
    const active = button.dataset.base === state.base;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  qsa('[data-ingredient]').forEach(button => {
    const active = state.ingredients.has(button.dataset.ingredient);
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  const selection = [state.base === 'tomate' ? 'Tomate' : 'Crème', ...[...state.ingredients].map(key => ingredientLabels[key])];
  qs('#selection-label').textContent = selection.join(' · ');
}

function randomizePizza() {
  state.base = Math.random() > .5 ? 'tomate' : 'creme';
  state.ingredients.clear();
  const keys = Object.keys(ingredientLabels).sort(() => Math.random() - .5);
  const count = 2 + Math.floor(Math.random() * 3);
  keys.slice(0, count).forEach(key => state.ingredients.add(key));
  updatePizza();
  showToast('Composition surprise prête !');

  if (!prefersReducedMotion) {
    const pizza = qs('#pizza-3d');
    pizza.animate([
      { transform: 'translate(-50%,-50%) rotateX(57deg) rotateZ(-18deg) scale(1)' },
      { transform: 'translate(-50%,-50%) rotateX(57deg) rotateZ(342deg) scale(1.04)' }
    ], { duration: 850, easing: 'cubic-bezier(.2,.75,.25,1)' });
  }
}

function setLocation(location, persist = true) {
  if (!orderLinks[location]) return;
  state.location = location;
  qs('.location-label').textContent = orderLinks[location].label;
  qs('#delivery-link').href = orderLinks[location].delivery;
  qs('#pickup-link').href = orderLinks[location].pickup;

  qsa('[data-order-location]').forEach(button => {
    const active = button.dataset.orderLocation === location;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  if (persist) {
    try { localStorage.setItem('fo-location', location); } catch (_) { /* Storage is optional. */ }
  }
}

function openOrderModal(preselect) {
  if (preselect) setLocation(preselect);
  state.lastFocused = document.activeElement;
  const modal = qs('#order-modal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => qs('.modal-close', modal)?.focus());
}

function closeOrderModal() {
  const modal = qs('#order-modal');
  if (!modal.classList.contains('open')) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  state.lastFocused?.focus?.();
}

function trapModalFocus(event) {
  if (event.key !== 'Tab') return;
  const modal = qs('#order-modal');
  if (!modal.classList.contains('open')) return;
  const focusables = qsa('button:not([disabled]), a[href]', modal).filter(element => element.offsetParent !== null);
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

let toastTimer;
function showToast(message) {
  const toast = qs('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
}

function initReveal() {
  const elements = qsa('.reveal');
  elements.forEach(element => {
    if (element.dataset.delay) element.style.setProperty('--delay', `${element.dataset.delay}ms`);
  });

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    elements.forEach(element => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .13, rootMargin: '0px 0px -45px' });

  elements.forEach(element => observer.observe(element));
}

function initCounters() {
  const counters = qsa('[data-count]');
  if (!counters.length) return;

  const animate = element => {
    const target = Number(element.dataset.count);
    if (prefersReducedMotion) {
      element.textContent = target;
      return;
    }
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / 1100, 1);
      element.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .7 });

  counters.forEach(counter => observer.observe(counter));
}

function initParallax() {
  if (prefersReducedMotion || !window.matchMedia('(pointer:fine)').matches) return;

  const hero = qs('.hero');
  const media = qs('#hero-media');
  hero?.addEventListener('pointermove', event => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    media.style.setProperty('--ry', `${x * 2.8}deg`);
    media.style.setProperty('--rx', `${y * -2.2}deg`);
    media.style.setProperty('--mx', `${x * -9}px`);
    media.style.setProperty('--my', `${y * -7}px`);
  });
  hero?.addEventListener('pointerleave', () => {
    ['--ry','--rx'].forEach(property => media.style.setProperty(property, '0deg'));
    ['--mx','--my'].forEach(property => media.style.setProperty(property, '0px'));
  });

  const stage = qs('#pizza-stage');
  const pizza = qs('#pizza-3d');
  stage?.addEventListener('pointermove', event => {
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    pizza.style.setProperty('--pizza-rx', `${57 + y * -10}deg`);
    pizza.style.setProperty('--pizza-rz', `${-18 + x * 14}deg`);
  });
  stage?.addEventListener('pointerleave', () => {
    pizza.style.setProperty('--pizza-rx', '57deg');
    pizza.style.setProperty('--pizza-rz', '-18deg');
  });
}

function initNavigation() {
  const header = qs('.site-header');
  const progress = qs('.scroll-progress span');
  const menuToggle = qs('.menu-toggle');
  const nav = qs('.main-nav');
  const actions = qs('.header-actions');
  const locationTrigger = qs('.location-trigger');

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 24);
    const max = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
    progress.style.width = `${Math.min(window.scrollY / max * 100, 100)}%`;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });

  qsa('a', nav).forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
  }));

  locationTrigger.addEventListener('click', event => {
    event.stopPropagation();
    const open = actions.classList.toggle('location-open');
    locationTrigger.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', event => {
    if (!actions.contains(event.target)) {
      actions.classList.remove('location-open');
      locationTrigger.setAttribute('aria-expanded', 'false');
    }
  });
}

function initEvents() {
  document.addEventListener('click', event => {
    const openButton = event.target.closest('.open-order');
    if (openButton) openOrderModal(openButton.dataset.preselect);

    if (event.target.closest('[data-close-modal]')) closeOrderModal();

    const location = event.target.closest('[data-location]');
    if (location) {
      setLocation(location.dataset.location);
      qs('.header-actions').classList.remove('location-open');
      qs('.location-trigger').setAttribute('aria-expanded', 'false');
      showToast(`Restaurant sélectionné : ${orderLinks[state.location].label}`);
    }

    const modalLocation = event.target.closest('[data-order-location]');
    if (modalLocation) setLocation(modalLocation.dataset.orderLocation);

    const base = event.target.closest('[data-base]');
    if (base) {
      state.base = base.dataset.base;
      updatePizza();
    }

    const ingredient = event.target.closest('[data-ingredient]');
    if (ingredient) {
      const key = ingredient.dataset.ingredient;
      state.ingredients.has(key) ? state.ingredients.delete(key) : state.ingredients.add(key);
      updatePizza();
    }
  });

  qs('#randomize').addEventListener('click', randomizePizza);

  qsa('[data-category]').forEach(tab => tab.addEventListener('click', () => {
    state.category = tab.dataset.category;
    qsa('[data-category]').forEach(button => {
      const active = button === tab;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    renderProducts(state.category);
  }));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeOrderModal();
    trapModalFocus(event);
  });
}

function init() {
  try {
    const savedLocation = localStorage.getItem('fo-location');
    if (orderLinks[savedLocation]) state.location = savedLocation;
  } catch (_) { /* Storage is optional. */ }

  qs('#year').textContent = new Date().getFullYear();
  setLocation(state.location, false);
  buildPizzaToppings();
  updatePizza();
  renderProducts();
  initReveal();
  initCounters();
  initParallax();
  initNavigation();
  initEvents();
}

document.addEventListener('DOMContentLoaded', init);
