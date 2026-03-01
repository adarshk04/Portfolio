/* ============================================
   ADARSH K PORTFOLIO — MAIN.JS
   ============================================ */

// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    document.querySelector('#hero').classList.add('active');
    initParticles();
    startRoleTyping();
    initScrollObserver();
    initNavbar();
    initMiniGame();
    initTiltCards();
    initContactForm();
    initNavToggle();
  }, 1800);
});

// ===== PARTICLES =====
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: ${Math.random() > 0.5 ? 'rgba(108,99,255,0.6)' : 'rgba(0,212,255,0.4)'};
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: particleFloat ${Math.random() * 8 + 6}s ease-in-out infinite;
      animation-delay: ${Math.random() * -8}s;
      pointer-events: none;
    `;
    container.appendChild(p);
  }
}

// ===== ROLE TYPING EFFECT =====
const roles = ['AI Engineer', 'ML Researcher', 'UI/UX Designer', 'Python Developer'];
let roleIdx = 0, charIdx = 0, isDeleting = false;
function startRoleTyping() {
  const el = document.getElementById('roleCycle');
  if (!el) return;
  function type() {
    const current = roles[roleIdx];
    if (isDeleting) {
      el.textContent = current.substring(0, charIdx--);
    } else {
      el.textContent = current.substring(0, charIdx++);
    }
    let delay = isDeleting ? 60 : 100;
    if (!isDeleting && charIdx === current.length + 1) {
      delay = 2000; isDeleting = true;
    }
    if (isDeleting && charIdx < 0) {
      isDeleting = false; roleIdx = (roleIdx + 1) % roles.length; charIdx = 0; delay = 300;
    }
    setTimeout(type, delay);
  }
  type();
}

// ===== FX SCROLL OBSERVER =====
function initScrollObserver() {
  const slides = document.querySelectorAll('.fx-slide');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });
  slides.forEach(slide => observer.observe(slide));
}

// ===== NAVBAR =====
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
  // Active section highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinksArr = document.querySelectorAll('.nav-links a');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinksArr.forEach(a => a.style.color = '');
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.style.color = 'var(--accent)';
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => observer.observe(s));
}

// ===== MOBILE NAV TOGGLE =====
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

// ============================
//   SUDOKU GATEWAY
// ============================
function initMiniGame() {
  const boardEl = document.getElementById('sudoku-board');
  if (!boardEl) return;

  const puzzle = [
    [0, 0, 1], [0, 2, 3],
    [1, 1, 4], [1, 3, 2],
    [2, 0, 2], [2, 2, 4],
    [3, 1, 3], [3, 3, 1]
  ];
  const solution = [
    [1, 2, 3, 4],
    [3, 4, 1, 2],
    [2, 1, 4, 3],
    [4, 3, 2, 1]
  ];

  boardEl.innerHTML = '';
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      let isFixed = puzzle.find(p => p[0] === r && p[1] === c);
      if (isFixed) {
        let div = document.createElement('div');
        div.className = 'sudoku-cell fixed';
        div.textContent = isFixed[2];
        boardEl.appendChild(div);
      } else {
        let input = document.createElement('input');
        input.type = 'number';
        input.min = 1; input.max = 4;
        input.className = 'sudoku-cell input';
        input.dataset.r = r;
        input.dataset.c = c;
        boardEl.appendChild(input);
      }
    }
  }

  const checkBtn = document.getElementById('checkSudokuBtn');
  if (checkBtn) {
    checkBtn.addEventListener('click', () => {
      let win = true;
      let empty = false;
      let inputs = boardEl.querySelectorAll('input');
      inputs.forEach(inp => {
        let r = parseInt(inp.dataset.r);
        let c = parseInt(inp.dataset.c);
        if (!inp.value) { empty = true; win = false; }
        else if (parseInt(inp.value) !== solution[r][c]) {
          win = false;
          inp.classList.add('error');
        } else {
          inp.classList.remove('error');
        }
      });
      const msg = document.getElementById('sudokuMsg');
      if (empty) {
        msg.textContent = '⚠️ Please fill all blanks first!';
        msg.style.color = '#fbbf24';
      } else if (win) {
        msg.textContent = '✅ Correct! Unlocking portfolio...';
        msg.style.color = '#4ade80';
        setTimeout(unlockVault, 1000);
      } else {
        msg.textContent = '❌ Some numbers are incorrect. Try again!';
        msg.style.color = '#f87171';
      }
    });
  }

  const skipBtn = document.getElementById('skipBtn');
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      document.getElementById('sudokuMsg').textContent = '⏭️ Skipping... Unlocking portfolio!';
      document.getElementById('sudokuMsg').style.color = 'var(--text-dim)';
      setTimeout(unlockVault, 800);
    });
  }
}

function unlockVault() {
  document.getElementById('gateway').style.display = 'none';
  const dp = document.getElementById('detailed-portfolio');
  dp.style.display = 'block';
  // Reinitialize observer for new sections
  initScrollObserver();
  document.querySelectorAll('.nav-detail').forEach(n => n.classList.remove('locked-nav'));
  // Scroll to about
  confettiBurst();
  setTimeout(() => {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
  }, 1000);
}

function confettiBurst() {
  const colors = ['#6c63ff', '#00d4ff', '#4ade80', '#f87171', '#fbbf24'];
  for (let i = 0; i < 80; i++) {
    const c = document.createElement('div');
    const size = Math.random() * 10 + 5;
    c.style.cssText = `
      position: fixed;
      width: ${size}px; height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      left: ${Math.random() * 100}vw;
      top: -20px; z-index: 9999; pointer-events: none;
      animation: confettiFall ${Math.random() * 2 + 1}s ease forwards;
      animation-delay: ${Math.random() * 0.5}s;
    `;
    document.body.appendChild(c);
    c.addEventListener('animationend', () => c.remove());
  }
}

// ============================
//   TILT CARDS
// ============================
function initTiltCards() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      // Adjust intensity
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cfName').value;
    const email = document.getElementById('cfEmail').value;
    const msg = document.getElementById('cfMessage').value;
    const note = document.getElementById('formNote');
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);
    window.open(`mailto:adarsh2k004@gmail.com?subject=${subject}&body=${body}`, '_blank');
    note.textContent = '✅ Opening your email client...';
    form.reset();
    setTimeout(() => note.textContent = '', 3000);
  });
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-links a').forEach(l => l.style.color = '');
    link.style.color = 'var(--accent)';
  });
});
