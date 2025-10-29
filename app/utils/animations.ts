export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 250,
  slow: 400,
} as const;

export const TRANSITIONS = {
  default: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  fadeIn: 'opacity 0.3s ease-in-out',
  slideIn: 'transform 0.3s ease-out',
} as const;

export const EASING_FUNCTIONS = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;
