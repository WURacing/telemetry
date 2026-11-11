/*
  Two-finger chart interaction on touch screens.

  SciChart grabs every touch that starts on a chart, so on mobile you can't scroll
  the page past the plots. This holds single-finger touches back from SciChart so
  the browser scrolls instead (see the touch-action rule in index.css). Once a
  second finger lands on the chart, both fingers are handed to SciChart, so
  pinch zoom etc. still work. Mouse input is untouched.
*/

// Every chart's div id starts with "scichart-", except the track map
const CHART_SELECTOR = '[id^="scichart-"], #track-map';

// Latest event for each finger currently down on a chart
const touches = new Map<number, PointerEvent>();
// True once SciChart has been given the fingers for this gesture
let passing = false;
// Events we dispatch ourselves, which must be let through
const replayed = new WeakSet<Event>();

const isChart = (target: EventTarget | null) =>
  target instanceof Element && target.closest(CHART_SELECTOR) !== null;

// Re-sends a held-back finger's pointerdown so SciChart knows it's there
const replayDown = (e: PointerEvent) => {
  const down = new PointerEvent('pointerdown', {
    bubbles: true,
    cancelable: true,
    composed: true,
    pointerId: e.pointerId,
    pointerType: e.pointerType,
    isPrimary: e.isPrimary,
    clientX: e.clientX,
    clientY: e.clientY,
    screenX: e.screenX,
    screenY: e.screenY,
    width: e.width,
    height: e.height,
    pressure: e.pressure || 0.5,
    buttons: 1,
  });
  replayed.add(down);
  e.target?.dispatchEvent(down);
};

const onDown = (e: PointerEvent) => {
  if (e.pointerType !== 'touch' || replayed.has(e) || !isChart(e.target)) return;

  touches.set(e.pointerId, e);
  if (passing) return;

  if (touches.size < 2) {
    e.stopImmediatePropagation();
    return;
  }

  // Second finger: hand the first finger to SciChart, then let this one through
  passing = true;
  touches.forEach((held, id) => {
    if (id !== e.pointerId) replayDown(held);
  });
};

const onMove = (e: PointerEvent) => {
  if (!touches.has(e.pointerId)) return;
  touches.set(e.pointerId, e);
  if (!passing) e.stopImmediatePropagation();
};

const onEnd = (e: PointerEvent) => {
  if (!touches.has(e.pointerId)) return;
  touches.delete(e.pointerId);
  if (!passing) e.stopImmediatePropagation();
  if (touches.size === 0) passing = false;
};

export const installTwoFingerCharts = () => {
  // Capture phase on window runs before SciChart's listeners on the chart canvas
  window.addEventListener('pointerdown', onDown, true);
  window.addEventListener('pointermove', onMove, true);
  window.addEventListener('pointerup', onEnd, true);
  window.addEventListener('pointercancel', onEnd, true);
};
