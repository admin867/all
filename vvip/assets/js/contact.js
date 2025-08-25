/* DXB Nights — Contact (replaced) */
(() => {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function toast(msg, type = "success") {
    let t = $("#toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.remove("error", "success");
    t.classList.add(type);
    t.style.display = "block";
    setTimeout(() => (t.style.display = "none"), 3000);
  }

  function initForm() {
    const form = $("#contact-form-element");
    if (!form) return;

    on(form, "submit", async (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form).entries());
      // basic validation
      if (!data.firstName || !data.lastName) {
        toast("Please enter your full name.", "error");
        return;
      }
      if (!validateEmail(data.email || "")) {
        toast("Please enter a valid email.", "error");
        return;
      }
      if (!data.inquiryType) {
        toast("Please select inquiry type.", "error");
        return;
      }
      if (!data.message || String(data.message).trim().length < 10) {
        toast("Please write a short message (min 10 chars).", "error");
        return;
      }

      // simulate submit (replace with your backend endpoint)
      try {
        form.classList.add("is-loading");
        // Example:
        // const res = await fetch("/api/contact", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(data)
        // });
        // if (!res.ok) throw new Error("Failed");
        await new Promise((r) => setTimeout(r, 800));

        form.reset();
        toast("Message sent. We'll get back to you soon!");
      } catch (err) {
        console.error(err);
        toast("Submission failed. Please try again.", "error");
      } finally {
        form.classList.remove("is-loading");
      }
    });
  }

  function init() {
    initForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();