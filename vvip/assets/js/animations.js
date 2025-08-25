/* DXB Nights — Animations (replaced) */
(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    document.documentElement.classList.add("reduced-motion");
    // Let AOS handle simple fades if present; skip heavy GSAP.
    if (window.AOS) window.AOS.refresh();
    return;
  }

  // GSAP optional enhancements
  if (window.gsap) {
    const gsap = window.gsap;

    // Hero title lines (stagger fade+rise)
    const heroLines = document.querySelectorAll(".hero-title .hero-title-line");
    if (heroLines.length) {
      gsap.set(heroLines, { y: 40, opacity: 0 });
      gsap.to(heroLines, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.2
      });
    }

    // Scroll-triggered cards/sections (if ScrollTrigger is available)
    if (gsap.ScrollTrigger) {
      const cards = document.querySelectorAll("[data-aos='fade-up'], .feature-card, .value-card, .team-member, .post-card, .gallery-item");
      cards.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        });
      });

      // Subtle hero parallax (content vs background)
      const hero = document.querySelector(".hero");
      if (hero) {
        const content = hero.querySelector(".hero-content");
        if (content) {
          gsap.to(content, {
            y: -30,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: true
            }
          });
        }
      }
    }
  }
})();