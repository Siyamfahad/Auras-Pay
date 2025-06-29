/**
 * @file Animations.ts
 * @description Animation variants for Framer Motion.
 */

export const ANIMATE_CONTAINER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
    },
  },
};

const SPRING = {
  type: "spring",
  damping: 50,
  stiffness: 200,
};

export const ANIMATE_HEADING = {
  hidden: { opacity: 0, y: 100 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ...SPRING, delay: 0 },
  },
};

export const ANIMATE_SUBTITLE = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ...SPRING, delay: 0.2 },
  },
};

export const ANIMATE_MOBILE_MENU = {
  hidden: { opacity: 0, x: -10 },
  exit: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: { ...SPRING, delay: 0.2 },
  },
};

export const ANIMATE_BUTTON = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ...SPRING, delay: 0.3 },
  },
};
