(() => {
  const hero = document.querySelector('.soken-home .hero');
  if (!hero) return;
  const slides = [...document.querySelectorAll('[data-slide]')];
  const dots = [...document.querySelectorAll('[data-go]')];
  const status = document.querySelector('[data-status]');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 900px)');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.navigation');
  const header = document.querySelector('.site-header');
  const interval = 6000;
  let current = 0;
  let menuOpen = false;
  let timer;
  let requestId = 0;

  // 写真が読み込めてから切り替えるため、遅い通信でも空白になりません。
  const ready = (img) => img.decode().then(() => true).catch(() => false);
  const paused = () => motionPreference.matches || menuOpen || document.hidden;
  const schedule = () => {
    window.clearTimeout(timer);
    hero.classList.toggle('is-paused', paused());
    if (!paused()) timer = window.setTimeout(() => show(current + 1), interval);
  };
  const show = async (index, manual = false) => {
    const next = (index + slides.length) % slides.length;
    const thisRequest = ++requestId;
    if (!(await ready(slides[next].querySelector('img'))) || thisRequest !== requestId) {
      if (thisRequest === requestId) schedule();
      return;
    }
    if (next !== current) {
      const incoming = slides[next];
      incoming.classList.remove('is-moving');
      void incoming.offsetWidth; // 同じ写真に戻ったときもズームを最初から開始。
      incoming.classList.add('is-moving');
      current = next;
    }
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
    });
    dots.forEach((dot, i) => {
      if (i === current) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    if (manual) status.textContent = `${current + 1}枚目。${slides[current].querySelector('img').alt}`;
    schedule();
  };
  dots.forEach((dot, index) => dot.addEventListener('click', () => {
    window.clearTimeout(timer);
    show(index, true);
  }));
  motionPreference.addEventListener('change', schedule);
  document.addEventListener('visibilitychange', schedule);

  const setMenu = (open) => {
    menuOpen = open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    header.classList.toggle('menu-open', open);
    navigation.hidden = mobile.matches && !open;
    schedule();
  };
  menuButton.addEventListener('click', () => setMenu(!menuOpen));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuOpen) {
      setMenu(false);
      menuButton.focus();
    }
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('click', (event) => {
    if (menuOpen && !header.contains(event.target)) setMenu(false);
  });
  header.addEventListener('focusout', (event) => {
    if (menuOpen && event.relatedTarget && !header.contains(event.relatedTarget)) setMenu(false);
  });
  mobile.addEventListener('change', () => setMenu(false));

  // FV上では既存の固定採用ボタンを隠し、次のセクションから表示。
  const heroObserver = new IntersectionObserver(([entry]) => {
    document.body.classList.toggle('is-hero-visible', entry.isIntersecting);
  });
  heroObserver.observe(hero);

  menuButton.hidden = false;
  document.querySelector('.slide-controls').hidden = false;
  setMenu(false);
  ready(slides[0].querySelector('img')).then(() => {
    slides[0].classList.add('is-moving');
    schedule();
  });
})();

