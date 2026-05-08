/* =============================================
   SCRIPT.JS - PM SHRI CAPACITY BUILDING WEBSITE
   Lenis smooth scroll + GSAP animations
   ============================================= */

"use strict";

/* ---- LENIS SMOOTH SCROLL ---- */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  mouseMultiplier: 1,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sync lenis with GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ---- PRELOADER ---- */
function dismissPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader || preloader.dataset.dismissed) return;
  preloader.dataset.dismissed = "1";

  // Make sure hero is visible regardless
  forceHeroVisible();

  gsap.to(preloader, {
    yPercent: -100,
    duration: 0.7,
    ease: "power3.inOut",
    onComplete: () => {
      preloader.style.display = "none";
      entranceAnimation();
    },
  });
}

// Force hero visible immediately as a safety net
function forceHeroVisible() {
  document.querySelectorAll(".hero-left [data-anim]").forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
  const heroRight = document.querySelector(".hero-right");
  if (heroRight) {
    heroRight.style.opacity = "1";
    heroRight.style.transform = "none";
  }
}

// Dismiss after preloader bar animation + small delay
window.addEventListener("load", () => setTimeout(dismissPreloader, 1200));
// Hard fallback: always dismiss after 2s no matter what
setTimeout(dismissPreloader, 2000);

/* ---- HERO ENTRANCE ---- */
function entranceAnimation() {
  const heroLeft = document.querySelector(".hero-left");
  const heroRight = document.querySelector(".hero-right");
  if (!heroLeft) return;

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // Animate left side items staggered
  const items = heroLeft.querySelectorAll("[data-anim]");
  tl.from(items, {
    y: 36,
    opacity: 0,
    duration: 0.85,
    stagger: 0.11,
    clearProps: "all",
  });

  // Animate right side simultaneously
  if (heroRight) {
    tl.from(
      heroRight,
      {
        x: 50,
        opacity: 0,
        duration: 1.0,
        ease: "power3.out",
        clearProps: "all",
      },
      "-=0.7"
    );
  }
}

/* ---- NAVBAR SCROLL INDICATOR (active link only now) ---- */

/* ---- HAMBURGER MENU ---- */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger?.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
  document.body.style.overflow = navLinks.classList.contains("open") ? "hidden" : "";
});

// Close nav on link click
navLinks?.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
    document.body.style.overflow = "";
  });
});

/* ---- SMOOTH ANCHOR SCROLL via Lenis ---- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) lenis.scrollTo(target, { offset: -80, duration: 1.2 });
  });
});

/* ---- SCROLL ANIMATIONS (IntersectionObserver) ---- */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger children if parent is a grid
          const el = entry.target;
          el.classList.add("in-view");
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
  );

  // Observe all elements with data-anim, but skip hero (handled by entrance)
  document.querySelectorAll("[data-anim]").forEach((el) => {
    if (!el.closest(".hero")) observer.observe(el);
  });
}
initScrollAnimations();

/* ---- GSAP STAGGER for grid cards ---- */
function initGSAPScrollAnimations() {
  // About cards
  gsap.from(".about-card", {
    scrollTrigger: {
      trigger: ".about-grid",
      start: "top 80%",
    },
    y: 40,
    opacity: 0,
    duration: 0.7,
    stagger: 0.12,
    ease: "power3.out",
    clearProps: "all",
  });

  // Objective items
  gsap.from(".objective-item", {
    scrollTrigger: {
      trigger: ".objectives-right",
      start: "top 75%",
    },
    x: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: "power3.out",
    clearProps: "all",
  });

  // Highlight cards
  gsap.from(".highlight-card", {
    scrollTrigger: {
      trigger: ".highlights-grid",
      start: "top 75%",
    },
    y: 40,
    opacity: 0,
    duration: 0.65,
    stagger: 0.1,
    ease: "power3.out",
    clearProps: "all",
  });

  // Award badges
  gsap.from(".award-badge", {
    scrollTrigger: {
      trigger: ".awards-grid",
      start: "top 85%",
    },
    scale: 0.85,
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: "back.out(1.4)",
    clearProps: "all",
  });
  
  // Eligibility items
  gsap.from(".eligibility-list li", {
    scrollTrigger: {
      trigger: ".eligibility-list",
      start: "top 85%",
    },
    x: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.12,
    ease: "power3.out",
    clearProps: "all",
  });

  // Benefit items
  gsap.from(".benefit-item", {
    scrollTrigger: {
      trigger: ".benefits-grid",
      start: "top 80%",
    },
    y: 40,
    opacity: 0,
    duration: 0.7,
    stagger: 0.15,
    ease: "power3.out",
    clearProps: "all",
  });

  // Timeline items on schedule
  function animateTimeline() {
    gsap.from(".day-panel.active .tl-item", {
      scrollTrigger: {
        trigger: ".schedule-panels",
        start: "top 80%",
      },
      x: -20,
      opacity: 0,
      duration: 0.45,
      stagger: 0.05,
      ease: "power2.out",
      clearProps: "all",
    });
  }
  animateTimeline();
}
initGSAPScrollAnimations();

/* ---- SCHEDULE TABS ---- */
const tabBtns = document.querySelectorAll(".tab-btn");
const dayPanels = document.querySelectorAll(".day-panel");

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const day = btn.dataset.day;

    // Update active tab
    tabBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Show correct panel
    dayPanels.forEach((panel) => {
      if (panel.dataset.panel === day) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });

    // Animate timeline items for new panel
    gsap.from(`.day-panel[data-panel="${day}"] .tl-item`, {
      x: -15,
      opacity: 0,
      duration: 0.4,
      stagger: 0.04,
      ease: "power2.out",
      clearProps: "all",
    });
  });
});


/* ---- ACTIVE NAV LINK on Scroll ---- */
const sections = document.querySelectorAll("section[id]");
const navLinksAll = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute("id");
    }
  });
  navLinksAll.forEach((link) => {
    link.style.color = "";
    link.style.background = "";
    if (link.getAttribute("href") === `#${current}`) {
      link.style.color = "var(--green-600)";
      link.style.background = "var(--green-50)";
    }
  });
}, { passive: true });

/* ---- DOWNLOAD BUTTON ripple ---- */
const downloadBtn = document.getElementById("downloadBtn");
downloadBtn?.addEventListener("click", (e) => {
  const btn = e.currentTarget;
  gsap.to(btn, {
    scale: 0.96,
    duration: 0.12,
    ease: "power1.inOut",
    yoyo: true,
    repeat: 1,
    clearProps: "all",
  });
});
