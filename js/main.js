import { initMobileNav } from "./modules/mobile-nav.js";
import "./modules/faq-accordion.js";
import { initStickyHeader } from "./modules/sticky-header.js";
import { initBackToTop } from "./modules/back-to-top.js";
import activeNav from "./modules/active-nav.js";

mobileNav();
faqAccordion();
activeNav();

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initStickyHeader();
  initBackToTop();
});
