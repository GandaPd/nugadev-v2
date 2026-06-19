/**
 * Mobile Navigation
 * NugaDev
 */

export function initMobileNav() {
  const toggleButton = document.querySelector("[data-mobile-nav-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-nav]");
  const mobileLinks = document.querySelectorAll("[data-mobile-nav-link]");

  if (!toggleButton || !mobileMenu) return;

  const openMenu = () => {
    mobileMenu.classList.remove("hidden");

    requestAnimationFrame(() => {
      mobileMenu.classList.remove(
        "opacity-0",
        "-translate-y-2",
        "pointer-events-none",
      );
    });

    toggleButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("overflow-hidden");
  };

  const closeMenu = () => {
    mobileMenu.classList.add(
      "opacity-0",
      "-translate-y-2",
      "pointer-events-none",
    );

    toggleButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("overflow-hidden");

    setTimeout(() => {
      mobileMenu.classList.add("hidden");
    }, 200);
  };

  const isOpen = () => toggleButton.getAttribute("aria-expanded") === "true";

  toggleButton.addEventListener("click", () => {
    isOpen() ? closeMenu() : openMenu();
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      closeMenu();
    }
  });
}
