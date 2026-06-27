export default function initPortfolioFilter() {
  const buttons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll(".portfolio-card");

  if (!buttons.length || !cards.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      // reset button
      buttons.forEach((btn) => {
        btn.classList.remove("portfolio-filter-active");
        btn.classList.add("portfolio-filter");
      });

      button.classList.remove("portfolio-filter");
      button.classList.add("portfolio-filter-active");

      const filter = button.dataset.filter;

      cards.forEach((card) => {
        const category = card.dataset.category;

        if (filter === "all" || category === filter) {
          card.classList.remove("hidden");
          card.classList.add("animate-fade");
        } else {
          card.classList.add("hidden");
          card.classList.remove("animate-fade");
        }
      });
    });
  });
}
