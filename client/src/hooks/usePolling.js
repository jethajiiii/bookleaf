import { useRef, useEffect } from 'react';

/**
 * Silent polling hook. Calls `fn` on mount and every `intervalMs` thereafter.
 * Pauses automatically when `document.hidden` (tab not visible).
 * Cleans up the interval on unmount.
 * Does NOT cause a loading state — callers update data in-place to avoid remounts.
 *
 * @param {Function} fn  Async callback to invoke each tick
 * @param {number} intervalMs  Default 5000 ms
 * @param {boolean} enabled  Set false to pause from outside
 */
export function usePolling(fn, intervalMs = 5000, enabled = true) {
  // Keep fn stable — always call the latest version without restarting the interval
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      if (document.hidden) return; // pause when tab is hidden
      fnRef.current();
    };

    // Fire immediately on mount, then on schedule
    tick();
    const id = setInterval(tick, intervalMs);

    const onVisibilityChange = () => {
      if (!document.hidden) tick(); // resume immediately when tab becomes visible
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [intervalMs, enabled]);
}

export default usePolling;
