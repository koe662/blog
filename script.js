const yearTarget = document.querySelector("#current-year");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const revealItems = document.querySelectorAll(".reveal");
const tiltItems = document.querySelectorAll(".hero-copy, .hero-panel, .post-card, .about-card, .note-item");
const parallaxItems = document.querySelectorAll(".hero-copy, .hero-panel");
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

if (!reducedMotion.matches) {
  let pointerFrame = 0;
  let parallaxFrame = 0;
  let pointerX = 0;
  let pointerY = 0;

  tiltItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width;
      const relativeY = (event.clientY - rect.top) / rect.height;
      const rotateY = (relativeX - 0.5) * 8;
      const rotateX = (0.5 - relativeY) * 8;

      item.classList.add("is-tilting");
      item.style.transform =
        `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      item.style.setProperty("--glow-x", `${relativeX * 100}%`);
      item.style.setProperty("--glow-y", `${relativeY * 100}%`);
    });

    item.addEventListener("pointerleave", () => {
      item.classList.remove("is-tilting");
      item.style.transform = "";
    });
  });

  parallaxItems.forEach((item) => item.classList.add("parallax"));

  window.addEventListener("pointermove", (event) => {
    pointerX = (event.clientX / window.innerWidth - 0.5) * 16;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 16;

    if (parallaxFrame) {
      return;
    }

    parallaxFrame = window.requestAnimationFrame(() => {
      parallaxItems.forEach((item, index) => {
        const depth = index === 0 ? 1 : 0.65;
        item.style.transform =
          `translate3d(${pointerX * depth}px, ${pointerY * depth}px, 0)`;
      });

      parallaxFrame = 0;
    });
  });

  window.addEventListener("scroll", () => {
    if (pointerFrame) {
      return;
    }

    pointerFrame = window.requestAnimationFrame(() => {
      const scrollOffset = Math.min(window.scrollY * 0.06, 22);

      parallaxItems.forEach((item, index) => {
        const currentX = (pointerX || 0) * (index === 0 ? 1 : 0.65);
        const currentY = (pointerY || 0) * (index === 0 ? 1 : 0.65);
        item.style.transform =
          `translate3d(${currentX}px, ${currentY + scrollOffset}px, 0)`;
      });

      pointerFrame = 0;
    });
  }, { passive: true });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
