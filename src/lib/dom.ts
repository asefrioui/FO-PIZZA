export function query<T extends Element>(selector: string, root: ParentNode = document): T {
  const element = root.querySelector<T>(selector);
  if (element === null) {
    throw new Error(`Élément requis introuvable : ${selector}`);
  }
  return element;
}

export function queryAll<T extends Element>(selector: string, root: ParentNode = document): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;

export function setPressed(element: HTMLElement, pressed: boolean): void {
  element.classList.toggle('active', pressed);
  element.setAttribute('aria-pressed', String(pressed));
}
