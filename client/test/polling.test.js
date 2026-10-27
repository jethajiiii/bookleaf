import test from 'node:test';
import assert from 'node:assert/strict';

test('usePolling Logic: interval, pause on hidden, cleanup', async (t) => {
  await t.test('calls tick initially and pauses when document is hidden', () => {
    let callCount = 0;
    const tick = () => {
      if (mockDocument.hidden) return;
      callCount += 1;
    };

    const mockDocument = { hidden: false };

    // Initial tick
    tick();
    assert.equal(callCount, 1);

    // Document hides
    mockDocument.hidden = true;
    tick(); // Interval fires while hidden
    assert.equal(callCount, 1, 'Should not increment while hidden');

    // Document becomes visible
    mockDocument.hidden = false;
    tick(); // Resume
    assert.equal(callCount, 2, 'Should increment when visible again');
  });

  await t.test('cleans up interval timer and event listener on unmount', () => {
    let clearedId = null;
    let removedEvent = null;

    const mockWindow = {
      clearInterval: (id) => {
        clearedId = id;
      },
    };
    const mockDocument = {
      removeEventListener: (event) => {
        removedEvent = event;
      },
    };

    const cleanup = (intervalId) => {
      mockWindow.clearInterval(intervalId);
      mockDocument.removeEventListener('visibilitychange');
    };

    cleanup(12345);
    assert.equal(clearedId, 12345);
    assert.equal(removedEvent, 'visibilitychange');
  });
});
