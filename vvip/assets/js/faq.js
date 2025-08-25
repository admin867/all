/* DXB Nights — FAQ (replaced) */
(() => {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);

  function initAccordion() {
    $$(".faq-item .faq-question").forEach((btn) => {
      on(btn, "click", () => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        // close others
        $$(".faq-item .faq-question").forEach((b) => {
          b.setAttribute("aria-expanded", "false");
          b.parentElement?.classList.remove("open");
        });
        // toggle current
        if (!expanded) {
          btn.setAttribute("aria-expanded", "true");
          btn.parentElement?.classList.add("open");
        }
      });
    });
  }

  function initFilters() {
    const container = $("#faq-categories .category-filters");
    if (!container) return;

    on(container, "click", (e) => {
      const btn = e.target.closest(".category-btn");
      if (!btn) return;
      const cat = btn.dataset.category || "all";

      // set active
      $$(".category-btn", container).forEach((b) =>
        b.classList.toggle("active", b === btn)
      );

      // filter list
      const items = $$(".faq-item");
      items.forEach((it) => {
        const itemCat = it.getAttribute("data-category") || "";
        const show = cat === "all" || itemCat === cat;
        it.style.display = show ? "" : "none";
      });

      updateNoResults();
    });
  }

  function initSearch() {
    const input = $("#faq-search-input");
    if (!input) return;

    on(input, "input", () => {
      const q = input.value.trim().toLowerCase();
      $$(".faq-item").forEach((it) => {
        const text = it.innerText.toLowerCase();
        it.style.display = text.includes(q) ? "" : "none";
      });
      updateNoResults();
    });
  }

  function updateNoResults() {
    const no = $("#no-results");
    if (!no) return;
    const anyVisible = $$(".faq-item").some((el) => el.style.display !== "none");
    no.style.display = anyVisible ? "none" : "block";
  }

  function init() {
    initAccordion();
    initFilters();
    initSearch();
    updateNoResults();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();