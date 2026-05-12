const yearTarget = document.querySelector("#current-year");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const revealItems = document.querySelectorAll(".reveal");
const parallaxItems = document.querySelectorAll(".hero");
const cursorAura = document.querySelector(".cursor-aura");
const cursorTrail = document.querySelector(".cursor-trail");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (yearTarget) {
  yearTarget.textContent = String(new Date().getFullYear());
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("is-open", !expanded);
  });
}

if (!reducedMotion.matches && parallaxItems.length > 0) {
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;

  parallaxItems.forEach((item) => item.classList.add("parallax"));

  window.addEventListener("pointermove", (event) => {
    pointerX = (event.clientX / window.innerWidth - 0.5) * 10;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 10;

    if (frame) {
      return;
    }

    frame = window.requestAnimationFrame(() => {
      parallaxItems.forEach((item) => {
        item.style.transform = `translate3d(${pointerX}px, ${pointerY * 0.6}px, 0)`;
      });

      frame = 0;
    });
  });
}

if (!reducedMotion.matches && cursorAura && cursorTrail) {
  let auraX = window.innerWidth / 2;
  let auraY = window.innerHeight / 2;
  let trailX = auraX;
  let trailY = auraY;
  let targetX = auraX;
  let targetY = auraY;

  const renderCursor = () => {
    auraX += (targetX - auraX) * 0.12;
    auraY += (targetY - auraY) * 0.12;
    trailX += (targetX - trailX) * 0.24;
    trailY += (targetY - trailY) * 0.24;

    cursorAura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0) translate(-50%, -50%)`;
    cursorTrail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate(-50%, -50%)`;

    window.requestAnimationFrame(renderCursor);
  };

  window.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    cursorAura.style.opacity = "1";
    cursorTrail.style.opacity = "1";
  });

  window.addEventListener("pointerleave", () => {
    cursorAura.style.opacity = "0";
    cursorTrail.style.opacity = "0";
  });

  renderCursor();
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
