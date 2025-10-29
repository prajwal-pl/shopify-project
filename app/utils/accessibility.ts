/**
 * Accessibility Utilities
 *
 * Constants and helpers for WCAG 2.1 AA compliance.
 */

/**
 * Media query for users who prefer reduced motion
 */
export const PREFERS_REDUCED_MOTION = '@media (prefers-reduced-motion: reduce)';

/**
 * Minimum touch target size (44x44px for WCAG AAA)
 */
export const MIN_TOUCH_TARGET = 44;

/**
 * Keyboard event keys
 */
export const KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
} as const;

/**
 * Focus visible utility class
 * Use for custom focus indicators
 */
export const FOCUS_VISIBLE_CLASS = 'focus-visible';

/**
 * Generate focus ring styles
 */
export function focusRingStyles(color = '#d4af37', offset = '2px') {
  return `
    outline: 2px solid ${color};
    outline-offset: ${offset};
    border-radius: 4px;
  `;
}

/**
 * Get reduced motion styles
 */
export function getReducedMotionStyles() {
  return `
    ${PREFERS_REDUCED_MOTION} {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  `;
}

/**
 * Handle keyboard activation (Enter/Space)
 */
export function handleKeyboardActivation(
  event: React.KeyboardEvent,
  callback: () => void
) {
  if (event.key === KEYS.ENTER || event.key === KEYS.SPACE) {
    event.preventDefault();
    callback();
  }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get ARIA live region announcement
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  if (typeof document === 'undefined') return;

  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}
