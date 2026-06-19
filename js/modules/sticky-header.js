export function initStickyHeader() {
  const header = document.querySelector("#site-header");

  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.classList.add("shadow-md");
    } else {
      header.classList.remove("shadow-md");
    }
  });
}
