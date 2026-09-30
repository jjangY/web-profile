(() => {
  'use strict';
  const list = document.querySelector('.detail-list');
  if (!list || !Array.isArray(window.DETAIL_GALLERY)) return;
  const make = (tag, cls, text) => {
    const el = document.createElement(tag);
    el.className = cls;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  const placeholder = index => {
    const el = make('div', 'detail-placeholder');
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', `상세페이지 ${index + 1} 썸네일을 넣을 공간`);
    el.append(make('span', '', String(index + 1).padStart(2, '0')), make('small', '', 'DETAIL DESIGN'));
    return el;
  };
  window.DETAIL_GALLERY.forEach((item, index) => {
    const card = make('li', 'detail-card');
    const title = item.title || `상세페이지 디자인 ${index + 1}`;
    const pdf = typeof item.pdf === 'string' ? item.pdf.trim() : '';
    const preview = make(pdf ? 'a' : 'div', 'detail-preview');
    if (pdf) {
      preview.href = pdf;
      preview.target = '_blank';
      preview.rel = 'noopener noreferrer';
      preview.setAttribute('aria-label', `${title} 전체 상세페이지 PDF 보기 (새 탭)`);
    }
    const thumbnail = make('div', 'detail-thumbnail');
    if (item.thumbnail) {
      const img = make('img', '');
      img.alt = item.alt || title;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('error', () => img.replaceWith(placeholder(index)), { once:true });
      img.src = item.thumbnail;
      thumbnail.append(img);
    } else thumbnail.append(placeholder(index));
    preview.append(thumbnail, make('span', 'detail-cta', pdf ? '상세페이지 보기 ↗' : 'PDF 준비 중'));
    card.append(preview, make('h3', '', title), make('p', 'detail-description', item.description || ''));
    list.append(card);
  });
})();
