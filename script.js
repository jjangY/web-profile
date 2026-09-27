(() => {
  'use strict';
  const video = document.querySelector('.hero-video');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let resumeOnVisible = false;
  async function play() {
    video.muted = true;
    try { await video.play(); } catch { /* Keep the poster frame when autoplay is unavailable. */ }
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      resumeOnVisible = !video.paused;
      video.pause();
    } else if (resumeOnVisible && !reducedMotion.matches) {
      resumeOnVisible = false;
      play();
    }
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) video.pause();
  });
  if (!reducedMotion.matches) play();
})();
// Reveal characters in place so centered mobile text never shifts while typing.
(() => {
  'use strict';
  const copy = document.querySelector('.hero-copy');
  if (!copy) return;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches) return;
  const heading = copy.querySelector('h1');
  const signature = copy.querySelector('.signature');
  const stages = [...copy.querySelectorAll('.hero-line'), signature];
  const characters = [];
  let due = 350;
  heading.setAttribute('aria-label', heading.textContent.replace(/\s+/g, ' ').trim());
  signature.setAttribute('aria-label', signature.textContent.trim());
  stages.forEach((stage, stageIndex) => {
    const walker = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const fragment = document.createDocumentFragment();
      for (const character of node.textContent) {
        const span = document.createElement('span');
        span.className = 'typing-character';
        span.textContent = character;
        span.setAttribute('aria-hidden', 'true');
        fragment.append(span);
        characters.push({ span, due });
        due += stageIndex === 2 ? 45 : 65;
      }
      node.replaceWith(fragment);
    }
    due += 240;
  });
  let index = 0;
  let elapsed = 0;
  let previous = null;
  let frame = null;
  let current = null;
  let finished = false;
  function finish() {
    finished = true;
    cancelAnimationFrame(frame);
    characters.forEach(({ span }) => span.classList.add('is-visible'));
    current?.classList.remove('is-current');
    document.removeEventListener('visibilitychange', onVisibility);
    preference.removeEventListener('change', onPreference);
  }
  function tick(time) {
    if (finished || document.hidden) return;
    if (previous !== null) elapsed += time - previous;
    previous = time;
    while (index < characters.length && elapsed >= characters[index].due) {
      current?.classList.remove('is-current');
      current = characters[index++].span;
      current.classList.add('is-visible', 'is-current');
    }
    if (index === characters.length && elapsed >= due) finish();
    else frame = requestAnimationFrame(tick);
  }
  function onVisibility() {
    cancelAnimationFrame(frame);
    previous = null;
    if (!document.hidden && !finished) frame = requestAnimationFrame(tick);
  }
  function onPreference() { if (preference.matches) finish(); }
  document.addEventListener('visibilitychange', onVisibility);
  preference.addEventListener('change', onPreference);
  if (!document.hidden) frame = requestAnimationFrame(tick);
})();
// Reveal each principle once when it enters the viewport.
(() => {
  'use strict';
  const items = document.querySelectorAll('.about-principle');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!items.length || preference.matches || !('IntersectionObserver' in window)) return;
  const animations = new Set();
  let remaining = items.length;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      const animation = entry.target.animate([
        { opacity: 0, transform: 'translateY(28px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 750, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      animations.add(animation);
      animation.onfinish = () => {
        animations.delete(animation);
        if (remaining === 0 && animations.size === 0) preference.removeEventListener('change', onPreference);
      };
      remaining -= 1;
    }
    if (remaining === 0) observer.disconnect();
  }, { threshold: 0.12 });
  function onPreference() {
    if (!preference.matches) return;
    observer.disconnect();
    animations.forEach(animation => animation.cancel());
    animations.clear();
    preference.removeEventListener('change', onPreference);
  }
  preference.addEventListener('change', onPreference);
  items.forEach(item => observer.observe(item));
})();
