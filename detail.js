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
  const dialog = make('dialog', 'detail-dialog');
  dialog.setAttribute('aria-labelledby', 'detail-dialog-title');
  const shell = make('div', 'detail-dialog-shell');
  const toolbar = make('div', 'detail-dialog-toolbar');
  const heading = make('h2', '', '');
  heading.id = 'detail-dialog-title';
  const close = make('button', 'detail-dialog-close', '닫기 ×');
  close.type = 'button';
  close.setAttribute('aria-label', '상세페이지 닫기');
  const content = make('div', 'detail-dialog-content');
  toolbar.append(heading, close);
  shell.append(toolbar, content);
  dialog.append(shell);
  document.body.append(dialog);
  let opener = null, previousOverflow = '', previousPadding = '', locked = false, backdropDown = false;
  function openImage(item, trigger) {
    if (dialog.open) return;
    opener = trigger;
    heading.textContent = item.title || '상세페이지';
    const message = make('p', 'detail-dialog-message', '이미지를 불러오는 중입니다.');
    message.setAttribute('role', 'status');
    const image = make('img', 'detail-full-image');
    image.alt = item.alt || item.title || '전체 상세페이지 디자인';
    image.decoding = 'async';
    image.hidden = true;
    image.addEventListener('load', () => { message.remove(); image.hidden = false; }, { once:true });
    image.addEventListener('error', () => {
      message.textContent = '이미지를 불러오지 못했습니다. 닫은 뒤 다시 열어주세요.';
    }, { once:true });
    content.replaceChildren(message, image);
    image.src = item.fullImage;
    previousOverflow = document.body.style.overflow;
    previousPadding = document.body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const padding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingRight = (padding + gap) + 'px';
    locked = true;
    dialog.scrollTop = 0;
    close.focus({ preventScroll:true });
  }
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('pointerdown', event => { backdropDown = event.target === dialog; });
  dialog.addEventListener('click', event => {
    if (backdropDown && event.target === dialog) dialog.close();
    backdropDown = false;
  });
  // Native dialog handles Esc, focus trapping, and makes the background inert.
  dialog.addEventListener('close', () => {
    if (locked) {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      locked = false;
    }
    content.replaceChildren();
    opener?.focus({ preventScroll:true });
    opener = null;
  });
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
    const full = typeof item.fullImage === 'string' ? item.fullImage.trim() : '';
    const pdf = typeof item.pdf === 'string' ? item.pdf.trim() : '';
    const preview = make(full || pdf ? 'a' : 'div', 'detail-preview');
    if (full || pdf) {
      preview.href = full || pdf;
      preview.setAttribute('aria-label', `${title} 전체 상세페이지 보기`);
      if (full && typeof dialog.showModal === 'function') {
        preview.setAttribute('aria-haspopup', 'dialog');
        preview.addEventListener('click', event => {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
          event.preventDefault();
          openImage({ ...item, fullImage:full }, preview);
        });
      } else {
        preview.target = '_blank';
        preview.rel = 'noopener noreferrer';
      }
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
    preview.append(thumbnail, make('span', 'detail-cta', full || pdf ? '상세페이지 보기 ↗' : '준비 중'));
    card.append(preview, make('h3', '', title), make('p', 'detail-description', item.description || ''));
    list.append(card);
  });
})();
