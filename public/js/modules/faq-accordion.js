export default function initFaqAccordion() {
  const faqButtons = document.querySelectorAll(".faq-button");

  if (!faqButtons.length) return;

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";

      // Tutup semua FAQ
      faqButtons.forEach((otherButton) => {
        otherButton.setAttribute("aria-expanded", "false");

        const otherContent = otherButton.nextElementSibling;
        const otherIcon = otherButton.querySelector(".faq-icon");

        if (otherContent) {
          otherContent.classList.add("hidden");
        }

        if (otherIcon) {
          otherIcon.textContent = "+";
        }
      });

      // Jika sebelumnya tertutup, buka FAQ yang dipilih
      if (!isOpen) {
        const content = button.nextElementSibling;
        const icon = button.querySelector(".faq-icon");

        button.setAttribute("aria-expanded", "true");

        if (content) {
          content.classList.remove("hidden");
        }

        if (icon) {
          icon.textContent = "−";
        }
      }
    });
  });
}
