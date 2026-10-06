// Shared, once-per-visit scroll reveals. Content remains visible without JavaScript.
(() => {
  'use strict';
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;

  const down = [
    '.about-eyebrow', '#about-title', '.capabilities-eyebrow', '#capabilities-title',
    '.capabilities-description', '.works-eyebrow', '#works-title',
    '#popup-title', '#poster-title', '.banner-heading', '#detail-title', '#project-title',
    '#geulgil-title', '.project-number', '.project-english', '.project-about h4',
    '#mockup-title', '#brand-logo-title', '#brand-type-title',
    '#sumn-title', '.sumn-number', '.sumn-tagline', '#sumn-about-title',
    '#sumn-design-title', '#sumn-typography-title', '.sumn-color-heading h2', '.closing-message',
    '.skill-item ul', '.project-facts > div', '.sumn-facts > div',
    '.brand-device-sizes > li', '.sumn-type-sizes > li'
  ];
  const left = ['#skills-title', '.detail-copy', '.brand-logo-copy > p', '.closing-thanks', '.brand-type-scale'];
  const pending = new Map();
  const mobile = matchMedia('(max-width: 760px)');
  let sequence = 0;
  const observer = new IntersectionObserver(entries => {
    let delay = 0;
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      const animation = pending.get(entry.target);
      if (!animation) continue;
      animation.effect.updateTiming({ delay: Math.min(delay, 240) });
      animation.play();
      delay += 60;
    }
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

  function stop() {
    if (!preference.matches) return;
    observer.disconnect();
    pending.forEach(animation => animation.cancel());
    pending.clear();
    preference.removeEventListener('change', stop);
  }
  function register(selector, direction) {
    document.querySelectorAll(selector).forEach(item => {
      if (pending.has(item)) return;
      const distance = mobile.matches ? 18 : 32;
      // Individual translate preserves existing layout transforms (e.g. centered artwork).
      const frames = [
        { translate: direction === 'left' ? distance + 'px 0' : '0 -' + distance + 'px' },
        { translate: '0 0' }
      ];
      // Thank you keeps its existing CSS opacity throughout the movement.
      if (!item.matches('.closing-thanks')) {
        frames[0].opacity = 0;
        frames[1].opacity = 1;
      }
      const animation = item.animate(frames, { duration: 900, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' });
      animation.id = 'scroll-reveal-' + direction + '-' + (++sequence);
      animation.pause();
      pending.set(item, animation);
      animation.onfinish = () => {
        pending.delete(item);
        animation.cancel();
        if (!pending.size) {
          observer.disconnect();
          preference.removeEventListener('change', stop);
        }
      };
      observer.observe(item);
    });
  }
  register(down.join(','), 'down');
  register(left.join(','), 'left');
  preference.addEventListener('change', stop);
})();
