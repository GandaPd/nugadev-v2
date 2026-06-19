const faqButtons = document.querySelectorAll(".faq-button");

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const content = button.nextElementSibling;
    const icon = button.querySelector(".faq-icon");

    const isOpen = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", !isOpen);

    content.classList.toggle("hidden");

    icon.textContent = isOpen ? "+" : "−";
  });
});
