const sliderElement = document.querySelector(".p-swiper");
const heroDots = [...document.querySelectorAll(".hero__dot")];
const progressLength = 2 * Math.PI * 13;

const updateHeroDots = (activeIndex) => {
  heroDots.forEach((dot, index) => {
    const isActive = index === activeIndex;
    const progress = dot.querySelector(".hero__dot-progress");

    dot.classList.toggle("is-active", isActive);

    if (isActive) {
      dot.setAttribute("aria-current", "true");
    } else {
      dot.removeAttribute("aria-current");
    }

    if (progress) {
      progress.style.strokeDashoffset = String(progressLength);
    }
  });
};

if (sliderElement && heroDots.length > 0) {
  const fvSlider = new Swiper(sliderElement, {
    loop: true,
    speed: 800,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    allowTouchMove: false,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    on: {
      init(swiper) {
        updateHeroDots(swiper.realIndex);
      },
      realIndexChange(swiper) {
        updateHeroDots(swiper.realIndex);
      },
      autoplayTimeLeft(swiper, timeLeft, percentage) {
        const activeProgress = heroDots[swiper.realIndex]?.querySelector(
          ".hero__dot-progress",
        );

        if (activeProgress) {
          const remaining = Math.min(Math.max(percentage, 0), 1);
          activeProgress.style.strokeDashoffset = String(
            progressLength * remaining,
          );
        }
      },
    },
  });

  heroDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const slideIndex = Number(dot.dataset.dot);

      if (!Number.isInteger(slideIndex)) return;

      fvSlider.slideToLoop(slideIndex);
      fvSlider.autoplay.stop();
      fvSlider.autoplay.start();
      updateHeroDots(slideIndex);
    });
  });
}

const menuButton = document.querySelector("[data-menu-button]");
const globalMenu = document.querySelector("[data-menu]");

if (menuButton && globalMenu) {
  const menuLabel = menuButton.querySelector(".u-visually-hidden");
  const desktopMedia = window.matchMedia("(min-width: 1024px)");

  const setMenuState = (isOpen, returnFocus = false) => {
    const shouldOpen = isOpen && !desktopMedia.matches;

    menuButton.setAttribute("aria-expanded", String(shouldOpen));
    globalMenu.classList.toggle("is-open", shouldOpen);
    document.body.classList.toggle("is-menu-open", shouldOpen);

    if (desktopMedia.matches) {
      globalMenu.removeAttribute("aria-hidden");
    } else {
      globalMenu.setAttribute("aria-hidden", String(!shouldOpen));
    }

    if (menuLabel) {
      menuLabel.textContent = shouldOpen ? "メニューを閉じる" : "メニューを開く";
    }

    if (returnFocus) {
      menuButton.focus();
    }
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  globalMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true"
    ) {
      setMenuState(false, true);
    }
  });

  desktopMedia.addEventListener("change", () => setMenuState(false));
  setMenuState(false);
}
