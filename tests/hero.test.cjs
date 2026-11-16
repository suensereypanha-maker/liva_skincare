const test = require('node:test');
const assert = require('node:assert/strict');
const hero = require('../js/hero.js');

function clock() {
  let now = 0, nextId = 0;
  const frames = new Map();
  return {
    now: () => now,
    requestFrame(callback) { frames.set(++nextId, callback); return nextId; },
    cancelFrame(id) { frames.delete(id); },
    advance(ms) {
      now += ms;
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach(callback => callback(now));
    },
    pending: () => frames.size
  };
}

function setup(options = {}) {
  assert.equal(typeof hero.createPlaybackController, 'function', 'hero playback controller is available');
  const timer = clock(), changes = [];
  const controller = hero.createPlaybackController({durations: [10000, 8000, 8000], ...timer, onState: (state, change) => changes.push({state, change}), ...options});
  return {controller, timer, changes};
}

test('autoplay gives the film and still chapters their full durations and wraps', () => {
  const {controller, timer} = setup();
  timer.advance(9999);
  assert.equal(controller.snapshot().index, 0);
  timer.advance(1);
  assert.equal(controller.snapshot().index, 1);
  timer.advance(7999);
  assert.equal(controller.snapshot().index, 1);
  timer.advance(1);
  assert.equal(controller.snapshot().index, 2);
  timer.advance(8000);
  assert.equal(controller.snapshot().index, 0);
  controller.destroy();
});

test('manual navigation wraps, pauses, and explicit Play starts a fresh chapter', () => {
  const {controller, timer, changes} = setup();
  timer.advance(4000);
  controller.navigate(-1);
  assert.equal(controller.snapshot().index, 2);
  assert.equal(controller.snapshot().running, false);
  assert.equal(changes.at(-1).change.manual, true);
  timer.advance(20000);
  assert.equal(controller.snapshot().index, 2);
  controller.navigate(3);
  assert.equal(controller.snapshot().index, 0);
  controller.play();
  timer.advance(9999);
  assert.equal(controller.snapshot().index, 0);
  timer.advance(1);
  assert.equal(controller.snapshot().index, 1);
  controller.destroy();
});

test('hover or focus pause remains paused until explicit Play', () => {
  const {controller, timer} = setup();
  timer.advance(4000);
  controller.pause();
  assert.equal(timer.pending(), 0);
  timer.advance(30000);
  assert.equal(controller.snapshot().index, 0);
  controller.play();
  timer.advance(9999);
  assert.equal(controller.snapshot().index, 0);
  timer.advance(1);
  assert.equal(controller.snapshot().index, 1);
  controller.destroy();
});

test('visibility, offscreen and overlay suspension compose without losing elapsed time', () => {
  const {controller, timer} = setup();
  timer.advance(4000);
  controller.suspend('hidden', true);
  controller.suspend('overlay', true);
  timer.advance(30000);
  controller.suspend('hidden', false);
  assert.equal(controller.snapshot().running, false);
  controller.suspend('overlay', false);
  assert.equal(controller.snapshot().running, true);
  timer.advance(5999);
  assert.equal(controller.snapshot().index, 0);
  timer.advance(1);
  assert.equal(controller.snapshot().index, 1);
  controller.destroy();
});

test('closing an overlay cannot resume a user-paused carousel', () => {
  const {controller, timer} = setup();
  controller.suspend('overlay', true);
  controller.pause();
  controller.suspend('overlay', false);
  assert.equal(controller.snapshot().running, false);
  assert.equal(timer.pending(), 0);
  controller.destroy();
});

test('reduced motion and data saving start still, but allow explicit Play', () => {
  for (const preference of ['reducedMotion', 'saveData']) {
    const {controller, timer} = setup({[preference]: true});
    assert.equal(controller.snapshot().running, false);
    assert.equal(timer.pending(), 0);
    timer.advance(20000);
    assert.equal(controller.snapshot().index, 0);
    controller.play();
    assert.equal(controller.snapshot().running, true);
    timer.advance(10000);
    assert.equal(controller.snapshot().index, 1);
    controller.destroy();
  }
});

test('new accessibility preference stops motion, and removing it does not restart', () => {
  const {controller, timer} = setup();
  controller.setPreference(true);
  assert.equal(controller.snapshot().running, false);
  controller.setPreference(false);
  timer.advance(30000);
  assert.equal(controller.snapshot().index, 0);
  assert.equal(controller.snapshot().running, false);
  controller.destroy();
});

test('destroy cancels scheduled work and permanently disables the old route controller', () => {
  const {controller, timer, changes} = setup();
  assert.equal(timer.pending(), 1);
  controller.destroy();
  const count = changes.length;
  controller.destroy();
  controller.play();
  controller.navigate(1);
  controller.suspend('hidden', false);
  timer.advance(100000);
  assert.equal(timer.pending(), 0);
  assert.equal(controller.snapshot().running, false);
  assert.equal(controller.snapshot().index, 0);
  assert.equal(changes.length, count);
});

class DeferredVideo extends EventTarget {
  paused = true;
  requests = [];
  play() {
    this.paused = false;
    return new Promise((resolve, reject) => this.requests.push({
      finish: () => { this.paused = false; this.dispatchEvent(new Event('playing')); resolve(); },
      reject
    }));
  }
  pause() { this.paused = true; }
}

test('late video play completion after navigation is stopped and never reveals a video frame', async () => {
  assert.equal(typeof hero.createVideoPlayback, 'function', 'video lifecycle guard is available');
  const video = new DeferredVideo();
  let visible = false;
  const playback = hero.createVideoPlayback(video, {onVisible: value => { visible = value; }});
  playback.sync(true);
  playback.sync(false);
  video.requests[0].finish();
  await Promise.resolve();
  assert.equal(video.paused, true);
  assert.equal(visible, false);
  playback.destroy();
});

test('a stale video request cannot pause a newer explicit Play request', async () => {
  assert.equal(typeof hero.createVideoPlayback, 'function');
  const video = new DeferredVideo();
  let visible = false;
  const playback = hero.createVideoPlayback(video, {onVisible: value => { visible = value; }});
  playback.sync(true);
  playback.sync(false);
  playback.sync(true);
  video.requests[1].finish();
  video.requests[0].finish();
  await Promise.resolve();
  assert.equal(video.paused, false);
  assert.equal(visible, true);
  playback.destroy();
});

test('blocked video retains the poster and destroy stops late playback', async () => {
  assert.equal(typeof hero.createVideoPlayback, 'function');
  const video = new DeferredVideo();
  let visible = false;
  const playback = hero.createVideoPlayback(video, {onVisible: value => { visible = value; }});
  playback.sync(true);
  video.requests[0].reject(new Error('Autoplay blocked'));
  await Promise.resolve();
  assert.equal(visible, false);
  assert.equal(video.paused, true);
  playback.sync(false);
  playback.sync(true);
  playback.destroy();
  video.requests[1].finish();
  await Promise.resolve();
  assert.equal(video.paused, true);
  assert.equal(visible, false);
});

function overlaySetup(controller) {
  assert.equal(typeof hero.createOverlayMonitor, 'function', 'overlay lifecycle monitor is available');
  const breakpoint = new EventTarget();
  const bodyClasses = new Set();
  const menu = {hidden: false, visible: true, getClientRects() { return this.visible ? [{}] : []; }};
  const search = {hidden: true, getClientRects() { return []; }};
  const document = {body: {classList: {contains: name => bodyClasses.has(name)}}, querySelectorAll: () => [menu, search]};
  let notifyMutation;
  class MutationObserver {
    constructor(callback) { notifyMutation = callback; }
    observe() {}
    disconnect() { notifyMutation = () => {}; }
  }
  const monitor = hero.createOverlayMonitor({document, breakpoint, MutationObserver, onChange: open => controller.suspend('overlay', open)});
  controller.suspend('overlay', monitor.isOpen());
  return {monitor, menu, breakpoint, bodyClasses, mutate: () => notifyMutation()};
}

test('a menu hidden by the desktop breakpoint releases suspension and blocks again when visible', () => {
  const {controller, timer} = setup();
  const {monitor, menu, breakpoint} = overlaySetup(controller);
  assert.equal(controller.snapshot().running, false);
  menu.visible = false; // CSS display:none; the HTML hidden attribute stays false.
  breakpoint.dispatchEvent(new Event('change'));
  assert.equal(controller.snapshot().running, true);
  timer.advance(10000);
  assert.equal(controller.snapshot().index, 1);
  menu.visible = true;
  breakpoint.dispatchEvent(new Event('change'));
  assert.equal(controller.snapshot().running, false);
  monitor.destroy();
  controller.destroy();
});

test('a breakpoint change preserves user pause and motion preferences until explicit Play', () => {
  for (const options of [{}, {reducedMotion: true}, {saveData: true}]) {
    const {controller, timer} = setup(options);
    if (!Object.keys(options).length) controller.pause();
    const {monitor, menu, breakpoint} = overlaySetup(controller);
    menu.visible = false;
    breakpoint.dispatchEvent(new Event('change'));
    timer.advance(20000);
    assert.equal(controller.snapshot().running, false);
    assert.equal(controller.snapshot().index, 0);
    controller.play();
    assert.equal(controller.snapshot().running, true);
    monitor.destroy();
    controller.destroy();
  }
});

test('a hidden mobile menu cannot release the bag suspension, and a destroyed monitor stops responding', () => {
  const {controller} = setup();
  const {monitor, menu, breakpoint, bodyClasses, mutate} = overlaySetup(controller);
  bodyClasses.add('drawer-open');
  menu.visible = false;
  breakpoint.dispatchEvent(new Event('change'));
  assert.equal(controller.snapshot().running, false);
  bodyClasses.delete('drawer-open');
  mutate();
  assert.equal(controller.snapshot().running, true);
  monitor.destroy();
  menu.visible = true;
  breakpoint.dispatchEvent(new Event('change'));
  assert.equal(controller.snapshot().running, true);
  controller.destroy();
});
