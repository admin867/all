/* DXB Nights — Main JS (replaced) */
(() => {
  "use strict";

  // ---------- helpers ----------
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Mobile nav ----------
  function initMobileNav() {
    const navToggle = $("#nav-toggle");
    const navMenu   = $("#nav-menu");
    if (!navToggle || !navMenu) return;

    on(navToggle, "click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navMenu.classList.toggle("is-open");
      document.body.classList.toggle("nav-open", !expanded);
    });

    // close on link click (mobile)
    on(navMenu, "click", (e) => {
      if (e.target.matches(".nav-link")) {
        navToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("is-open");
        document.body.classList.remove("nav-open");
      }
    });
  }

  // ---------- Active nav link ----------
  function setActiveNavLink() {
    const path = location.pathname.split("/").pop() || "index.html";
    $$("#nav-menu .nav-link").forEach(a => {
      const href = (a.getAttribute("href") || "").split("/").pop();
      if (href === path) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      } else {
        a.classList.remove("active");
        a.removeAttribute("aria-current");
      }
    });
  }

  // ---------- Smooth scroll for in-page anchors ----------
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(a => {
      on(a, "click", (e) => {
        const id = a.getAttribute("href");
        const target = id && $(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
        }
      });
    });
  }

  // ---------- Footer year ----------
  function setFooterYear() {
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  }

  // ---------- Language toggle (delegates to i18n.js) ----------
  function initLanguageToggle() {
    const btn = $("#lang-toggle");
    const i18n = window.i18n;
    if (!btn || !i18n) return;
    on(btn, "click", () => {
      const next = i18n.getCurrentLanguage() === "en" ? "ar" : "en";
      i18n.applyLanguage(next);
    });
  }

  // ---------- AOS (if present) ----------
  function initAOS() {
    if (!window.AOS) return;
    window.AOS.init({
      once: true,
      duration: prefersReduced ? 0 : 800,
      easing: "ease-out"
    });
  }

  // ---------- Counters (on visibility) ----------
  function initCounters() {
    const counters = $$(".stat-number");
    if (!counters.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count || "0");
        const isFloat = !Number.isInteger(target);
        const dur = prefersReduced ? 0 : 1200;
        const startTime = performance.now();

        function tick(t) {
          const p = dur ? Math.min((t - startTime) / dur, 1) : 1;
          const val = target * p;
          el.textContent = isFloat ? val.toFixed(1) : Math.round(val);
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.35 });

    counters.forEach((c) => io.observe(c));
  }

  // ---------- Reduced-motion helpers ----------
  function markReducedMotion() {
    if (prefersReduced) document.documentElement.classList.add("reduced-motion");
  }

  // ---------- Init ----------
  function init() {
    markReducedMotion();
    setFooterYear();
    initMobileNav();
    setActiveNavLink();
    initSmoothScroll();
    initLanguageToggle();
    initAOS();
    initCounters();
  }

  // DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();