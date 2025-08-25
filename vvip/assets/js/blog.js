/* DXB Nights — Blog/Events (replaced) */
(() => {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);

  function initFilters() {
    const bar = $("#blog-controls .blog-filters");
    if (!bar) return;

    on(bar, "click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      // active class
      $$(".filter-btn", bar).forEach((b) => b.classList.toggle("active", b === btn));
      const filter = btn.dataset.filter || "all";
      filterCards(filter);
      paginate(1);
    });
  }

  function initSearch() {
    const input = $("#blog-search-input");
    if (!input) return;
    on(input, "input", debounce(() => {
      paginate(1);
    }, 200));
  }

  function filterCards(filter) {
    const cards = $$(".post-card");
    cards.forEach((c) => {
      const cat = (c.dataset.category || "").toLowerCase();
      c.dataset.visible = (filter === "all" || cat === filter) ? "1" : "0";
    });
  }

  function getSearchTerm() {
    const input = $("#blog-search-input");
    return (input?.value || "").trim().toLowerCase();
  }

  // Simple pagination (client-side)
  const PAGE_SIZE = 6;

  function paginate(page = 1) {
    const q = getSearchTerm();
    const cards = $$(".post-card");
    // apply search over title + excerpt
    const filtered = cards.filter((c) => {
      if (c.dataset.visible === "0") return false;
      const text = (c.innerText || "").toLowerCase();
      return !q || text.includes(q);
    });

    cards.forEach((c) => (c.style.display = "none"));
    const total = filtered.length;
    const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
    page = Math.min(Math.max(1, page), maxPage);
    const start = (page - 1) * PAGE_SIZE;
    filtered.slice(start, start + PAGE_SIZE).forEach((c) => (c.style.display = ""));

    updateNoResults(total === 0);
    renderPagination(page, maxPage);
  }

  function renderPagination(cur, max) {
    const pag = $("#pagination");
    if (!pag) return;
    const prev = $("#prev-btn");
    const next = $("#next-btn");
    const nums = pag.querySelector(".pagination-numbers");
    if (nums) nums.innerHTML = "";

    prev && (prev.disabled = cur <= 1);
    next && (next.disabled = cur >= max);

    // Simple numeric (1..max up to 5)
    const span = 2;
    const from = Math.max(1, cur - span);
    const to = Math.min(max, cur + span);
    for (let i = from; i <= to; i++) {
      const b = document.createElement("button");
      b.className = "pagination-number" + (i === cur ? " active" : "");
      b.textContent = String(i);
      b.addEventListener("click", () => paginate(i));
      nums?.appendChild(b);
    }

    prev?.addEventListener("click", () => paginate(cur - 1), { once: true });
    next?.addEventListener("click", () => paginate(cur + 1), { once: true });
  }

  function updateNoResults(show) {
    const no = $("#no-results");
    if (no) no.style.display = show ? "block" : "none";
  }

  function debounce(fn, t) {
    let id;
    return (...args) => {
      clearTimeout(id);
      id = setTimeout(() => fn.apply(null, args), t);
    };
  }

  function init() {
    // default: all visible
    filterCards("all");
    initFilters();
    initSearch();
    paginate(1);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();