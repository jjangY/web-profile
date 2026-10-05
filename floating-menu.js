(() => {
  'use strict';
  const menu = document.querySelector('.floating-menu');
  const hero = document.querySelector('.hero');
  if (!menu || !hero) return;
  const toggle = menu.querySelector('.floating-menu-toggle');
  const panel = menu.querySelector('.floating-menu-panel');
  const links = [...panel.querySelectorAll('a')];
  const targets = links.map(link => document.querySelector(link.getAttribute('href')));
  const topLink = menu.querySelector('.back-to-top');
  const closing = document.querySelector('#contact');
  const heroLinks = [...document.querySelectorAll('.hero-menu a')];
  function selectHeroLink(link) {
    heroLinks.forEach(item => item.classList.toggle('is-selected', item === link));
  }
  heroLinks.forEach(link => link.addEventListener('click', () => selectHeroLink(link)));
  topLink.addEventListener('click', () => { setOpen(false); hero.setAttribute('tabindex','-1'); hero.focus({preventScroll:true}); });
  let open = false;
  let frame = 0;
  function setOpen(value, restoreFocus = false) {
    open = value;
    menu.classList.toggle('is-open', open);
    toggle.textContent = open ? 'X' : 'MENU';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '페이지 메뉴 닫기' : '페이지 메뉴 열기');
    panel.inert = !open;
    if (restoreFocus) toggle.focus({ preventScroll:true });
  }
  function update() {
    frame = 0;
    const visible = hero.getBoundingClientRect().bottom <= 1;
    if (!visible && open) setOpen(false);
    menu.hidden = !visible;
    const closingBounds = closing?.getBoundingClientRect();
    topLink.hidden = !(visible && closingBounds && closingBounds.top < innerHeight && closingBounds.bottom > 0);
    let active = 0;
    targets.forEach((target, index) => {
      if (target && target.getBoundingClientRect().top <= innerHeight * .35) active = index;
    });
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 3) active = links.length - 1;
    links.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleUpdate() { if (!frame) frame = requestAnimationFrame(update); }
  toggle.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse' || open) return;
    setOpen(true);
  });
  menu.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse' && open) {
      setOpen(false);
    }
  });
  toggle.addEventListener('click', () => setOpen(!open));
  links.forEach((link, index) => link.addEventListener('click', () => {
    setOpen(false);
    const group = index === 0 ? 0 : index >= 2 && index <= 5 ? 1 : index === 6 ? 2 : index === 7 ? 3 : -1;
    selectHeroLink(heroLinks[group]);
    const target = targets[index];
    if (target) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll:true });
    }
  }));
  document.addEventListener('pointerdown', event => {
    if (open && !menu.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && open) { event.preventDefault(); setOpen(false, true); }
  });
  window.addEventListener('scroll', scheduleUpdate, { passive:true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('load', scheduleUpdate);
  document.fonts?.ready.then(scheduleUpdate);
  update();
})();
