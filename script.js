const yearTarget = document.querySelector("#current-year");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const revealItems = document.querySelectorAll(".reveal");
const parallaxItems = document.querySelectorAll(".home-copy");
const reactiveCard = document.querySelector(".floating-card");
const cursorAura = document.querySelector(".cursor-aura");
const cursorTrail = document.querySelector(".cursor-trail");
const particleCanvas = document.querySelector(".particle-canvas");
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
  if (reactiveCard) {
    reactiveCard.classList.add("float-reactive");
  }

  window.addEventListener("pointermove", (event) => {
    pointerX = (event.clientX / window.innerWidth - 0.5) * 12;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 12;

    if (frame) {
      return;
    }

    frame = window.requestAnimationFrame(() => {
      parallaxItems.forEach((item) => {
        item.style.transform = `translate3d(${pointerX * 0.45}px, ${pointerY * 0.35}px, 0)`;
      });

      if (reactiveCard) {
        const rotateX = (-pointerY * 0.25).toFixed(2);
        const rotateY = (pointerX * 0.25).toFixed(2);
        reactiveCard.style.transform =
          `perspective(1200px) translate3d(${pointerX * 0.7}px, ${pointerY * 0.7}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }

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
    auraX += (targetX - auraX) * 0.1;
    auraY += (targetY - auraY) * 0.1;
    trailX += (targetX - trailX) * 0.22;
    trailY += (targetY - trailY) * 0.22;

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

if (!reducedMotion.matches && particleCanvas) {
  const context = particleCanvas.getContext("2d");
  const particles = [];

  const resizeCanvas = () => {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  };

  const spawnParticle = (x, y) => {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2 - 0.4,
      size: 1.2 + Math.random() * 2.2,
      life: 1,
      decay: 0.015 + Math.random() * 0.02,
      hue: Math.random() > 0.5 ? "138, 165, 255" : "255, 216, 234"
    });

    if (particles.length > 90) {
      particles.shift();
    }
  };

  const renderParticles = () => {
    if (!context) {
      return;
    }

    context.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    for (let index = particles.length - 1; index >= 0; index -= 1) {
      const particle = particles[index];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= particle.decay;
      particle.vx *= 0.985;
      particle.vy *= 0.985;

      if (particle.life <= 0) {
        particles.splice(index, 1);
        continue;
      }

      context.beginPath();
      context.fillStyle = `rgba(${particle.hue}, ${particle.life * 0.7})`;
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    window.requestAnimationFrame(renderParticles);
  };

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pointermove", (event) => {
    spawnParticle(event.clientX, event.clientY);
    if (Math.random() > 0.4) {
      spawnParticle(event.clientX + (Math.random() - 0.5) * 16, event.clientY + (Math.random() - 0.5) * 16);
    }
  });

  resizeCanvas();
  renderParticles();
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
