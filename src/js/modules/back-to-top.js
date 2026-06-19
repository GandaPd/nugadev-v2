export function initBackToTop() {
  const button = document.querySelector("#back-to-top");

  if (!button) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      button.classList.remove("hidden");
    } else {
      button.classList.add("hidden");
    }
  });

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
