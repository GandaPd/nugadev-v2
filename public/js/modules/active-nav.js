export default function activeNav() {
  const currentPath = window.location.pathname;

  const navLinks = document.querySelectorAll("[data-nav]");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) return;

    /*
    |--------------------------------------------------------------------------
    | Homepage
    |--------------------------------------------------------------------------
    */

    if (currentPath === "/" && href === "/") {
      link.classList.add("text-primary", "font-semibold");
    }

    /*
    |--------------------------------------------------------------------------
    | Service Pages
    |--------------------------------------------------------------------------
    */

    if (currentPath.startsWith("/layanan/") && href === "#services") {
      link.classList.add("text-primary", "font-semibold");
    }
  });
}
