import { useState, useEffect } from "react";

/**
 * useScrollPosition Hook
 * Returns the current scroll position of the window
 * Used to fade in/out the header
 * @returns {ScrollPosition} ScrollPosition
 */

interface ScrollPosition {
  x: number;
  y: number;
}

// Check if we are in the browser
const isBrowser = typeof window !== `undefined`;

// Get the current scroll position
function getScrollPosition(): ScrollPosition {
  return isBrowser
    ? { x: window.pageXOffset, y: window.pageYOffset }
    : { x: 0, y: 0 };
}

// Debounce the scroll event
function debounce<F extends (...params: unknown[]) => void>(
  fn: F,
  delay: number
) {
  let timeoutID = 0;
  return function (this: unknown, ...args: unknown[]) {
    clearTimeout(timeoutID);
    timeoutID = window.setTimeout(() => fn.apply(this, args), delay);
  } as F;
}

// Hook
export function useScrollPosition(): ScrollPosition {
  const [position, setScrollPosition] = useState<ScrollPosition>(
    getScrollPosition()
  );

  useEffect(() => {
    let requestRunning: number | null = null;

    function handleScroll() {
      if (isBrowser && requestRunning === null) {
        requestRunning = window.requestAnimationFrame(() => {
          setScrollPosition(getScrollPosition());
          requestRunning = null;
        });
      }
    }

    if (isBrowser) {
      window.addEventListener("scroll", debounce(handleScroll, 200));
      return () =>
        window.removeEventListener("scroll", debounce(handleScroll, 200));
    }
  }, []);

  return position;
}
