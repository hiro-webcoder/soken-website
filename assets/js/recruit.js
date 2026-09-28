(() => {
  const section = document.querySelector("[data-voices]");
  if (!section) return;
  const list = section.querySelector("[data-voice-list]");
  const cards = [...list.children];
  const controls = section.querySelector("[data-voice-controls]");
  const previous = section.querySelector("[data-voice-prev]");
  const next = section.querySelector("[data-voice-next]");
  const status = section.querySelector("[data-voice-status]");
  const desktop = matchMedia("(min-width: 1024px)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let targetIndex = 0;
  let settling;

  const position = (index) => {
    const offset = cards[index].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
    return Math.max(0, Math.min(offset, list.scrollWidth - list.clientWidth));
  };
  const sync = () => {
    const max = list.scrollWidth - list.clientWidth;
    previous.disabled = list.scrollLeft <= 2;
    next.disabled = list.scrollLeft >= max - 2;
    targetIndex = cards.reduce((best, _, index) =>
      Math.abs(position(index) - list.scrollLeft) < Math.abs(position(best) - list.scrollLeft) ? index : best, 0);
    status.textContent = desktop.matches ? "" : `${cards.length}人中${targetIndex + 1}人目の社員の声`;
  };
  const move = (direction) => {
    targetIndex = Math.max(0, Math.min(cards.length - 1, targetIndex + direction));
    list.scrollTo({ left: position(targetIndex), behavior: reducedMotion.matches ? "instant" : "smooth" });
  };
  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  list.addEventListener("keydown", (event) => {
    if (desktop.matches || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    move(event.key === "ArrowRight" ? 1 : -1);
  });
  list.addEventListener("scroll", () => {
    clearTimeout(settling);
    settling = setTimeout(sync, 120);
  }, { passive: true });
  const resize = () => {
    controls.hidden = desktop.matches;
    list.tabIndex = desktop.matches ? -1 : 0;
    list.setAttribute("aria-label", desktop.matches ? "社員の声" : "社員の声。横にスクロールしてご覧いただけます");
    sync();
  };
  new ResizeObserver(resize).observe(list);
  desktop.addEventListener("change", resize);
  resize();
})();
