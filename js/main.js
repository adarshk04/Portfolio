/* ============================================
   ADARSH K PORTFOLIO — MAIN.JS
   ============================================ */

// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    // Activate hero immediately
    document.querySelector('#hero').classList.add('active');
    initParticles();
    startRoleTyping();
    initScrollObserver();
    initNavbar();
    initPuzzle();
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
  // inject keyframes if not present
  if (!document.getElementById('particleKF')) {
    const style = document.createElement('style');
    style.id = 'particleKF';
    style.textContent = `
      @keyframes particleFloat {
        0%,100% { transform: translateY(0) translateX(0); opacity:0.3; }
        25% { transform: translateY(-30px) translateX(15px); opacity:1; }
        50% { transform: translateY(-50px) translateX(-10px); opacity:0.6; }
        75% { transform: translateY(-20px) translateX(20px); opacity:0.8; }
      }
    `;
    document.head.appendChild(style);
  }
}

// ===== ROLE TYPING EFFECT =====
const roles = ['AI Engineer', 'ML Researcher', 'FPGA Developer', 'UI/UX Designer', 'Python Developer'];
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
  // Close on link click
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

// ============================
//   PUZZLE SYSTEM
// ============================
const PUZZLES = [
  {
    question: "🧠 A machine can learn but never forgets to overfit. I work with these every day — what is this field of study called? (Two words!)",
    answer: "machine learning",
    hint: "Think: Python + TensorFlow + training models..."
  },
  {
    question: "⚡ I take a trained neural network and squeeze it into a tiny chip so it can run without a powerful computer. What is this called? (Two words!)",
    answer: "edge ai",
    hint: "Think: FPGA, Artix-7, running AI at the 'edge'..."
  },
  {
    question: "🎨 Before any code is written, designers create a visual blueprint of the app. Adarsh won 2nd place doing this! What tool did he use?",
    answer: "figma",
    hint: "It's a popular browser-based design collaboration tool..."
  }
];

let puzzleStep = 0;
let hintsUsed = 0;

function initPuzzle() {
  renderPuzzle();
  document.getElementById('riddleSubmit').addEventListener('click', checkAnswer);
  document.getElementById('riddleAnswer').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkAnswer();
  });
  document.getElementById('hintBtn').addEventListener('click', showHint);
}

function renderPuzzle() {
  const q = PUZZLES[puzzleStep];
  document.getElementById('riddleQuestion').textContent = q.question;
  document.getElementById('riddleAnswer').value = '';
  document.getElementById('puzzleFeedback').textContent = '';
  document.getElementById('puzzleFeedback').className = 'puzzle-feedback';
  document.getElementById('hintText').textContent = '';
  document.getElementById('progressText').textContent = `Question ${puzzleStep + 1} of ${PUZZLES.length}`;
  // Update dots
  PUZZLES.forEach((_, i) => {
    const dot = document.getElementById(`pdot${i}`);
    dot.className = 'pdot';
    if (i < puzzleStep) dot.classList.add('done');
    if (i === puzzleStep) dot.classList.add('active');
  });
}

function checkAnswer() {
  const input = document.getElementById('riddleAnswer').value.trim().toLowerCase();
  const correct = PUZZLES[puzzleStep].answer.toLowerCase();
  const feedback = document.getElementById('puzzleFeedback');

  if (!input) {
    showFeedback('⚠️ Type your answer first!', 'error');
    return;
  }

  // Fuzzy check — allow partial matches
  if (input === correct || correct.includes(input) && input.length > 3) {
    showFeedback('✅ Correct! Nice one 🎉', 'success');
    // Mark dot done
    document.getElementById(`pdot${puzzleStep}`).className = 'pdot done';
    puzzleStep++;
    if (puzzleStep >= PUZZLES.length) {
      setTimeout(unlockVault, 1000);
    } else {
      setTimeout(renderPuzzle, 1000);
    }
  } else {
    showFeedback("❌ Not quite! Try again or use a hint 💡", 'error');
    // Shake animation
    const input_el = document.getElementById('riddleAnswer');
    input_el.style.animation = 'shake 0.4s ease';
    input_el.addEventListener('animationend', () => input_el.style.animation = '', { once: true });
    if (!document.getElementById('shakeKF')) {
      const style = document.createElement('style');
      style.id = 'shakeKF';
      style.textContent = `
        @keyframes shake {
          0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px)}
          40%{transform:translateX(10px)} 60%{transform:translateX(-6px)}
          80%{transform:translateX(6px)}
        }
      `;
      document.head.appendChild(style);
    }
  }
}

function showFeedback(msg, type) {
  const el = document.getElementById('puzzleFeedback');
  el.textContent = msg;
  el.className = `puzzle-feedback ${type}`;
}

function showHint() {
  const hint = PUZZLES[puzzleStep].hint;
  document.getElementById('hintText').textContent = `Hint: ${hint}`;
  hintsUsed++;
}

function unlockVault() {
  // Hide puzzle container, show vault
  document.getElementById('puzzleContainer').style.display = 'none';
  const vault = document.getElementById('vaultContent');
  vault.classList.remove('hidden');
  vault.style.animation = 'fadeInUp 0.8s ease both';
  // Confetti burst
  confettiBurst();
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
  if (!document.getElementById('confettiKF')) {
    const style = document.createElement('style');
    style.id = 'confettiKF';
    style.textContent = `
      @keyframes confettiFall {
        to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
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
    // Compose mailto link
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);
    window.open(`mailto:adarsh2k004@gmail.com?subject=${subject}&body=${body}`, '_blank');
    note.textContent = '✅ Opening your email client...';
    form.reset();
    setTimeout(() => note.textContent = '', 3000);
  });
}

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== NAV HIGHLIGHT ON active =====
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-links a').forEach(l => l.style.color = '');
    link.style.color = 'var(--accent)';
  });
});
