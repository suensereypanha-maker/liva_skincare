(function (window) {
  'use strict';

  const slides = [
    { id: 'everyday', theme: 'dark', image: 'assets/campaign/everyday-poster.webp', video: 'assets/campaign/everyday-film.mp4', mobileVideo: 'assets/campaign/everyday-film-mobile.mp4', duration: 10000, eyebrow: 'THE LIVA DAILY EDIT', title: 'The art of<br><em>the everyday.</em>', description: 'Hair and body essentials.<br> A little space for yourself.', cta: 'Shop the collection', href: '#shop', note: 'HAIR + BODY CARE', chapter: 'Everyday', alt: 'LIVA hair and body essentials in warm, sculptural light' },
    { id: 'pair', theme: 'light', image: 'assets/campaign/hair-pair.webp', duration: 8000, eyebrow: 'THE HAIR PAIR', title: 'Good things<br>come <em>in pairs.</em>', description: 'Shampoo &amp; conditioner.<br> Two essentials, one place to begin.', cta: 'Discover the pair', href: '#product/ritual-duo', note: '2 × 250 mL · $38.00 · Sample collection', chapter: 'The hair pair', alt: 'LIVA shampoo and conditioner paired on a sunlit stone surface' },
    { id: 'moment', theme: 'dark', image: 'assets/campaign/your-moment.webp', duration: 8000, eyebrow: 'A MOMENT, JUST YOURS', title: 'A little time.<br><em>Entirely yours.</em>', description: 'Make room for the things<br> that belong in your everyday.', cta: 'Build your shelf', href: '#routine', note: 'CURATED BY YOU', chapter: 'Your moment', alt: 'A quiet moment of personal care in warm afternoon light' }
  ];

  const kmSlideMap = {
    everyday: {
      eyebrow: 'ការថែទាំប្រចាំថ្ងៃរបស់ LIVA',
      title: 'សិល្បៈនៃ<br><em>ជីវិតប្រចាំថ្ងៃ។</em>',
      description: 'របស់ចាំបាច់សម្រាប់សក់ និងដងខ្លួន។<br> ពេលវេលាដ៏ស្ងប់ស្ងាត់សម្រាប់ខ្លួនអ្នក។',
      cta: 'ស្វែងរកទំនិញទាំងអស់',
      note: 'ការថែទាំសក់ និងដងខ្លួន',
      chapter: 'ប្រចាំថ្ងៃ'
    },
    pair: {
      eyebrow: 'ឈុតថែរក្សាសក់',
      title: 'អ្វីដែលល្អ<br>តែងតែមក<em>ជាគូ។</em>',
      description: 'សាប៊ូកក់ និងបន្ទន់សក់។<br> របស់ចាំបាច់ទាំងពីរ កន្លែងចាប់ផ្តើមដ៏ល្អ។',
      cta: 'ស្វែងយល់ពីឈុតនេះ',
      note: '២ × ២៥០ mL · $៣៨.០០ · កម្រងគំរូ',
      chapter: 'ឈុតសក់'
    },
    moment: {
      eyebrow: 'ពេលវេលាផ្ទាល់ខ្លួនរបស់អ្នក',
      title: 'ពេលវេលាដ៏មានតម្លៃ<br><em>សម្រាប់តែអ្នក។</em>',
      description: 'ទុកកន្លែងសម្រាប់របស់<br> ដែលជាជីវិតប្រចាំថ្ងៃរបស់អ្នក។',
      cta: 'រៀបចំកញ្ចប់ផ្ទាល់ខ្លួន',
      note: 'រៀបចំដោយអ្នកផ្ទាល់',
      chapter: 'ពេលវេលារបស់អ្នក'
    }
  };

  // A single clock owns rotation. Temporary suspensions preserve time; user
  // interaction stays paused until Play starts a fresh chapter.
  function createPlaybackController(options) {
    const durations = options.durations;
    const now = options.now;
    const blocked = new Set(options.suspended || []);
    let index = 0, elapsed = 0, frame = null, destroyed = false;
    let userPaused = !!(options.reducedMotion || options.saveData);
    let running = !userPaused && blocked.size === 0;
    let lastTime = now();

    function snapshot() {
      return { index, running, userPaused, destroyed, progress: Math.min(1, elapsed / durations[index]) };
    }
    function progress() { if (options.onProgress) options.onProgress(snapshot().progress); }
    function emit(change) { if (options.onState) options.onState(snapshot(), change || {}); }
    function captureElapsed() {
      if (running) elapsed = Math.min(durations[index], elapsed + Math.max(0, now() - lastTime));
      lastTime = now();
    }
    function schedule() {
      if (running && frame === null) frame = options.requestFrame(tick);
    }
    function reconcile(change) {
      const wasRunning = running;
      running = !destroyed && !userPaused && blocked.size === 0;
      if (!running && frame !== null) { options.cancelFrame(frame); frame = null; }
      if (running && !wasRunning) lastTime = now();
      emit(change);
      progress();
      schedule();
    }
    function tick() {
      frame = null;
      if (!running || destroyed) return;
      captureElapsed();
      if (elapsed >= durations[index]) {
        const previousIndex = index;
        index = (index + 1) % durations.length;
        elapsed = 0;
        emit({ manual: false, previousIndex });
      }
      progress();
      schedule();
    }
    const controller = {
      snapshot,
      navigate(nextIndex) {
        if (destroyed || !Number.isFinite(nextIndex)) return;
        const previousIndex = index;
        index = ((Math.trunc(nextIndex) % durations.length) + durations.length) % durations.length;
        userPaused = true;
        elapsed = 0;
        lastTime = now();
        reconcile({ manual: true, previousIndex });
      },
      pause() {
        if (destroyed || userPaused) return;
        captureElapsed();
        userPaused = true;
        reconcile();
      },
      play() {
        if (destroyed) return;
        userPaused = false;
        elapsed = 0;
        lastTime = now();
        reconcile({ restart: true });
      },
      suspend(reason, value) {
        if (destroyed || blocked.has(reason) === !!value) return;
        captureElapsed();
        if (value) blocked.add(reason); else blocked.delete(reason);
        reconcile();
      },
      setPreference(value) { if (value) controller.pause(); },
      destroy() {
        if (destroyed) return;
        destroyed = true;
        reconcile();
      }
    };
    schedule();
    return controller;
  }

  // Browsers may settle play() after a slide or route has changed. A stale
  // request must never revive hidden media or pause a newer Play request.
  function createVideoPlayback(video, options) {
    options = options || {};
    let wanted = false, destroyed = false, version = 0;
    function visible(value) { if (options.onVisible) options.onVisible(value); }
    function playing() {
      if (!wanted || destroyed) { video.pause(); return; }
      visible(true);
    }
    function failed() { video.pause(); visible(false); }
    video.addEventListener('playing', playing);
    video.addEventListener('error', failed);
    return {
      sync(value) {
        value = !!value && !destroyed;
        if (value === wanted) return;
        wanted = value;
        const request = ++version;
        if (!wanted) { video.pause(); return; }
        if (options.prepare) options.prepare();
        let promise;
        try { promise = video.play(); } catch (_) { failed(); return; }
        if (promise && typeof promise.then === 'function') promise.then(() => {
          if (destroyed || !wanted) video.pause();
        }, () => {
          if (!destroyed && request === version) failed();
        });
      },
      destroy() {
        if (destroyed) return;
        destroyed = true;
        wanted = false;
        version += 1;
        video.pause();
        visible(false);
        video.removeEventListener('playing', playing);
        video.removeEventListener('error', failed);
      }
    };
  }

  // The mobile menu can keep hidden=false while a desktop media query removes
  // it from layout. Only a rendered overlay should suspend the campaign.
  function createOverlayMonitor(options) {
    const document = options.document;
    let destroyed = false;
    function isOpen() {
      return document.body.classList.contains('drawer-open') || [...document.querySelectorAll('.mobile-nav, .header-search')].some(node => !node.hidden && node.getClientRects().length > 0);
    }
    function changed() {
      if (!destroyed) options.onChange(isOpen());
    }
    const observer = new options.MutationObserver(changed);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    document.querySelectorAll('.mobile-nav, .header-search').forEach(node => observer.observe(node, { attributes: true, attributeFilter: ['hidden'] }));
    options.breakpoint.addEventListener('change', changed);
    return {
      isOpen, destroy() {
        destroyed = true;
        observer.disconnect();
        options.breakpoint.removeEventListener('change', changed);
      }
    };
  }

  const svg = (path, extra) => `<svg class="icon${extra ? ' ' + extra : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
  const arrow = svg('<path d="M4 12h16m-6-6 6 6-6 6"/>');
  const pauseIcon = svg('<path d="M9 5v14M15 5v14"/>', 'campaign-pause-icon');
  const playIcon = svg('<path d="m8 5 11 7-11 7Z"/>', 'campaign-play-icon');

  function renderHero() {
    const isKm = typeof window !== 'undefined' && window.Liva && window.Liva.getLang && window.Liva.getLang() === 'km';
    const activeSlides = slides.map(slide => {
      if (!isKm) return slide;
      return Object.assign({}, slide, kmSlideMap[slide.id] || {});
    });
    const pauseText = isKm ? 'ផ្អាក' : 'Pause';

    return `<section class="campaign-hero" id="liva-campaign" role="region" aria-roledescription="carousel" aria-label="LIVA collection stories" data-theme="dark" style="--hero-progress:0">
      <div class="campaign-stage">${activeSlides.map((slide, index) => `<article class="campaign-slide${index === 0 ? ' is-active' : ''}" data-slide="${index}" data-theme="${slide.theme}" role="group" aria-roledescription="slide" aria-label="${index + 1} of 3: ${slide.chapter}"${index ? ' inert aria-hidden="true"' : ' aria-hidden="false"'}>
        <div class="campaign-media"><img class="campaign-poster" src="${slide.image}" alt="${slide.alt}" width="${index === 0 ? 1280 : 1672}" height="${index === 0 ? 720 : 941}"${index === 0 ? ' fetchpriority="high" loading="eager"' : ' loading="lazy"'} decoding="async">${slide.video ? `<video class="campaign-video" muted playsinline loop preload="none" poster="${slide.image}" aria-hidden="true" tabindex="-1" disablepictureinpicture></video>` : ''}</div>
        <div class="campaign-copy"><p class="campaign-eyebrow">${slide.eyebrow}</p><${index ? 'h2' : 'h1'} class="campaign-title">${slide.title}</${index ? 'h2' : 'h1'}><p class="campaign-description">${slide.description}</p><a class="btn campaign-cta" href="${slide.href}">${slide.cta} ${arrow}</a><span class="campaign-note">${slide.note}</span></div>
      </article>`).join('')}</div>
      <div class="campaign-footer"><div class="campaign-pagination" role="group" aria-label="Choose a collection story">${activeSlides.map((slide, index) => `<button type="button" class="campaign-chapter" data-hero-go="${index}" aria-label="Show story ${index + 1}: ${slide.chapter}"${index === 0 ? ' aria-current="true"' : ''}><span class="chapter-number" aria-hidden="true">0${index + 1}</span><span class="chapter-name">${slide.chapter}</span><span class="chapter-progress" aria-hidden="true"><span></span></span></button>`).join('')}</div>
      <div class="campaign-controls"><span class="campaign-counter" aria-hidden="true">01 / 03</span><button type="button" class="campaign-arrow" data-hero-prev aria-label="Previous story">${arrow}</button><button type="button" class="campaign-arrow" data-hero-next aria-label="Next story">${arrow}</button><button type="button" class="campaign-motion" data-hero-motion aria-label="Pause slideshow and video">${pauseIcon}${playIcon}<span>${pauseText}</span></button></div></div>
      <p class="campaign-status sr-only" role="status" aria-atomic="true"></p>
    </section>`;
  }

  if (typeof module === 'object' && module.exports) module.exports = { createPlaybackController, createVideoPlayback, createOverlayMonitor, renderHero };
  if (!window || !window.Liva) return;

  const L = window.Liva;
  let instance = null;
  L.renderHero = renderHero;
  L.destroyHero = function () {
    if (!instance) return;
    instance.destroy();
    instance = null;
  };
  L.initHero = function () {
    const root = document.getElementById('liva-campaign');
    if (instance && instance.root === root) return;
    L.destroyHero();
    if (!root) return;

    const slideNodes = [...root.querySelectorAll('[data-slide]')];
    const chapters = [...root.querySelectorAll('[data-hero-go]')];
    const motionButton = root.querySelector('[data-hero-motion]');
    const status = root.querySelector('.campaign-status');
    const counter = root.querySelector('.campaign-counter');
    const video = root.querySelector('video');
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 760px)');
    const connection = window.navigator.connection;
    const cleanup = [];
    let controller, destroyed = false, touchStart = null, ignoreClickUntil = 0;
    let motionIntent = null;

    function listen(target, name, callback, options) {
      target.addEventListener(name, callback, options);
      cleanup.push(() => target.removeEventListener(name, callback, options));
    }
    const playback = createVideoPlayback(video, {
      prepare() {
        if (video.hasAttribute('src')) return;
        video.muted = true;
        video.src = mobileQuery.matches ? slides[0].mobileVideo : slides[0].video;
      },
      onVisible(value) { video.classList.toggle('is-playing', value); }
    });
    function applyState(state, change) {
      change = change || {};
      if (change.manual && change.previousIndex !== state.index && slideNodes[change.previousIndex].contains(document.activeElement)) {
        chapters[state.index].focus({ preventScroll: true });
      }
      slideNodes.forEach((slide, index) => {
        const active = index === state.index;
        slide.classList.toggle('is-active', active);
        slide.inert = !active;
        slide.setAttribute('aria-hidden', String(!active));
        if (active) slide.querySelector('img').loading = 'eager';
        if (active) chapters[index].setAttribute('aria-current', 'true'); else chapters[index].removeAttribute('aria-current');
      });
      root.dataset.theme = slides[state.index].theme;
      root.dataset.paused = String(state.userPaused);
      root.dataset.running = String(state.running);
      const isKm = typeof window !== 'undefined' && window.Liva && window.Liva.getLang && window.Liva.getLang() === 'km';
      motionButton.setAttribute('aria-label', state.userPaused ? (isKm ? 'ចាក់ស្លាយ និងវីដេអូ' : 'Play slideshow and video') : (isKm ? 'ផ្អាកស្លាយ និងវីដេអូ' : 'Pause slideshow and video'));
      motionButton.querySelector('span').textContent = state.userPaused ? (isKm ? 'ចាក់' : 'Play') : (isKm ? 'ផ្អាក' : 'Pause');
      motionButton.classList.toggle('is-paused', state.userPaused);
      counter.textContent = `0${state.index + 1} / 03`;
      if (change.manual) status.textContent = isKm ? `រឿងរ៉ាវទី ${state.index + 1} នៃ 3: ${(kmSlideMap[slides[state.index].id] || {}).chapter || slides[state.index].chapter}` : `Story ${state.index + 1} of 3: ${slides[state.index].chapter}`;
      if ((change.restart || change.previousIndex !== undefined) && state.index === 0 && video.hasAttribute('src')) {
        try { video.currentTime = 0; } catch (_) { }
      }
      playback.sync(state.running && state.index === 0);
    }
    const rect = root.getBoundingClientRect();
    const suspended = [];
    const overlayMonitor = createOverlayMonitor({ document, breakpoint: mobileQuery, MutationObserver: window.MutationObserver, onChange: open => controller.suspend('overlay', open) });
    cleanup.push(() => overlayMonitor.destroy());
    if (document.hidden) suspended.push('hidden');
    if (overlayMonitor.isOpen()) suspended.push('overlay');
    if (rect.bottom <= 0 || rect.top >= window.innerHeight) suspended.push('offscreen');
    controller = createPlaybackController({
      durations: slides.map(slide => slide.duration),
      reducedMotion: mediaQuery.matches,
      saveData: !!(connection && connection.saveData),
      suspended,
      now: () => window.performance.now(),
      requestFrame: callback => window.requestAnimationFrame(callback),
      cancelFrame: id => window.cancelAnimationFrame(id),
      onState: applyState,
      onProgress: value => root.style.setProperty('--hero-progress', value.toFixed(4))
    });
    applyState(controller.snapshot());

    listen(root, 'pointerenter', event => {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') controller.pause();
    });
    listen(root, 'focusin', () => controller.pause());
    listen(motionButton, 'pointerdown', () => { motionIntent = controller.snapshot().userPaused ? 'play' : 'pause'; });
    listen(root, 'click', event => {
      if (window.performance.now() < ignoreClickUntil) { event.preventDefault(); return; }
      const button = event.target.closest('button');
      if (!button || !root.contains(button)) return;
      if (button === motionButton) {
        const action = motionIntent || (controller.snapshot().userPaused ? 'play' : 'pause');
        motionIntent = null;
        controller[action]();
      } else if (button.hasAttribute('data-hero-go')) controller.navigate(Number(button.dataset.heroGo));
      else if (button.hasAttribute('data-hero-prev')) controller.navigate(controller.snapshot().index - 1);
      else if (button.hasAttribute('data-hero-next')) controller.navigate(controller.snapshot().index + 1);
    });
    listen(root, 'keydown', event => {
      motionIntent = null;
      if (event.altKey || event.ctrlKey || event.metaKey || event.target.matches('input, textarea, select, [contenteditable="true"]')) return;
      const index = controller.snapshot().index;
      const target = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: slides.length - 1 }[event.key];
      if (target === undefined) return;
      event.preventDefault();
      controller.navigate(target);
    });
    listen(root, 'pointerdown', event => {
      if (event.pointerType !== 'touch' || !event.isPrimary || event.target.closest('button, a, input, select, textarea')) return;
      touchStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
    }, { passive: true });
    listen(root, 'pointerup', event => {
      if (!touchStart || event.pointerId !== touchStart.id) return;
      const dx = event.clientX - touchStart.x, dy = event.clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      ignoreClickUntil = window.performance.now() + 400;
      controller.navigate(controller.snapshot().index + (dx < 0 ? 1 : -1));
    }, { passive: true });
    listen(root, 'pointercancel', () => { touchStart = null; motionIntent = null; }, { passive: true });
    listen(document, 'visibilitychange', () => controller.suspend('hidden', document.hidden));
    listen(mediaQuery, 'change', () => controller.setPreference(mediaQuery.matches));
    if (connection && connection.addEventListener) listen(connection, 'change', () => controller.setPreference(connection.saveData));

    if (window.IntersectionObserver) {
      const observer = new window.IntersectionObserver(entries => {
        if (destroyed) return;
        const entry = entries[entries.length - 1];
        controller.suspend('offscreen', !entry.isIntersecting || entry.intersectionRatio < 0.1);
      }, { threshold: [0, 0.1] });
      observer.observe(root);
      cleanup.push(() => observer.disconnect());
    }
    instance = {
      root, destroy() {
        destroyed = true;
        controller.destroy();
        cleanup.forEach(remove => remove());
        playback.destroy();
        video.removeAttribute('src');
        video.load();
      }
    };
  };
})(typeof window === 'undefined' ? null : window);
