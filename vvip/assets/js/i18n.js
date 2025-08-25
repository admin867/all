/* DXB Nights — i18n (replaced) */
(() => {
  "use strict";

  const STORAGE_KEY = "dxb_lang";
  const DEFAULT_LANG = "en";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // Minimal dictionary example (expand as you wish)
  const DICT = {
    en: {},
    ar: {}
  };

  function getCurrentLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "ar") return saved;
    // Detect once from browser
    const nav = (navigator.language || "").toLowerCase();
    return nav.startsWith("ar") ? "ar" : DEFAULT_LANG;
  }

  function applyLangAttributes(lang) {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
    // Optional: toggle body class for CSS flips
    document.body.classList.toggle("rtl", lang === "ar");
  }

  function applyTextTranslations(lang) {
    // data-i18n="namespace.key" → innerText
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = resolveKey(DICT, lang, key);
      if (val != null) el.textContent = val;
    });

    // data-i18n-attr="attr:key,attr2:key2"
    $$("[data-i18n-attr]").forEach((el) => {
      const raw = el.getAttribute("data-i18n-attr") || "";
      raw.split(",").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s?.trim());
        if (!attr || !key) return;
        const val = resolveKey(DICT, lang, key);
        if (val != null) el.setAttribute(attr, val);
      });
    });
  }

  function resolveKey(dict, lang, path) {
    const parts = (path || "").split(".");
    let cur = dict[lang];
    for (const p of parts) {
      if (!cur || typeof cur !== "object") return null;
      cur = cur[p];
    }
    if (typeof cur === "string") return cur;
    return null;
  }

  function syncLangToggleUI(lang) {
    const btnText = document.querySelector(".lang-text");
    if (btnText) btnText.textContent = lang.toUpperCase();
  }

  function applyLanguage(lang) {
    if (lang !== "en" && lang !== "ar") lang = DEFAULT_LANG;
    localStorage.setItem(STORAGE_KEY, lang);
    applyLangAttributes(lang);
    applyTextTranslations(lang);
    syncLangToggleUI(lang);
  }

  function init() {
    const lang = getCurrentLanguage();
    applyLanguage(lang);
    // If canonical / hreflang links exist, leave as-is (SEO static).
  }

  // Expose API used by main.js
  window.i18n = {
    getCurrentLanguage,
    applyLanguage
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();