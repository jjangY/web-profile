(() => {
  document.querySelectorAll('[data-configurable-link]').forEach(link => {
    const configured = () => Boolean(link.getAttribute('href')?.trim());
    if (configured()) {
      link.removeAttribute('aria-disabled');
      link.removeAttribute('title');
    }
    link.addEventListener('click', event => {
      if (!configured()) event.preventDefault();
    });
  });
})();
