(() => {
  const filter = document.querySelector('.p-works-filter');
  if (!filter) return;

  const buttons = [...filter.querySelectorAll('[data-work-filter]')];
  const cards = [...document.querySelectorAll('[data-work-category]')];
  const count = document.querySelector('[data-work-count]');
  const label = document.querySelector('[data-work-label]');
  const labels = {
    all: 'すべて',
    road: '道路工事',
    bridge: '橋梁工事',
    drainage: '排水設備工事',
  };

  const render = (category) => {
    const selected = Object.hasOwn(labels, category) ? category : 'all';
    let visibleCount = 0;
    cards.forEach((card) => {
      const visible = selected === 'all' || card.dataset.workCategory === selected;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.workFilter === selected));
    });
    count.textContent = String(visibleCount);
    label.textContent = labels[selected];
  };

  const readCategory = () => new URL(location.href).searchParams.get('category') || 'all';

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.getAttribute('aria-pressed') === 'true') return;
      const category = button.dataset.workFilter;
      const url = new URL(location.href);
      if (category === 'all') url.searchParams.delete('category');
      else url.searchParams.set('category', category);
      // 非表示になったカードをブラウザが追いかけないよう、カードのハッシュは外します。
      if (url.hash.startsWith('#work-')) url.hash = '';
      history.pushState(null, '', url);
      render(category);
    });
  });

  window.addEventListener('popstate', () => render(readCategory()));
  render(readCategory());
  filter.hidden = false;
})();
