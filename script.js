const yearTarget = document.querySelector("#current-year");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const revealItems = document.querySelectorAll(".reveal");
const parallaxItems = document.querySelectorAll(".home-copy");
const reactiveCard = document.querySelector(".floating-card");
const particleCanvas = document.querySelector(".particle-canvas");
const eyeOverlays = document.querySelectorAll(".character-eye-overlay");
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

if (!reducedMotion.matches && eyeOverlays.length > 0) {
  const moveEyes = (clientX, clientY) => {
    eyeOverlays.forEach((eye) => {
      const pupil = eye.querySelector(".character-eye-dot");
      if (!pupil) {
        return;
      }

      const rect = eye.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const angle = Math.atan2(dy, dx);
      const distance = Math.min(4, Math.hypot(dx, dy) * 0.035);
      const offsetX = Math.cos(angle) * distance;
      const offsetY = Math.sin(angle) * distance;

      pupil.style.transform =
        `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
    });
  };

  window.addEventListener("pointermove", (event) => {
    moveEyes(event.clientX, event.clientY);
  });

  const blink = () => {
    eyeOverlays.forEach((eye) => eye.classList.add("is-blinking"));
    window.setTimeout(() => {
      eyeOverlays.forEach((eye) => eye.classList.remove("is-blinking"));
    }, 160);

    const nextBlink = 2200 + Math.random() * 1800;
    window.setTimeout(blink, nextBlink);
  };

  window.setTimeout(blink, 1500);
}

if (!reducedMotion.matches && particleCanvas) {
  const context = particleCanvas.getContext("2d");
  const particles = [];
  let pointerFrame = 0;
  let latestPointerX = 0;
  let latestPointerY = 0;

  const resizeCanvas = () => {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  };

  const spawnParticle = (x, y) => {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.95,
      vy: (Math.random() - 0.5) * 0.95 - 0.32,
      size: 0.9 + Math.random() * 1.7,
      life: 1,
      decay: 0.018 + Math.random() * 0.018,
      hue: Math.random() > 0.5 ? "138, 165, 255" : "255, 216, 234",
      kind: Math.random() > 0.66 ? "hex" : (Math.random() > 0.5 ? "line" : "diamond")
    });

    if (particles.length > 64) {
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
      particle.vx *= 0.988;
      particle.vy *= 0.988;

      if (particle.life <= 0) {
        particles.splice(index, 1);
        continue;
      }

      context.save();
      context.translate(particle.x, particle.y);
      context.rotate((particle.life * 6) + particle.size);
      context.fillStyle = `rgba(${particle.hue}, ${particle.life * 0.65})`;
      context.strokeStyle = `rgba(${particle.hue}, ${particle.life * 0.5})`;

      if (particle.kind === "hex") {
        const radius = particle.size * 1.35;
        context.beginPath();
        for (let side = 0; side < 6; side += 1) {
          const angle = (Math.PI / 3) * side;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          if (side === 0) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }
        }
        context.closePath();
        context.stroke();
      } else if (particle.kind === "line") {
        context.lineWidth = Math.max(0.8, particle.size * 0.4);
        context.beginPath();
        context.moveTo(-particle.size * 2.2, 0);
        context.lineTo(particle.size * 2.2, 0);
        context.stroke();
      } else {
        context.beginPath();
        context.moveTo(0, -particle.size * 1.8);
        context.lineTo(particle.size * 0.9, 0);
        context.lineTo(0, particle.size * 1.8);
        context.lineTo(-particle.size * 0.9, 0);
        context.closePath();
        context.fill();
      }

      context.restore();
    }

    window.requestAnimationFrame(renderParticles);
  };

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pointermove", (event) => {
    latestPointerX = event.clientX;
    latestPointerY = event.clientY;

    if (pointerFrame) {
      return;
    }

    pointerFrame = window.requestAnimationFrame(() => {
      spawnParticle(latestPointerX, latestPointerY);
      spawnParticle(
        latestPointerX + (Math.random() - 0.5) * 10,
        latestPointerY + (Math.random() - 0.5) * 10
      );

      if (Math.random() > 0.38) {
        spawnParticle(
          latestPointerX + (Math.random() - 0.5) * 16,
          latestPointerY + (Math.random() - 0.5) * 16
        );
      }

      pointerFrame = 0;
    });
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
