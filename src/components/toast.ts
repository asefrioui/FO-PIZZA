import { query } from '../lib/dom';

let toastTimer: number | undefined;

export function showToast(message: string): void {
  const toast = query<HTMLElement>('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2300);
}
