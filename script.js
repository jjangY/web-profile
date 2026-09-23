(() => {
  'use strict';
  const video = document.querySelector('.hero-video');
  const control = document.querySelector('.video-control');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let resumeOnVisible = false;
  function updateControl() {
    const label = video.ended ? '다시 재생' : video.paused ? '재생' : '일시정지';
    control.textContent = label;
    control.setAttribute('aria-label', `배경 영상 ${label}`);
    control.hidden = false;
  }
  async function play() {
    video.muted = true;
    try { await video.play(); } catch { updateControl(); }
  }
  control.addEventListener('click', () => {
    if (video.paused || video.ended) {
      if (video.ended) video.currentTime = 0;
      play();
    } else { video.pause(); }
  });
  for (const event of ['play', 'pause', 'ended', 'loadeddata']) {
    video.addEventListener(event, updateControl);
  }
  video.addEventListener('error', () => { control.hidden = true; });
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