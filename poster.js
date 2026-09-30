(() => {
  'use strict';
  const section = document.querySelector('.poster-section');
  const config = window.POSTER_GALLERY;
  if (!section || !config) return;
  const list = section.querySelector('.poster-list');
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const placeholder = index => {
    const box = make('div', 'poster-placeholder');
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', `포스터 ${index + 1} 이미지를 넣을 공간`);
    box.append(make('span', '', String(index + 1).padStart(2, '0')), make('small', '', 'POSTER DESIGN'));
    return box;
  };
  (config.items || []).forEach((item, index) => {
    const row = make('li', 'poster-item');
    const figure = make('figure', 'poster-image');
    if (item.image) {
      const img = make('img', '');
      img.alt = item.alt || item.title || `포스터 ${index + 1}`;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('error', () => img.replaceWith(placeholder(index)), { once:true });
      img.src = item.image;
      figure.append(img);
    } else figure.append(placeholder(index));
    const copy = make('div', 'poster-copy');
    const title = make('h3', '', item.title || `포스터 디자인 ${index + 1}`);
    title.id = `poster-work-${index + 1}`;
    row.setAttribute('aria-labelledby', title.id);
    copy.append(title, make('p', '', item.description || ''));
    row.append(figure, copy);
    list.append(row);
  });
  if (config.pinkScratch) {
    const scratch = make('img', 'poster-scratch');
    scratch.alt = '';
    scratch.decoding = 'async';
    scratch.addEventListener('error', () => scratch.remove(), { once:true });
    scratch.src = config.pinkScratch;
    section.querySelector('.poster-stage').append(scratch);
  }
})();
