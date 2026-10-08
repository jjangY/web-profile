(() => {
  'use strict';
  const gallery = document.querySelector('.banner-gallery');
  const config = window.BANNER_GALLERY;
  if (!gallery || !config?.items?.length) return;
  const viewport = gallery.querySelector('.banner-viewport');
  const dots = gallery.querySelector('.banner-dots');
  const play = gallery.querySelector('.banner-play');
  const status = gallery.querySelector('.banner-status');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const hold = Math.max(1000, Number(config.holdMs) || 4000);
  const fade = Math.max(0, Number(config.fadeMs) || 0);
  gallery.style.setProperty('--banner-fade', fade + 'ms');
  if (config.frameRatio && CSS.supports('aspect-ratio', config.frameRatio)) gallery.style.setProperty('--banner-ratio', config.frameRatio);
  const make = (tag, cls, text) => {
    const el = document.createElement(tag);
    el.className = cls;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  const placeholder = i => {
    const el = make('div', 'banner-placeholder');
    el.style.setProperty('--banner-hue', [42, 195, 330, 145][i % 4]);
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', `배너 ${i + 1} 이미지를 넣을 공간`);
    el.append(make('span', '', String(i + 1).padStart(2, '0')), make('small', '', 'BANNER DESIGN'));
    return el;
  };
  let active = 0, timer = null, inView = false, paused = preference.matches;
  const buttons = [], captions = [];
  const captionArea = make('div', 'banner-captions');
  viewport.insertAdjacentElement('afterend', captionArea);
  const slides = config.items.map((item, i) => {
    const slide = make('figure', 'banner-slide');
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', '슬라이드');
    slide.setAttribute('aria-label', `${i + 1} / ${config.items.length}`);
    if (item.image) {
      const img = make('img', '');
      img.alt = item.alt || `배너 디자인 ${i + 1}`;
      img.decoding = 'async';
      img.addEventListener('error', () => img.replaceWith(placeholder(i)), { once:true });
      img.src = item.image;
      slide.append(img);
    } else slide.append(placeholder(i));
    viewport.append(slide);
    const caption = make('div', 'banner-caption');
    caption.id = 'banner-caption-' + (i + 1);
    caption.append(make('h3', '', item.title || item.alt || '배너 디자인'), make('p', '', item.description || ''));
    captionArea.append(caption); captions.push(caption);
    slide.setAttribute('aria-describedby', caption.id);
    const button = make('button', 'banner-dot');
    button.type = 'button';
    button.setAttribute('aria-label', `배너 ${i + 1} 보기`);
    button.addEventListener('click', () => {
      paused = true;
      select(i);
      status.textContent = `${i + 1} / ${slides.length}: ${item.alt || '배너 디자인'}`;
      sync();
    });
    dots.append(button);
    buttons.push(button);
    return slide;
  });
  function alignCaptions() {
    const width = viewport.clientWidth, height = viewport.clientHeight;
    if (!width || !height) return;
    slides.forEach((slide, i) => {
      const img = slide.querySelector('img');
      const paintedWidth = img?.naturalWidth && img.naturalHeight
        ? Math.min(width, height * img.naturalWidth / img.naturalHeight) : width;
      captions[i].style.width = (paintedWidth / width * 100) + '%';
    });
  }
  function select(index) {
    active = index;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === active);
      slide.setAttribute('aria-hidden', String(i !== active));
      buttons[i].setAttribute('aria-pressed', String(i === active));
      captions[i].classList.toggle('is-active', i === active);
      captions[i].setAttribute('aria-hidden', String(i !== active));
    });
  }
  function sync() {
    clearTimeout(timer);
    timer = null;
    play.textContent = paused ? '자동 재생' : '일시정지';
    play.setAttribute('aria-pressed', String(!paused));
    if (!paused && inView && !document.hidden && slides.length > 1) {
      timer = setTimeout(() => { select((active + 1) % slides.length); sync(); }, hold + (preference.matches ? 0 : fade));
    }
  }
  play.addEventListener('click', () => { paused = !paused; sync(); });
  document.addEventListener('visibilitychange', sync);
  preference.addEventListener('change', () => { if (preference.matches) paused = true; sync(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { inView = entries[0].isIntersecting; gallery.classList.toggle('is-in-view', inView); sync(); }, { threshold:0.15 }).observe(viewport);
  } else { inView = true; gallery.classList.add('is-in-view'); }
  slides.forEach(slide => {
    const img = slide.querySelector('img');
    img?.addEventListener('load', alignCaptions);
    img?.addEventListener('error', alignCaptions);
  });
  if ('ResizeObserver' in window) new ResizeObserver(alignCaptions).observe(viewport);
  window.addEventListener('resize', alignCaptions);
  alignCaptions();
  select(0);
  gallery.querySelector('.banner-controls').hidden = false;
  sync();
})();
