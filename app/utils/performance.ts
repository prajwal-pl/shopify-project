/**
 * Performance Optimization Utilities
 *
 * Helpers for optimizing animations and rendering performance.
 */

/**
 * Properties that trigger GPU acceleration
 */
export const GPU_ACCELERATED_PROPERTIES = [
  'transform',
  'opacity',
  'filter',
] as const;

/**
 * Get will-change declaration for animation optimization
 * Use sparingly - only on elements that will animate
 */
export function willChange(...properties: string[]) {
  return `will-change: ${properties.join(', ')};`;
}

/**
 * Common performance-optimized transition
 */
export function performantTransition(
  properties: string[] = ['transform', 'opacity'],
  duration = '0.3s',
  easing = 'cubic-bezier(0.4, 0, 0.2, 1)'
) {
  return properties
    .map(prop => `${prop} ${duration} ${easing}`)
    .join(', ');
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll/resize handlers
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Request animation frame wrapper
 */
export function smoothScroll(element: HTMLElement, to: number, duration: number) {
  const start = element.scrollTop;
  const change = to - start;
  const startTime = performance.now();

  function animateScroll(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-in-out)
    const easeProgress = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    element.scrollTop = start + change * easeProgress;

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}
