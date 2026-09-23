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