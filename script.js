// Modern Love Animation - Particle System + Interactive Hearts
(function() {
  'use strict';

  // ===== PARTICLE SYSTEM =====
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around screen
      if (this.x > width) this.x = 0;
      if (this.x < 0) this.x = width;
      if (this.y > height) this.y = 0;
      if (this.y < 0) this.y = height;
    }

    draw() {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const particleCount = Math.floor((width * height) / 8000);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw connections
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });
      
      p1.update();
      p1.draw();
    });

    requestAnimationFrame(animateParticles);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  resizeCanvas();
  initParticles();
  animateParticles();

  // ===== FLOATING HEARTS =====
  const heartsContainer = document.getElementById('hearts-container');
  const heartEmojis = ['❤️', '💖', '💕', '💗', '💓', '💝', '💘'];

  function createFloatingHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = (Math.random() * 2 + 1) + 'rem';
    
    heartsContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 4000);
  }

  // Auto-generate hearts periodically
  setInterval(() => {
    const x = Math.random() * window.innerWidth;
    const y = window.innerHeight;
    createFloatingHeart(x, y);
  }, 800);

  // ===== BUTTON INTERACTION =====
  const button = document.getElementById('clickMe');
  
  button.addEventListener('click', (e) => {
    // Create burst of hearts
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const angle = (Math.PI * 2 * i) / 15;
        const distance = 100;
        const x = window.innerWidth / 2 + Math.cos(angle) * distance;
        const y = window.innerHeight / 2 + Math.sin(angle) * distance;
        createFloatingHeart(x, y);
      }, i * 50);
    }

    // Button animation
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 150);

    // Open love letter modal with typewriter
    openLoveModal();
  });

  // Click anywhere to create hearts
  document.addEventListener('click', (e) => {
    if (e.target.closest('.modern-btn')) return;
    createFloatingHeart(e.clientX, e.clientY);
  });

  // ===== MOUSE TRAIL EFFECT =====
  let mouseX = 0, mouseY = 0;
  let trailTimeout;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    clearTimeout(trailTimeout);
    trailTimeout = setTimeout(() => {
      if (Math.random() > 0.95) {
        createFloatingHeart(mouseX, mouseY);
      }
    }, 100);
  });

  // ===== INITIAL WELCOME ANIMATION =====
  setTimeout(() => {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight + Math.random() * 100;
        createFloatingHeart(x, y);
      }, i * 200);
    }
  }, 500);

  // ===== LOVE LETTER MODAL + TYPEWRITER =====
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  const typewriterEl = document.getElementById('typewriter');
  let isTyping = false;
  let typingTimeout;

  const loveMessage = [
    "Hi Cherry,",
    "",
    "You light up my days in the gentlest, brightest ways.",
    "Every laugh, every glance, every small moment with you—",
    "it all feels like a beautiful little miracle.",
    "",
    "Thank you for being you. I’m really, really glad it’s you.",
    "Always. 💖"
  ].join("\n");

  function typeText(element, text, speed = 22) {
    element.textContent = "";
    let i = 0;
    isTyping = true;

    function step() {
      if (i <= text.length) {
        element.textContent = text.slice(0, i);
        i++;
        typingTimeout = setTimeout(step, speed + Math.random() * 12);
      } else {
        isTyping = false;
      }
    }

    step();
  }

  function openLoveModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.add('show');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    clearTimeout(typingTimeout);
    typeText(typewriterEl, loveMessage);
  }

  function closeLoveModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('show');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    clearTimeout(typingTimeout);
    isTyping = false;
  }

  modalClose && modalClose.addEventListener('click', closeLoveModal);
  modalBackdrop && modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeLoveModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLoveModal();
  });

  // ===== POLCASAN MASCOT ASSET LOADER =====
  // Make mascot spawn hearts on click (overlay captures clicks)
  const mascotClick = document.getElementById('mascotClick');
  mascotClick && mascotClick.addEventListener('click', (e) => {
    const rect = mascotClick.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 3;
    for (let i = 0; i < 8; i++) {
      setTimeout(() => createFloatingHeart(x + (Math.random() - 0.5) * 120, y + (Math.random() - 0.5) * 60), i * 80);
    }
    e.stopPropagation();
  });

})();
