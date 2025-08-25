/* DXB Nights — Performance JS (replaced) */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const PERF = {
    async checkWebPSupport() {
      if (!self.createImageBitmap) return false;
      const webpData =
        "data:image/webp;base64,UklGRiIAAABXRUJQVlA4ICAAAADwAQCdASoEAAQAAVAfJeQAA3AA/vuUAAA=";
      try {
        const res = await fetch(webpData);
        const blob = await res.blob();
        await createImageBitmap(blob);
        return true;
      } catch {
        return false;
      }
    },

    async setupImageOptimization() {
      const supportsWebP = await this.checkWebPSupport();
      document.documentElement.classList.toggle("webp", supportsWebP);
      this.setupLazyLoading();
      this.setupResponsiveImages();
    },

    // Lazy-load media with data-src (falls back to src if not provided)
    setupLazyLoading() {
      if (!("IntersectionObserver" in window)) return;
      const lazyMedia = $$("img[data-src], video[data-src], iframe[data-src]");
      if (!lazyMedia.length) return;

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const src = el.getAttribute("data-src");
            if (src) el.setAttribute("src", src);
            el.classList.add("loaded");
            el.classList.remove("lazy");
            io.unobserve(el);
          });
        },
        { rootMargin: "100px 0px", threshold: 0.01 }
      );

      lazyMedia.forEach((m) => io.observe(m));
    },

    // If you use <img srcset/sizes>, ensure width/height set to avoid CLS
    setupResponsiveImages() {
      $$("img").forEach((img) => {
        if (!img.getAttribute("width") || !img.getAttribute("height")) {
          // Skip SVG and placeholders
          if ((img.src || "").endsWith(".svg")) return;
          // Set a conservative placeholder ratio if none provided
          if (img.naturalWidth && img.naturalHeight) {
            img.setAttribute("width", img.naturalWidth);
            img.setAttribute("height", img.naturalHeight);
          }
        }
        img.setAttribute("decoding", "async");
        img.setAttribute("loading", "lazy");
      });
    },

    // Preload critical fonts only; avoid duplicating with HTML
    setupCriticalResourceHints() {
      const added = new Set();
      function preload(href, as, type) {
        if (!href || added.has(href)) return;
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = as;
        if (type) link.type = type;
        link.href = href.startsWith("/") ? href : href; // keep as provided
        link.crossOrigin = "anonymous";
        document.head.appendChild(link);
        added.add(href);
      }
      // Example (keep in sync with HTML):
      preload("assets/fonts/inter-variable.woff2", "font", "font/woff2");
      preload("assets/fonts/playfair-display-variable.woff2", "font", "font/woff2");
    },

    // Defer non-critical scripts (optional hook)
    deferNonCritical() {
      // Example hook if you later add heavy scripts dynamically.
    }
  };

  function init() {
    PERF.setupCriticalResourceHints();
    PERF.setupImageOptimization();
    PERF.deferNonCritical();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();