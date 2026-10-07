// SPでは折りたたみ、PCでは展開。JSがなくてもdetailsで操作可能。
(() => {
  const groups = [...document.querySelectorAll('.soken-footer__group')];
  if (!groups.length) return;
  const desktop = window.matchMedia('(min-width: 801px)');
  const sync = () => groups.forEach(group => { group.open = desktop.matches; });
  groups.forEach(group => group.querySelector('summary').addEventListener('click', event => {
    if (desktop.matches) event.preventDefault();
  }));
  desktop.addEventListener('change', sync);
  sync();
})();
