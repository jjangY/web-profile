(() => {
  const link = document.querySelector('.geulgil-visit');
  if (!link) return;
  const hasAddress = () => Boolean(link.getAttribute('href')?.trim());
  if (hasAddress()) {
    link.removeAttribute('aria-disabled');
    link.removeAttribute('title');
  }
  link.addEventListener('click', event => {
    if (!hasAddress()) event.preventDefault();
  });
})();
