(() => {
  'use strict';
  // Circular positions wrap only outside the viewport; no cloned slide IDs.
  const wrap = (value, count) => ((value % count) + count) % count;
  const offsetAt = (index, phase, count) => wrap(index - phase + count / 2, count) - count / 2;
  const centerIndex = (phase, count) => wrap(Math.floor(phase + 1e-8), count);
  if (typeof module !== 'undefined' && module.exports) module.exports = { wrap, offsetAt, centerIndex };
  if (typeof document === 'undefined') return;
  const gallery = document.querySelector('.popup-gallery');
  const config = window.POPUP_GALLERY;
  if (!gallery || !config?.items?.length) return;
  const items = config.items;
  const count = items.length;
  const interval = Math.max(1500, Number(config.intervalMs) || 7000);
  const viewport = gallery.querySelector('.popup-viewport');
  const track = gallery.querySelector('.popup-track');
  const details = gallery.querySelector('.popup-details');
  const counter = gallery.querySelector('.popup-counter');
  const playButton = gallery.querySelector('.popup-play');
  const status = gallery.querySelector('.popup-status');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const number = i => String(i + 1).padStart(2, '0');
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function placeholder(index) {
    const box = element('div', 'popup-placeholder');
    box.style.setProperty('--card-hue', String([205, 25, 285, 150, 345, 48, 185, 260, 15][index % 9]));
    box.append(element('span', '', number(index)), element('small', '', 'POPUP DESIGN'));
    return box;
  }
  const cards = items.map((item, index) => {
    const card = element('figure', 'popup-slide');
    card.setAttribute('role', 'group');
    card.setAttribute('aria-roledescription', '슬라이드');
    card.setAttribute('aria-label', `${index + 1} / ${count}: ${item.title}`);
    if (item.image) {
      const image = element('img');
      image.alt = item.alt || item.title;
      image.draggable = false;
      image.decoding = 'async';
      image.addEventListener('error', () => image.replaceWith(placeholder(index)), { once: true });
      image.src = item.image;
      card.append(image);
    } else card.append(placeholder(index));
    track.append(card);
    const article = element('article', 'popup-detail');
    article.append(element('h4', '', item.title));
    const meta = element('dl', 'popup-meta');
    for (const [label, field] of [['Type', 'type'], ['Tool', 'tool'], ['Size', 'size'], ['Year', 'year']]) {
      meta.append(element('dt', '', label), element('dd', '', item[field] || '—'));
    }
    article.append(meta, element('p', 'popup-description', item.description || ''));
    details.append(article);
    return card;
  });
  const descriptions = [...details.children];
  let phase = 0, active = -1, step = 1, cardWidth = 1, viewportWidth = 1;
  let frame = null, previousTime = null, tween = null, pointer = null;
  let inView = false, hovered = false, focused = false, userPaused = reduced.matches;
  function select(index, announce = false) {
    if (index !== active) {
      active = index;
      descriptions.forEach((article, i) => {
        article.classList.toggle('is-active', i === active);
        article.setAttribute('aria-hidden', String(i !== active));
        cards[i].setAttribute('aria-hidden', String(i !== active));
      });
      counter.textContent = `${number(active)} / ${String(count).padStart(2, '0')}`;
    }
    if (announce) status.textContent = `${active + 1} / ${count}: ${items[active].title}`;
  }
  function draw() {
    cards.forEach((card, index) => {
      const x = (viewportWidth - cardWidth) / 2 + offsetAt(index, phase, count) * step;
      card.style.transform = `translate3d(${x}px, 0, 0)`;
    });
  }
  function measure() {
    viewportWidth = viewport.clientWidth;
    cardWidth = cards[0].getBoundingClientRect().width;
    step = cardWidth + viewportWidth * .03871;
    draw();
  }
  function canPlay() { return !userPaused && !hovered && !focused && !pointer && inView && !document.hidden && count > 1; }
  function requestFrame() {
    if (frame === null && !document.hidden && (tween || canPlay())) frame = requestAnimationFrame(tick);
  }
  function tick(time) {
    frame = null;
    const delta = previousTime === null ? 0 : Math.min(time - previousTime, 80);
    previousTime = time;
    if (tween) {
      tween.elapsed += delta;
      const progress = Math.min(1, tween.elapsed / tween.duration);
      phase = tween.from + (tween.to - tween.from) * (1 - Math.pow(1 - progress, 3));
      if (progress === 1) {
        phase = wrap(tween.to, count);
        tween = null;
        select(centerIndex(phase, count), true);
      }
    } else if (canPlay()) {
      phase = wrap(phase + delta / interval, count);
      select(centerIndex(phase, count));
    }
    draw();
    if (tween || canPlay()) requestFrame();
    else previousTime = null;
  }
  function sync() {
    previousTime = null;
    if (!tween && !canPlay() && frame !== null) { cancelAnimationFrame(frame); frame = null; }
    playButton.textContent = userPaused ? '자동 재생' : '일시정지';
    playButton.setAttribute('aria-pressed', String(!userPaused));
    requestFrame();
  }
  function goTo(target) {
    userPaused = true;
    if (reduced.matches) {
      tween = null;
      phase = wrap(target, count);
      select(centerIndex(phase, count), true);
      draw();
    } else tween = { from: phase, to: target, elapsed: 0, duration: 650 };
    sync();
  }
  function move(direction) {
    const base = tween ? tween.to : Math.floor(phase + 1e-8);
    goTo(base + direction);
  }
  gallery.querySelector('.popup-prev').addEventListener('click', () => move(-1));
  gallery.querySelector('.popup-next').addEventListener('click', () => move(1));
  playButton.addEventListener('click', () => {
    userPaused = !userPaused;
    // An explicit play command overrides focus/hover until the next interaction.
    if (!userPaused) { hovered = false; focused = false; }
    sync();
  });
  viewport.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  gallery.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovered = true; sync(); } });
  gallery.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') { hovered = false; sync(); } });
  gallery.addEventListener('focusin', event => { focused = event.target !== playButton; sync(); });
  gallery.addEventListener('focusout', event => { if (!gallery.contains(event.relatedTarget)) { focused = false; sync(); } });
  viewport.addEventListener('pointerdown', event => {
    if (event.button !== 0 || pointer) return;
    tween = null;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, phase, dragged: false };
    viewport.setPointerCapture(event.pointerId);
    sync();
  });
  viewport.addEventListener('pointermove', event => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    if (!pointer.dragged && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      pointer.dragged = true; userPaused = true;
    }
    if (pointer.dragged) { phase = pointer.phase - dx / step; draw(); }
  });
  function release(event) {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dragged = pointer.dragged;
    pointer = null;
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    if (dragged) goTo(Math.round(phase));
    else sync();
  }
  viewport.addEventListener('pointerup', release);
  viewport.addEventListener('pointercancel', release);
  viewport.addEventListener('lostpointercapture', release);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frame !== null) { cancelAnimationFrame(frame); frame = null; }
    sync();
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      userPaused = true;
      phase = wrap(Math.round(phase), count);
      tween = null;
      select(centerIndex(phase, count)); draw();
    }
    sync();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      sync();
    }, { threshold: 0 }).observe(gallery);
  } else inView = true;
  new ResizeObserver(measure).observe(viewport);
  gallery.querySelector('.popup-controls').hidden = false;
  select(0); measure(); sync();
})();