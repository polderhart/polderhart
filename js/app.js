gsap.registerPlugin(ScrollTrigger);

// Hero on load
if (document.querySelector(".hero__content")) {
  gsap.from(".hero__content > *:not(.hero__image)", {
    opacity: 0,
    y: 40,
    duration: 1.05,
    ease: "power2.out",
    stagger: 0.08,
  });
}

// Section headers
Array.from(document.querySelectorAll(".section-header")).forEach((el) => {
  gsap.from(el, {
    opacity: 0,
    y: 28,
    duration: 0.8,
    ease: "power1.out",
    scrollTrigger: {
      trigger: el,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });
});

// Grids with stagger
Array.from(document.querySelectorAll(".u-grid-stagger")).forEach((grid) => {
  gsap.from(grid.children, {
    opacity: 0,
    y: 24,
    duration: 0.7,
    ease: "power1.out",
    stagger: 0.1,
    scrollTrigger: {
      trigger: grid,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });
});

// Buttons hover micro-animations
Array.from(document.querySelectorAll(".c-button, .btn")).forEach((btn) => {
  btn.addEventListener("mouseenter", () =>
    gsap.to(btn, { y: -2, scale: 1.02, duration: 0.15, ease: "power1.out" })
  );
  btn.addEventListener("mouseleave", () =>
    gsap.to(btn, { y: 0, scale: 1.0, duration: 0.16, ease: "power1.out" })
  );
});
