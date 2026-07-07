(() => {
  const rows = [...document.querySelectorAll('a[href*="/maps/place/"]')]
    .map(a => ({ name: (a.getAttribute('aria-label') || a.textContent || '').trim(), url: a.href }))
    .filter(x => x.name && x.url);
  console.table(rows);
  window.ZXMapsRows = rows;
})();
