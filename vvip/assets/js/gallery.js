/* DXB Nights — Gallery JS (replaced) */
(() => {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);

  const GRID_ID = "gallery-grid";

  // ---------- Filters ----------
  function initFilters() {
    const container = $("#gallery-filters, .filter-container");
    const grid = $("#" + GRID_ID);
    if (!container || !grid) return;

    on(container, "click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      const filter = btn.dataset.filter || "all";

      // active state
      $$(".filter-btn", container).forEach((b) => b.classList.toggle("active", b === btn));

      // filter items
      $$(".gallery-item", grid).forEach((item) => {
        const cat = item.getAttribute("data-category") || "";
        const show = filter === "all" || cat === filter;
        item.style.display = show ? "" : "none";
      });

      // relayout after filter
      requestAnimationFrame(layoutMasonry);
    });
  }

  // ---------- Lightbox (event delegation) ----------
  function initLightbox() {
    const grid = $("#" + GRID_ID);
    const lightbox = $("#lightbox");
    if (!grid || !lightbox) return;

    const imgEl   = $(".lightbox-image", lightbox);
    const titleEl = $(".lightbox-title", lightbox);
    const descEl  = $(".lightbox-description", lightbox);
    const closeBtn = $(".lightbox-close", lightbox);
    const prevBtn  = $(".lightbox-prev", lightbox);
    const nextBtn  = $(".lightbox-next", lightbox);
    const overlay  = $(".lightbox-overlay", lightbox);

    function visibleItems() {
      return $$(".gallery-item", grid).filter((it) => it.offsetParent !== null);
    }

    let currentIndex = -1;

    function openAt(index) {
      const items = visibleItems();
      const item = items[index];
      if (!item) return;

      const img  = item.querySelector("img");
      const t    = item.querySelector(".gallery-title");
      const d    = item.querySelector(".gallery-description");

      imgEl.src = img?.src || "";
      imgEl.alt = img?.alt || "";
      titleEl.textContent = t ? t.textContent : "";
      descEl.textContent  = d ? d.textContent : "";

      currentIndex = index;
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";

      prevBtn.style.display = index > 0 ? "block" : "none";
      nextBtn.style.display = index < items.length - 1 ? "block" : "none";
    }

    on(grid, "click", (e) => {
      const card = e.target.closest(".gallery-item");
      if (!card) return;
      const items = visibleItems();
      const idx = items.indexOf(card);
      if (idx >= 0) openAt(idx);
    });

    function close() {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
      currentIndex = -1;
    }

    function nav(dir) {
      const items = visibleItems();
      if (!items.length) return;
      const next = Math.min(Math.max(currentIndex + dir, 0), items.length - 1);
      openAt(next);
    }

    [closeBtn, overlay].forEach((el) => on(el, "click", close));
    on(prevBtn, "click", () => nav(-1));
    on(nextBtn, "click", () => nav(1));
    on(document, "keydown", (e) => {
      if (!lightbox.classList.contains("active")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") nav(-1);
      if (e.key === "ArrowRight") nav(1);
    });
  }

  // ---------- Masonry layout (no libs) ----------
  const GAP = 20;
  const ITEM_W = 300;

  function layoutMasonry() {
    const grid = $("#" + GRID_ID);
    if (!grid) return;

    const w = grid.clientWidth;
    const cols = Math.max(1, Math.floor(w / (ITEM_W + GAP)));
    const items = $$(".gallery-item", grid).filter((it) => it.style.display !== "none");

    // Single column → reset absolute positioning
    if (cols === 1) {
      items.forEach((it) => {
        it.style.position = "";
        it.style.left = "";
        it.style.top = "";
        it.style.width = "";
      });
      grid.style.height = "";
      grid.style.position = "";
      return;
    }

    const heights = new Array(cols).fill(0);
    items.forEach((it) => {
      const col = heights.indexOf(Math.min(...heights));
      const x = col * (ITEM_W + GAP);
      const y = heights[col];
      it.style.position = "absolute";
      it.style.left = x + "px";
      it.style.top = y + "px";
      it.style.width = ITEM_W + "px";
      heights[col] += it.offsetHeight + GAP;
    });
    grid.style.height = Math.max(...heights) + "px";
    grid.style.position = "relative";
  }

  function waitImagesThenLayout() {
    const grid = $("#" + GRID_ID);
    if (!grid) return layoutMasonry();
    const imgs = $$("img", grid);
    if (!imgs.length) return layoutMasonry();

    let pending = imgs.length;
    const done = () => {
      pending -= 1;
      if (pending <= 0) layoutMasonry();
    };
    imgs.forEach((img) => {
      if (img.complete) done();
      else img.addEventListener("load", done, { once: true });
    });
  }

  // ---------- Load More (optional) ----------
  function initLoadMore() {
    const btn = $("#load-more-btn");
    const grid = $("#" + GRID_ID);
    if (!btn || !grid) return;

    on(btn, "click", async () => {
      btn.disabled = true;
      try {
        // Example: replace with your real fetch endpoint or static HTML partials
        // const res = await fetch("assets/data/gallery-more.html");
        // const html = await res.text();
        // const tmp = document.createElement("div");
        // tmp.innerHTML = html;
        // const newItems = tmp.querySelectorAll(".gallery-item");
        // newItems.forEach((n) => grid.appendChild(n));
        // For now just disable the button:
      } catch (e) {
        console.error("Load more failed", e);
      } finally {
        btn.disabled = false;
        waitImagesThenLayout();
      }
    });
  }

  // ---------- Init ----------
  function init() {
    initFilters();
    initLightbox();
    initLoadMore();
    waitImagesThenLayout();
    window.addEventListener("resize", debounce(layoutMasonry, 200), { passive: true });
  }

  function debounce(fn, t) {
    let id;
    return (...args) => {
      clearTimeout(id);
      id = setTimeout(() => fn.apply(null, args), t);
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();